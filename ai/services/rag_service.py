import math
from typing import List, Dict, Any, Optional
from ai.models.registry import model_registry
from ai.core.config import settings
from ai.core.logging import logger

try:
    from pinecone import Pinecone, ServerlessSpec
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False


class RAGService:
    def __init__(self):
        self.pc = None
        self.index = None
        self.in_memory_db: List[Dict[str, Any]] = [] # Fallback local database
        
        # Try to connect to real Pinecone
        if PINECONE_AVAILABLE and settings.PINECONE_API_KEY:
            try:
                self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
                # Create index if not exists
                existing_indexes = [idx.name for idx in self.pc.list_indexes()]
                if settings.PINECONE_INDEX_NAME not in existing_indexes:
                    self.pc.create_index(
                        name=settings.PINECONE_INDEX_NAME,
                        dimension=384,  # Dimension matching default model
                        metric="cosine",
                        spec=ServerlessSpec(cloud="aws", region="us-east-1")
                    )
                self.index = self.pc.Index(settings.PINECONE_INDEX_NAME)
                logger.info(f"Connected to Pinecone index: {settings.PINECONE_INDEX_NAME}")
            except Exception as e:
                logger.error(f"Pinecone connection failed: {e}. Defaulting to in-memory vector store.")
        else:
            logger.info("Pinecone API key missing or SDK not installed. Using local in-memory store.")

    def chunk_text(self, text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> List[str]:
        """
        Splits raw document text into overlapping chunks.
        """
        words = text.split()
        chunks = []
        i = 0
        while i < len(words):
            chunk = " ".join(words[i : i + chunk_size])
            chunks.append(chunk)
            i += (chunk_size - chunk_overlap)
        return chunks

    def ingest_document(self, doc_id: str, title: str, text: str, metadata: Optional[Dict[str, Any]] = None) -> bool:
        """
        Splits document, generates embeddings, and indexes into Pinecone (or local DB).
        """
        try:
            chunks = self.chunk_text(text)
            logger.info(f"Ingesting '{title}' ({len(chunks)} chunks)")
            
            embeddings = model_registry.get_embeddings(chunks)
            meta_data = metadata or {}
            
            # Form vector records
            records = []
            for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                chunk_id = f"{doc_id}_{idx}"
                record_meta = {
                    **meta_data,
                    "title": title,
                    "chunk_id": chunk_id,
                    "doc_id": doc_id,
                    "content": chunk
                }
                records.append({
                    "id": chunk_id,
                    "values": embedding,
                    "metadata": record_meta
                })
                
                # Always sync to in-memory fallback database for fast offline dev
                self.in_memory_db.append({
                    "id": chunk_id,
                    "values": embedding,
                    "metadata": record_meta
                })
                
            # Upsert into Pinecone if index is connected
            if self.index:
                # Pinecone expects list of tuples: (id, vector, metadata)
                pinecone_records = [(r["id"], r["values"], r["metadata"]) for r in records]
                # Batch upserts of 100 vectors
                for i in range(0, len(pinecone_records), 100):
                    self.index.upsert(vectors=pinecone_records[i : i + 100])
                    
            logger.info(f"Ingestion completed for document: {doc_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to ingest document: {e}")
            return False

    def retrieve_context(self, query: str, top_k: int = 3, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Queries Pinecone (or local index) for semantically relevant chunks.
        """
        try:
            query_vector = model_registry.get_embeddings([query])[0]
            
            # If Pinecone is available, query it
            if self.index:
                # Query Pinecone
                response = self.index.query(
                    vector=query_vector,
                    top_k=top_k,
                    include_metadata=True,
                    filter=filters
                )
                results = []
                for match in response.matches:
                    results.append({
                        "source": match.metadata.get("title", "Unknown"),
                        "score": match.score,
                        "content": match.metadata.get("content", "")
                    })
                return results
                
            # Otherwise, fall back to in-memory cosine-similarity calculation
            logger.info("Performing local memory cosine-similarity retrieval")
            local_matches = []
            for record in self.in_memory_db:
                # Apply simple filter matches if specified
                if filters:
                    skip = False
                    for key, val in filters.items():
                        if record["metadata"].get(key) != val:
                            skip = True
                            break
                    if skip:
                        continue
                        
                # Compute Cosine Similarity
                sim = self._cosine_similarity(query_vector, record["values"])
                local_matches.append({
                    "source": record["metadata"].get("title", "Unknown"),
                    "score": sim,
                    "content": record["metadata"].get("content", "")
                })
                
            # Sort and return top_k
            local_matches.sort(key=lambda x: x["score"], reverse=True)
            return local_matches[:top_k]
            
        except Exception as e:
            logger.error(f"RAG retrieval failed: {e}")
            return []

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude_1 = math.sqrt(sum(a * a for a in vec1))
        magnitude_2 = math.sqrt(sum(b * b for b in vec2))
        if magnitude_1 == 0 or magnitude_2 == 0:
            return 0.0
        return dot_product / (magnitude_1 * magnitude_2)

rag_service = RAGService()
# Seed some general company knowledge into the RAG database upon load
rag_service.ingest_document(
    doc_id="company_handbook",
    title="BuildSpace Safety manual Rev 3",
    text="All workers on-site must wear hard hats (helmets) and Class 2 reflective vests. Failure to wear PPE will trigger immediate site warning. Scaffolding over 6 feet must include security harnesses and anchor points. Danger zones must be fenced off with red caution tape."
)
rag_service.ingest_document(
    doc_id="cost_spec_paint",
    title="Project Painting BOQ specifications",
    text="Concrete surface painting requires primer coats followed by double coat exterior acrylic latex. Price index per square meter is $12.50. Labor index per hour is $22.00."
)
