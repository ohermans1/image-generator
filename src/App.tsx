import React, { useEffect, useState } from "react";
import "./App.css";
import { Spinner, DefaultButton } from "@fluentui/react";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

function App() {
  const [loading, setLoading] = useState(false);

  const [imageURL, setImageURL] = useState(null);
  const [subject, setSubject] = useState(null);
  const [background, setbackground] = useState(null);
  const [style, setstyle] = useState(null);

  const saveClicked = async (e: any) => {
    e.preventDefault();
    if (!subject || !background || !style) {
      window.alert("Please complete all fields before saving.");
      return;
    }
    setLoading(true);
    let string = `${subject} with a ${background} background in a ${style} style`;

    await createImage(string);
    setLoading(false);
  };

  const saveInput = (e: any) => {
    const inputType = e.target.name;
    if (inputType === "Subject") {
      setSubject(e.target.value);
    }
    if (inputType === "Background") {
      setbackground(e.target.value);
    }
    if (inputType === "Style") {
      setstyle(e.target.value);
    }
  };

  const createImage = async (searchQuery: string) => {
    const response = await openai.createImage({
      prompt: searchQuery,
      n: 1,
      size: "1024x1024",
    });
    setImageURL(response.data.data[0].url);
  };

  return (
    <div className="App">
      {loading && <Spinner></Spinner>}
      {imageURL && !loading && <img src={imageURL} className="image" alt="generated content" />}
      <div className="input">
        <label htmlFor="subjectImage">What would you like your picture to be of?</label>
        <input
          title="Subject Image"
          placeholder="e.g. a pirate ship"
          name="Subject"
          onChange={saveInput}
        ></input>
      </div>
      <div className="input">
        <label htmlFor="subjectImage">What would you like the background to be?</label>
        <input
          title="Background"
          placeholder="e.g. a dark stormy sea"
          name="Background"
          onChange={saveInput}
        ></input>
      </div>
      <div className="input">
        <label htmlFor="subjectImage">What style would you like your picture to be in?</label>
        <input
          title="Style"
          placeholder="e.g. watercolour"
          name="Style"
          onChange={saveInput}
        ></input>
      </div>
      <DefaultButton onClick={saveClicked} disabled={loading}>
        Save
      </DefaultButton>
    </div>
  );
}

export default App;
