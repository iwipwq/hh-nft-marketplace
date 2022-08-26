// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNft is ERC721 {
    string public constant TOKEN_URI =
        "ipfs://QmbmvajL7TXFv6c5ZDvxjxTYbK5rMocqDayLtJJQu3CGVC";
    uint256 private s_tokenCounter;

    event FlyMinted(uint256 indexed tokenId);

    constructor() ERC721("flyingHead", "FLY") {
        s_tokenCounter = 0;
    }

    function mintNft() public returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter);
        emit FlyMinted(s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
        return s_tokenCounter;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_exists(tokenId), unicode"ERC721Metadata: 존재하지 않는 토큰의 URI를 쿼리하고 있습니다.");
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns(uint256) {
        return s_tokenCounter;
    }
}
