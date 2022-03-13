import React, {useEffect, useRef, useState} from "react";
import {Link} from "umi";
import {connect, history} from "umi";
import {Card, Form, Input, Button, Upload, Select, List, Descriptions, Table} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {getLoanById, payoffLoanByMonth} from "@/services/loan";
import {columnFactory} from "@/pages/loans/schedule/column";

const LoanSchedule = ({currentUser, match}) => {
  let [loan, setLoan] = useState({});
  let loanId=match?.params?.id;

  useEffect(() => {
    (async () => {
      let loan = await getLoanById(loanId);
      setLoan(loan);
    })();

  }, [])

  const payOffCallback= async (step)=> {
     let {month}= step;
     let loan = await payoffLoanByMonth(currentUser['addr'], loanId, month);
     setLoan(loan);
  }

  return (
    <PageContainer title={'Loan Schedule'}>
      <Card extra={<Link to={"/loans"} className={"ant-btn"}>Close</Link>}>
        <Descriptions title={loan['title']}>
          <Descriptions.Item label="amount">{'$'+ loan['amount']}</Descriptions.Item>
          <Descriptions.Item label="rate">{loan['rate'] +"%"}</Descriptions.Item>
          <Descriptions.Item label="type">{loan['type']}</Descriptions.Item>
          <Descriptions.Item label="# of payments">{`${loan["duration"]}`}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Table dataSource={loan['schedule']} pagination={{ pageSize: 6}}
               columns={columnFactory(payOffCallback)}
               rowKey={'month'}>
        </Table>
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

export default connect(mapStateToProps)(LoanSchedule);
