const {loans, loanDict, loan_accounts} = require("../config/loan");
const {createAsset, optInAsset} = require("../service/assetService")
const {addrAccountDict} = require("../config/accounts");
const {transferAsset2} = require("./accountService");
const {assetDict} = require("../config/assets");

function getLoans() {
  return loans;
}

function getLoanById(id) {
  let loan = loanDict[id] || {};
  if (! loan['schedule']) {
    let schedule= computeLoanSchedule(loan['amount'], loan['rate'], loan['duration']);
    loan['schedule'] = schedule;
  }

  return loan;
}


function computeLoanSchedule  (amount, rate, duration)  {
  let P = amount;
  let r = rate / (12 * 100);
  let n = duration;
  let monthlyPayment = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);  //monthly Payment is fixed
  let schedule = [], outstanding=P;

  for (let i = 1; i <= duration; i++) {
    let interest = outstanding * r;
    let principle = monthlyPayment - interest;
    outstanding = outstanding - principle;
    outstanding = Math.abs(outstanding)<0.001 ? 0: outstanding

    schedule.push({
      month: i,
      payment: monthlyPayment,
      interest,
      principle,
      outstanding
    })
  }

  return schedule;
}

async function createLoan(loan) {
  let loanId =  loans.length +1;
  let {adminAccount, lockAccount} = loan_accounts;
  let assetCode=`Loan-${loanId}-${Date.now()}`;
  let assetId = await createAsset(adminAccount, assetCode, 'Loan');
  let asset= {'asset_id':assetId, 'asset_code':assetCode};
  await optInAsset(lockAccount, asset);

  assetDict[assetCode] = asset;

  let entity ={...loan, id: loanId, status:"submitted", asset, remain:loan['amount']};
  loans.unshift(entity);
  loanDict[entity['id']] = entity;
}

async function approveLoanById(addr, id, update={}) {
  let {adminAccount} = loan_accounts;
  let approvalAccount = addrAccountDict[addr];
  let entity = loanDict[id] ||{};
  let assetInfo=entity['asset'];

  await optInAsset(approvalAccount, assetInfo);
  await transferAsset2(assetInfo, entity['amount'], adminAccount, approvalAccount)

  entity.status= update?.status ;
  entity.approvedAt = update?.approvedAt;
  entity.approvalAddr=addr;
}

async function payoffPaymentById(ownerAddr, id, month) {
  let loan = loanDict[id] || {}, asset = loan['asset'] || {};
  let index= month-1;
  let {lockAccount}=loan_accounts;
  let amount= index==loan['schedule'].length-1 ? loan['remain']: parseInt(loan['schedule'][index]['principle']);


  await transferAsset2(asset,amount, addrAccountDict[ownerAddr], lockAccount);
  loan['remain'] = loan['remain'] - amount;
  loan['schedule'][index]['status'] = 'done';
  return loan;
}



module.exports = {
  getLoans, getLoanById, createLoan, approveLoanById, payoffPaymentById
}
