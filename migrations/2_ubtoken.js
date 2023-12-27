const MyToken = artifacts.require("./UBToken.sol");

module.exports = function (deployer) {
  const tokenName = "UBToken";
  const tokenSymbol = "UBT";
  const tokenDecimals = 18;
  const tokenTotalSupply = 1000000000000;

  deployer.deploy(MyToken, tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply);
};