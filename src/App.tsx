import { useState } from "react";
import "./App.scss";
import { Spinner, DefaultButton, SpinnerSize } from "@fluentui/react";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function App() {
  const [loading, setLoading] = useState(false);

  const [imageURL, setImageURL] = useState("");
  const [subject, setSubject] = useState("");
  const [background, setbackground] = useState("");
  const [style, setstyle] = useState("");

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
    try {
      const response = await openai.createImage({
        prompt: searchQuery,
        n: 1,
        size: "1024x1024",
      });
      setImageURL(response.data.data[0].url as string);
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  };

  return (
    <div className="App">
      {loading && (
        <Spinner
          size={SpinnerSize.large}
          label="Creating a never before seen image..."
          ariaLive="assertive"
          labelPosition="right"
        ></Spinner>
      )}
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
        Generate!
      </DefaultButton>
    </div>
  );
}

export default App;
