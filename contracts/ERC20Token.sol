// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./ERC20Interface.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20Interface, Ownable {
    
    string  private tokenName;
    string  private tokenSymbol;
    uint8   private tokenDecimals;
    uint256 internal tokenTotalSupply;
    address private contractOwner;
    
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    
    
    constructor(/*string memory symbol, string memory name, uint8 decimals, uint256 totalSupply*/) 
    {
        tokenSymbol      = "TEST";//symbol;
        tokenName        = "TST";//name;
        tokenDecimals    = 18;//decimals;
        tokenTotalSupply = 1000000000000000000000000;//totalSupply;
        balances[msg.sender]  = tokenTotalSupply; 
        contractOwner = msg.sender;
    }     


    function name() public override view returns (string memory) {
        return tokenName;
    }


    function symbol() public override view returns (string memory) {
        return tokenSymbol;
    }


    function decimals() public override view returns (uint8) {
        return tokenDecimals;
    }


    function totalSupply() public override view returns (uint256) {
        return tokenTotalSupply;
    }

    function getOwner() public override view returns (address) {
        return contractOwner;
    }
    
    function balanceOf(address tokenOwner) public override view returns (uint) {
        return balances[tokenOwner];
    } 
    
    function transfer(address receiver, uint numTokens) payable public override returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender] - numTokens;
        balances[receiver] = balances[receiver] + numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }
    
    function approve(address delegate, uint numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }
    
    function allowance(address owner, address delegate) public override view returns (uint) {
        return allowed[owner][delegate];
    } 
    
    function transferFrom(address owner, address buyer, uint numTokens) payable public override returns (bool) {
        require(numTokens <= balances[owner], "owner balance too small");
        require(numTokens <= allowed[owner][msg.sender], "allowed balance too small");
        balances[owner] = balances[owner] - numTokens;
        allowed[owner][msg.sender] = allowed[owner][msg.sender] - numTokens;
        balances[buyer] = balances[buyer] + numTokens;
        emit Transfer(owner, buyer, numTokens);
        return true;   
    }  

    function transferLostFunds(address lostAddress, address activeAddress, uint numTokens) payable public override onlyOwner   returns (bool) {
        require(numTokens <= balances[lostAddress], "lostAddress balance too small");
      //  require(numTokens <= allowed[owner][msg.sender], "allowed balance too small");
        balances[lostAddress] = balances[lostAddress] - numTokens;
     //   allowed[owner][msg.sender] = allowed[owner][msg.sender] - numTokens;
        balances[activeAddress] = balances[activeAddress] + numTokens;
     //   emit Transfer(owner, buyer, numTokens);
        return true;   
    }  


} 

