import request from '@/utils/request';

export async function fetchContractTemplates() {
  let templates = await request.get(`/api/smart-templates`)
  return templates;
}

export async function createContract(template_id, author) {
  let contract = await request(`/api/smart-contracts`,{
    method:"POST",
    data:{
      template_id: template_id,
      author
    }
  })
  return contract;
}

export async function fetchContract(contract_id) {
  let contract = await request.get(`/api/smart-contracts/${contract_id}`)
  return contract;
}

export async function fetchContractHistory(contract_id) {
  let contract = await request.get(`/api/smart-contracts/${contract_id}/history`)
  return contract;
}

export async function executeSmartContract(contract_id, step, event) {
  let contract = await request(`/api/smart-contracts/${contract_id}`,{
    method:"PUT",
    data:{
      contract_id: contract_id,
      step,
      event
    }
  })
  return contract;
}
