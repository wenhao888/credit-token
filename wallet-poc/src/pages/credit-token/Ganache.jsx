import React, {useEffect} from "react";
import {PageContainer} from '@ant-design/pro-layout';
import {Card, Table, Typography} from 'antd';
import makeColumns from "./tableColumns";
import promisedModal from "@/components/modal/promisedModal";
import TransferModal from "@/pages/credit-token/modals/TransferModal";

import {connect} from "umi";

const Ganache = ({fetchBalances, balances=[], currentUser, isLoading, transfer}) => {

  const transferHandler = async (i)=> {
    let peers=[];
    for(let b of balances) {
      if (b['id']!= i) {
        peers.push(b);
      }
    }

    try {
      let asset_code ='CRT'
      let values = await promisedModal(TransferModal, null, "Transfer asset", 416, {asset_code, peers});
      let {target, amount} = values;
      let to = balances[parseInt(target)].address;
      transfer && transfer(balances[0].address, to, parseFloat(amount), onSubmitFinishHandler);

    } catch (error) {
    }
  };

  const onSubmitFinishHandler= () => {
    fetchBalances && fetchBalances();
  }


  useEffect(() => {
    fetchBalances && fetchBalances();
  }, []);


  return (
    <PageContainer>
      <Card>
        <Table dataSource={balances} columns={makeColumns(transferHandler)} rowKey={"id"} loading={isLoading}/>
      </Card>
    </PageContainer>
  )
}

function mapStateToProps(state) {
  let {user, ganache, loading} = state;

  return {
    currentUser: user.currentUser,
    balances: ganache['balances'],
    isLoading: loading.effects['ganache/fetchBalances'] || loading.effects['ganache/transfer']
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBalances: () => {
      dispatch({
        type: "ganache/fetchBalances",
      })
    },
    transfer:(from, to, amount, onSubmitFinishHandler) => {
      dispatch({
        type: "ganache/transfer",
        payload: {from, to, amount},
        onSubmit: onSubmitFinishHandler
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (Ganache);

