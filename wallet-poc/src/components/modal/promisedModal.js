import React from "react"
import {Modal} from "antd"


export default function promisedModal(Form, submitHandler, title, width=416, otherArgs={}) {
  let formRef = React.createRef();
  let reference = null;

  return new Promise((gResolve, gReject)=> {
    Modal.confirm({
      title: title,
      width,
      className: 'custom-confirm-modal',
      icon: null,
      content: <Form  formRef={formRef} ref={ref=> reference=ref} onSubmit={submitHandler} {...otherArgs}/>,
      onOk() {
        return new Promise( async (resolve, reject)=> {
          try {
            await formRef.current.validateFields();
          }catch {
            reject();
            return;
          }

          try {
            let values =null;
            if (reference.getFieldsValue) {
              values  = reference.getFieldsValue();
            } else {
              values = formRef.current.getFieldsValue()
            }

            reference.submitForm && await reference.submitForm(values);
            resolve("");
            gResolve(values);

          } catch {
            console.log("promisedModal catch");
            reject("");
          }
        })
      },
      onCancel() {
        gReject("cancel")
      },
    });

  });
}
