// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts_latest/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts_latest/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts_latest/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts_latest/access/Ownable.sol";
import "@openzeppelin/contracts_latest/utils/math/SafeMath.sol";

import "./uniswap/interfaces/IUniswapV2Router01.sol";

import "./interfaces/IAaveIncentivesController.sol";
import "./interfaces/ILendingPool.sol";

contract ERC20Collateral is ERC20, ERC20Burnable, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // External Contracts
    IAaveIncentivesController public immutable aaveContract; // Aave Contract
    IERC20 public immutable wMaticContract; // WMatic ERC20

    // Local Router
    IUniswapV2Router01 public RouterContract;

    // Aave lending pool
    address public constant LENDING_POOL = 0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf;

    // Markup
    uint8 public constant markup_decimals = 4;
    uint public markup = 5 * 10 ** markup_decimals; // 5%
    
    // Underlying asset address (USDT)
    address public immutable collateral_address;
    
    // Initialization can only be run once
    bool public initialized = false;
    
    // Events
    event Initialized(address owner, uint collateral, uint starting_ratio);
    event Minted(address to, uint collateralAmount, uint tokenAmount);
    event Withdrawal(address to, uint collateralAmount, uint tokenAmount);

    // Collateral without decimals
    constructor(string memory name_, string memory symbol_, address collateral_address_) ERC20(name_, symbol_) {
        aaveContract = IAaveIncentivesController(0x357D51124f59836DeD84c8a1730D72B749d8BC23); // aave incentives controller
        wMaticContract = IERC20(0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270);
        RouterContract =  IUniswapV2Router01(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff); // Quickswap

        collateral_address = collateral_address_;
    }

    // 6 Decimals
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
    
    // Sets initial minting. Cna only be runned once
    function initiliaze(uint collateral, uint starting_ratio) public {
        require(!initialized, 'Contract already initialized');
        IERC20 collateralContract = IERC20(collateral_address);
        
        require(ERC20(collateral_address).decimals() == decimals(), 'Decimals from collateral and this ERC20 must match');
        
        collateralContract.safeTransferFrom(msg.sender, address(this), collateral);
        _mint(msg.sender, starting_ratio * collateral);
        initialized = true;
        emit Initialized(msg.sender, collateral, starting_ratio);
    }
    
    // Received collateral and mints the proportional tokens
    function mint(address to, uint amount) public { //Amount for this ERC20
        // Transfer collateral from users wallet to current contract
        uint collateral_amount = buyingPrice() * amount / 10 ** decimals();
        IERC20(collateral_address).safeTransferFrom(msg.sender, address(this), collateral_amount);
        _mint(to, amount);
        emit Minted(msg.sender, collateral_amount, amount);
    }
    
    // Receives Main token burns it and returns Collateral Token proportionally
    function withdraw(address to, uint amount) public { //Amount for this ERC20
        // Transfer collateral back to user wallet to current contract
        uint collateralAmount = collateralRatio() * amount / 10 ** decimals();
        IERC20(collateral_address).safeTransfer(to, collateralAmount);
        
        //Burn tokens
        _burn(msg.sender, amount);
        emit Withdrawal(msg.sender, collateralAmount, amount);
    }
    
    // Sets markup for minting function
    function setMarkup(uint16 val) public onlyOwner {
        markup = val;
    }
    

    function collateralBalance() external view returns (uint){
        return ERC20(collateral_address).balanceOf(address(this));
    }
    
    function collateralRatio() public view returns (uint){
        uint currentCollateral = ERC20(collateral_address).balanceOf(address(this));
        return (currentCollateral * 10 ** decimals()) / this.totalSupply();
    }

    function collateralPrice() public view returns (uint) {
        return (this.totalSupply() * 10 ** decimals()) / ERC20(collateral_address).balanceOf(address(this));
    }

    function buyingPrice() public view returns (uint) {
        uint base_price = collateralRatio();
        uint fee = (base_price * markup) / (10 ** (markup_decimals + 2));
        return base_price + fee;
    }

    function claimAaveRewards() public {
        
    }

    function harvestMaticIntoToken() public {

    }
}