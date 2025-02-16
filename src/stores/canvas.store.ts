import type { Diagram } from '@/types/canvas'
import { useVueFlow, type Edge, type Node } from '@vue-flow/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCanvasStore = defineStore('CANVAS_STORE', () => {
  const vueFlow = useVueFlow('1')

  const diagram = ref<Diagram>({
    nodes: [
      // an input node, specified by using `type: 'input'`
      {
        id: '1',
        type: 'input',
        position: { x: 250, y: 105 },
        // all nodes can have a data object containing any data you want to pass to the node
        // a label can property can be used for default nodes
        data: { label: 'Node 1' },
        class: 'vue-flow__node-custom',
      },

      // default node, you can omit `type: 'default'` as it's the fallback type
      {
        id: '2',
        position: { x: 100, y: 200 },
        data: { label: 'Node 2' },
        class: 'vue-flow__node-custom',
      },

      // An output node, specified by using `type: 'output'`
      {
        id: '3',
        type: 'output',
        position: { x: 400, y: 500 },
        data: { label: 'Node 3' },
        class: 'vue-flow__node-custom',
      },

      // this is a custom node
      // we set it by using a custom type name we choose, in this example `special`
      // the name can be freely chosen, there are no restrictions as long as it's a string
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
    edges: [
      // default bezier edge
      // consists of an edge id, source node id and target node id
      {
        id: 'e1->2',
        source: '1',
        target: '2',
      },

      // set `animated: true` to create an animated edge path
      {
        id: 'e2->3',
        source: '2',
        target: '3',
        animated: true,
      },

      // a custom edge, specified by using a custom type name
      // we choose `type: 'special'` for this example
      {
        id: 'e3->4',
        type: 'special',
        source: '3',
        target: '4',

        // all edges can have a data object containing any data you want to pass to the edge
        data: {
          hello: 'world',
        },
      },
    ],
  })

  return {
    diagram,
  }
})
