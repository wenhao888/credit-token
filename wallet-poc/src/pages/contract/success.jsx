import React from "react";
import {PageContainer} from '@ant-design/pro-layout';
import {Card} from "antd";
import {connect, history} from "umi";


const CreateResult =() => {

  return <PageContainer title={"Create Contract"}>

    <Card title={'Result'}>
      <div>
         You contract has been sent out to
        Please checkout email
      </div>

    </Card>

  </PageContainer>

}


export default CreateResult
