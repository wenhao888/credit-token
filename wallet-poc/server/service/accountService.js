const algosdk = require("algosdk");
const {algodClient} = require("../config/network");
const {accountNameDict} = require("../config/accounts");
const {ALGO_CODE, getAssetByCode, getAssetById} = require("../config/assets");
const { ExceptionMap } = require("antd/lib/result");

async function getBalances(addr) {
  console.log("get balance: " + addr)
   let accountInfo = await algodClient.accountInformation(addr).do();
   console.log(accountInfo)
   let {amount} = accountInfo, count=0;

   let assets= [{id: count++, ...getAssetById(-1), balance: amount}];

   for (let asset of (accountInfo['assets'] || [] )) {
     let amount= asset['amount'], asset_id= asset['asset-id']
     let assetInUse= getAssetById(asset_id);
     assetInUse['asset_id'] && assets.push({id: count++, ...assetInUse,  balance:amount});
   }

   return assets;
}


async function transfer(asset_code, amount, src, targetAddr) {
   if (asset_code == ALGO_CODE) {
     await transferAlgo(asset_code, amount, src, targetAddr);
   } else {
     await transferAsset(asset_code, amount, src, targetAddr);
   }
}

async function transferAlgo(asset_code, amount, src, targetAddr) {
  let sourceMemonic = accountNameDict[src]['memonic']

  let sourceAccount = algosdk.mnemonicToSecretKey(sourceMemonic);

  let params = await algodClient.getTransactionParams().do();
  const suggestedParams = {
    fee: 1,
    firstRound: params.firstRound,
    lastRound: params.lastRound,
    genesisHash: params.genesisHash,
  };

  let transactionOptions = {
    from: sourceAccount.addr,
    to: targetAddr,
    amount: parseInt(amount),
    suggestedParams,
    note: new Uint8Array(Buffer.from("transfer native asset"))
  };

  let transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject(transactionOptions)
  let signedTxn = algosdk.signTransaction(transaction, sourceAccount.sk);
  let sendTx = await algodClient.sendRawTransaction(signedTxn.blob).do();
  return sendTx;
}

async function transferAsset(asset_code, amount, src, targetAddr) {
  let asset = getAssetByCode(asset_code);
  let sourceMemonic = accountNameDict[src]['memonic']

  let sourceAccount = algosdk.mnemonicToSecretKey(sourceMemonic);
  let params = await algodClient.getTransactionParams().do();

  const suggestedParams = {
    fee: 1,
    firstRound: params['firstRound'],
    lastRound: params['lastRound'],
    genesisHash: params['genesisHash']
  };

  let transactionOptions = {
    from: sourceAccount.addr,
    to: targetAddr,
    amount: parseInt(amount),
    suggestedParams,
    assetIndex: asset['asset_id'],
    note: new Uint8Array(Buffer.from("transfer HAM"))
  };

  let txn =algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(transactionOptions)
  let signedTxn = algosdk.signTransaction(txn, sourceAccount.sk);
  let sendTx = await algodClient.sendRawTransaction(signedTxn.blob).do();
  return sendTx;
}

async function transferAsset2(assetInfo, amount, sourceAccountInfo, targetAccountInfo) {
  let sourceMemonic = sourceAccountInfo['memonic']
  let sourceAccount = algosdk.mnemonicToSecretKey(sourceMemonic);
  let params = await algodClient.getTransactionParams().do();

  const suggestedParams = {
    fee: 1,
    firstRound: params['firstRound'],
    lastRound: params['lastRound'],
    genesisHash: params['genesisHash']
  };

  let transactionOptions = {
    from: sourceAccount.addr,
    to: targetAccountInfo['addr'],
    amount: parseInt(amount),
    suggestedParams,
    assetIndex: assetInfo['asset_id'],
  };

  let txn =algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(transactionOptions)
  let signedTxn = algosdk.signTransaction(txn, sourceAccount.sk);
  let sendTx = await algodClient.sendRawTransaction(signedTxn.blob).do();
  return sendTx;
}



module.exports = {
  getBalances,
  transfer,
  transferAsset2
}
