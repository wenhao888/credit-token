import React, {useEffect, useState} from "react";
import {Link} from "umi";
import {connect, history} from "umi";
import moment from 'moment';
import {Card, Form, Input, Button, Upload} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {getLoanById, approveLoan} from "@/services/loan";
import SearchableSelect from "@/components/form/SearchableSelect";
import {LoanTypes} from "@/pages/loans/configuration";

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};
const tailLayout = {
  wrapperCol: {offset: 8, span: 16},
};


const LenderDetail = ({currentUser, match}) => {
  let [loan, setLoan] = useState({});
  let [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  useEffect(() => {
    (async () => {
      let id = match?.params?.id;
      let loan = await getLoanById(id);
      setLoan(loan);
    })();

  }, [])


  const approveLoanHandler=async ()=> {
    let update={
      status: `approved by ${currentUser?.name}`,
      approvedAt: moment.utc().format()
    }

     try {
       setLoading(true);
       await approveLoan(loan?.id, update);
       history.push("/simulation/loans")
     } catch (error) {
      //
     }
     finally {
       setLoading(false);
     }

  }

  return (
    <PageContainer title={'Apply Loan'}>
      <Card> {
        !(loan?.id) ?
          null :
          <Form {...layout} form={form} name="create-loan-form" initialValues={loan}>
            <Form.Item name="title" label="Title" rules={[{required: true}]}>
              <Input readOnly={true}/>
            </Form.Item>

            <Form.Item name="amount" label="Loan amount" rules={[{required: true}]}>
              <Input addonBefore="$" readOnly={true}  style={{width:"300px"}}/>
            </Form.Item>

            <Form.Item label={'Loan Type'} name={'type'}
                       rules={[{required: true, message: 'required'}]}>
               <Input readOnly={true}  style={{width:"300px"}}/>
            </Form.Item>

            <Form.Item name="rate" label="Interest Rate" rules={[{required: true}]}>
              <Input readOnly={true} style={{width:"300px"}} addonAfter={"%"}/>
            </Form.Item>

            { loan['type']=='1time' ? null:
              <Form.Item name="duration" label="Duration in month" rules={[{required: true}]}>
                <Input readOnly={true} style={{width: "300px"}}/>
              </Form.Item>
            }

            <Form.Item name="status" label="Status" rules={[{required: true}]}>
              <Input readOnly={true} style={{width:"300px"}}/>
            </Form.Item>

            <Form.Item name="createdBy" label="Applicant" rules={[{required: true}]}>
              <Input readOnly={true} style={{width:"300px"}}/>
            </Form.Item>

            <Form.Item name="createdAt" label="Submitted At" rules={[{required: true}]}>
              <Input readOnly={true} style={{width:"300px"}}/>
            </Form.Item>


            <Form.Item {...tailLayout}>
              <Link className={"ant-btn"} to={"/simulation/loans"}>
                Close
              </Link>

              { loan?.status=='submitted'?
                <Button type="primary" style={{"marginLeft": "20px"}} onClick={approveLoanHandler} loading={loading}>
                  Approve
                </Button>
                :null
              }
            </Form.Item>
          </Form>
      }
      </Card>
    </PageContainer>
  )
}

function mapStateToProps(state) {
  let {user} = state;
  return {
    currentUser: user.currentUser,
  }
}

export default connect(mapStateToProps)(LenderDetail);
