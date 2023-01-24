const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, should, assert } = require('chai');
const { ethers } = require('hardhat');

describe("Stable diffusion NFT", function() {

    async function deployTokenFixture() {
        const NFTFactory = await ethers.getContractFactory("StableDiffusionNFT");
        const [owner, addr1, addr2] = await ethers.getSigners();

        const contract = await NFTFactory.deploy();
        await contract.deployed();

        return { NFTFactory, contract, owner, addr1, addr2};
    }

    it("Should be able to mint NFT", async function () {
        const {contract, owner} = await loadFixture(deployTokenFixture);
        await expect(
            contract.mintNFT("https://dummyUrl", "dummyName")
            ).to.emit(contract, 'NewNFTMinted')
            .withArgs(owner.address, "0");
    
    });

    it("Token counter should increment", async function () {
        const {contract, owner} = await loadFixture(deployTokenFixture);
        
        let txn = await contract.mintNFT("https://dummyUrl", "dummyName");
        let txnReceipt = await txn.wait();
        let [ transferEvent ] = txnReceipt.events;
        let { tokenId } = transferEvent.args;
        expect(tokenId).to.equal("0");

        const txn2 = await contract.mintNFT("https://dummyUrl", "dummyName");
        const txnReceipt2 = await txn2.wait();
        const [ transferEvent2 ] = txnReceipt2.events;
        const { tokenId: tokenId2 } = transferEvent2.args;
        expect(tokenId2).to.equal("1");
    });

});