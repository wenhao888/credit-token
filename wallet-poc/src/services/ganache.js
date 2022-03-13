import Web3 from "web3";
import CreditToken from "@/contracts/CreditToken.json";
let web3 = new Web3("ws://localhost:7545");

export async function  getAllBalance() {
  const chain_accounts = await web3.eth.getAccounts();
  const networkId = await web3.eth.net.getId();
  const instance = new web3.eth.Contract(
    CreditToken.abi,
    CreditToken.networks[networkId].address,
  );

  let ps = [];
  for (let addr of [chain_accounts[0], chain_accounts[1], chain_accounts[2]]) {
    let p = instance.methods.balanceOf(addr).call();
    ps.push(p);
  }

  let result = await Promise.all(ps);
  return ([
    {id: 0, address: chain_accounts[0], name: "wenhao",  balance: result[0]},
    {id: 1, address: chain_accounts[1], name: "hubert",  balance: result[1]},
    {id: 2, address: chain_accounts[2], name: "steve",  balance: result[2]}
  ])
}

export  async  function  transfer(from, to, amount) {
  const networkId = await web3.eth.net.getId();
  const instance = new web3.eth.Contract(
    CreditToken.abi,
    CreditToken.networks[networkId].address,
  );

  await instance.methods.transfer(to, amount).send({ from });
}
