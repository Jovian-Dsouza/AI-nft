import twitterLogo from "../assets/twitter-logo.svg";
import "./Footer.css";

const TWITTER_HANDLE = "DsouzaJovian";

export function Footer() {
  const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
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
