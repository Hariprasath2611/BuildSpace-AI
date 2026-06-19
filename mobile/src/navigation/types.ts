export type RootStackParamList = {
  Auth: undefined
  Main: undefined
  ProjectDetail: { projectId: string }
  TaskBoard: { projectId: string }
  ProgressUpload: { projectId: string }
  Materials: undefined
  Finance: undefined
  Documents: undefined
  MediaGallery: undefined
  Meetings: undefined
  ChatRoom: { channelId: string; title: string }
  MapTracking: undefined
  Profile: undefined
  Settings: undefined
}

export type AuthStackParamList = {
  Login: undefined
}

export type MainTabParamList = {
  Dashboard: undefined
  Projects: undefined
  Attendance: undefined
  AICopilot: undefined
  Safety: undefined
}
