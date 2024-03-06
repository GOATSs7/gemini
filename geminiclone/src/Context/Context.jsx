import { createContext, useState } from "react";
import runChat from "../config/gemini";
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // for typing text effect

  const delayPara = (index, nextWord) => {
    //   console.log(nextWord + "1");
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  //new chat button

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  //
  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompt((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }

    //for split the text on ** pattern  and make that text bold basically it is heading
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }

    //   for new line

    let newResponse2 = newResponse.split("*").join("</br>");

    // setResultData(newResponse2);
    let newReponseArray = newResponse2.split(" ");
    for (let i = 0; i < newReponseArray.length; i++) {
      const nextWord = newReponseArray[i];
      //   console.log(nextWord);
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    loading,
    resultData,
    input,
    setInput,
    showResult,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
