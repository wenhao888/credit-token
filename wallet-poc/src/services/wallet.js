import request from '@/utils/request';

export async function getBalances(addr) {
  let currentUser = JSON.parse(sessionStorage.getItem("antd-pro-authority")) || {}
  console.log("current user: " + currentUser)
  let balances = await request.get(`/api/account/balances?addr=${currentUser["addr"]}`)
  return balances;
}

export async function transfer(payload) {
   return await request("/api/account/transfer", {
     method:'POST',
     data: payload
   })
}

export async function convert(payload) {
  return await request("/api/account/convert", {
    method:'POST',
    data: payload
  })
}

export async function withdraw(payload) {
  await request("/api/account/withdraw", {
    method:'POST',
    data: payload
  })
}

export async function deposit(payload) {
  await request("/api/account/deposit", {
    method:'POST',
    data:payload
  })
}

