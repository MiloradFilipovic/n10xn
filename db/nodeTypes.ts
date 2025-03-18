import { type NodeType } from '../src/types/common'

export const NODE_TYPES: NodeType[] = [
  {
    id: 'manual-trigger',
    type: 'trigger',
    name: 'Manual trigger',
    description: 'Manually trigger the workflow',
    parameters: [
      {
        type: 'notice',
        name: 'manualTriggerNotice',
        content: 'This node has no parameters',
      },
    ],
    icon: ['fas', 'arrow-pointer'],
  },
  {
    id: 'cron-trigger',
    type: 'trigger',
    name: 'Cron trigger',
    description: 'Trigger the workflow on a schedule',
    parameters: [
      {
        type: 'string',
        name: 'cronExpression',
        label: 'Cron expression',
        required: true,
        default: '0 0 * * *',
        maxLength: 100,
        description: 'A cron expression to define the schedule',
      },
    ],
    icon: ['fas', 'clock'],
  },
  {
    id: 'http-request',
    type: 'regular',
    name: 'HTTP request',
    description: 'Make an HTTP request',
    parameters: [
      {
        type: 'string',
        name: 'url',
        label: 'URL',
        maxLength: 1000,
        required: true,
        description: 'URL of the request',
      },
      {
        type: 'enum',
        name: 'method',
        label: 'HTTP method',
        values: [
          { value: 'GET', label: 'GET', default: true },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' },
        ],
        required: true,
        description: 'HTTP method',
      },
      {
        type: 'string',
        name: 'headers',
        label: 'Headers',
        default: '{}',
        maxLength: 1000,
        description: 'Request headers',
      },
      {
        type: 'string',
        name: 'body',
        label: 'Body',
        default: '{}',
        maxLength: 1000,
        description: 'Request body',
      },
    ],
    icon: ['fas', 'globe'],
  },
  {
    id: 'if',
    type: 'if',
    name: 'If',
    description: 'Introduce a conditional branch',
    parameters: [
      {
        type: 'string',
        name: 'condition',
        label: 'Condition',
        maxLength: 100,
        required: true,
        default: '1 === 1',
        description: 'Condition to check',
      },
    ],
    icon: ['fas', 'signs-post'],
  },
]
