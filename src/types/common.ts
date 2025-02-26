export type NodeType = {
  id: string
  type?: 'input' | 'output' | 'if' | 'default'
  name: string
  description: string
  // TODO: parameters need to have types
  parameters: Record<string, any>
  icon?: string
}
