import React, {Component} from "react";
import {Select} from "antd";
const Option =Select.Option;

class TemplateSelect extends Component {
  render() {
    let {onChange, templates} = this.props;

    return (<Select
      style={{ width: 330 }}
      placeholder="Select a template"
      onChange={(value)=> onChange && onChange(value)}
    >
      {
        (Array.isArray(templates)? templates: []).map(t=>  <Option value={t.id}>{t.title}</Option>)
      }
    </Select>)
  }
}


export default TemplateSelect;
