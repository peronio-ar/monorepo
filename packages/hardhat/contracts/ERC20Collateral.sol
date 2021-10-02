// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts_latest/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts_latest/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts_latest/access/Ownable.sol";

contract ERC20Collateral is ERC20, ERC20Burnable, Ownable {
    uint8 public constant markup_decimals = 4;
    uint public markup = 1 * 10 ** markup_decimals; // 1%
    
    address public immutable collateral_contract;
    
    bool public initialized = false;
    
    event Initialized(address owner, uint collateral, uint starting_ratio);
    event Minted(address to, uint collateralAmount, uint tokenAmount);
    event Withdrawal(address to, uint collateralAmount, uint tokenAmount);

    // Collateral without decimals
    constructor(string memory name_, string memory symbol_, address collateral_contract_) ERC20(name_, symbol_) {
        collateral_contract = collateral_contract_;
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
    
    function initiliaze(uint collateral, uint starting_ratio) public {
        require(!initialized, 'Contract already initialized');
        ERC20 collateralContract = ERC20(collateral_contract);
        
        require(collateralContract.decimals() == decimals(), 'Decimals from collateral and this ERC20 must match');
        
        collateralContract.transferFrom(msg.sender, address(this), collateral);
        _mint(msg.sender, starting_ratio * collateral);
        initialized = true;
        emit Initialized(msg.sender, collateral, starting_ratio);
    }
    
    function mint(address to, uint amount) public { //Amount for this ERC20
        // Transfer collateral from users wallet to current contract
        uint collateral_amount = buyingPrice() * amount / 10 ** decimals();
        ERC20(collateral_contract).transferFrom(msg.sender, address(this), collateral_amount);
        _mint(to, amount);
        emit Minted(msg.sender, collateral_amount, amount);
    }
    
    function withdraw(address to, uint amount) public { //Amount for this ERC20
        // Transfer collateral back to user wallet to current contract
        uint collateralAmount = collateralRatio() * amount / 10 ** decimals();
        ERC20(collateral_contract).transfer(to, collateralAmount);
        
        //Burn tokens
        _burn(msg.sender, amount);
        emit Withdrawal(msg.sender, collateralAmount, amount);
    }
    
    function setMarkup(uint16 val) public onlyOwner {
        markup = val;
    }
    
    function collateralBalance() external view returns (uint){
        return ERC20(collateral_contract).balanceOf(address(this));
    }
    
    function buyingPrice() public view returns (uint) {
        uint base_price = collateralRatio();
        uint fee = (base_price * markup) / (10 ** (markup_decimals + 2));
        return base_price + fee;
    }
    
    function collateralPrice() public view returns (uint) {
        return (this.totalSupply() * 10 ** decimals()) / ERC20(collateral_contract).balanceOf(address(this));
    }
    
    
    function collateralRatio() public view returns (uint){
        uint currentCollateral = ERC20(collateral_contract).balanceOf(address(this));
        return (currentCollateral * 10 ** decimals()) / this.totalSupply();
    }
}