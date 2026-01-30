// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;
עןא
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SellerProfileNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    uint256 public constant PROFILE_MINT_COST = 10 * 10**18;

    struct SellerProfile {
        address owner;
        uint256 totalJobs;
        uint256 successfulJobs;
        uint256 totalEarned;
        uint256 totalRating;
        uint256 ratingCount;
        uint256 joinedAt;
    }

    mapping(uint256 => SellerProfile) public profiles;
    mapping(address => uint256) public sellerToTokenId;

    event ProfileCreated(address indexed seller, uint256 tokenId);
    event ReputationUpdated(uint256 indexed tokenId, uint256 rating, bool jobCompleted);

    constructor() ERC721("Dexios Seller Profile", "DSP") Ownable(msg.sender) {}

    function mintProfile(address seller) external onlyOwner returns (uint256) {
        require(sellerToTokenId[seller] == 0, "Profile already exists");
        
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        _mint(seller, newTokenId);
        
        profiles[newTokenId] = SellerProfile({
            owner: seller,
            totalJobs: 0,
            successfulJobs: 0,
            totalEarned: 0,
            totalRating: 0,
            ratingCount: 0,
            joinedAt: block.timestamp
        });
        
        sellerToTokenId[seller] = newTokenId;
        
        emit ProfileCreated(seller, newTokenId);
        return newTokenId;
    }

    function updateReputation(
        uint256 tokenId,
        uint256 rating,
        bool jobCompleted,
        uint256 amountEarned
    ) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Profile does not exist");
        
        SellerProfile storage profile = profiles[tokenId];
        profile.totalJobs++;
        
        if (jobCompleted) {
            profile.successfulJobs++;
            profile.totalEarned += amountEarned;
        }
        
        if (rating > 0) {
            profile.totalRating += rating;
            profile.ratingCount++;
        }
        
        emit ReputationUpdated(tokenId, rating, jobCompleted);
    }

    function getProfile(uint256 tokenId) external view returns (SellerProfile memory) {
        require(_ownerOf(tokenId) != address(0), "Profile does not exist");
        return profiles[tokenId];
    }

    function getAverageRating(uint256 tokenId) external view returns (uint256) {
        SellerProfile memory profile = profiles[tokenId];
        if (profile.ratingCount == 0) return 0;
        return profile.totalRating / profile.ratingCount;
    }

    function hasProfile(address seller) external view returns (bool) {
        return sellerToTokenId[seller] != 0;
    }
}