import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  Building2,
  Search,
  ArrowRight,
  Plus,
  Compass,
  Hammer
} from 'lucide-react'

export default function SelectOrg() {
  const navigate = useNavigate()
  const selectOrg = useAuthStore((state) => state.selectOrg)
  const user = useAuthStore((state) => state.user)
  const [searchQuery, setSearchQuery] = useState("")

  const organizations = [
    { id: "apex", name: "Apex General Contractors", role: "Superintendent", sites: 4, icon: Compass },
    { id: "matrix", name: "Matrix Industrial Development", role: "Safety Inspector", sites: 2, icon: Hammer }
  ]

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (orgId: string) => {
    selectOrg(orgId)
    // Redirect to home/dashboard
    navigate('/')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-10">
        <div className="w-96 h-96 bg-brand-accent rounded-full filter blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full space-y-6 bg-white dark:bg-[#141B2D] border border-border p-6 sm:p-8 rounded-2xl shadow-floating">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center mx-auto text-brand-obsidian shadow shadow-brand-accent/20">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
            Select Your Workspace
          </h2>
          <p className="text-xs text-muted-foreground">
            Logged in as <strong>{user?.email || 'd.hariprasath@apex.com'}</strong>
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search workspaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border border-border rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand-accent"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
        </div>

        {/* Workspace Cards */}
        <div className="space-y-3">
          {filteredOrgs.map((org) => {
            const Icon = org.icon
            return (
              <button
                key={org.id}
                onClick={() => handleSelect(org.id)}
                className="w-full text-left p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted dark:hover:bg-slate-800/50 hover:border-brand-accent transition-all flex items-center justify-between group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-brand-accent/10 text-brand-accent rounded-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-brand-accent transition-colors">
                      {org.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Role: <strong>{org.role}</strong> • {org.sites} Active Sites
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-accent group-hover:translate-x-1 transition-all" />
              </button>
            )
          })}

          {filteredOrgs.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4 italic">No matching workspaces found.</p>
          )}
        </div>

        {/* Create workspace link */}
        <div className="border-t border-border pt-4 text-center">
          <button className="inline-flex items-center gap-1 text-xs font-bold text-brand-accent hover:underline">
            <Plus className="w-3.5 h-3.5" />
            Create a new workspace
          </button>
        </div>
      </div>
    </div>
  )
}
