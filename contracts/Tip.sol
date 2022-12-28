// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Tip {
  address payable owner;

  constructor() {
    owner = payable(msg.sender);
  }

  event NewMemo(address indexed from, uint256 timestamp, string message, uint256 amount);

  struct Memo{
    address from;
    uint256 timestamp;
    string message;
    uint256 amount;
  }

  Memo[] public memos;

  function giveTip(string memory _message) public payable {
    require(msg.value > 0, "Really?");
    memos.push(Memo(msg.sender, block.timestamp, _message, msg.value));
    emit NewMemo(msg.sender, block.timestamp, _message, msg.value);
  }

  function getMemos() external view returns(Memo[] memory) {
    return memos;
  }

  function withdrawTips() public {
    require(msg.sender == owner, "Not an Owner");
    owner.transfer(address(this).balance);
  }
}