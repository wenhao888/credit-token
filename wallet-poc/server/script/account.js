const {algodClient} = require("../config/network");
const algosdk = require("algosdk")

async function  createAccount() {
  let account = algosdk.generateAccount();
  console.log("Account Address: ", account.addr);
  let mn = algosdk.secretKeyToMnemonic(account.sk);
  console.log("Account Mnemonic: ", mn);
}

(async function () {
  await createAccount()
})()
