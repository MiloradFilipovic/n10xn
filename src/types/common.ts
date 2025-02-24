export type NodeType = {
  id: string
  type?: 'input' | 'output' | 'special' | 'default'
  name: string
  description: string
  parameters: Record<string, any>
  icon?: string
}
