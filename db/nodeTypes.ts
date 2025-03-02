import { type NodeType } from '../src/types/common'

export const NODE_TYPES: NodeType[] = [
  {
    id: 'manual-trigger',
    type: 'trigger',
    name: 'Manual trigger',
    description: 'Manually trigger the workflow',
    parameters: {
      notice: 'This node does not have any parameters',
    },
    icon: ['fas', 'arrow-pointer'],
  },
  {
    id: 'cron-trigger',
    type: 'trigger',
    name: 'Cron trigger',
    description: 'Trigger the workflow on a schedule',
    parameters: {
      cron: 'Cron expression',
    },
    icon: ['fas', 'clock'],
  },
  {
    id: 'http-request',
    type: 'regular',
    name: 'HTTP request',
    description: 'Make an HTTP request',
    parameters: {
      url: 'URL of the request',
      method: 'HTTP method',
      headers: 'Request headers',
      body: 'Request body',
    },
    icon: ['fas', 'globe'],
  },
  {
    id: 'if',
    type: 'if',
    name: 'If',
    description: 'Introduce a conditional branch',
    parameters: {
      condition: 'Condition to check',
    },
    icon: ['fas', 'signs-post'],
  },
]
