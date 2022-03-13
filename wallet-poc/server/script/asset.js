// const {accountNameDict} = require("../config/accounts");
// const {algodClient} = require("../config/network");
// const algosdk = require("algosdk")
// const {waitForConfirmation} = require("../service/help");
// const {getAssetByCode} = require("../config/assets")
//
// async function createAsset(asset_code, ownerName) {
//   let accountInfo = accountNameDict[ownerName];
//   console.log("before create asset");
//
//   if ( ! accountInfo) {
//     return;
//   }
//   console.log("create asset");
//   let addr = accountInfo['addr'];
//   let params = await algodClient.getTransactionParams().do();
//   let account = algosdk.mnemonicToSecretKey(accountInfo['memonic']);
//
//   params.fee = 1000;
//   params.flatFee = true;
//   let note = undefined;
//   let defaultFrozen = false;
//   let decimals = 0;
//   let totalIssuance = 1000000;
//   let unitName = asset_code;
//   let assetName = asset_code;
//   let assetURL = "http://someurl";
//   let assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";
//   let manager = addr;
//   let reserve = addr;
//   let freeze = addr;
//   let clawback = addr;
//
//   let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(addr, note,
//     totalIssuance, decimals, defaultFrozen, manager, reserve, freeze,
//     clawback, unitName, assetName, assetURL, assetMetadataHash, params);
//
//   let rawSignedTxn = txn.signTxn(account.sk)
//   let tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
//   console.log("Transaction : " + tx.txId);
//   let assetID = null;
//   await waitForConfirmation(tx.txId);
//   let ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
//   assetID = ptx["asset-index"];
//   console.log("AssetID = " + assetID);
// }
//
// async function  optIn_asset(asset_code, userName) {
//   let sourceMemonic = accountNameDict[userName]['memonic']
//   let sourceAccount = algosdk.mnemonicToSecretKey(sourceMemonic);
//   let asset = getAssetByCode(asset_code);
//
//   let params = await algodClient.getTransactionParams().do();
//   const suggestedParams = {
//     fee: 1,
//     firstRound: params.firstRound,
//     lastRound: params.lastRound,
//     genesisHash: params.genesisHash
//   };
//
//   let transactionOptions = {
//     "from": sourceAccount.addr,
//     "to":  sourceAccount.addr,
//     "fee": 1,
//     "amount": 0,
//     suggestedParams,
//     assetIndex: asset['asset_id']
//   };
//
//   let transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(transactionOptions);
//   let signedTxn = algosdk.signTransaction(transaction, sourceAccount.sk);
//   let sendTx = await algodClient.sendRawTransaction(signedTxn.blob).do();
//   return sendTx;
// }
//
// (async function () {
//   await optIn_asset("HAM", "hubert")
// })()
