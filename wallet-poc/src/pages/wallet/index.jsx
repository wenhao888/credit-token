import React, {useEffect} from "react"
import {connect} from 'umi';
import {PageContainer} from '@ant-design/pro-layout';
import {Card, Table, Avatar} from "antd"
import {makeColumns} from "./columns"
import promisedModal from "@/components/modal/promisedModal";
import TransferModal from "@/pages/wallet/modals/TransferModal";
import WithdrawModal from "@/pages/wallet/modals/WithdrawModal";
import ConvertModal  from "@/pages/wallet/modals/ConvertModal";
import DepositModal from "@/pages/wallet/modals/DepositModal";
import {accountNameDict} from "../../../server/config/accounts";
import {assetDict} from "../../../server/config/assets";
import {getConversionTargets} from "@/pages/wallet/helper";

const {Meta} = Card;

const  Wallet = (props)=> {
  useEffect(()=> {
    let {fetchBalances, currentUser} = props;
    fetchBalances(currentUser.publicKey);

  },[])

  const transferHandler = async (i)=> {
    let { balances, currentUser, transfer} = props;
    let peers=[];
    for (let key in accountNameDict) {
      if (key!=currentUser['name']) {
        peers.push(accountNameDict[key])
      }
    }

    let {asset_code} =  balances[i];
    let asset_issuer = assetDict[asset_code]['issuer'];

    try {
      let values = await promisedModal(TransferModal, null, "Transfer asset", 416, {asset_code, peers})
      transfer(asset_code, asset_issuer , values['amount'], currentUser['name'], values['target'], onSubmitFinishHandler);
    } catch (error) {
    }
  };

  const convertHandler = async (i)=> {
    let {balances, currentUser, convert} = props;
    let {asset_code} =  balances[i], asset_issuer = assetDict[asset_code]['issuer'];
    let targets = getConversionTargets(asset_code);
    let values = await promisedModal(ConvertModal, null, "Convert asset", 416, {asset_code, targets})
    let {target_code, amount} = values;
    convert(asset_code, asset_issuer, amount, target_code, assetDict[target_code]['issuer'],  currentUser['name'], onSubmitFinishHandler);
  }

  const withdrawHandler =async (i)=> {
    let {balances, currentUser, withdraw} = props;
    let {asset_code} =  balances[i], asset_issuer = assetDict[asset_code]['issuer'];

    try {
      let values = await promisedModal(WithdrawModal, null, "Transfer asset", 416, {asset_code})
      withdraw(asset_code, asset_issuer,values['amount'],currentUser['name'], onSubmitFinishHandler);
    }catch (error) {
    }
  }

  const depositHandler = async (i)=> {
    let {balances, currentUser, deposit} = this.props;
    let {asset_code} =  balances[i];

    try {
      let values = await promisedModal(DepositModal, null, "Deposit asset", 416, {asset_code})
      deposit(asset_code,values['amount'], currentUser['publicKey'], onSubmitFinishHandler);
    }catch (error) {
    }
  }

  const onSubmitFinishHandler= ()=>{
    let {fetchBalances, currentUser} = props;
    fetchBalances(currentUser.publicKey);
  }

  let {currentUser = {}, balances, isLoading} = props;
  return (
    <PageContainer>
      <Card title={<Meta
        title={currentUser['title'] + ' Wallet'}
        description={`Algo address: ${currentUser['addr']}`}/>}
            style={{width: "800px"}}>

        <Table dataSource={balances}
               columns={makeColumns(transferHandler, convertHandler, withdrawHandler, depositHandler)}
               rowKey={'id'}
               loading={isLoading}
               pagination={false}>
        </Table>
      </Card>
    </PageContainer>
  )
}

function mapStateToProps(state) {
  let {user, wallet, loading} = state;

  return {
    currentUser: user.currentUser,
    balances: wallet['balances'],
    isLoading: loading.effects['wallet/fetchBalances'] || loading.effects['wallet/transfer'] ||
      loading.effects['wallet/convert'] || loading.effects['wallet/withdraw'] ||
      loading.effects['wallet/deposit']
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBalances: (publicKey) => {
      dispatch({
        type: "wallet/fetchBalances",
        publicKey,
      })
    },
    transfer: (asset_code, asset_issuer, amount, src, target, onSubmit)=>{
      dispatch({
        type:"wallet/transfer",
        payload: {
          asset_code, asset_issuer, amount, src, target
        },
        onSubmit
      })
    },
    convert: (source_code, source_issuer, amount, target_code, target_issuer, src, onSubmit)=>{
      dispatch({
        type:"wallet/convert",
        payload: {
          source_code, source_issuer, amount, target_code, target_issuer, src
        },
        onSubmit
      })
    },

    withdraw: (asset_code, asset_issuer, amount, src, onSubmit)=>{
      dispatch({
        type:"wallet/withdraw",
        payload: {
          asset_code, asset_issuer, amount, src
        },
        onSubmit
      })
    },
    deposit: (asset_code, amount, publicKey, onSubmit)=> {
      dispatch({
        type:"wallet/withdraw",
        payload: {
          asset_code, amount, publicKey
        },
        onSubmit
      })
    },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
