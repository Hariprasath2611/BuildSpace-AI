import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../../store/uiStore'
import { useAuthStore } from '../../store/authStore'
import { useSyncStore } from '../../store/syncStore'
import {
  Search,
  Compass,
  LogOut,
  FolderGit2,
  Lock,
  RotateCcw
} from 'lucide-react'

export default function CommandPalette() {
  const navigate = useNavigate()
  const isOpen = useUIStore((state) => state.isCommandPaletteOpen)
  const setOpen = useUIStore((state) => state.setCommandPaletteOpen)
  const logout = useAuthStore((state) => state.logout)
  const clearQueue = useSyncStore((state) => state.clearQueue)

  const [query, setQuery] = useState("")

  // Global key listener for Ctrl + K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!isOpen)
      }
      if (e.key === 'Escape' && isOpen) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setOpen])

  if (!isOpen) return null

  const commands = [
    { name: "Go to Homepage", action: () => navigate('/'), icon: Compass, type: "nav" },
    { name: "Go to Projects", action: () => { navigate('/projects'); setOpen(false); }, icon: FolderGit2, type: "nav" },
    { name: "Go to Materials", action: () => { navigate('/materials'); setOpen(false); }, icon: FolderGit2, type: "nav" },
    { name: "Go to Finance", action: () => { navigate('/finance'); setOpen(false); }, icon: FolderGit2, type: "nav" },
    { name: "Go to Workforce", action: () => { navigate('/workforce'); setOpen(false); }, icon: FolderGit2, type: "nav" },
    { name: "Go to Safety", action: () => { navigate('/safety'); setOpen(false); }, icon: FolderGit2, type: "nav" },
    { name: "Go to AI Operating System", action: () => { navigate('/ai'); setOpen(false); }, icon: FolderGit2, type: "nav" },
    { name: "Go to Reports & Analytics", action: () => { navigate('/analytics'); setOpen(false); }, icon: FolderGit2, type: "nav" },
    { name: "Go to Features", action: () => navigate('/features'), icon: FolderGit2, type: "nav" },
    { name: "Go to Pricing", action: () => navigate('/pricing'), icon: FolderGit2, type: "nav" },
    { name: "Go to Admin console", action: () => navigate('/admin'), icon: Lock, type: "nav" },
    { name: "Clear Sync Log Queue", action: () => { clearQueue(); setOpen(false); }, icon: RotateCcw, type: "action" },
    { name: "Sign Out", action: () => { logout(); navigate('/'); setOpen(false); }, icon: LogOut, type: "action" }
  ]

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm"
      ></div>

      {/* Palette Box */}
      <div className="w-full max-w-lg bg-white dark:bg-[#141B2D] border border-border rounded-xl shadow-2xl relative z-10 overflow-hidden text-xs">
        {/* Input */}
        <div className="relative border-b border-border flex items-center">
          <input
            type="text"
            autoFocus
            placeholder="Type a command or path... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent pl-10 pr-4 py-3 focus:outline-none text-slate-800 dark:text-white"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5" />
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filteredCommands.map((cmd, i) => {
            const Icon = cmd.icon
            return (
              <button
                key={i}
                onClick={cmd.action}
                className="w-full text-left p-2.5 rounded-lg hover:bg-muted dark:hover:bg-slate-800 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-brand-accent transition-colors" />
                  <span className="font-medium text-slate-700 dark:text-slate-200">{cmd.name}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                  {cmd.type}
                </span>
              </button>
            )
          })}

          {filteredCommands.length === 0 && (
            <p className="text-center py-6 text-muted-foreground italic">No commands match your query.</p>
          )}
        </div>

        {/* Helper Footer */}
        <div className="bg-muted/40 dark:bg-slate-900/40 p-2.5 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground">
          <span>Search directories, routes, and tasks</span>
          <span className="font-mono">Ctrl + K</span>
        </div>
      </div>
    </div>
  )
}
