// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts_latest/token/ERC20/ERC20.sol";

contract USDCMock is ERC20 {
    constructor(uint amount) ERC20("USDC Mock", "USDC") {
        _mint(msg.sender, amount);
    }
}