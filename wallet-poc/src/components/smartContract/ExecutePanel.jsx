import React, {Component} from "react"
import {Button, Select} from "antd";

const {Option} = Select;

/**
 *  step has the format:
 *   {
        id: 1,
        title: "Pay supplier",
        source_account: 'address_of_e',
        recipients: [
          {
            dest_account: 'address_of_b',
            amount: 100,
            condition: 'success'
          },
          {
            dest_account: 'address_of_e',
            amount: 400,
            condition: 'failed'
          }
        ]
      }
 *
 */

class ExecutePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'selected':'',
    }
  }

  reset = ()=>{
    this.setState({selected: '', loading: false});
  };

  getStepEvents(recipients) {
    let eventDict = {};
    for (let r of recipients || []) {
      let condition = r['condition'];
      eventDict[condition] = condition;
    }

    return Object.keys(eventDict) || [];
  }

  valueChangeHandler=(value)=>{
    this.setState({selected: value});
  }

  executeStepHandler = ()=> {
    let {onExecute} = this.props, condition= this.state?.selected;
    onExecute && condition &&  onExecute(condition);
  }

  render () {
    let {step={}, disabled, loading} = this.props;
    let {selected} = this.state;

    let events = this.getStepEvents(step['recipients']);

    return (
      <div style={{paddingLeft:"100px"}}>
        <span> Events: </span>
        <Select disabled={disabled} style={{ width: 300 }} ref={this.selectRef} value={selected} onChange={this.valueChangeHandler}>
          {events.map(e=> <Option value={e}> {e} </Option>)}
        </Select>
        <Button disabled={disabled} loading={loading} onClick={this.executeStepHandler} type={'primary'}> Trigger </Button>
      </div>
    );
  }
}


export default  ExecutePanel;
