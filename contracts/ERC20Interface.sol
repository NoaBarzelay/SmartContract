// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.0;

contract ERC20Interface {

    event Transfer(address indexed owner, address indexed buyer, uint256 numTokens);
    event Approval(address indexed owner, address indexed buyer, uint256 numTokens);
    event Bought(uint256 amountTobuy);

    function name() public view returns (string memory);
    function symbol() public view returns (string memory);
    function decimals() public view returns (uint8);
    
    function totalSupply() public view returns (uint256 supply);
    function balanceOf(address tokenOwner) public view returns (uint256 balance);
    function allowance(address owner, address delegate) public view returns (uint256 remaining);
    function transfer(address receiver, uint256 numTokens) payable public returns (bool success);
    function transferFrom(address owner, address buyer, uint256 numTokens) payable public returns (bool success);
    function approve(address delegate, uint256 numTokens) public returns (bool success);
}