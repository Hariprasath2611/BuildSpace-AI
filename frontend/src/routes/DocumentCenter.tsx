import React, { useState } from 'react'
import {
  Folder,
  FileText,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  Search,
  UploadCloud,
  Check
} from 'lucide-react'
import { useDocumentStore, type DocumentItem } from '@/store/documentStore'

export default function DocumentCenter() {
  const documents = useDocumentStore((state) => state.documents)
  const folders = useDocumentStore((state) => state.folders)
  const selectedFolderId = useDocumentStore((state) => state.selectedFolderId)
  
  const uploadDocument = useDocumentStore((state) => state.uploadDocument)
  const lockDocument = useDocumentStore((state) => state.lockDocument)
  const unlockDocument = useDocumentStore((state) => state.unlockDocument)
  const approveDocument = useDocumentStore((state) => state.approveDocument)
  const createFolder = useDocumentStore((state) => state.createFolder)
  const deleteDocument = useDocumentStore((state) => state.deleteDocument)
  const restoreDocument = useDocumentStore((state) => state.restoreDocument)
  const setSelectedFolder = useDocumentStore((state) => state.setSelectedFolder)

  // Navigation / Search Local States
  const [docSearchQuery, setDocSearchQuery] = useState('')
  const [activeDocTab, setActiveDocTab] = useState<'vault' | 'recycle'>('vault')
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)

  // Folder creation state
  const [showAddFolderInput, setShowAddFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  // Document upload state
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newDocName, setNewDocName] = useState('')
  const [newDocCat, setNewDocCat] = useState<'Drawing' | 'Contract' | 'Method Statement' | 'Invoice' | 'Permit'>('Drawing')
  const [newDocTags, setNewDocTags] = useState('')

  // Digital signature pad state
  const [hasSigned, setHasSigned] = useState(false)
  const [signatureName, setSignatureName] = useState('')

  // Document AI chat states
  const [aiDocAnswer, setAiDocAnswer] = useState('')
  const [isAiDocLoading, setIsAiDocLoading] = useState(false)

  // Calculations
  const activeDocument = documents.find(d => d.id === selectedDocId)

  // Filtered files
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(docSearchQuery.toLowerCase()) || 
                          doc.tags.some(tag => tag.toLowerCase().includes(docSearchQuery.toLowerCase()))
    const matchesFolder = doc.folderId === selectedFolderId
    const matchesTab = activeDocTab === 'vault' ? !doc.isDeleted : doc.isDeleted
    return matchesSearch && matchesFolder && matchesTab
  })

  // Folder Node Click Handler
  const handleFolderClick = (id: string | null) => {
    setSelectedFolder(id)
    setSelectedDocId(null)
  }

  // Create folder submit
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return
    createFolder(newFolderName, selectedFolderId)
    setNewFolderName('')
    setShowAddFolderInput(false)
  }

  // Document upload submit
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDocName.trim()) return

    uploadDocument({
      name: newDocName.endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
      folderId: selectedFolderId,
      category: newDocCat,
      uploadedBy: "Robert Dow",
      dateUploaded: new Date().toISOString().split('T')[0],
      size: "4.8 MB",
      approvalStatus: "Pending",
      tags: newDocTags.split(',').map(tag => tag.trim()).filter(Boolean)
    })

    setNewDocName('')
    setNewDocTags('')
    setShowUploadModal(false)
  }

  // Lock / Unlock toggle
  const handleLockToggle = (doc: DocumentItem) => {
    if (doc.locked) {
      unlockDocument(doc.id)
    } else {
      lockDocument(doc.id, "Robert Dow")
    }
  }

  // AI summarization prompt
  const handleAiSummarizeDoc = () => {
    if (!activeDocument) return
    setIsAiDocLoading(true)
    setTimeout(() => {
      setAiDocAnswer(`AI Document Summary for **${activeDocument.name}**: This is a checked drawing detailing layout boundaries. OCR text indicates foundation concrete thickness parameters set at 3-inches cover. Approvals pending structural engineer sign-off.`)
      setIsAiDocLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-border pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold tracking-tight">Enterprise Document Center</h1>
          <p className="text-xs text-muted-foreground">Store drawings vault, contracts agreement database, and permits history. Sign-off digital signatures with OCR support.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <UploadCloud className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      {/* Main vault split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column Folder Tree */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-4 shadow-raised space-y-3">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white">Folders Vault</span>
              <button
                onClick={() => setShowAddFolderInput(!showAddFolderInput)}
                className="p-1 hover:bg-muted rounded text-amber-500"
                title="Create Folder"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showAddFolderInput && (
              <form onSubmit={handleCreateFolder} className="flex gap-1.5">
                <input
                  type="text"
                  required
                  placeholder="Folder Name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 bg-muted/65 border border-border rounded p-1 text-[10px] focus:outline-none"
                />
                <button type="submit" className="px-2 py-1 bg-amber-500 text-slate-950 text-[10px] font-bold rounded">
                  Add
                </button>
              </form>
            )}

            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => handleFolderClick(null)}
                className={`w-full text-left p-2 rounded-lg hover:bg-muted/40 font-semibold flex items-center gap-2 ${
                  selectedFolderId === null ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-muted-foreground'
                }`}
              >
                <Folder className="w-4 h-4" /> Root Vault
              </button>

              {folders.map((fol) => (
                <button
                  key={fol.id}
                  onClick={() => handleFolderClick(fol.id)}
                  className={`w-full text-left p-2 rounded-lg hover:bg-muted/40 font-semibold flex items-center gap-2 ${
                    selectedFolderId === fol.id ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-muted-foreground'
                  }`}
                >
                  <Folder className="w-4 h-4" /> {fol.name}
                </button>
              ))}
            </div>
          </div>

          {/* Recycle bin switch */}
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-4 shadow-raised text-xs text-left">
            <span className="font-bold text-[11px] text-muted-foreground block mb-2">Vault Views</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setActiveDocTab('vault'); setSelectedDocId(null); }}
                className={`flex-1 py-1.5 rounded-lg border font-bold uppercase tracking-wider ${
                  activeDocTab === 'vault' ? 'bg-amber-500 text-slate-950' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Files Vault
              </button>
              <button
                onClick={() => { setActiveDocTab('recycle'); setSelectedDocId(null); }}
                className={`flex-1 py-1.5 rounded-lg border font-bold uppercase tracking-wider ${
                  activeDocTab === 'recycle' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Recycle Bin
              </button>
            </div>
          </div>
        </div>

        {/* Center column files listing */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left min-h-120">
            <div className="border-b border-border pb-3 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">
                {activeDocTab === 'vault' ? 'Drawing Files Vault' : 'Recycled Deleted Vault'}
              </h3>

              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-amber-500"
                />
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2" />
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 text-xs">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3 border rounded-xl hover:border-amber-500/50 transition-colors flex items-center justify-between cursor-pointer ${
                    selectedDocId === doc.id ? 'border-amber-500 bg-amber-500/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white block">{doc.name}</span>
                      <span className="text-[10px] text-muted-foreground">Category: {doc.category} • Size: {doc.size} • Version {doc.version}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.locked && (
                      <Lock className="w-3.5 h-3.5 text-amber-500" title={`Locked by ${doc.lockedBy}`} />
                    )}

                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      doc.approvalStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      doc.approvalStatus === 'Pending' ? 'bg-amber-500/10 text-amber-500 animate-pulse' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {doc.approvalStatus}
                    </span>

                    {activeDocTab === 'vault' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteDocument(doc.id)
                        }}
                        className="p-1 hover:bg-muted rounded text-slate-400 hover:text-red-500"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          restoreDocument(doc.id)
                        }}
                        className="p-1 hover:bg-muted rounded text-slate-400 hover:text-emerald-500"
                        title="Restore Document"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredDocuments.length === 0 && (
                <div className="py-12 text-center text-muted-foreground italic border border-dashed border-border rounded-xl">
                  Empty folder directory catalog.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column details sidebar */}
        <div className="space-y-6 text-xs text-left">
          {activeDocument ? (
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
              <div className="border-b border-border pb-3 flex justify-between items-center">
                <span className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">Document Panel</span>
                <span className="text-[10px] text-muted-foreground">Doc ID: {activeDocument.id}</span>
              </div>

              {/* Version & Lock details */}
              <div className="p-3 bg-muted/40 dark:bg-slate-900/40 border border-border rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version history:</span>
                  <span className="font-bold text-slate-800 dark:text-white">v{activeDocument.version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Check-out lock:</span>
                  <button
                    onClick={() => handleLockToggle(activeDocument)}
                    className="p-1 text-slate-500 hover:text-amber-500 flex items-center gap-1 font-bold text-[10px]"
                  >
                    {activeDocument.locked ? (
                      <><Unlock className="w-3 h-3 text-amber-500" /> Unlock file</>
                    ) : (
                      <><Lock className="w-3 h-3 text-muted-foreground" /> Lock file</>
                    )}
                  </button>
                </div>
                {activeDocument.locked && (
                  <div className="text-[9px] text-amber-500">Currently locked by: {activeDocument.lockedBy}</div>
                )}
              </div>

              {/* OCR scanner text */}
              <div className="space-y-1.5">
                <span className="font-bold text-muted-foreground">OCR Scanning Detailing Text:</span>
                <div className="p-2.5 bg-slate-900 text-slate-350 font-mono text-[9px] rounded-lg border border-slate-850 overflow-auto max-h-24">
                  OCR Text: Concrete volumetric pour Ground slab Zone B - thickness dimensions set at 3-inches, grade 60 reinforcement steel rods spacing layout must conform to 12-inch spacing specs.
                </div>
              </div>

              {/* AI summaries */}
              <div className="space-y-2.5 border-t border-border pt-3">
                <button
                  onClick={handleAiSummarizeDoc}
                  className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold uppercase rounded-lg shadow flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Summarize Document
                </button>
                {isAiDocLoading && <div className="text-[10px] text-muted-foreground animate-pulse text-center">Reading OCR text...</div>}
                {aiDocAnswer && (
                  <p className="p-2 bg-amber-500/5 border border-amber-500/20 text-slate-700 dark:text-slate-350 rounded-lg text-[10px] leading-relaxed">
                    {aiDocAnswer}
                  </p>
                )}
              </div>

              {/* Digital signature panel */}
              <div className="border-t border-border pt-3 space-y-2.5">
                <span className="font-bold text-muted-foreground block">Sign-off Signatures Validation:</span>
                
                {hasSigned ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded-lg flex items-center justify-between">
                    <span>Signed successfully: {signatureName}</span>
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Type name to sign-off approval"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded p-1.5 text-[10px] focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (signatureName.trim()) {
                          setHasSigned(true)
                          approveDocument(activeDocument.id, "Approved")
                        }
                      }}
                      disabled={!signatureName.trim()}
                      className="w-full py-1.5 bg-slate-850 hover:bg-slate-800 text-white font-bold rounded-lg disabled:opacity-50 text-[10px]"
                    >
                      Authorize Digital Signature
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-center text-muted-foreground italic">
              Select a document to inspect versioning and digital signature approvals.
            </div>
          )}
        </div>
      </div>

      {/* Upload document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl relative text-xs">
            <h3 className="text-sm font-extrabold text-slate-850 dark:text-white mb-4">Upload Document File</h3>
            <form onSubmit={handleUploadDocument} className="space-y-3.5">
              <div>
                <label className="block text-muted-foreground font-bold mb-1">Document Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ground_Floorplan_Vault"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl p-2.5 focus:outline-none text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-bold mb-1">Category</label>
                <select
                  value={newDocCat}
                  onChange={(e) => setNewDocCat(e.target.value as any)}
                  className="w-full bg-muted/50 border border-border rounded-xl p-2.5 focus:outline-none text-slate-800 dark:text-white"
                >
                  <option value="Drawing">Blueprint Drawing</option>
                  <option value="Contract">Legal Contract</option>
                  <option value="Method Statement">Method Statement</option>
                  <option value="Invoice">Invoice slip</option>
                  <option value="Permit">Site Permit</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-bold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Level 1, Foundation"
                  value={newDocTags}
                  onChange={(e) => setNewDocTags(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl p-2.5 focus:outline-none text-slate-800 dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow"
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-muted border border-border rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
