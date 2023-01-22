import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import { ethers } from "ethers";
import { Carousel } from "./components/Carousel";
import { Input } from "./components/Input";

// Constants
const TWITTER_HANDLE = "DsouzaJovian";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

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
    } else {
      console.log("We have a ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length != 0) {
      const account = accounts[0];
      console.log("Found an authorized account", account);
      setCurrentAccount(account);
    } else {
      console.log("Could not find authorized account");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Get Metamask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  function MintButton() {
    return (
      <button className="cta-button connect-wallet-button">Connect</button>
    );
  }

  function NavBar() {
    return (
      <nav className="navbar navbar-dark navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src="./logo-color.svg"
              alt="StableDiffusionNFT"
              width="100"
              height="100"
            />
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </a>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-link" href="#">
                Pricing
              </a>
              <a className="nav-link" href="#">
                Marketplace
              </a>
              <a className="nav-link" href="#">
                Gallery
              </a>
              <div className="nav-mint-button">
                <MintButton />
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  function Footer() {
    return (
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built by @${TWITTER_HANDLE}`}</a>
      </div>
    );
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container-fluid app-container">
        <NavBar />

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

              <Input />
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
