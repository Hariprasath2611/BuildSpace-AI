import mongoose from 'mongoose'
import { Project, Material, Workforce, SafetyObservation, Expense, Invoice } from '../models'

/**
 * Compiles dashboard high-level KPIs including:
 * - Active Projects count
 * - Total Budget value
 * - Total Workforce count
 * - Resolved Safety hazards count
 */
export async function getDashboardKpiAggregation(tenantId: string) {
  const projectStats = await Project.aggregate([
    { $match: { tenantId } },
    {
      $group: {
        _id: null,
        activeProjectsCount: { $sum: 1 },
        totalHazards: { $sum: "$hazards" },
        avgProgress: { $avg: "$progress" }
      }
    }
  ])

  const workforceCount = await Workforce.countDocuments({ tenantId, status: 'active' })
  const materialStats = await Material.aggregate([
    { $match: { tenantId } },
    {
      $group: {
        _id: null,
        totalItemsCount: { $sum: 1 },
        reorderAlerts: {
          $sum: { $cond: [{ $eq: ["$status", "Reorder"] }, 1, 0] }
        }
      }
    }
  ])

  const safetyObservationsCount = await SafetyObservation.countDocuments({ tenantId, status: 'Resolved' })

  const stats = projectStats[0] || { activeProjectsCount: 0, totalHazards: 0, avgProgress: 0 }
  const mats = materialStats[0] || { totalItemsCount: 0, reorderAlerts: 0 }

  return {
    activeProjects: stats.activeProjectsCount,
    workforceTotal: workforceCount,
    inventoryAlerts: mats.reorderAlerts,
    resolvedHazards: safetyObservationsCount,
    avgProjectProgress: Math.round(stats.avgProgress || 0)
  }
}

/**
 * Calculates monthly budget cash flows comparing:
 * - Total Expenses (outflow)
 * - Total Invoices Paid (inflow)
 */
export async function getCashFlowAggregation(tenantId: string) {
  const expenseMonthly = await Expense.aggregate([
    { $match: { tenantId, status: 'Paid' } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        totalOutflow: { $sum: "$amount" }
      }
    },
    { $sort: { _id: 1 } }
  ])

  const invoiceMonthly = await Invoice.aggregate([
    { $match: { tenantId, status: 'Paid' } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$dueDate" } },
        totalInflow: { $sum: "$amount" }
      }
    },
    { $sort: { _id: 1 } }
  ])

  // Combine results by month
  const cashFlows: Record<string, { month: string; inflow: number; outflow: number; netFlow: number }> = {}

  invoiceMonthly.forEach((item) => {
    cashFlows[item._id] = {
      month: item._id,
      inflow: item.totalInflow,
      outflow: 0,
      netFlow: item.totalInflow
    }
  })

  expenseMonthly.forEach((item) => {
    if (cashFlows[item._id]) {
      cashFlows[item._id].outflow = item.totalOutflow
      cashFlows[item._id].netFlow = cashFlows[item._id].inflow - item.totalOutflow
    } else {
      cashFlows[item._id] = {
        month: item._id,
        inflow: 0,
        outflow: item.totalOutflow,
        netFlow: -item.totalOutflow
      }
    }
  })

  return Object.values(cashFlows).sort((a, b) => a.month.localeCompare(b.month))
}

/**
 * Aggregates material consumption parameters grouped by category types
 */
export async function getMaterialConsumptionByCategory(tenantId: string) {
  return Material.aggregate([
    { $match: { tenantId } },
    {
      $group: {
        _id: "$category",
        currentStockTotal: { $sum: "$currentStock" },
        itemsCount: { $sum: 1 }
      }
    },
    { $sort: { currentStockTotal: -1 } }
  ])
}
