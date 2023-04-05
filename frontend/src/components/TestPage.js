import React, { useEffect } from "react";
import "../css/TestPage.css";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer";

const TestPage = () => {
  const words = ["BUY", "CAR", "TRAIN", "BUS"];
  const [timer, settimer] = useState(30);
  const [timerRunning, settimerRunning] = useState(false);
  const [nextWord, setnextWord] = useState(0);
  const [currentChar, setcurrentChar] = useState(0);
  const [score, setScore] = useState(0);
  const [word, setWord] = useState(""); // Add word state

  const [imageSrc, setImageSrc] = useState("");
  const [predicted_char, setpredictedChar] = useState("");
  const [predicted_acc, setpredictedAcc] = useState(0.0);
  useEffect(() => {
    const eventSource = new EventSource("http://127.0.0.1:5000/video_feed");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const image = data.image;

      // Set the image source to a data: URL containing the received image data
      setImageSrc(`data:image/jpeg;base64,${btoa(image)}`);
      setpredictedChar(data.predicted_character);
      setpredictedAcc(data.predicted_accuracy);
    };

    return () => {
      // Clean up the EventSource when the component unmounts
      eventSource.close();
    };
  }, []);

  // Key Detection
  useEffect(() => {
    // document.addEventListener("keypress", detectKeyDown, true);
    // return () => {
    //   document.removeEventListener("keypress", detectKeyDown, true);
    // };
    detectKeyDown(predicted_char, predicted_acc);
  }, [currentChar, nextWord, predicted_char, predicted_acc]);

  const detectKeyDown = (predicted_char, predicted_acc) => {
    console.log(predicted_acc);
    console.log(typeof predicted_acc);
    console.log("word" + words[nextWord].charAt(currentChar));
    if (
      words[nextWord].charAt(currentChar) === predicted_char &&
      Math.round(predicted_acc) * 100 > 40
    ) {
      setWord((prevWord) => prevWord + predicted_char);
      console.log("word" + word);
      setcurrentChar((prevChar) => prevChar + 1);
    }
  };

  useEffect(() => {
    if (word === words[nextWord]) {
      setScore((prevScore) => prevScore + 10);
      setnextWord((prevWord) => (prevWord + 1) % words.length);
      settimer(30);
      setcurrentChar(0);
      setWord("");
    }
  }, [word, words, nextWord]);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        settimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    if (timer === 0) {
      settimer(30);
      setWord("");
      setcurrentChar(0);
      setScore((prevScore) => prevScore - 5);
      setnextWord((prevWord) => (prevWord + 1) % words.length);
    }
  }, [timer, words, nextWord]);

  useEffect(() => {
    if (!timerRunning && currentChar === 0 && word === "") {
      settimerRunning(true);
    }
  }, [currentChar, timerRunning, word]);

  // const words = ["hello", "buy", "tanish", "kartik"];
  // const [timer, settimer] = useState(30);
  // const [timerRunning, settimerRunning] = useState(false);
  // const [nextWord, setnextWord] = useState(0);
  // const [currentChar, setcurrentChar] = useState(0);
  // const [score, setScore] = useState(0);

  // let currentchar = 0;
  // // useEffect(() => {YYY
  // //   settimer(timer - 1);
  // // }, []);
  // let word = "";
  // // Key Detection
  // useEffect(() => {
  //   document.addEventListener("keypress", detectKeyDown, true);
  // }, [currentchar, nextWord]);

  // const detectKeyDown = (e) => {
  //   // console.log();

  //   // console.log(words[nextWord].charAt(currentChar) === e.key);

  //   // console.log("currentChar ", currentchar);
  //   // console.log("next word", nextWord);
  //   // console.log(words[nextWord].charAt(currentchar) === e.key);
  //   console.log("nextword", nextWord);

  //   if (words[nextWord].charAt(currentchar) === e.key) {
  //     console.log("key pressed", e.key);
  //     word = word + e.key;

  //     if (word === words[nextWord]) {
  //       word = "";
  //       currentchar = 0;
  //       settimer(30);

  //       setScore((prevScore) => prevScore + 10);
  //       if (nextWord == words.length - 1) {
  //         setnextWord(0);
  //       } else {
  //         setnextWord((prevWord) => prevWord + 1);
  //       }
  //       // const elements = document.querySelectorAll(".test-word span");
  //       // elements.forEach((element) => {
  //       //   while (element.classList.length > 0) {
  //       //     element.classList.remove(element.classList.item(0));
  //       //   }
  //       // });
  //       console.log("done");
  //     }
  //     console.log(word);
  //     // document
  //     //   .querySelectorAll(".test-word span")
  //     //   [currentchar].classList.add("correct");
  //     currentchar += 1;

  //     console.log(currentchar);
  //   }
  // };

  // useEffect(() => {
  //   var SetInterval = setInterval(() => {
  //     settimer((prevTimer) => prevTimer - 1);
  //     if (timer == 0) {
  //       if (nextWord == words.length - 1) {
  //         setnextWord(0);
  //       } else {
  //         settimerRunning(false);
  //         setnextWord((prevWord) => prevWord + 1);
  //       }
  //       settimer(30);
  //     }
  //   }, 1000);

  //   return () => clearInterval(SetInterval);
  // });

  // // function starttimer() {
  // //   settimerRunning(true);
  // //   var setIntervalTimer = setInterval(() => {
  // //     settimer((prevTimer) => prevTimer - 1);
  // //     if (timer == 0) {
  // //       clearInterval(setIntervalTimer);
  // //       if (words.length != 0) {
  // //         settimerRunning(false);
  // //         setnextWord((prevWord) => prevWord + 1);
  // //       } else {
  // //         setnextWord(0);
  // //       }
  // //     }
  // //   }, 500);
  // // }

  return (
    <>
      <div className="testpage-container">
        <div className="testpage-wrapper">
          <div className="test-timer">
            <h1>{timer}</h1>{" "}
          </div>
          <div className="test-word-part">
            <div className="score">
              <h1>Points: {score}</h1>
            </div>
            <div className="word-div">
              <p>Word To Make</p>
              <h1 className="test-word">
                {Array.from(words[nextWord]).map((word, index) => (
                  <span
                    key={index}
                    className={index < currentChar ? "correct" : ""}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </div>
            <div className="sign-language-panel">
              
            </div>
          </div>

          <div className="test-practise-part">
            <img
              className="main-test-page-video-stream"
              src={imageSrc}
              alt="video feed"
            />
            <p>{predicted_acc}</p>
            <p>{predicted_char}</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default TestPage;
