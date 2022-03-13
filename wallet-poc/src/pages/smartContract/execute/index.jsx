import React, {Component} from "react";
import {PageContainer} from '@ant-design/pro-layout';
import {Card} from "antd";
import {Link} from "umi";
import styles from "@/pages/smartContract/styles.less";
import StepsNav from "@/components/smartContract/StepsNav";
import StepTab from "@/components/smartContract/StepTab";

import {fetchContract, executeSmartContract} from "@/services/smartContract";
import ExecutePanel from "@/components/smartContract/ExecutePanel";


class ExecuteContract extends Component {
  constructor(props) {
    super(props);
    this.executeRef = React.createRef();
    this.contract_id = this.props?.match?.params['id'];

    this.state = {
      currentStep: 0,
      contract: {},
      loading: false
    };
  }

  async componentDidMount() {
    if (!this.contract_id) {
      return;
    }

    try {
      let contract = await fetchContract(this.contract_id);
      this.setState({
        contract
      });
    } catch (error) {
    }
  }

  currentStepChangeHandler = (current) => {
    this.setState({
      currentStep: current,
      loading: false
    })
    this.executeRef.current.reset();
  }

  executeHandler = async (condition) => {
    let {currentStep} = this.state;
    try {
      this.setState({loading:true})
      let contract= await executeSmartContract(this.contract_id,currentStep, condition);
      this.setState({
        contract
      })
    } catch (error){
    } finally {
      this.setState({loading: false})
    }
  }

  render() {
    let {currentStep = 0, contract = {}, loading} = this.state;
    let steps = contract['steps'] || [];
    let step = steps.length - 1 >= currentStep ? steps[currentStep] : {};
    let lastFinishedStep = contract['last_finished_step'];

    return (
      <PageContainer title={'Execute Contract'}
                     extra={<Link to={'/smartContracts'} className={"ant-btn"}> Close </Link>}>
        <Card title={!contract['id'] ? 'Contract-Flow' : `Contract-Flow (total: $${contract['total']})`}
              className={styles['contract-card']}>
          <div className={styles['content-container']}>

            <div className={styles['content-left']}>
              <StepsNav templateOrContract={contract || {}} current={currentStep}
                        onChange={this.currentStepChangeHandler}/>
            </div>

            <div className={styles['content-right']}>
              <StepTab index={currentStep} mode={'execute'} contract={contract}/>
              <ExecutePanel ref={this.executeRef} loading={loading} disabled={contract['finished'] || step['finished'] || (currentStep-1) != lastFinishedStep } step={step} onExecute={this.executeHandler}/>
            </div>
          </div>

        </Card>
      </PageContainer>
    )
  }
}

export default ExecuteContract
