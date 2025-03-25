export type Node = {
  id: string
  type?: 'trigger' | 'if' | 'regular'
  nodeType: string
  position: { x: number; y: number }
  data: Record<string, any>
  class?: string
}

export type Connection = {
  id: string
  sourceId: string
  sourceHandle?: string
  targetId: string
  targetHandle?: string
  type?: string
  data?: Record<string, any>
}

export type Diagram = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  deleted: boolean
  nodes: Node[]
  connections: Connection[]
  authorId: string
}

export type User = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
}

export type CollaborationUser = Omit<User, 'email'> & {
  clientId: number
  color?: string
  status: 'online' | 'offline'
  cursorPosition?: { x: number; y: number }
  isEditingDiagramName?: boolean
}
