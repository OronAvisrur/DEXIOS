const DexiosToken = artifacts.require("DexiosToken");
const SellerProfileNFT = artifacts.require("SellerProfileNFT");
const DexiosMarketplace = artifacts.require("DexiosMarketplace");

contract("DEXIOS Platform Tests", (accounts) => {
  let token, nft, marketplace;
  const owner = accounts[0];
  const seller = accounts[1];
  const buyer = accounts[2];
  const initialSupply = 1000000;

  beforeEach(async () => {
    token = await DexiosToken.new(initialSupply, { from: owner });
    nft = await SellerProfileNFT.new({ from: owner });
    marketplace = await DexiosMarketplace.new(token.address, nft.address, { from: owner });
    await nft.transferOwnership(marketplace.address, { from: owner });
  });

  describe("DexiosToken", () => {
    it("should deploy with correct initial supply", async () => {
      const balance = await token.balanceOf(owner);
      const expectedSupply = web3.utils.toBN(initialSupply).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18)));
      assert.equal(balance.toString(), expectedSupply.toString(), "Initial supply incorrect");
    });

    it("should allow owner to mint tokens", async () => {
      const mintAmount = web3.utils.toWei("1000", "ether");
      await token.mint(seller, mintAmount, { from: owner });
      const balance = await token.balanceOf(seller);
      assert.equal(balance.toString(), mintAmount, "Mint failed");
    });

    it("should allow token transfers", async () => {
      const transferAmount = web3.utils.toWei("100", "ether");
      await token.transfer(buyer, transferAmount, { from: owner });
      const balance = await token.balanceOf(buyer);
      assert.equal(balance.toString(), transferAmount, "Transfer failed");
    });
  });

  describe("SellerProfileNFT", () => {
    it("should mint seller profile", async () => {
      await marketplace.createGig("Test Gig", "Description", "GPT-4", web3.utils.toWei("50", "ether"), 24, { from: seller });
      const hasProfile = await nft.hasProfile(seller);
      assert.equal(hasProfile, false, "Profile should not exist yet");
    });

    it("should track seller reputation", async () => {
      const tokenId = 1;
      await nft.mintProfile(seller, { from: owner });
      await nft.updateReputation(tokenId, 5, true, web3.utils.toWei("50", "ether"), { from: owner });
      const profile = await nft.getProfile(tokenId);
      assert.equal(profile.totalJobs.toString(), "1", "Job count incorrect");
      assert.equal(profile.successfulJobs.toString(), "1", "Successful jobs incorrect");
    });
  });

  describe("DexiosMarketplace - Gig Creation", () => {
    it("should create gig successfully", async () => {
      await nft.mintProfile(seller, { from: owner });
      const tx = await marketplace.createGig(
        "AI Logo Design",
        "Professional logos with DALL-E",
        "DALL-E 3",
        web3.utils.toWei("50", "ether"),
        24,
        { from: seller }
      );
      assert.equal(tx.logs[0].event, "GigCreated", "GigCreated event not emitted");
      const gig = await marketplace.getGig(1);
      assert.equal(gig.title, "AI Logo Design", "Gig title incorrect");
      assert.equal(gig.seller, seller, "Gig seller incorrect");
    });

    it("should fail without seller profile", async () => {
      try {
        await marketplace.createGig(
          "Test Gig",
          "Description",
          "GPT-4",
          web3.utils.toWei("50", "ether"),
          24,
          { from: seller }
        );
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "Must have seller profile", "Wrong error message");
      }
    });
  });

  describe("DexiosMarketplace - Order Flow", () => {
    beforeEach(async () => {
      await nft.mintProfile(seller, { from: owner });
      await marketplace.createGig(
        "AI Content Writing",
        "SEO articles with GPT-4",
        "GPT-4",
        web3.utils.toWei("50", "ether"),
        48,
        { from: seller }
      );
      await token.transfer(buyer, web3.utils.toWei("100", "ether"), { from: owner });
    });

    it("should place order successfully", async () => {
      const gigPrice = web3.utils.toWei("50", "ether");
      await token.approve(marketplace.address, gigPrice, { from: buyer });
      const tx = await marketplace.placeOrder(1, "Write 1000 word article about AI", { from: buyer });
      assert.equal(tx.logs[0].event, "OrderPlaced", "OrderPlaced event not emitted");
      const order = await marketplace.getOrder(1);
      assert.equal(order.buyer, buyer, "Order buyer incorrect");
      assert.equal(order.gigId.toString(), "1", "Order gigId incorrect");
    });

    it("should deliver work", async () => {
      const gigPrice = web3.utils.toWei("50", "ether");
      await token.approve(marketplace.address, gigPrice, { from: buyer });
      await marketplace.placeOrder(1, "Requirements", { from: buyer });
      const tx = await marketplace.deliverWork(1, "QmTestHash123", { from: seller });
      assert.equal(tx.logs[0].event, "WorkDelivered", "WorkDelivered event not emitted");
      const order = await marketplace.getOrder(1);
      assert.equal(order.ipfsHash, "QmTestHash123", "IPFS hash incorrect");
      assert.equal(order.status.toString(), "1", "Order status should be Delivered");
    });

    it("should approve order and release payment", async () => {
      const gigPrice = web3.utils.toWei("50", "ether");
      await token.approve(marketplace.address, gigPrice, { from: buyer });
      await marketplace.placeOrder(1, "Requirements", { from: buyer });
      await marketplace.deliverWork(1, "QmTestHash123", { from: seller });
      
      const sellerBalanceBefore = await token.balanceOf(seller);
      await marketplace.approveOrder(1, 5, { from: buyer });
      const sellerBalanceAfter = await token.balanceOf(seller);
      
      assert.isTrue(sellerBalanceAfter.gt(sellerBalanceBefore), "Seller should receive payment");
      
      const order = await marketplace.getOrder(1);
      assert.equal(order.status.toString(), "2", "Order status should be Approved");
      assert.equal(order.rating.toString(), "5", "Rating incorrect");
    });

    it("should reject order", async () => {
      const gigPrice = web3.utils.toWei("50", "ether");
      await token.approve(marketplace.address, gigPrice, { from: buyer });
      await marketplace.placeOrder(1, "Requirements", { from: buyer });
      await marketplace.deliverWork(1, "QmTestHash123", { from: seller });
      
      const tx = await marketplace.rejectOrder(1, "Quality not acceptable", { from: buyer });
      assert.equal(tx.logs[0].event, "OrderRejected", "OrderRejected event not emitted");
      
      const order = await marketplace.getOrder(1);
      assert.equal(order.status.toString(), "3", "Order status should be Rejected");
    });
  });

  describe("DexiosMarketplace - Admin Functions", () => {
    it("should set platform fee", async () => {
      await marketplace.setPlatformFee(500, { from: owner });
      const fee = await marketplace.platformFeePercent();
      assert.equal(fee.toString(), "500", "Platform fee incorrect");
    });

    it("should resolve dispute in favor of seller", async () => {
      await nft.mintProfile(seller, { from: owner });
      await marketplace.createGig("Test", "Desc", "AI", web3.utils.toWei("50", "ether"), 24, { from: seller });
      await token.transfer(buyer, web3.utils.toWei("100", "ether"), { from: owner });
      await token.approve(marketplace.address, web3.utils.toWei("50", "ether"), { from: buyer });
      await marketplace.placeOrder(1, "Req", { from: buyer });
      await marketplace.deliverWork(1, "QmHash", { from: seller });
      await marketplace.rejectOrder(1, "Reason", { from: buyer });
      
      const sellerBalanceBefore = await token.balanceOf(seller);
      await marketplace.resolveDispute(1, true, { from: owner });
      const sellerBalanceAfter = await token.balanceOf(seller);
      
      assert.isTrue(sellerBalanceAfter.gt(sellerBalanceBefore), "Seller should receive payment");
    });
  });
});