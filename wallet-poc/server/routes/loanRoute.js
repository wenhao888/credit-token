const express = require('express');
const router = express.Router();
const loanService = require("../service/loanService");


router.get("/", (req, res, next) => {
  res.json(loanService.getLoans());
})


router.post("/", async (req, res, next) => {
  try {
    let loan = req.body || {};
    await loanService.createLoan(loan);
    res.json({"message": "success"});
  } catch (error) {
    console.log(error);
    next(error);
  }
})


router.post("/upload", (req, res, next) => {
  let file = req.files?.file || {};
  res.json({"message": "success", id: file['md5']});
})


router.get("/:id", (req, res, next) => {
  let id = req.params['id'];
  let loan = loanService.getLoanById(id);
  res.json(loan);
})

router.post("/:id/payments", async (req, res, next) => {
  let id = req.params["id"];
  let body = req.body || {};
  let {ownerAddr, month} = body;
  try {
    let updatedLoan = await loanService.payoffPaymentById(ownerAddr, id, month);
    res.json(updatedLoan);
  } catch (error) {
    next(error);
  }
})

router.put("/:id/approve", async (req, res, next) => {
  let id = req.params['id'];
  let addr = req.query['addr']
  let body = req.body || {}
  await loanService.approveLoanById(addr, id, body);
  res.json({"message": "success"});
})


module.exports = router;
