const DexiosToken = artifacts.require("DexiosToken");
const SellerProfileNFT = artifacts.require("SellerProfileNFT");
const DexiosMarketplace = artifacts.require("DexiosMarketplace");

module.exports = async function (deployer, network, accounts) {
  const initialSupply = 1000000;

  await deployer.deploy(DexiosToken, initialSupply);
  const tokenInstance = await DexiosToken.deployed();

  await deployer.deploy(SellerProfileNFT);
  const nftInstance = await SellerProfileNFT.deployed();

  await deployer.deploy(DexiosMarketplace, tokenInstance.address, nftInstance.address);
  const marketplaceInstance = await DexiosMarketplace.deployed();

  await nftInstance.transferOwnership(marketplaceInstance.address);

  console.log("DexiosToken deployed at:", tokenInstance.address);
  console.log("SellerProfileNFT deployed at:", nftInstance.address);
  console.log("DexiosMarketplace deployed at:", marketplaceInstance.address);
};