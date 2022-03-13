import dagre from 'dagre';

/**
 * input node has format:
 *    {
        id: '1',
        type: 'input', // input node
        data: {label: 'Input Node'},
        position: {x: 250, y: 25},
    },
 *
 * input  edge has format:
 *    {id: 'e1-2', source: '1', target: '2', animated: true}
 *
 *
 *
 * dagre node has format:
 *   {
            label:"a",
            width: NODE_WIDTH,
            data:"something",
            height: NODE_HEIGHT
        }
 *
 * dagre edge has format:
 *
 *
 * @param nodes
 * @param edges
 */
function createGraph(nodes, edges) {
  const NODE_WIDTH = 200;
  const NODE_HEIGHT = 50;
  const g = new dagre.graphlib.Graph();
  g.setGraph({});
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  nodes.forEach(n=> {
    g.setNode(n["id"], {
      ... n,
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    })
  });

  edges.forEach(e=> {
    g.setEdge(e["source"], e['target'])
  });

  dagre.layout(g);
  nodes.forEach(n=> {
    let id =n['id'];
    let node = g.node(id);
    n['position'] = {
      x: node['x'],
      y: node['y']
    };

    delete n['x'];
    delete n['y'];
  });

  return [...nodes, ...edges];

}

export {createGraph}
