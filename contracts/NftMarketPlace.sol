// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NftMarketPlace__PriceMustBeAboveZero();
error NftMarketPlace__NotApprovedForMarketplace();
error NftMarketPlace__AlreadyListed(address, uint256);
error NftMarketPlace__NotOwner();

contract NftMarketPlace {
    struct Listing {
        uint256 price;
        address seller;
    }

    event ItemList(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    // NFT Contract address -> NFT TokenID -> Listing
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    ////////////////////
    //    Modifier    //
    ////////////////////

    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketPlace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NftMarketPlace__NotOwner();
        }
        _;
    }

    ////////////////////
    // Main Functions //
    ////////////////////

    /*
     * @notice 사용자소유의 NFT를 리스트에 등록해주는 함수입니다.
     * @param nftAddress: 사용자(소유자)의 NFT 주소
     * @param tokenId: 해당 NFT의 tokenID
     * @param price: 등록 후 판매할 가격
     * @dev 기술적으로, 우리는 NFT의 에스크로(조건부 날인 증서/ 즉, 이 계약이 임시로 소유권을 가집니다.) 계약을 만들 수 도 있지만, 
     * 이 방식으로 하면 사람들은 상장되어(listed)도 자신의 NFT 소유권을 보유할 수 있습니다.
     */

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert NftMarketPlace__PriceMustBeAboveZero();
        }
        // 1. Send the NFT to the contract. Transfer -> Contract "hold" the NFT.
        // 2. Owners can still hold their NFT, and give the marketplace approval to sell the NFT for them
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketPlace__NotApprovedForMarketplace();
        }
        // array? mapping?
        // mapping
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemList(msg.sender, nftAddress, tokenId, price);
    }
}

// 1. Create decentralied NFT Marketplace
// 1. `listitem`: List NFTs on the marketplace
// 2. `bytItem`: Buy the NFts
// 3. `cancelItem`: Cancel a listing
// 4. `updateListing`: Update Price
// 5. `withdrawProceeds`: Withdraw payment for my bought NFTs
