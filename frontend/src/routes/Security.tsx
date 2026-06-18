import {
  ShieldCheck,
  Lock,
  Server,
  FileCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

export default function Security() {
  const complianceCertificates = [
    { name: "SOC 2 Type II Certified", desc: "Third-party audited security operational controls protecting tenant systems.", badge: "SOC2" },
    { name: "ISO / IEC 27001", desc: "International standard for structural information security management systems.", badge: "ISO" },
    { name: "HIPAA Compliant", desc: "Data protection rules safeguarding administrative healthcare integrations.", badge: "HIPAA" },
    { name: "GDPR Compliant", desc: "Comprehensive user privacy, data erasure, and consent tracking controls.", badge: "GDPR" }
  ]

  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HEADER */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
          Enterprise Security &{' '}
          <span className="bg-gradient-to-r from-brand-safety to-brand-accent bg-clip-text text-transparent">
            Zero Trust Architecture
          </span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          BuildSpace AI safeguards your intellectual property, RFI drawings, and financial cost codes with multi-tenant isolation and end-to-end encryption.
        </p>
      </section>

      {/* 2. SECURITY PILLARS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          {
            title: "Data Isolation",
            desc: "Multi-tenant database boundaries are enforced strictly at the query layer. Tenant data resides in isolated MongoDB Atlas clusters with VPC peering.",
            icon: Server
          },
          {
            title: "Identity Access Management",
            desc: "Powered by Firebase Authentication, supporting custom RBAC and ABAC claims, multi-factor verification, and enterprise SSO integrations.",
            icon: Lock
          },
          {
            title: "Cryptographic Auditing",
            desc: "All system modifications, RFI comments, and checklist approvals are logged with tamper-proof immutable audit records.",
            icon: ShieldCheck
          }
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="bg-white dark:bg-[#141B2D] p-6 rounded-xl border border-border shadow-raised space-y-3">
              <div className="p-2.5 bg-brand-safety/10 text-brand-safety rounded-lg w-max">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-slate-800 dark:text-slate-200">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          )
        })}
      </section>

      {/* 3. COMPLIANCE GRID */}
      <section className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 sm:p-8 shadow-floating max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h3 className="font-heading font-bold text-lg sm:text-xl flex items-center justify-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-safety animate-pulse-slow" />
            Compliance Certifications
          </h3>
          <p className="text-xs text-muted-foreground">Strict compliance audits validated annually by certified auditors.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          {complianceCertificates.map((cert, i) => (
            <div key={i} className="p-4 bg-muted/30 dark:bg-slate-900/30 rounded-xl border border-border flex items-start gap-4">
              <div className="p-2 bg-brand-success/15 text-brand-success rounded-lg flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs sm:text-sm">{cert.name}</h4>
                  <span className="px-1.5 py-0.5 bg-brand-accent/15 text-brand-accent text-[8px] font-bold rounded">
                    {cert.badge}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{cert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DOWNLOAD BLUEPRINT */}
      <section className="bg-gradient-to-r from-brand-safety/10 to-brand-accent/10 border border-brand-safety/20 rounded-2xl p-8 sm:p-12 text-center space-y-4 max-w-4xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-heading font-extrabold">
          Review our Complete Security & Identity Blueprint
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Download the SOC 2 audits, Firebase architecture details, and custom RBAC mapping manuals.
        </p>
        <div className="pt-2">
          <button className="px-6 py-2.5 bg-brand-safety text-white text-xs font-semibold rounded-lg hover:bg-brand-safety/90 transition-all inline-flex items-center gap-2 shadow-lg shadow-brand-safety/15">
            Download Security PDF
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  )
}
