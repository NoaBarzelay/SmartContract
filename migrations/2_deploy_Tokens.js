const ERC20Token = artifacts.require("../contracts/ERC20Token")

module.exports = async function (deployer, network, accounts) {
  // Deploy MyToken
  await deployer.deploy(ERC20Token, "TEST", "ERC20", 18, 1000000)
  const myToken = await ERC20Token.deployed()
}