export type NodeType = {
  id: string
  type: 'trigger' | 'regular' | 'if'
  name: string
  description: string
  // TODO: parameters need to have types
  parameters: Record<string, any>
  icon: string[]
}
