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
    
    
    constructor(/*string memory symbol, string memory name, uint8 decimals, uint256 totalSupply*/) public
    {
        tokenSymbol      = "TEST";//symbol;
        tokenName        = "TST";//name;
        tokenDecimals    = 18;//decimals;
        tokenTotalSupply = 1000000000000000000000000;//totalSupply;
        balances[msg.sender]  = tokenTotalSupply; 
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
        require(numTokens <= balances[owner], "owner balance too small");
        require(numTokens <= allowed[owner][msg.sender], "allowed balance too small");
        balances[owner] = balances[owner] - numTokens;
        allowed[owner][msg.sender] = allowed[owner][msg.sender] - numTokens;
        balances[buyer] = balances[buyer] + numTokens;
        emit Transfer(owner, buyer, numTokens);
        return true;   
    }  


}

