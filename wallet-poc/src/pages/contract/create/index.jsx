import React, {useEffect, useState} from "react";
import {PageContainer} from '@ant-design/pro-layout';
import {Card, List, Checkbox, Button, Form, Input} from "antd";
import {connect, history} from "umi";
import {fetchContractTemplate, createContract} from "@/services/contract";

const {Meta} = Card;

const CreateContact = () => {
  const [form] = Form.useForm();
  let [template, setTemplate] = useState({
    sections: []
  })
  let [roles, setRoles] = useState([]);

  useEffect(() => {
    (async function () {
      let template = await fetchContractTemplate();
      setTemplate(template);
    })()
  }, [])

  /**
   * submit handler
   *
   * @param values
   */
  const createHandler = async (values) => {
    let selectedSections=[];
    let selectedRoles= [];

    for(let section of (template['sections'] ||[])) {
      let id= section["id"];
      let role = section["role"];

      if (values["section-" + id]) {
        selectedSections.push(id);
      }

      if (values["role-"+role]) {
        selectedRoles.push({
          "role": role,
          "email": values["role-"+role]
        })
      }
    }

    let request={
      selectedSections,
      selectedRoles
    }

    let view = (await createContract(request)) ||{};
    if (view["url"]) {
      window.location.replace(view['url']);
    } else {
      history.push("/contracts/success")
    }
  }

  const valuesChangeHandler = (values, allValues) => {
    let selectedRoles = [];
    let templateSections = template?.sections || [];

    for (let i = 0; i < templateSections.length; i++) {
      let key = "section-" + i;
      if (allValues[key]) {
        selectedRoles.push(templateSections[i]['role']);
      }
    }

    if (!arrayEquals(roles, selectedRoles)) {
      setRoles(selectedRoles);
    }
  }

  const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

  let {title = "", content = "", sections = []} = template;

  return (
    <PageContainer title={"Create Contract"}>

      <Card title={'Sample template'}>
        <div>
          <h2 style={{"textAlign": "center"}}> {title} </h2>
          <p>
            {content}
          </p>
        </div>
        <Form
          form={form}
          autoComplete="off"
          onFinish={createHandler}
          onValuesChange={valuesChangeHandler}
        >

          <h3> Select applicable sections </h3>
          <List
            itemLayout="horizontal"
            dataSource={sections}
            renderItem={section => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Form.Item name={"section-" + section["id"]} valuePropName="checked">
                      <Checkbox value={section["id"]}> {section['title']} </Checkbox>
                    </Form.Item>}
                  description={section['content']}/>
              </List.Item>)}
          />


          <h3> Specify email of roles </h3>
          {
            roles.map(r => (
              <Form.Item name={"role-" + r} label={r} labelCol={{span: 3}}>
                <Input style={{width: '400px'}}/>
              </Form.Item>
            ))
          }


          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>

        </Form>

      </Card>

    </PageContainer>
  )
}


export default CreateContact;

