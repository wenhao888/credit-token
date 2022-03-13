import React, {Component} from "react";
import {Form, Input} from "antd"

const layout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};

class WithdrawModal  extends Component {
  render() {
    let {formRef, asset_code } = this.props;
    return (
      <Form
        {...layout}
        ref={formRef}
        name={"asset-withdraw-modal"}
        validateTrigger={'onBlur'}
      >

        <Form.Item label={`Amount (${asset_code})`} name={'amount'}
                   rules={[{ required: true, message: 'required' }]}
        >
          <Input/>
        </Form.Item>

        <span>
          Withdraw asset to my coinbase account
        </span>
      </Form>
    )
  }
}

export default WithdrawModal
