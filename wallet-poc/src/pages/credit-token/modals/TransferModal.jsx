import React, {Component} from "react";
import {Form, Input, Select} from "antd"
import SearchableSelect from "@/components/form/SearchableSelect";

const {Option} = Select;

const layout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};

class TransferModal extends Component {
  render() {
    let {formRef, asset_code, peers = []} = this.props;
    return (
      <Form
        {...layout}
        ref={formRef}
        name={"asset-transfer-modal"}
        validateTrigger={'onBlur'}
      >
        <Form.Item label={'To whom'} name={'target'}
                   rules={[{required: true, message: 'required'}]}>
          <SearchableSelect>
            {peers.map(p =>
              <Option key={p.id} value={p.id}>
                {p.name}
              </Option>)}
          </SearchableSelect>
        </Form.Item>

        <Form.Item label={`Amount (${asset_code})`} name={'amount'}
                   rules={[{required: true, message: 'required'}]}>
          <Input/>
        </Form.Item>
      </Form>
    )
  }
}

export default TransferModal
