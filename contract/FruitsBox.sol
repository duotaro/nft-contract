// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract FruitsBox {

    string[] public Box;
    
    function AddFruits(string memory _fruits) public {
        Box.push(_fruits);
    }

    function getFruits(uint256 _index) public view returns (string memory) {
        require(_index < Box.length, "Index out of bounds");
        return Box[_index];
    }

    function getBoxSize() public view returns (uint256) {
        return Box.length;
    }

    function getAllFruits() public view returns (string[] memory) {
        return Box;
    }
}