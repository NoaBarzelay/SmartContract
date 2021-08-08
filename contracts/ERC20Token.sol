// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.0;

import "./ERC20Interface.sol";

contract ERC20Token is ERC20Interface{
    
    string  private tokenName;
    string  private tokenSymbol;
    uint8   private tokenDecimals;
    uint256 internal tokenTotalSupply;
    
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    
    
    constructor(string memory symbol, string memory name, uint8 decimals, uint256 totalSupply) public
    {
        tokenSymbol      = symbol;
        tokenName        = name;
        tokenDecimals    = decimals;
        tokenTotalSupply = totalSupply;
        balances[msg.sender]  = totalSupply;
    }


    function name() public view returns (string memory) {
        return tokenName;
    }


    function symbol() public view returns (string memory) {
        return tokenSymbol;
    }


    function decimals() public view returns (uint8) {
        return tokenDecimals;
    }


    function totalSupply() public view returns (uint256) {
        return tokenTotalSupply;
    }
    
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }
    
    function transfer(address receiver, uint numTokens) payable public returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender] - numTokens;
        balances[receiver] = balances[receiver] + numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }
    
    function approve(address delegate, uint numTokens) public returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }
    
    function allowance(address owner, address delegate) public view returns (uint) {
        return allowed[owner][delegate];
    }
    
    function transferFrom(address owner, address buyer, uint numTokens) payable public returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);
        balances[owner] = balances[owner] - numTokens;
        allowed[owner][msg.sender] = allowed[owner][msg.sender] - numTokens;
        balances[buyer] = balances[buyer] + numTokens;
        emit Transfer(owner, buyer, numTokens);
        return true;
    }


}

contract DEX {

    event Bought(uint256 amount);
    event Sold(uint256 amount);


    ERC20Interface public token;

    constructor() public {
        token = new ERC20Token("TEST", "ERC20", 18, 1000000);
    }

    function buy() payable public {
        uint256 amountTobuy = msg.value;
        uint256 dexBalance = token.balanceOf(address(this));

        token.transfer(msg.sender, amountTobuy);
        emit Bought(amountTobuy);
    }

    function sell(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");
        token.transferFrom(msg.sender, address(this), amount);
        msg.sender.transfer(amount);
        emit Sold(amount);
    }

}