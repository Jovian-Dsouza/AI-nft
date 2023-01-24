// contracts/StableDiffusionNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract StableDiffusionNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NewNFTMinted(address sender, uint tokenId);

    constructor() ERC721("StableDiffusionNFT", "SDNFT") {}

    function mintNFT(string memory url, string memory desc)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);

        bytes memory json = abi.encodePacked(
                    '{',
                        '"name": "Stability AI #', Strings.toString(newItemId), '", ',
                        '"description": "', desc, '", ',
                        '"image": "', url, '"',
                    '}'
        );
               
        string memory finaltokenURI = string(
            abi.encodePacked("data:application/json;base64,", Base64.encode(json))
        );
        _setTokenURI(newItemId, finaltokenURI);
        _tokenIds.increment();
        emit NewNFTMinted(msg.sender, newItemId);
        return newItemId;
    }
}