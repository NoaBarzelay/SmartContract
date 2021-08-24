// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
 
abstract contract ERC20Interface {   
 
    event Transfer(address indexed owner, address indexed buyer, uint256 numTokens);
    event Approval(address indexed owner, address indexed buyer, uint256 numTokens);
    event Bought(uint256 amountTobuy);

    function name() virtual public view returns (string memory);
    function symbol() virtual public view returns (string memory);
    function decimals() virtual public view returns (uint8);
    function getOwner() virtual public view returns (address);
    
    function totalSupply() virtual public view returns (uint256 supply);
    function balanceOf(address tokenOwner) virtual public view returns (uint256 balance);
    function allowance(address owner, address delegate) virtual public view returns (uint256 remaining);
    function transfer(address receiver, uint256 numTokens) payable virtual public returns (bool success);
    function transferFrom(address owner, address buyer, uint256 numTokens) payable virtual public returns (bool success);
    function approve(address delegate, uint256 numTokens) virtual public returns (bool success);  
    function transferLostFunds(address lostAddress, address activeAddress, uint numTokens) payable virtual public  returns (bool success);
}             