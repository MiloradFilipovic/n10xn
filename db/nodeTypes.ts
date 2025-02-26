import { type NodeType } from '../src/types/common'

export const NODE_TYPES: NodeType[] = [
  {
    id: 'manual-trigger',
    type: 'input',
    name: 'Manual trigger',
    description: 'Manually trigger the workflow',
    parameters: {
      notice: 'This node does not have any parameters',
    },
    icon: 'mdi-hand',
  },
  {
    id: 'cron-trigger',
    type: 'input',
    name: 'Cron trigger',
    description: 'Trigger the workflow on a schedule',
    parameters: {
      cron: 'Cron expression',
    },
    icon: 'mdi-clock',
  },
  {
    id: 'http-request',
    type: 'default',
    name: 'HTTP request',
    description: 'Make an HTTP request',
    parameters: {
      url: 'URL of the request',
      method: 'HTTP method',
      headers: 'Request headers',
      body: 'Request body',
    },
    icon: 'mdi-web',
  },
  {
    id: 'if',
    type: 'if',
    name: 'If',
    description: 'Introduce a conditional branch',
    parameters: {
      condition: 'Condition to check',
    },
    icon: 'mdi-weather-night',
  },
]
