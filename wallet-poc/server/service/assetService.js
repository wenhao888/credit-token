const {algodClient} = require("../config/network");
const algosdk = require("algosdk")
const {waitForConfirmation} = require("../service/help");

async function createAsset(accountInfo, asset_code, asset_unit) {
  let params = await algodClient.getTransactionParams().do();
  let account = algosdk.mnemonicToSecretKey(accountInfo['memonic']);

  params.fee = 1000;
  params.flatFee = true;
  let note = undefined;
  let defaultFrozen = false;
  let decimals = 0;
  let totalIssuance = 1000000;
  let unitName = asset_unit;
  let assetName = asset_code;
  let assetURL = "http://someurl";
  let assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";
  let manager = account['addr'];
  let reserve =  account['addr'];
  let freeze =  account['addr'];
  let clawback =  account['addr'];

  let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(account['addr'], note,
    totalIssuance, decimals, defaultFrozen, manager, reserve, freeze,
    clawback, unitName, assetName, assetURL, assetMetadataHash, params);

  let rawSignedTxn = txn.signTxn(account.sk)
  let tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
  console.log("Transaction : " + tx['txId']);
  await waitForConfirmation(tx['txId']);
  let ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
  let assetID = ptx["asset-index"];
  return assetID;
}

async function  optInAsset(accountInfo, assetInfo) {
  let sourceMemonic = accountInfo['memonic']
  let sourceAccount = algosdk.mnemonicToSecretKey(sourceMemonic);

  let params = await algodClient.getTransactionParams().do();
  const suggestedParams = {
    fee: 1,
    firstRound: params['firstRound'],
    lastRound: params['lastRound'],
    genesisHash: params['genesisHash']
  };

  let transactionOptions = {
    "from": sourceAccount.addr,
    "to":  sourceAccount.addr,
    "fee": 1,
    "amount": 0,
    suggestedParams,
    assetIndex: assetInfo['asset_id']
  };

  let transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(transactionOptions);
  let signedTxn = algosdk.signTransaction(transaction, sourceAccount.sk);
  let sendTx = await algodClient.sendRawTransaction(signedTxn.blob).do();
  return sendTx;
}

module.exports = {
  createAsset,
  optInAsset
}
