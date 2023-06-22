// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

// error FundMe__NotOwner();
error FundMe__NotOwner();
contract FundMe {

//type decleration
        using  PriceConverter for uint256;
    //state variables
        uint256 public constant MINIMUM_USD =50 * 1e18;
        address[] private s_funders;
        mapping(address => uint256) public s_addressToAmountFunded;
        address private immutable i_OWNER;
        AggregatorV3Interface private s_priceFeed;

// modifier
        modifier onlyOwner() {
        // require(msg.sender == i_OWNER);
        if (msg.sender != i_OWNER) revert FundMe__NotOwner();
        _;
    }

        constructor(address s_priceFeedAddress) {
        i_OWNER = msg.sender;
        s_priceFeed = AggregatorV3Interface(s_priceFeedAddress);
    }


function fund() public payable {
    require(
      msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
      'Not enough eth'
    );
    s_addressToAmountFunded[msg.sender] += msg.value;
    s_funders.push(msg.sender);
  }


function withdraw ()public onlyOwner{

for (uint256 funderIndex = 0; funderIndex < s_funders.length ; funderIndex++) 
{
        address funder =  s_funders[funderIndex];
        s_addressToAmountFunded[funder] = 0 ;     }

 //reset the array    
s_funders = new address [](0);
//actually withdraw funds
(bool success, ) =  i_OWNER.call{value: address(this).balance}("");require(success);
}


function cheaperWithdraw()public onlyOwner{
        //assign the  s_funders storage varible  to memmory variable
        address[] memory funders = s_funders;
        for(uint256 funderIndex = 0; funders.length< funderIndex;funderIndex++){
                address funder = funders[funderIndex];
                 s_addressToAmountFunded[funder]=0;     }

                 s_funders = new address [](0);
(bool success, ) =  i_OWNER.call{value: address(this).balance}("");require(success);
}




// view funtions
/** @notice Gets the amount that an address has funded
     *  @param fundingAddress the address of the funder
     *  @return the amount funded
     */

function getAddressToAmountFunded(address fundingAddress)public view returns(uint256){
   return s_addressToAmountFunded[fundingAddress];
}

function getOwner()public view returns(address){
 return i_OWNER;
}
function getFunders(uint256 index)public view returns(address){
        return s_funders[index];
}

function getPriceFeed()public view returns(AggregatorV3Interface){
  return s_priceFeed;
}

// receive() external payable {
//         fund();
// }

// fallback() external payable {
//         fund();
// }


}