const {algodClient} = require("../config/network");

const waitForConfirmation = async function (txId) {
  let response = await algodClient.status().do();
  let lastround = response["last-round"];
  while (true) {
    const pendingInfo = await algodClient.pendingTransactionInformation(txId).do();
    if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
      console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
      break;
    }
    lastround++;
    await algodClient.statusAfterBlock(lastround).do();
  }
};


module.exports = {
  waitForConfirmation
}
