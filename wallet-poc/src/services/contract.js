import request from '@/utils/request';

export async function fetchContractTemplate() {
  let template = await request.get(`/api/templates/0`)
  return template;
}


export async function createContract(requestBody={}) {
  let contract = await request(`/api/contracts`,{
    method:"POST",
    data: {
      ...requestBody
    }
  })
  return contract;
}
