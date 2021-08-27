pragma solidity ^0.8.0;

import "./ERC20Interface.sol";
import "./ERC20Token.sol";

contract DEX {   

    event Bought(uint256 amount);
    event Sold(uint256 amount);


    ERC20Interface public token;
    string public name = 'DEX';

    constructor(ERC20Token _token) public {
        //token = new ERC20Token(/*"TEST", "ERC20", 18, 1000000*/);
        token = _token;
    } 

    function buyTokens() public payable { 
        uint256 amountTobuy = msg.value;
        uint256 dexBalance = token.balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some ether");
        require(amountTobuy <= dexBalance, "Not enough tokens in the reserve");
        token.transfer(msg.sender, amountTobuy); 
        // token.transferFrom(address(this), msg.sender, amountTobuy);
        emit Bought(amountTobuy);
    }

    function sellTokens(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        require(address(this).balance >= amount, "Not enough ether in the reserve");
        uint256 allowance = token.allowance(msg.sender, address(this));
      //  require(allowance >= amount, "Check the token allowance");
        token.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(amount);
        emit Sold(amount);
    } 

   /* function () external payable {   
    } */

} 