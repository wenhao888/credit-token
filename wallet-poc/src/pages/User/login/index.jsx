import {
  UserOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import {connect } from 'umi';
import styles from './index.less';
import {getLoginUsers} from "../../../../server/config/accounts"

const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [type, setType] = useState('account');

  const handleSubmit = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };

  let allowedUsers = getLoginUsers();

  return (
    <div className={styles.main} style={{'padding':"50px 0 0 0"}}>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
              margin: '20px 0 0 0',
            },
          },
        }}
        onFinish={(values) => {
          handleSubmit(values);
          return Promise.resolve();
        }}
      >

        <>
          <ProFormText
            name="userName"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder={"user name"}
            rules={[
              {
                required: true,
                message: "username is required"
              },
              {
                "validator": (_,text)=> {
                  let value = text||"";
                  //will be handled by the first validator
                  if (value == "") {
                    return Promise.resolve();
                  }

                  let userName = (value).trim().toLowerCase();
                  if (! allowedUsers.includes(userName) ) {
                    return Promise.reject(new Error("Invalid users"));
                  } else {
                    return Promise.resolve();
                  }
                } ,
              }
            ]}
          />
        </>
        <div>
          Only the following user names are supported: {allowedUsers.join(", ")}
        </div>
      </ProForm>

    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
