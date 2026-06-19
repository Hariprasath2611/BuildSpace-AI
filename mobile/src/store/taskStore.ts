import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'inprogress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  projectId: string
}

interface TaskState {
  tasks: Task[]
  fetchTasks: () => Promise<void>
  addTask: (task: Omit<Task, 'id'>) => void
  updateTaskStatus: (taskId: string, status: 'todo' | 'inprogress' | 'completed') => void
}

const INITIAL_TASKS: Task[] = [
  { id: "tsk_1", title: "Complete concrete pour Sector B", description: "Coordinate with Apex suppliers.", status: "inprogress", priority: "critical", projectId: "proj_1" },
  { id: "tsk_2", title: "Install scaffold handrails", description: "Level 3 scaffolding east facing facade.", status: "todo", priority: "high", projectId: "proj_1" },
  { id: "tsk_3", title: "Audit worker safety vests", description: "Perform routine EHS walkthrough check.", status: "completed", priority: "medium", projectId: "proj_1" }
]

export const useTaskStore = create<TaskState>((set) => ({
  tasks: INITIAL_TASKS,

  fetchTasks: async () => {
    // Sync task records from server.
  },

  addTask: (newTask) => set((state) => {
    const taskWithId: Task = {
      ...newTask,
      id: `tsk_${Date.now()}`
    }
    return { tasks: [...state.tasks, taskWithId] }
  }),

  updateTaskStatus: (taskId, status) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t))
  }))
}))
