import "./ConnectButton.css";
import { useState, useEffect } from "react";

export function ConnectButton(props) {
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
      props.onConnect(currentAccount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return currentAccount === "" ? (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect
    </button>
  ) : (
    <p className="gradient-text bold">
      Connected:{" "}
      {currentAccount.substring(0, 8) +
        "......." +
        currentAccount.substring(currentAccount.length - 5)}
    </p>
  );
}
