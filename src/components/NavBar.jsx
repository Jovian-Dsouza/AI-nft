import "./NavBar.css";

export function NavBar(props) {
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
              {props.btn}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
