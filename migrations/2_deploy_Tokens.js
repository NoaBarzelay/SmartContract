const ERC20Token = artifacts.require("../contracts/ERC20Token")
const DEX = artifacts.require("../contracts/DEX")

module.exports = async function (deployer, network, accounts) {
  // Deploy MyToken
  await deployer.deploy(ERC20Token/*, "SafekeepToken", "ERC20", 18, 1000000*/)
  const token = await ERC20Token.deployed()

  await deployer.deploy(DEX, token.address)
  const DEXcontract = await DEX.deployed()

  await token.transfer(DEXcontract.address, '1000000000000000000000000')
}