import React, {Component} from "react"
import {Steps} from "antd";

const { Step } = Steps;


class StepsNav extends Component {
  onChangeHandler= (current)=> {
     let {onChange} =this.props;
    onChange && onChange(current);
  };

  render() {
    let {current, templateOrContract={}} =this.props;
    let steps = templateOrContract['steps'] || [];

   return (
     <Steps direction="vertical" size="small" current={current||0} type={'navigation'} onChange={this.onChangeHandler}>
       {
        steps.map(s=> <Step  title={s.title} description={s['description']} />)
       }
     </Steps>
   );
  }
}

export default StepsNav
