const express = require('express');
const router = express.Router();
const {contractTemplateDict, contractDict} = require("../config/contractTemplates")
const {createSmartContract,executeStep} = require("../service/contractService");

router.post('/', async function (req, res, next) {
  let template_id = req.body['template_id'];
  let author = req.body['author'];
  let template = contractTemplateDict[template_id];
  let contract = null;

  try {
    contract = await createSmartContract(template);
  }catch (error) {
    console.log(error)
    next(error);
    return;
  }

  contract['last_finished_step'] = -1;
  contract['createdBy'] = author;
  contract['createdAt'] = new Date();
  contract['status'] = 'created';
  contractDict[contract['id']] = contract;
  res.json(contract);
});


router.get("/:id", function(req, res, next) {
  let contract_id = req.params['id'];
  res.json(contractDict[contract_id] || {});
})

router.put("/:id", async function(req, res, next) {
  let contract_id = req.params['id'];
  let {step, event}= req.body || {}
  let contract = contractDict[contract_id];
  if (!contract) {
    res.json({});
    return;
  }
  contract['status'] = 'in-progress';
  let balance = contract['balance'];

  try {
    let consumed = await executeStep(contract,step, event);
    contract['balance'] = balance - consumed;
  } catch (error) {
    console.log(error);
    next(error.toJSON());
    return
  }

  contract['last_finished_step']=step;
  if (step == contract['steps'].length -1 || event=='failure') {
    contract['finished'] = true;
    contract['status'] = 'finished';
  }

  res.json(contractDict[contract_id]);
})

module.exports = router;
