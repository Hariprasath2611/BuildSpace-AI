import React, { useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Calendar as CalendarIcon,
  Search,
  Folder,
  Sliders,
  ChevronLeft
} from 'lucide-react'

// ==========================================
// 1. BUTTONS
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all select-none focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50'
  
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow shadow-amber-500/10',
    secondary: 'bg-muted hover:bg-muted/80 text-foreground border border-border',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow shadow-rose-500/10',
    ghost: 'hover:bg-muted text-muted-foreground hover:text-foreground',
    outline: 'border border-border bg-transparent hover:bg-muted text-foreground'
  }

  const sizes = {
    sm: 'text-[10px] px-3 py-1.5 uppercase tracking-wider',
    md: 'text-xs px-4 py-2.5',
    lg: 'text-sm px-5 py-3'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// ==========================================
// 2. BADGES
// ==========================================
interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'slate'
  children: React.ReactNode
}

export function Badge({ variant = 'slate', children }: BadgeProps) {
  const styles = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
    danger: 'bg-rose-500/10 border-rose-500/20 text-rose-500',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
    slate: 'bg-muted border-border text-muted-foreground'
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 border text-[9px] uppercase font-bold rounded-full tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  )
}

// ==========================================
// 3. CARDS
// ==========================================
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised transition-all hover:shadow-floating ${className}`}>
      {children}
    </div>
  )
}

// ==========================================
// 4. DATA GRID / TABLE
// ==========================================
interface Column<T> {
  header: string
  accessor: (row: T) => React.ReactNode
  sortKey?: string
}

interface DataGridProps<T> {
  columns: Column<T>[]
  data: T[]
  onSort?: (key: string) => void
  onSearch?: (query: string) => void
}

export function DataGrid<T>({ columns, data, onSort, onSearch }: DataGridProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-4 text-xs">
      {onSearch && (
        <div className="relative max-w-xs">
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              onSearch(e.target.value)
            }}
            className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
        </div>
      )}

      <div className="border border-border rounded-2xl overflow-hidden bg-white dark:bg-[#141B2D] shadow-raised">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/20 dark:bg-slate-900/20 text-muted-foreground font-semibold">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    onClick={() => col.sortKey && onSort && onSort(col.sortKey)}
                    className={`py-3 px-4 ${col.sortKey && onSort ? 'cursor-pointer hover:text-foreground' : ''}`}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortKey && onSort && <Sliders className="w-3 h-3 text-muted-foreground/60" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="py-3 px-4 text-slate-800 dark:text-slate-200">
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center text-muted-foreground italic">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 5. TIMELINE
// ==========================================
interface TimelineItem {
  date: string
  title: string
  description: string
  status: 'Completed' | 'Current' | 'Upcoming'
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative border-l border-border pl-4 ml-3 space-y-6 text-xs text-left">
      {items.map((item, idx) => {
        const dotColors = {
          Completed: 'bg-emerald-500 ring-emerald-500/20',
          Current: 'bg-amber-500 ring-amber-500/20 animate-pulse',
          Upcoming: 'bg-slate-350 dark:bg-slate-700 ring-slate-400/10'
        }

        return (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <span className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full ring-4 ${dotColors[item.status]}`}></span>
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.date}</span>
              <h4 className="font-extrabold text-slate-800 dark:text-white leading-tight">{item.title}</h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">{item.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ==========================================
// 6. ACCORDION
// ==========================================
interface AccordionItem {
  title: string
  content: React.ReactNode
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="border border-border rounded-xl divide-y divide-border bg-white dark:bg-[#141B2D] overflow-hidden text-xs text-left">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx
        return (
          <div key={idx} className="flex flex-col">
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="py-3 px-4 flex justify-between items-center font-bold text-slate-800 dark:text-white hover:bg-muted/40 transition-colors"
            >
              <span>{item.title}</span>
              {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </button>
            {isOpen && (
              <div className="p-4 bg-muted/20 border-t border-border text-slate-700 dark:text-slate-350 leading-relaxed animate-fade-in">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ==========================================
// 7. TABS
// ==========================================
interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-border text-xs text-left">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 border-b-2 font-semibold uppercase tracking-wider transition-all -mb-[2px] ${
              isActive
                ? 'border-amber-500 text-amber-500 font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

// ==========================================
// 8. ACCESSIBLE TOOLTIP
// ==========================================
export function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-950 text-white text-[9px] rounded-lg border border-border whitespace-nowrap z-50 shadow-xl">
        {text}
      </div>
    </div>
  )
}

// ==========================================
// 9. TREE VIEW (FOLDER FOLDER VAULT)
// ==========================================
interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
}

interface TreeViewProps {
  nodes: TreeNode[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function TreeView({ nodes, selectedId, onSelect }: TreeViewProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedIds(expandedIds.includes(id) ? expandedIds.filter((x) => x !== id) : [...expandedIds, id])
  }

  const renderNode = (node: TreeNode) => {
    const isSelected = selectedId === node.id
    const hasChildren = !!node.children && node.children.length > 0
    const isExpanded = expandedIds.includes(node.id)

    return (
      <div key={node.id} className="text-xs text-left pl-2 select-none">
        <div
          onClick={() => onSelect(node.id)}
          className={`flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-muted/40 cursor-pointer ${
            isSelected ? 'bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20' : 'text-slate-700 dark:text-slate-350'
          }`}
        >
          {hasChildren ? (
            <button onClick={(e) => toggleExpand(node.id, e)} className="p-0.5 hover:bg-muted rounded">
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-5"></span>
          )}
          <Folder className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span>{node.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="pl-4 border-l border-border/60 ml-2 space-y-1">
            {node.children!.map((child) => renderNode(child))}
          </div>
        )}
      </div>
    )
  }

  return <div className="space-y-1.5">{nodes.map((node) => renderNode(node))}</div>
}

// ==========================================
// 10. COLOR PICKER SELECTOR
// ==========================================
export function ColorPicker({ color, onChange }: { color: string; onChange: (hex: string) => void }) {
  const palette = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e", "#64748b"]
  return (
    <div className="flex gap-2">
      {palette.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`w-6 h-6 rounded-full border transition-transform ${
            color === c ? 'scale-125 border-white ring-2 ring-amber-500/50' : 'border-border'
          }`}
          style={{ backgroundColor: c }}
        ></button>
      ))}
    </div>
  )
}

// ==========================================
// 11. JSON & CODE HIGHLIGHTER VIEWER
// ==========================================
export function JSONViewer({ data }: { data: any }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-[10px] font-mono text-left text-slate-300 overflow-auto max-h-80 select-text">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export function CodeViewer({ code, language }: { code: string; language: string }) {
  return (
    <div className="bg-[#0b0e17] border border-[#1b2238] rounded-xl p-4 text-[10px] font-mono text-left text-slate-350 overflow-auto relative">
      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-800 text-[8px] font-bold rounded uppercase tracking-wider text-slate-400">{language}</span>
      <pre className="mt-2 select-text">{code}</pre>
    </div>
  )
}

// ==========================================
// 12. DATE PICKER
// ==========================================
export function DatePicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="relative text-xs">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
      />
      <CalendarIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
    </div>
  )
}

// ==========================================
// 13. PAGINATED CONTROLLER
// ==========================================
export function PaginationController({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex items-center gap-2 justify-end text-xs pt-3 border-t border-border">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-1 hover:bg-muted border border-border rounded-lg disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-1 hover:bg-muted border border-border rounded-lg disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
