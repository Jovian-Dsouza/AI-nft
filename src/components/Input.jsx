import "./Input.css";
import { useState } from "react";

export function Input(props) {
  const [promptText, setPromptText] = useState("");

  function handleOnClick() {
    if (promptText === "") {
      alert("Prompt message cant be empty");
      return;
    }
    props.onCreate(promptText);
    //TODO reset promptText
  }

  return (
    <div class="input-group w-75 input-container">
      <input
        type="text"
        class="form-control"
        placeholder="Enter Something..."
        aria-label="Enter Something..."
        aria-describedby="basic-addon2"
        value={promptText}
        onChange={(e) => {
          setPromptText(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleOnClick(promptText);
          }
        }}
      />
      <div class="input-group-append">
        <button
          class="btn btn-outline-secondary"
          type="button"
          onClick={handleOnClick}
        >
          Create
        </button>
      </div>
    </div>
  );
}
