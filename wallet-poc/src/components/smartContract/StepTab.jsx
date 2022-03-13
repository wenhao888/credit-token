import React, {Component} from "react"
import StepRender from "@/components/smartContract/StepRender";


class StepTab extends Component {
  render() {
    let {index=1,contract={}, mode=''} = this.props;
    return (
      <div>
        <StepRender index={index} contract={contract} mode={mode}/>
      </div>
    )
  }
}


export default StepTab;
