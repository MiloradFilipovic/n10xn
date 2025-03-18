export type NodeType = {
  id: string
  type: 'trigger' | 'regular' | 'if'
  name: string
  description: string
  icon: string[]
  parameters: NodeParameters[]
}

export type NodeParameter = {
  name: string
  type: string
  label?: string
  required?: boolean
  default?: any
  description?: string
}

export type StringNodeParameter = NodeParameter & {
  type: 'string'
  maxLength: number
}

export type NumberNodeParameter = NodeParameter & {
  type: 'number'
  min: number
  max: number
}

export type BooleanNodeParameter = NodeParameter & {
  type: 'boolean'
}

export type EnumNodeParameter = NodeParameter & {
  type: 'enum'
  values: Array<{ value: string; label: string; default?: boolean }>
}

export type NoticeNodeParameter = NodeParameter & {
  type: 'notice'
  content: string
}

export type NodeParameters =
  | StringNodeParameter
  | NumberNodeParameter
  | BooleanNodeParameter
  | EnumNodeParameter
  | NoticeNodeParameter
