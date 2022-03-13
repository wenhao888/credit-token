const algosdk = require("algosdk");
const {algodClient} = require("../config/network");
const fs = require('fs')
const {transfer} = require("./accountService");
const {addrAccountDict} = require("../config/accounts")
const {getAssetByCode} = require("../config/assets");
const uuid = require("uuid");

/**
 * i assume we only have one step
 *
 * @param template
 * @param asset_code
 * @returns {Promise<{}>}
 */
async function createSmartContract(template) {
  let contract_id = uuid.v4(), asset_code= template['asset'];
  let step = template.steps[0];
  let receipt1 = step.recipients[0], receipt2 = step.recipients[1], receipt3 = step.recipients[2];
  let dest1= receipt1['dest_address'], condition1 = receipt1['condition'];
  let dest2= receipt2['dest_address'], condition2 = receipt2['condition'];

  let teal = fs.readFileSync("/Users/Vincent/work/algorand-wallet-poc/server/service/" + template.teal, 'utf8')
  teal = teal.replace(/@contract_id/g, contract_id)
  teal = teal.replace(/@event_id_1/g, condition1)
  teal = teal.replace(/@receiver_1/g, dest1)
  teal = teal.replace(/@event_id_2/g, condition2)
  teal = teal.replace(/@receiver_2/g, dest2)
  if(template.id == 2) {
    let dest3= receipt3['dest_address'];
    teal = teal.replace(/@receiver_3/g, dest3)
  }
  teal = teal.replace(/@amount/g, template['total'])

  console.log(teal)
  let results = await algodClient.compile(teal).do()
  let program = new Uint8Array(Buffer.from(results.result,"base64"))
  const lsign = algosdk.makeLogicSig(program);
  console.log(lsign.address());
  let customer = addrAccountDict[template['customer_address']];
  await transfer("algo", 300000, customer['name'], lsign.address())
  //contract account (as escrow) opt-in to receive asset
  await contractAccountTransferAsset(asset_code,  lsign, lsign.address(), 0);
  await transfer(asset_code, template['total'], customer['name'], lsign.address())

  let contract = JSON.parse(JSON.stringify(template))
  contract['id'] = contract_id;
  contract['balance'] = contract['total'];
  contract['escrow'] = program
  return contract
}

async function executeStep(contract, step, event) {
  let stepObj = contract['steps'][step];
  let matched_recipient= null;

  for(let r of stepObj['recipients']) {
    let condition = r['condition']
    if (condition == event) {
      matched_recipient = r;
    }
  }

  if (! matched_recipient) {
    return;
  }
  // we need to transfer amount from contract['escrow'] to matched_recipient['dest_address'] with amount matched_recipient['amount']
  //

  let  asset_code= contract['asset'], program= contract['escrow'], amount = matched_recipient['amount'], destAddr= matched_recipient['dest_address']
  let lsig = algosdk.makeLogicSig(program)
  let txn = await createEscrowSignedTransaction(asset_code, lsig, destAddr, amount);

  let m ="manage erode connect disagree scene auction close oil assume yard ride rapid brush assume gossip match find south deposit snake access endless stove absent ski"
  let hp = algosdk.mnemonicToSecretKey(m);

  const signature = algosdk.tealSign(hp.sk, txn.rawTxID(), lsig.address());
  const args = [signature, new Uint8Array(Buffer.from(event))];
  const lsig2 = algosdk.makeLogicSig(program, args);
  const signedTxn = algosdk.signLogicSigTransactionObject(txn, lsig2);
  await algodClient.sendRawTransaction(signedTxn.blob).do();

  stepObj['finished'] =true

  console.log("smart contract address ", lsig.address())
  console.log("event ", event)
  console.log("dest", destAddr)
  return amount||0;
}


async function contractAccountTransferAsset(asset_code,  lsign, dest_addr, amount ) {
  let  asset = getAssetByCode(asset_code);

  let params = await algodClient.getTransactionParams().do();

  const suggestedParams = {
    fee: 0,
    firstRound: params.firstRound,
    lastRound: params.lastRound,
    genesisHash: params.genesisHash
  };

  let transactionOptions = {
    from: lsign.address(),
    to:  dest_addr,
    amount: amount,
    suggestedParams,
    assetIndex: asset['asset_id']
  };

  let txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(transactionOptions)
  let signedTxn = algosdk.signLogicSigTransaction(txn, lsign);
  let sendTx = await algodClient.sendRawTransaction(signedTxn.blob).do();
  return sendTx;
}


async function createEscrowSignedTransaction(asset_code, lsign, dest_addr, amount) {
  let  asset = getAssetByCode(asset_code);

  let params = await algodClient.getTransactionParams().do();

  const suggestedParams = {
    fee: 0,
    firstRound: params.firstRound,
    lastRound: params.lastRound,
    genesisHash: params.genesisHash
  };

  let transactionOptions = {
    from: lsign.address(),
    to:  dest_addr,
    amount: amount,
    suggestedParams,
    assetIndex: asset['asset_id']
  };

  let txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(transactionOptions)
  return txn
}


module.exports = {
  createSmartContract,
  executeStep
}
