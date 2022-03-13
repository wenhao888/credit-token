import React, {useEffect} from "react";
import {Link} from "umi";
import {connect} from "umi";
import {Card, Table} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {columns} from "@/pages/loans/myLoans/column";

const MyLoans =({fetchLoans, isLoading, loans=[]})=> {

  useEffect(()=>{
    fetchLoans && fetchLoans();
  },[])

  return (
    <PageContainer title={'My Loans'}>
      <Card extra={<Link className={"ant-btn ant-btn-primary"} to={"/loans/create"}> Apply Loan </Link>}>
        <Table dataSource={loans}
               columns={columns}
               rowKey={'id'}
               loading={isLoading}
               pagination={false}>
        </Table>
      </Card>
    </PageContainer>
  )
}

function mapStateToProps(state) {
  let {user,myLoans, loading} = state;
  return {
    currentUser: user.currentUser,
    loans: myLoans['loans'],
    isLoading: loading.effects['myLoans/fetchLoans']
  }
}

function mapDispatchToProps(dispatch)  {
  return  {
    fetchLoans: () => {
      dispatch({
        type: "myLoans/fetchLoans",
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyLoans);
