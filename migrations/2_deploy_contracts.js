const ConvertLib = artifacts.require("ConvertLib");
// const SimpleStorage = artifacts.require("SimpleStorage");
const CreditToken  = artifacts.require("CreditToken")

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  // deployer.deploy(MetaCoin);
  deployer.deploy(CreditToken);
};
