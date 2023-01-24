import { useState } from "react";
import { MintModal } from "./MintModal";
import { Input } from "./Input";
import { predict } from "../scripts/replicate-api";

export function Prediction(props) {
  const [show, setShow] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

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

  const handleOnCreate = (promptText) => {
    console.log("Prompt Text ", promptText);
    setShow(true);
    (async () => {
      const output = await getPrediction(promptText);
      console.log(output);
      const result = await addToIPFS(output, "test");
      console.log(result);
      setImgSrc(result);
    })();
  };

  return (
    <div>
      <MintModal
        img={imgSrc}
        show={show}
        onToggle={() => {
          setShow(!show);
          setImgSrc("");
        }}
      />
      <Input onCreate={handleOnCreate} />
    </div>
  );
}
