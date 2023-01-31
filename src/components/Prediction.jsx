import { useState, useEffect } from "react";
import { MintModal } from "./MintModal";
import { Input } from "./Input";
import { ethers } from "ethers";
import stableDiffusionNFT from "../assets/StableDiffusionNFT.json";

export function Prediction(props) {
  const CONTRACT_ADDRESS = "0x48aD17c98762060514d135E5CCa9A4451f488Fb6";
  const OPENSEA_LINK = `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

  const [show, setShow] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [promptText, setPromptText] = useState("");

  const getPrediction = async (prompt) => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_BASE_URL}/getPrediction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: "512x512",
          }),
        }
      );
      const result = await resp.json();
      return result["result"];
    } catch (e) {
      console.error(e);
      return "";
    }
  };

  const addToIPFS = async (url, name) => {
    const resp = await fetch(`${process.env.REACT_APP_BASE_URL}/addIPFS`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        name: name,
      }),
    });
    const result = await resp.json();
    return result["result"];
  };

  //Contract functions
  const mintNFT = async (url, desc) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          stableDiffusionNFT.abi,
          signer
        );
        const txn = await contract.mintNFT(url, desc);
        const txnReceipt = await txn.wait();
        const [transferEvent] = txnReceipt.events;
        const { tokenId } = transferEvent.args;

        console.log("NFT minted: ", `${OPENSEA_LINK}/${tokenId.toString()}`);
        alert(`NFT minted: ${OPENSEA_LINK}/${tokenId.toString()}`);
        return tokenId;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const totalNFTs = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          stableDiffusionNFT.abi,
          signer
        );
        const count = await contract.totalNFTs();
        return count;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setupEventListners = async () => {
    if (props.account !== "") {
      console.log("setting up event listeners");
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            stableDiffusionNFT.abi,
            signer
          );

          contract.on("NewNFTMinted", (from, tokenId) => {
            alert(`NFT minted: ${OPENSEA_LINK}/${tokenId.toString()}`);
          });
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // useEffect(() => {
  //   setupEventListners();
  // });

  // Callbacks

  const handleOnCreate = (promptText) => {
    console.log("Prompt Text ", promptText);
    setShow(true);
    (async () => {
      const output = await getPrediction(promptText);
      console.log(output);

      setImgSrc(output);
      setPromptText(promptText);
    })();
  };

  const handleToggle = () => {
    setShow(!show);
    setImgSrc("");
  };

  const handleMint = () => {
    (async () => {
      if (props.account !== "") {
        const nftNumber = await totalNFTs();
        const nftName = `Stability AI #${nftNumber.toString()}`;
        console.log("nftName: ", nftName);

        const result = await addToIPFS(imgSrc, nftName);
        console.log(result);
        mintNFT(result, promptText);
      }
    })();
    handleToggle();
  };

  return (
    <div>
      <MintModal
        img={imgSrc}
        show={show}
        onToggle={handleToggle}
        onMint={handleMint}
        disableMint={props.account === ""}
      />
      <Input onCreate={handleOnCreate} />
    </div>
  );
}
