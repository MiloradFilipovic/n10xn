import type { Diagram } from '../src/types/canvas'

export const DIAGRAMS: Diagram[] = [
  {
    id: '1741983697717',
    name: 'Sample Diagram 1',
    createdAt: '2025-03-14T20:21:37.717Z',
    updatedAt: '2025-03-14T20:21:37.717Z',
    deleted: false,
    authorId: '1',
    nodes: [
      {
        id: '1741983699612',
        type: 'trigger',
        nodeType: 'manual-trigger',
        position: { x: 641, y: 155 },
        data: {
          name: 'Manual trigger',
          type: 'manual-trigger',
          parameters: {
            manualTriggerNotice: 'This node has no parameters',
          },
        },
      },
      {
        id: '1741983700482',
        type: 'regular',
        nodeType: 'http-request',
        position: { x: 891, y: 155 },
        data: {
          name: 'HTTP request',
          type: 'http-request',
          parameters: {
            url: 'https://api.example.com',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        },
      },
    ],
    connections: [
      {
        id: '1741983699612_1741983700482',
        sourceId: '1741983699612',
        sourceHandle: 'source',
        targetId: '1741983700482',
        targetHandle: 'target',
      },
    ],
  },
  {
    id: '1741985397884',
    name: 'Sample Diagram 2',
    createdAt: '2025-03-14T20:49:57.884Z',
    updatedAt: '2025-03-14T20:49:57.884Z',
    deleted: false,
    authorId: '1',
    nodes: [
      {
        id: '1741985417430',
        type: 'trigger',
        nodeType: 'cron-trigger',
        position: { x: 409, y: 266 },
        data: {
          name: 'Cron trigger',
          type: 'cron-trigger',
          parameters: {
            cronExpression: '0 0 * * *',
          },
        },
      },
      {
        id: '1741985419873',
        type: 'if',
        nodeType: 'if',
        position: {
          x: 631,
          y: 265,
        },
        data: {
          name: 'If',
          type: 'if',
          parameters: {
            condition: '20 > 10',
          },
        },
      },
      {
        id: '1741985427328',
        type: 'regular',
        nodeType: 'http-request',
        position: { x: 942, y: 138 },
        data: {
          name: 'HTTP request',
          type: 'http-request',
          parameters: {
            url: 'https://api.example.com',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        },
      },
      {
        id: '1741985432606',
        type: 'regular',
        nodeType: 'http-request',
        position: { x: 961, y: 355 },
        data: {
          name: 'HTTP request 1',
          type: 'http-request',
          parameters: {
            url: 'https://api.example.com',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        },
      },
    ],
    connections: [
      {
        id: '1741985417430_1741985419873',
        sourceId: '1741985417430',
        sourceHandle: 'source',
        targetId: '1741985419873',
        targetHandle: 'target',
      },
      {
        id: '1741985419873_1741985427328',
        sourceId: '1741985419873',
        sourceHandle: 'source-true',
        targetId: '1741985427328',
        targetHandle: 'target',
      },
      {
        id: '1741985419873_1741985432606',
        sourceId: '1741985419873',
        sourceHandle: 'source-false',
        targetId: '1741985432606',
        targetHandle: 'target',
      },
    ],
  },
]
