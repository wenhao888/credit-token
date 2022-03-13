import React, {Component} from "react";
import {PageContainer} from '@ant-design/pro-layout';
import {Card, Button, Spin} from "antd";
import {connect, history} from "umi";
import TemplateSelect from "../../../components/smartContract/TemplateSelect"
import StepTab from "@/components/smartContract/StepTab";
import StepsNav from "@/components/smartContract/StepsNav";
import styles from "../styles.less"
import {createContract} from "@/services/smartContract";

const { Meta } = Card;


class ContractTemplates extends Component {
  constructor(props) {
    super(props);
    this.state= {
      currentStep: 0,
      currentTemplate: {},
      loading:false
    }
  }

  componentDidMount() {
    let {fetchTemplates} = this.props;
    fetchTemplates && fetchTemplates();
  }

  /**
   * value is index of the selected template
   *
   * @param value
   */
  templateChangeHandler = (value) => {
    let {templates} = this.props;
    let selected = (!value?1: parseInt(value) ) -1;

    this.setState({
      currentStep: 0,
      currentTemplate: templates.length-1>=selected? {... templates[selected] }: {}
    })
  }

  currentStepChangeHandler= (current)=> {
    this.setState({
      currentStep: current
    })
  }

  createContractHandler= async ()=> {
     let {currentUser={}}=this.props;
     let {currentTemplate = {}} = this.state;
     if (!currentTemplate['id']) {
       return;
     }

    try {
      this.setState({
        loading:true
      })
       let contract = await createContract(currentTemplate['id'], currentUser.name);
       history.push(`/smartContracts/${contract['id']}`);
    } catch (error) {

    } finally {
       this.setState({
         loading:false
       })
    }
  }

  render() {
    let {currentStep, currentTemplate, loading} = this.state ;
    let {templates, isLoading} = this.props;

    return (
      <PageContainer title={<span/>}
                     content={
                       <div>
                         Contract templates: <TemplateSelect templates={templates||[]} onChange={this.templateChangeHandler}/>
                         <Spin spinning={isLoading}/>
                       </div>}>

        <Card title={!currentTemplate['id']? 'Template-Flow': `Template-Flow (total: $${currentTemplate['total']})`}  className={styles['contract-card']}
              extra={<Button type='primary'  loading={loading}  onClick={this.createContractHandler}> Create Contract </Button>}>

          <div className={styles['content-container']}>

           <div className={styles['content-left']}>
             <StepsNav templateOrContract={currentTemplate||{}}  current={currentStep} onChange={this.currentStepChangeHandler}/>
           </div>

           <div className={styles['content-right']}>
              <StepTab  index={currentStep}  contract={currentTemplate}/>
           </div>
         </div>
        </Card>
      </PageContainer>

    )
  }
}

function mapStateToProps(state) {
  let {user,contractTemplates, loading} = state;
  return {
    currentUser: user.currentUser,
    templates: contractTemplates['templates'],
    isLoading: loading.effects['contractTemplates/fetchTemplates']
  }
}

function mapDispatchToProps(dispatch)  {
  return  {
    fetchTemplates: () => {
      dispatch({
        type: "contractTemplates/fetchTemplates",
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContractTemplates);

