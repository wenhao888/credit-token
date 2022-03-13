import React, {Component} from "react";
import ReactFlow from "react-flow-renderer";
import {createGraph} from "./helper"
import {getAccountByAddr} from "../../../server/config/accounts"

/**
 * step is an object defining transactions
 *
 */
class StepRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: null
    }
  }

  /**
   *  step has format:
   *
   *   {
        title:"Pay supplier",
        source_address: 'address_of_e',
        recipients:[
          {
            dest_address:'address_of_a',
            amount: 100,
            condition: 'success'
          },
          {
            dest_address:'address_of_b',
            amount: 100,
            condition: 'success'
          },
          {
            dest_address:'address_of_e',
            amount: 200,
            condition: 'failed'
          }
        ]
      }
   *
   *
   *
   * @param step
   * @returns {*[]|*}
   */
  createStepGraph = () => {
    let { index=1, mode='', contract={}} = this.props,  steps = contract['steps'] || [];
    let step = steps.length-1>= index  ? steps[index]: {}, balance = contract['balance'];

    if (! step['source_address']) {
      return [];
    }

    let edgeCount = 0, nodes = [], edges = [];
    let source_address = step['source_address'];
    let src_id =  `src-${source_address}`;

    nodes.push({
      id: src_id,
      data: {label: getAccountByAddr(source_address)['title']+ (mode=='execute'? ` (balance: ${balance})`:"")}
    });

    //at step 0, add the money flow from customer to escrow
    if (index ==0) {
      let customer_address = contract['customer_address'], customer_id = "customer-"+ customer_address;

      nodes.push({
        id: customer_id ,
        data: {label: getAccountByAddr(customer_address)['title']}
      });

      edges.push({
        id: edgeCount++,
        source: customer_id,
        target: src_id,
        label: `move to escrow $${contract['total']}`,
        arrowHeadType: "arrow"
      })
    }

    for (let r of step['recipients']) {
      let dest_address = r['dest_address']
      let amount = r['amount'];
      let condition = r['condition'];
      let matched = r['matched'];
      let dest_id = `dest-${dest_address}`;

      nodes.push({
        id: dest_id,
        data: {label: `${getAccountByAddr(dest_address)['title']} ($${amount}) `}
      });

      let edge = {
        id: edgeCount++,
        source: src_id,
        target: dest_id,
        label: `if ${condition}`,
        arrowHeadType: "arrow"
      }
      if (!!matched) {
        if (condition !='failure'){
          edge['labelStyle']= {fill:"green"}
          edge['style'] = {stroke:"green"}
        } else {
          edge['labelStyle']= {fill:"green"}
          edge['style'] = {stroke:"red"}
        }
      }

      edges.push(edge)
    }

    return createGraph(nodes, edges)
  }


  render() {
    let elements = this.createStepGraph();

    return (
      <div style={{height: "300px"}}>
        {
          elements &&
          <ReactFlow elements={elements} style={{width: "100%", height: "100%"}}
                     zoomOnPinch={false}
                     zoomOnDoubleClick={false}
                     zoomOnScroll={false}
                     deleteKeyCode={0}
                     minZoom={1} maxZoom={1}/>
        }
      </div>
    )
  }
}

export default StepRender;
