const express = require('express');
const router = express.Router();
const {getBalances, transfer} = require("../service/accountService");
const {accountNameDict} = require("../config/accounts");
const { ConsoleSqlOutlined } = require('@ant-design/icons');


router.get('/balances', async function (req, res, next) {
   try {
    console.log("balances");
    let addr=req.query['addr']
     console.log("balances: " + addr); //DEBUG
     let balance = await getBalances(addr)
     console.log(balance); //DEBUG
     res.json(balance);
   } catch (err) {
     console.log(err)
     next(err)
   }

});

router.post('/transfer', async function (req, res, next) {
   let body= req.body || {};
   let {asset_code, amount, src, target } = body;

   try {
     await transfer(asset_code, amount, src, accountNameDict[target]['addr']);
     res.json({"message": "success"});
   } catch (error) {
     console.log(error);
     next(error);
   }
});


module.exports = router;
