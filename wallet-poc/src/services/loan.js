import request from '@/utils/request';

export async function getLoans() {
  return await request.get('/api/loans');
}

export async function getLoanById(id) {
  return await request.get(`/api/loans/${id}`);
}

export async function approveLoan(id, update) {
  let currentUser = JSON.parse(sessionStorage.getItem("antd-pro-authority")) || {};
  return await request.put(`/api/loans/${id}/approve?addr=${currentUser["addr"]}`, {
    data: update
  });
}


export async function createLoan(loan={}) {
  return await request.post(`/api/loans`, {
    data:{ ...loan}
  })
}


export async function payoffLoanByMonth(ownerAddr, id, month) {
  return await request.post(`/api/loans/${id}/payments/`, {
    data: {ownerAddr, month}
  });
}
