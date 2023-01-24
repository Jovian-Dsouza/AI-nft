const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('StableDiffusionNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // Call the function.
  let txn = await nftContract.mintNFT(
    "https://gateway.pinata.cloud/ipfs/QmXRuBZAw8etnvEaXfSKwwwgemvbt47RPQazHJUd8gY34D",
    "an astronaut riding a horse on mars artstation, hd, dramatic lighting, detailed"
  )
  // Wait for it to be mined.
  const txReceipt = await txn.wait()
  const [transferEvent] = txReceipt.events;
  const { tokenId } = transferEvent.args;

  const nftURL = `https://testnets.opensea.io/assets/goerli/${nftContract.address}/${tokenId.toString()}`
  console.log("Minted NFT #1:", nftURL)

  const totalNFTs = await nftContract.totalNFTs();
  console.log("Total NFTS so far ", totalNFTs.toString());
  // let tokenUri = await nftContract.tokenURI(0);
  // console.log("Token URI", tokenUri);

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();