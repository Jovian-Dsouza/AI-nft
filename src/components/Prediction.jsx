import { useState } from "react";
import { MintModal } from "./MintModal";
import { Input } from "./Input";
import { predict } from "../scripts/replicate-api";
import { ethers } from "ethers";
import stableDiffusionNFT from "../assets/StableDiffusionNFT.json";

export function Prediction(props) {
  const CONTRACT_ADDRESS = "0x48aD17c98762060514d135E5CCa9A4451f488Fb6";
  const OPENSEA_LINK = `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

  const [show, setShow] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [promptText, setPromptText] = useState("");

  const getPrediction = async (prompt) => {
    const input = {
      prompt: prompt,
      num_outputs: 1,
      width: 768,
      height: 768,
      num_inference_steps: 50,
      guidance_scale: 7.5,
      scheduler: "DPMSolverMultistep",
    };

    try {
      let output = await predict(
        `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_PATH}`,
        process.env.REACT_APP_API_KEY,
        process.env.REACT_APP_MODEL_VERSION,
        input
      );
      return output[0];
    } catch (error) {
      console.error(error);
      return "";
    }
    return "";
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

  // Callbacks

  const handleOnCreate = (promptText) => {
    console.log("Prompt Text ", promptText);
    setShow(true);
    (async () => {
      const output = await getPrediction(promptText);
      console.log(output);

      if(props.account !== ""){
       
        const nftNumber = await totalNFTs();
        const nftName = `Stability AI #${nftNumber.toString()}`;
        console.log("nftName: ", nftName);

        const result = await addToIPFS(output, nftName);
        console.log(result);

        setImgSrc(result);
        setPromptText(promptText);
      }
      else{
        setImgSrc(output);
      }
    })();
  };

  const handleToggle = () => {
    setShow(!show);
    setImgSrc("");
  };

  const handleMint = () => {
    // (async () => {
      mintNFT(imgSrc, promptText);
      handleToggle();
    // })();
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
