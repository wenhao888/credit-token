import React, {useRef, useState} from "react";
import {Link} from "umi";
import {connect, history} from "umi";
import moment from 'moment';
import {Card, Form, Input, Button, Upload, Select} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {UploadOutlined} from '@ant-design/icons';
import {createLoan} from "@/services/loan";
import {isBlank, isIntegerOrBlank, isFloatOrBlank} from "@/pages/loans/validation";
import SearchableSelect from "@/components/form/SearchableSelect";
import {LoanTypes} from "../configuration"

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};
const tailLayout = {
  wrapperCol: {offset: 8, span: 16},
};

const Option = Select.Option;


const CreateLoan = ({currentUser}) => {
  const [form] = Form.useForm();
  const fileIdMapping = useRef({})
  const [loanType, setLoaType] = useState('amortization')
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values = {}) => {
    let {title, amount, documents = {}, type, rate, duration} = values;
    let uploadedFiles = [], fileMapping = fileIdMapping.current;

    for (let file of (documents?.fileList || [])) {
      let clientId = file['uid'], name = file?.name;
      uploadedFiles.push({id: fileMapping[clientId], name});
    }

    let loan = {
      title,
      amount: parseFloat(amount),
      documents: uploadedFiles,
      type,
      rate: parseFloat(rate),
      duration: type=='1time'? 1: parseInt(duration),
      createdBy: currentUser?.name,
      createdAt: moment.utc().format()
    }
    try {
      setLoading(true)
      await createLoan(loan);
      history.push("/loans");
    } catch (ex) {
      //
    } finally {
      setLoading(false);
    }
  };

  const fileUploadChangeHandler = (info = {}) => {
    let clientId = info.file?.uid;
    let serverId = info.file?.response?.id;

    if (clientId && serverId) {
      fileIdMapping.current[clientId] = serverId;
    }
  }

  const formChangeHandler=(changedValues={}, allValues)=> {
    if ("type" in changedValues) {
      setLoaType(changedValues['type']);
    }
  }

  return (
    <PageContainer title={'Apply Loan'}>
      <Card>
        <Form {...layout} form={form} name="create-loan-form" initialValues={{"type": "amortization"}}
              onValuesChange={formChangeHandler}
              onFinish={submitHandler}>
          <Form.Item name="title" label="Title" rules={[{required: true}]}>
            <Input/>
          </Form.Item>

          <Form.Item name="amount" label="Loan amount" rules={[
            {
              validator: (_, value) => isBlank(value)? Promise.reject(new Error("Amount is required")): Promise.resolve()
            },
            {
              validator: (_, value) => isFloatOrBlank(value)?Promise.resolve(): Promise.reject(new Error("Require to be numeric"))
            }
          ]}>
            <Input addonBefore="$"  style={{width:'300px'}}/>
          </Form.Item>

          <Form.Item label={'Loan Type'} name={'type'}
                     rules={[{required: true, message: 'required'}]}>
            <SearchableSelect style={{width: '300px'}}>
              {LoanTypes.map(p =>
                <Option key={p.value} value={p.value}>
                  {p.name}
                </Option>)}
            </SearchableSelect>
          </Form.Item>

          <Form.Item name="rate" label="Interest Rate" rules={[
            {
              validator: (_, value) =>  isBlank(value)? Promise.reject(new Error("Rate is required")): Promise.resolve()
            },
            {
              validator: (_, value) => isFloatOrBlank(value)?Promise.resolve(): Promise.reject(new Error("Require to be numeric"))
            }
          ]}>
            <Input style={{width:'300px'}} addonAfter="%"/>
          </Form.Item>

          { loanType == 'amortization' &&
            <Form.Item name="duration" label="Duration in month" rules={[
              {
                validator: (_, value) =>  isBlank(value)? Promise.reject(new Error("Duration is required")): Promise.resolve()
              },
              {
                validator: (_, value) => isIntegerOrBlank(value)?Promise.resolve(): Promise.reject(new Error("Require to be integer"))
              }
            ]}>
              <Input  style={{width:'300px'}}/>
            </Form.Item>
          }


          <Form.Item name="documents" label="Documents">
            <Upload name={'file'}
                    action={'/api/loans/upload'}
                    onChange={fileUploadChangeHandler}>
              <Button icon={<UploadOutlined/>}>Upload files</Button>
            </Upload>
          </Form.Item>


          <Form.Item {...tailLayout}>
            <Link className={"ant-btn"} to={"/loans"}>
              Cancel
            </Link>

            <Button type="primary" htmlType="submit" style={{"marginLeft": "20px"}} loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
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

export default connect(mapStateToProps)(CreateLoan);
