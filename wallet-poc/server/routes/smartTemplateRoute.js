const express = require('express');
const router = express.Router();
const {contractTemplates} = require("../config/contractTemplates");

router.get("/",  function (req,res,next) {
  res.json(contractTemplates);
})


module.exports = router;
