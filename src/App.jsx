import React, { useEffect, useState } from "react";
import "./styles/App.css";
import { ethers } from "ethers";
import { Carousel } from "./components/Carousel";
import { Input } from "./components/Input";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { ConnectButton } from "./components/ConnectButton";
import { predict } from "./scripts/replicate-api";

console.log(process.env.REACT_APP_BASE_URL);
// Constants
const EXAMPLE_PATH = "./stable-diffusion-examples/";

var examples = [
  "Hipster Llama wearing a hat, studio lighting, award winning photography.",
  "A high tech solarpunk utopia in the Amazon rainforest",
  "A small cabin on top of a snowy mountain in the style of Disney, artstation",
];
examples = examples.map((title) => {
  return { title: title, src: `${EXAMPLE_PATH}${title}.png` };
});

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask");
      return;
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log("Could not find authorized account");
    }
  };

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
      console.log(output);
      return output;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  const handleOnCreate = (promptText) => {
    console.log("Prompt Text ", promptText);
    let output = null;
    (async () => {
      output = await getPrediction(promptText);
      console.log(output);
    })();
    
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container-fluid app-container">
        <NavBar
          btn={
            <ConnectButton
              onConnect={(account) => {
                setCurrentAccount(account);
              }}
            />
          }
        />

        <div className="container text-container">
          <div className="row">
            {/* Body text */}
            <div className="col-lg-6 pt-3">
              <p className="header-text">
                Create, Collect and Sell NFTs by created <b>AI</b>
              </p>
              <p className="sub-text">
                Get the an NFT out of your wildest Dream.
                <br />
                Click on Create button to get your own NFT now.
              </p>

              <Input onCreate={handleOnCreate} />
            </div>

            {/* Carousel  */}
            <div className="col-lg-6">
              <Carousel examples={examples} />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default App;
