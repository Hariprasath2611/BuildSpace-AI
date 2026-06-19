from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class OCRRequest(BaseModel):
    document_url: str = Field(..., description="Document file path or cloud URL")
    document_type: str = Field(
        default="auto", 
        description="Type of file: invoice, purchase_order, contract, blueprint, boq, receipt, permit, auto"
    )

class InvoiceFields(BaseModel):
    vendor_name: Optional[str] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = None
    total_amount: Optional[float] = None
    tax_amount: Optional[float] = None
    gstin: Optional[str] = None
    line_items: List[Dict[str, Any]] = Field(default=[])

class OCRResponse(BaseModel):
    document_type: str = Field(..., description="Detected and processed document category")
    extracted_text: str = Field(..., description="Raw text parsed by OCR engine")
    parsed_fields: Dict[str, Any] = Field(..., description="Extracted structural fields (vendor, amounts, details)")
    confidence: float = Field(..., description="OCR text reading accuracy score (0.0 to 1.0)")
