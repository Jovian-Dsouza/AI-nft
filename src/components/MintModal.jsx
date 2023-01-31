import "./MintModal.css";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";

export function MintModal(props) {
  function handleModal() {
    props.onToggle();
  }

  return (
    <Modal show={props.show} onHide={handleModal}>
      <div className="modal-container">
        <Modal.Header closeButton>
          <p class="modal-header-text gradient-text">Your NFT</p>
        </Modal.Header>
        <Modal.Body>
          {props.img === "" ? (
            <div className="modal-spinner-container">
              <div
                class="spinner-border text-light modal-spinner"
                role="status"
              >
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <img className="modal-img" src={props.img} alt={props.promptText} />
          )}
        </Modal.Body>
        <Modal.Footer>
          {props.disableMint === true ? (
            <div>
              <button
                type="button"
                class="modal-btn btn btn-primary disable"
                onClick={console.log("Please connect your wallet first")}
              >
                Mint Now
              </button>
              <p className="modal-error-text">Connect your wallet to Mint</p>
            </div>
          ) : (
            <Button className="modal-btn" onClick={props.onMint}>
              Mint Now
            </Button>
          )}
        </Modal.Footer>
      </div>
    </Modal>
  );
}
