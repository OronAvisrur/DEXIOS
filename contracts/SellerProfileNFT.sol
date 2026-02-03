// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SellerProfileNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

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

    error ProfileAlreadyExists();
    error ProfileDoesNotExist();

    constructor() ERC721("Dexios Seller Profile", "DSP") Ownable(msg.sender) {}

    function mintProfile() external returns (uint256) {
        if (sellerToTokenId[msg.sender] != 0) revert ProfileAlreadyExists();
        
        unchecked {
            ++_tokenIdCounter;
        }
        uint256 newTokenId = _tokenIdCounter;
        
        _mint(msg.sender, newTokenId);
        
        profiles[newTokenId] = SellerProfile({
            owner: msg.sender,
            totalJobs: 0,
            successfulJobs: 0,
            totalEarned: 0,
            totalRating: 0,
            ratingCount: 0,
            joinedAt: block.timestamp
        });
        
        sellerToTokenId[msg.sender] = newTokenId;
        
        emit ProfileCreated(msg.sender, newTokenId);
        return newTokenId;
    }

    function updateReputation(
        uint256 tokenId,
        uint256 rating,
        bool jobCompleted,
        uint256 amountEarned
    ) external onlyOwner {
        if (_ownerOf(tokenId) == address(0)) revert ProfileDoesNotExist();
        
        SellerProfile storage profile = profiles[tokenId];
        
        unchecked {
            ++profile.totalJobs;
            
            if (jobCompleted) {
                ++profile.successfulJobs;
                profile.totalEarned += amountEarned;
            }
            
            if (rating > 0) {
                profile.totalRating += rating;
                ++profile.ratingCount;
            }
        }
        
        emit ReputationUpdated(tokenId, rating, jobCompleted);
    }

    function getProfile(uint256 tokenId) external view returns (SellerProfile memory) {
        if (_ownerOf(tokenId) == address(0)) revert ProfileDoesNotExist();
        return profiles[tokenId];
    }

    function getAverageRating(uint256 tokenId) external view returns (uint256) {
        SellerProfile memory profile = profiles[tokenId];
        return profile.ratingCount == 0 ? 0 : profile.totalRating / profile.ratingCount;
    }

    function hasProfile(address seller) external view returns (bool) {
        return sellerToTokenId[seller] != 0;
    }

    function getSuccessRate(uint256 tokenId) external view returns (uint256) {
        SellerProfile memory profile = profiles[tokenId];
        return profile.totalJobs == 0 ? 0 : (profile.successfulJobs * 100) / profile.totalJobs;
    }
}