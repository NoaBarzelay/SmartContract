const { assert } = require('chai');

const Token = artifacts.require('ERC20Token')
const DEXcontract = artifacts.require('DEX')

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('DEX', (accounts) => {
    let dex, token

    before(async () => {
        token = await Token.new()
        dex = await DEXcontract.new(token.address)
        await token.transfer(dex.address, tokens('1000000'))
    })

    describe('DEX deployment', async () => {
        it('contract has a name', async () => {
            const name = await dex.name()
            assert.equal(name, 'DEX')
        })

        it('contract has tokens', async () => {
            let balance = await token.balanceOf(dex.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })


    describe('buyTokens()', async() => {

        before(async () => {

            result = await dex.buyTokens({ from: accounts[1], value: web3.utils.toWei('1', 'ether') })
        })

        it('Allows user purchase tokens', async () => {
            let userBalance = await token.balanceOf(accounts[1])
            assert.equal(userBalance.toString(), tokens('1'))

            let dexBalance = await token.balanceOf(dex.address)
            assert.equal(dexBalance.toString(), tokens('999999'))

            let dexEtherBalance = await web3.eth.getBalance(dex.address)
            assert.equal(dexEtherBalance.toString(), web3.utils.toWei('1', 'ether'))
        })
    })


    describe('sellTokens()', async() => {

        before(async () => {

            await token.approve(dex.address, tokens('1'), { from: accounts[1] })
            result = await dex.sellTokens(tokens('1'), { from: accounts[1] })
        })

        it('Allows user sell tokens', async () => {
            let userBalance = await token.balanceOf(accounts[1])
            assert.equal(userBalance.toString(), tokens('0'))

            let dexBalance = await token.balanceOf(dex.address)
            assert.equal(dexBalance.toString(), tokens('1000000'))

            let dexEtherBalance = await web3.eth.getBalance(dex.address)
            assert.equal(dexEtherBalance.toString(), web3.utils.toWei('0', 'ether'))
        })
    })
})