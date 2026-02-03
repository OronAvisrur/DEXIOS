// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./SellerProfileNFT.sol";

contract DexiosMarketplace is Ownable, ReentrancyGuard {
    IERC20 public dexiosToken;
    SellerProfileNFT public sellerProfileNFT;

    uint256 public gigCounter;
    uint256 public orderCounter;
    uint256 public platformFeePercent = 250;

    enum OrderStatus {
        Pending,
        Delivered,
        Approved,
        Rejected,
        Disputed
    }

    struct Gig {
        uint256 id;
        address seller;
        string title;
        string description;
        string aiModel;
        uint256 priceInTokens;
        uint256 deliveryTimeHours;
        bool isActive;
        uint256 ordersCompleted;
        uint256 totalRating;
        uint256 ratingCount;
        uint256 createdAt;
    }

    struct Order {
        uint256 id;
        uint256 gigId;
        address buyer;
        address seller;
        string requirements;
        string ipfsHash;
        uint256 paidAmount;
        OrderStatus status;
        uint256 rating;
        uint256 createdAt;
        uint256 deliveredAt;
    }

    mapping(uint256 => Gig) public gigs;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public sellerGigs;
    mapping(address => uint256[]) public buyerOrders;
    mapping(address => uint256[]) public sellerOrders;

    event GigCreated(uint256 indexed gigId, address indexed seller, string title, uint256 price);
    event GigUpdated(uint256 indexed gigId, bool isActive);
    event OrderPlaced(uint256 indexed orderId, uint256 indexed gigId, address indexed buyer, uint256 amount);
    event WorkDelivered(uint256 indexed orderId, string ipfsHash);
    event OrderApproved(uint256 indexed orderId, uint256 rating);
    event OrderRejected(uint256 indexed orderId, string reason);
    event OrderDisputed(uint256 indexed orderId);

    error NoSellerProfile();
    error InvalidInput();
    error Unauthorized();
    error InvalidStatus();

    constructor(address _tokenAddress, address _nftAddress) Ownable(msg.sender) {
        dexiosToken = IERC20(_tokenAddress);
        sellerProfileNFT = SellerProfileNFT(_nftAddress);
    }

    function createGig(
        string calldata title,
        string calldata description,
        string calldata aiModel,
        uint256 priceInTokens,
        uint256 deliveryTimeHours
    ) external returns (uint256) {
        if (!sellerProfileNFT.hasProfile(msg.sender)) revert NoSellerProfile();
        if (bytes(title).length == 0 || priceInTokens == 0 || deliveryTimeHours == 0) revert InvalidInput();

        unchecked {
            ++gigCounter;
        }

        gigs[gigCounter] = Gig({
            id: gigCounter,
            seller: msg.sender,
            title: title,
            description: description,
            aiModel: aiModel,
            priceInTokens: priceInTokens,
            deliveryTimeHours: deliveryTimeHours,
            isActive: true,
            ordersCompleted: 0,
            totalRating: 0,
            ratingCount: 0,
            createdAt: block.timestamp
        });

        sellerGigs[msg.sender].push(gigCounter);

        emit GigCreated(gigCounter, msg.sender, title, priceInTokens);
        return gigCounter;
    }

    function updateGigStatus(uint256 gigId, bool isActive) external {
        if (gigs[gigId].seller != msg.sender) revert Unauthorized();
        gigs[gigId].isActive = isActive;
        emit GigUpdated(gigId, isActive);
    }

    function placeOrder(uint256 gigId, string calldata requirements) external nonReentrant returns (uint256) {
        Gig storage gig = gigs[gigId];
        if (!gig.isActive) revert InvalidStatus();
        if (msg.sender == gig.seller) revert Unauthorized();
        if (bytes(requirements).length == 0) revert InvalidInput();

        uint256 totalAmount = gig.priceInTokens;
        require(dexiosToken.transferFrom(msg.sender, address(this), totalAmount), "Payment failed");

        unchecked {
            ++orderCounter;
        }

        orders[orderCounter] = Order({
            id: orderCounter,
            gigId: gigId,
            buyer: msg.sender,
            seller: gig.seller,
            requirements: requirements,
            ipfsHash: "",
            paidAmount: totalAmount,
            status: OrderStatus.Pending,
            rating: 0,
            createdAt: block.timestamp,
            deliveredAt: 0
        });

        buyerOrders[msg.sender].push(orderCounter);
        sellerOrders[gig.seller].push(orderCounter);

        emit OrderPlaced(orderCounter, gigId, msg.sender, totalAmount);
        return orderCounter;
    }

    function deliverWork(uint256 orderId, string calldata ipfsHash) external {
        Order storage order = orders[orderId];
        if (order.seller != msg.sender) revert Unauthorized();
        if (order.status != OrderStatus.Pending) revert InvalidStatus();
        if (bytes(ipfsHash).length == 0) revert InvalidInput();

        order.ipfsHash = ipfsHash;
        order.status = OrderStatus.Delivered;
        order.deliveredAt = block.timestamp;

        emit WorkDelivered(orderId, ipfsHash);
    }

    function approveOrder(uint256 orderId, uint256 rating) external nonReentrant {
        Order storage order = orders[orderId];
        if (order.buyer != msg.sender) revert Unauthorized();
        if (order.status != OrderStatus.Delivered) revert InvalidStatus();
        if (rating < 1 || rating > 5) revert InvalidInput();

        order.status = OrderStatus.Approved;
        order.rating = rating;

        uint256 platformFee = (order.paidAmount * platformFeePercent) / 10000;
        uint256 sellerAmount = order.paidAmount - platformFee;

        require(dexiosToken.transfer(order.seller, sellerAmount), "Seller payment failed");
        require(dexiosToken.transfer(owner(), platformFee), "Fee transfer failed");

        Gig storage gig = gigs[order.gigId];
        unchecked {
            ++gig.ordersCompleted;
            gig.totalRating += rating;
            ++gig.ratingCount;
        }

        uint256 sellerTokenId = sellerProfileNFT.sellerToTokenId(order.seller);
        sellerProfileNFT.updateReputation(sellerTokenId, rating, true, sellerAmount);

        emit OrderApproved(orderId, rating);
    }

    function rejectOrder(uint256 orderId, string calldata reason) external {
        Order storage order = orders[orderId];
        if (order.buyer != msg.sender) revert Unauthorized();
        if (order.status != OrderStatus.Delivered) revert InvalidStatus();
        if (bytes(reason).length == 0) revert InvalidInput();

        order.status = OrderStatus.Rejected;

        emit OrderRejected(orderId, reason);
        emit OrderDisputed(orderId);
    }

    function resolveDispute(uint256 orderId, bool approveOrder) external onlyOwner nonReentrant {
        Order storage order = orders[orderId];
        if (order.status != OrderStatus.Rejected && order.status != OrderStatus.Disputed) revert InvalidStatus();

        if (approveOrder) {
            order.status = OrderStatus.Approved;

            uint256 platformFee = (order.paidAmount * platformFeePercent) / 10000;
            uint256 sellerAmount = order.paidAmount - platformFee;

            require(dexiosToken.transfer(order.seller, sellerAmount), "Seller payment failed");
            require(dexiosToken.transfer(owner(), platformFee), "Fee transfer failed");

            Gig storage gig = gigs[order.gigId];
            unchecked {
                ++gig.ordersCompleted;
            }

            uint256 sellerTokenId = sellerProfileNFT.sellerToTokenId(order.seller);
            sellerProfileNFT.updateReputation(sellerTokenId, 0, true, sellerAmount);
        } else {
            require(dexiosToken.transfer(order.buyer, order.paidAmount), "Refund failed");
        }
    }

    function getGig(uint256 gigId) external view returns (Gig memory) {
        return gigs[gigId];
    }

    function getOrder(uint256 orderId) external view returns (Order memory) {
        return orders[orderId];
    }

    function getSellerGigs(address seller) external view returns (uint256[] memory) {
        return sellerGigs[seller];
    }

    function getBuyerOrders(address buyer) external view returns (uint256[] memory) {
        return buyerOrders[buyer];
    }

    function getSellerOrders(address seller) external view returns (uint256[] memory) {
        return sellerOrders[seller];
    }

    function getGigAverageRating(uint256 gigId) external view returns (uint256) {
        Gig memory gig = gigs[gigId];
        return gig.ratingCount == 0 ? 0 : gig.totalRating / gig.ratingCount;
    }

    function setPlatformFee(uint256 newFeePercent) external onlyOwner {
        if (newFeePercent > 1000) revert InvalidInput();
        platformFeePercent = newFeePercent;
    }
}