import React, { useEffect } from "react";
import "../css/TestPage.css";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import io from 'socket.io-client'
const TestPage = () => {
  const words = ["hello", "buy", "tanish", "kartik"];
  const [timer, settimer] = useState(30);
  const [timerRunning, settimerRunning] = useState(false);
  const [nextWord, setnextWord] = useState(0);
  const [currentChar, setcurrentChar] = useState(0);
  const [score, setScore] = useState(0);
  

  let currentchar = 0;
  // useEffect(() => {
  //   settimer(timer - 1);
  // }, []);
  let word = "";
  // Key Detection
  useEffect(() => {
    document.addEventListener("keypress", detectKeyDown, true);
  }, [currentchar, nextWord]);
  useEffect(() => {
    const socket = io("ws://localhost:5000", {
      transports: ["polling"],
      cors: {
        origin: "http://localhost:3000/",
      },
    });
    
    socket.on("connect" , () =>{
      console.log("Connected")
      socket.emit({"con" : "Connected"})
      socket.on('connected', (data) => console.log("connected" , data))
      socket.on('newdata', (data) => console.log("newdata" , data))
    })
    
    return () => {
      socket.disconnect();
  };
  }, [])
  const detectKeyDown = (e) => {
    // console.log();

    // console.log(words[nextWord].charAt(currentChar) === e.key);

    // console.log("currentChar ", currentchar);
    // console.log("next word", nextWord);
    // console.log(words[nextWord].charAt(currentchar) === e.key);
    console.log("nextword", nextWord);

    if (words[nextWord].charAt(currentchar) === e.key) {
      console.log("key pressed", e.key);
      word = word + e.key;

      if (word === words[nextWord]) {
        word = "";
        currentchar = 0;
        settimer(30);
        setScore((prevScore) => prevScore + 10);
        if (nextWord === words.length - 1) {
          setnextWord(0);
        } else {
          setnextWord((prevWord) => prevWord + 1);
        }

        console.log("done");
      }
      console.log(word);

      currentchar += 1;

      console.log(currentchar);
    }
  };

  useEffect(() => {
    var SetInterval = setInterval(() => {
      settimer((prevTimer) => prevTimer - 1);
      if (timer === 0) {
        if (nextWord === words.length - 1) {
          setnextWord(0);
        } else {
          settimerRunning(false);
          setnextWord((prevWord) => prevWord + 1);
        }
        settimer(30);
      }
    }, 1000);

    return () => clearInterval(SetInterval);
  });

  // function starttimer() {
  //   settimerRunning(true);
  //   var setIntervalTimer = setInterval(() => {
  //     settimer((prevTimer) => prevTimer - 1);
  //     if (timer == 0) {
  //       clearInterval(setIntervalTimer);
  //       if (words.length != 0) {
  //         settimerRunning(false);
  //         setnextWord((prevWord) => prevWord + 1);
  //       } else {
  //         setnextWord(0);
  //       }
  //     }
  //   }, 500);
  // }

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
                  <span>{word}</span>
                ))}
              </h1>
            </div>
          </div>

          <div className="test-practise-part">
            <VideoPlayer></VideoPlayer>
          </div>
        </div>
      </div>
    </>
  );
};
export default TestPage;
