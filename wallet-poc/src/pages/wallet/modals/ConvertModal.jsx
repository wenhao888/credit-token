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

class ConvertModal extends Component {
  render() {
    let {formRef, asset_code, targets = []} = this.props;
    return (
      <Form
        {...layout}
        ref={formRef}
        name={"asset-convert-modal"}
        validateTrigger={'onBlur'}
      >
        <Form.Item label={'To'} name={'target_code'}
                   rules={[{required: true, message: 'required'}]}>
          <SearchableSelect>
            {targets.map(p =>
              <Option key={p.name} value={p.name}>
                {p.title}
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

export default ConvertModal
