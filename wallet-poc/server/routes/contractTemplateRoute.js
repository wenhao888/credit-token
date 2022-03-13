const express = require('express');
const router = express.Router();
const {templates} = require("../config/esignTemplate");

router.get("/:id",  function (req,res,next) {
  res.json(templates[0]);
})


module.exports = router;
