import type { Diagram } from '../src/types/canvas'

export const DIAGRAMS: Diagram[] = [
  {
    id: '1',
    name: 'Diagram 1',
    createdAt: '2021-10-01T12:00:00Z',
    updatedAt: '2021-10-01T12:00:00Z',
    deleted: false,
    authorId: '1',
    nodes: [
      {
        id: '1',
        type: 'input',
        position: { x: 250, y: 105 },
        data: { label: 'Node 1' },
        class: 'vue-flow__node-custom',
      },

      {
        id: '2',
        position: { x: 100, y: 200 },
        data: { label: 'Node 2' },
        class: 'vue-flow__node-custom',
      },

      {
        id: '3',
        type: 'output',
        position: { x: 400, y: 500 },
        data: { label: 'Node 3' },
        class: 'vue-flow__node-custom',
      },

      {
        id: '4',
        type: 'special', // <-- this is the custom node type name
        position: { x: 500, y: 200 },
        data: {
          label: 'Node 4',
          hello: 'world',
        },
        class: 'vue-flow__node-custom',
      },
    ],
    connections: [
      {
        id: 'e1->2',
        source: '1',
        target: '2',
      },
      {
        id: 'e2->3',
        source: '2',
        target: '3',
      },

      {
        id: 'e3->4',
        type: 'special',
        source: '3',
        target: '4',

        data: {
          hello: 'world',
        },
      },
    ],
  },
]
