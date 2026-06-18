import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  ShieldAlert,
  UserPlus,
  Lock,
  Mail,
  UserCheck,
  CheckCircle2
} from 'lucide-react'

export default function Admin() {
  const role = useAuthStore((state) => state.role)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("pm")
  const [inviteSent, setInviteSent] = useState(false)

  const [team, setTeam] = useState([
    { id: 1, name: "D. Hariprasath", email: "d.hariprasath@apex.com", role: "Superintendent", status: "Active" },
    { id: 2, name: "Sarah Connor", email: "s.connor@apex.com", role: "Safety Officer", status: "Active" },
    { id: 3, name: "John Doe", email: "j.doe@apex.com", role: "Project Manager", status: "Suspended" }
  ])

  // Redirect if unauthorized
  if (!isAuthenticated || (role !== 'admin' && role !== 'owner')) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-floating text-center space-y-4 text-xs">
        <ShieldAlert className="w-12 h-12 text-brand-danger mx-auto animate-pulse-slow" />
        <h3 className="font-heading font-bold text-lg text-brand-danger">403 — Access Denied</h3>
        <p className="text-muted-foreground leading-relaxed">
          Your account does not possess administrative or owner claims. Please contact your workspace administrator to upgrade your access.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="px-5 py-2.5 bg-brand-safety text-white font-semibold rounded hover:bg-brand-safety/90 transition-all shadow"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }


  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.includes('@')) return
    setInviteSent(true)
    setTimeout(() => {
      setInviteSent(false)
      setInviteEmail("")
    }, 2000)
  }

  const toggleStatus = (id: number) => {
    setTeam(prev => prev.map(member => {
      if (member.id === id) {
        return {
          ...member,
          status: member.status === 'Active' ? 'Suspended' : 'Active'
        }
      }
      return member
    }))
  }

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold flex items-center gap-2">
          <Lock className="w-6 h-6 text-brand-safety" />
          Workspace IAM Roster Console
        </h1>
        <p className="text-xs text-muted-foreground">Manage organization users, roles, invitations, and active sessions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Active Members Table */}
        <div className="lg:col-span-2 bg-white dark:bg-[#141B2D] border border-border rounded-2xl overflow-hidden shadow-raised">
          <div className="p-4 border-b border-border">
            <h3 className="font-heading font-bold text-sm">Active Workspace Roster</h3>
          </div>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 dark:bg-slate-800/30 text-muted-foreground font-semibold border-b border-border">
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/10 dark:hover:bg-slate-800/10">
                    <td className="p-3">
                      <p className="font-bold">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground">{member.email}</p>
                    </td>
                    <td className="p-3 font-medium">{member.role}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        member.status === 'Active' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-danger/10 text-brand-danger'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => toggleStatus(member.id)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          member.status === 'Active' ? 'bg-brand-danger/10 text-brand-danger hover:bg-brand-danger/20' : 'bg-brand-success/10 text-brand-success hover:bg-brand-success/20'
                        }`}
                      >
                        {member.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite User box */}
        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
          <h3 className="font-heading font-bold text-sm border-b border-border pb-2 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-brand-accent" />
            Invite Member
          </h3>

          {inviteSent ? (
            <div className="p-4 bg-brand-success/10 border border-brand-success/20 rounded-xl text-center space-y-2 text-xs">
              <CheckCircle2 className="w-6 h-6 text-brand-success mx-auto" />
              <p className="text-brand-success font-bold">Invitation Dispatched</p>
              <p className="text-muted-foreground text-[10px]">Invite link sent to recipient successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Recipient Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="partner@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full p-2.5 rounded border border-border bg-transparent focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Assigned Roster Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full p-2.5 rounded border border-border bg-white dark:bg-[#141B2D] focus:outline-none focus:border-brand-accent"
                >
                  <option value="pm">Project Manager</option>
                  <option value="safety">Safety Officer</option>
                  <option value="inspector">Quality Inspector</option>
                  <option value="worker">Worker</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!inviteEmail}
                className="w-full py-2 bg-brand-accent hover:opacity-90 text-brand-obsidian text-xs font-bold rounded transition-all flex items-center justify-center gap-1"
              >
                Send Invite Link
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
