import { create } from 'zustand'

export interface ReportSchedule {
  id: string
  templateId: string
  templateName: string
  frequency: 'Daily' | 'Weekly' | 'Monthly'
  emails: string[]
  exportType: 'PDF' | 'Excel' | 'CSV'
  isEnabled: boolean
}

export interface CustomReportField {
  id: string
  label: string
  isSelected: boolean
  source: 'Projects' | 'Finance' | 'Materials' | 'Workforce' | 'Safety'
}

export interface KPIIndicator {
  id: string
  name: string
  category: 'Company' | 'Project' | 'Department'
  value: number
  target: number
  unit: string
  status: 'optimal' | 'warning' | 'critical'
}

export interface ForecastDataPoint {
  period: string
  actual: number
  predicted: number
  rangeMin: number
  rangeMax: number
}

export interface AnalyticsState {
  kpis: KPIIndicator[]
  schedules: ReportSchedule[]
  customReportFields: CustomReportField[]
  forecasts: Record<string, ForecastDataPoint[]>
  companyHealthScore: number
  netCashFlow: number
  activeIncidentCount: number
  
  // Actions
  updateKPIThreshold: (id: string, newTarget: number) => void
  addSchedule: (schedule: Omit<ReportSchedule, 'id' | 'isEnabled'>) => void
  toggleScheduleEnabled: (id: string) => void
  deleteSchedule: (id: string) => void
  toggleCustomField: (id: string) => void
  triggerManualExport: (format: 'PDF' | 'Excel' | 'CSV', reportName: string) => Promise<string>
}

const INITIAL_KPIS: KPIIndicator[] = [
  { id: "kpi_1", name: "Company Overall Health", category: "Company", value: 94.2, target: 95.0, unit: "%", status: "optimal" },
  { id: "kpi_2", name: "Net Profit Margin", category: "Company", value: 18.4, target: 15.0, unit: "%", status: "optimal" },
  { id: "kpi_3", name: "TRIR Safety Score", category: "Department", value: 1.12, target: 1.5, unit: "Index", status: "optimal" },
  { id: "kpi_4", name: "Schedule Variance Index", category: "Project", value: -4.2, target: 0.0, unit: "Days", status: "warning" },
  { id: "kpi_5", name: "Material Waste Ratio", category: "Project", value: 3.8, target: 3.0, unit: "%", status: "warning" },
  { id: "kpi_6", name: "Equipment Downtime", category: "Department", value: 5.6, target: 2.0, unit: "%", status: "critical" }
]

const INITIAL_SCHEDULES: ReportSchedule[] = [
  { id: "sch_1", templateId: "temp_1", templateName: "OSHA Safety Audit Summary", frequency: "Weekly", emails: ["pm@buildspace.ai", "safety@buildspace.ai"], exportType: "PDF", isEnabled: true },
  { id: "sch_2", templateId: "temp_2", templateName: "Quarterly Revenue & Expense Briefing", frequency: "Monthly", emails: ["cfo@buildspace.ai", "investors@apex.com"], exportType: "Excel", isEnabled: true }
]

const INITIAL_FIELDS: CustomReportField[] = [
  { id: "fld_1", label: "Project Name", isSelected: true, source: "Projects" },
  { id: "fld_2", label: "Baseline Budget", isSelected: true, source: "Finance" },
  { id: "fld_3", label: "Actual Cost Incurred", isSelected: true, source: "Finance" },
  { id: "fld_4", label: "TRIR Incident Index", isSelected: false, source: "Safety" },
  { id: "fld_5", label: "Inventory Value", isSelected: false, source: "Materials" },
  { id: "fld_6", label: "Workforce Count", isSelected: true, source: "Workforce" },
  { id: "fld_7", label: "Milestone Completion Rate", isSelected: true, source: "Projects" }
]

const INITIAL_FORECASTS: Record<string, ForecastDataPoint[]> = {
  cashflow: [
    { period: "Jan", actual: 120000, predicted: 120000, rangeMin: 110000, rangeMax: 130000 },
    { period: "Feb", actual: 145000, predicted: 140000, rangeMin: 130000, rangeMax: 155000 },
    { period: "Mar", actual: 110000, predicted: 115000, rangeMin: 100000, rangeMax: 125000 },
    { period: "Apr", actual: 150000, predicted: 148000, rangeMin: 135000, rangeMax: 160000 },
    { period: "May", actual: 0, predicted: 155000, rangeMin: 140000, rangeMax: 170000 },
    { period: "Jun", actual: 0, predicted: 172000, rangeMin: 150000, rangeMax: 195000 }
  ],
  material: [
    { period: "Week 1", actual: 45, predicted: 45, rangeMin: 40, rangeMax: 50 },
    { period: "Week 2", actual: 52, predicted: 50, rangeMin: 45, rangeMax: 55 },
    { period: "Week 3", actual: 38, predicted: 48, rangeMin: 40, rangeMax: 52 },
    { period: "Week 4", actual: 60, predicted: 55, rangeMin: 50, rangeMax: 65 },
    { period: "Week 5 (F)", actual: 0, predicted: 58, rangeMin: 52, rangeMax: 70 },
    { period: "Week 6 (F)", actual: 0, predicted: 64, rangeMin: 55, rangeMax: 75 }
  ]
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  kpis: INITIAL_KPIS,
  schedules: INITIAL_SCHEDULES,
  customReportFields: INITIAL_FIELDS,
  forecasts: INITIAL_FORECASTS,
  companyHealthScore: 94.2,
  netCashFlow: 1420000,
  activeIncidentCount: 0,

  updateKPIThreshold: (id, newTarget) => {
    set((state) => ({
      kpis: state.kpis.map((k) => {
        if (k.id !== id) return k
        const nextStatus = (k.name.includes("Safety") || k.name.includes("Waste") || k.name.includes("Downtime") || k.name.includes("Variance"))
          ? (k.value <= newTarget ? 'optimal' : (k.value <= newTarget * 1.5 ? 'warning' : 'critical'))
          : (k.value >= newTarget ? 'optimal' : (k.value >= newTarget * 0.85 ? 'warning' : 'critical'))
        return {
          ...k,
          target: newTarget,
          status: nextStatus
        }
      })
    }))
  },

  addSchedule: (newSchedule) => {
    const scheduleWithId: ReportSchedule = {
      ...newSchedule,
      id: `sch_${Date.now()}`,
      isEnabled: true
    }
    set((state) => ({
      schedules: [...state.schedules, scheduleWithId]
    }))
  },

  toggleScheduleEnabled: (id) => {
    set((state) => ({
      schedules: state.schedules.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    }))
  },

  deleteSchedule: (id) => {
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id)
    }))
  },

  toggleCustomField: (id) => {
    set((state) => ({
      customReportFields: state.customReportFields.map((f) => (f.id === id ? { ...f, isSelected: !f.isSelected } : f))
    }))
  },

  triggerManualExport: async (format, reportName) => {
    // Simulate API export generation
    return new Promise((resolve) => {
      setTimeout(() => {
        const fileUrl = `/exports/${reportName.replace(/\s+/g, '_')}_${Date.now()}.${format.toLowerCase()}`
        resolve(fileUrl)
      }, 1800)
    })
  }
}))
