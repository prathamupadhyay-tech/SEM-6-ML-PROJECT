import React, { useEffect } from "react";
import "../css/TestPage.css";
import { useCallback } from "react";
import { useState } from "react";

const SignToText = () => {
  const [word, setWord] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [predicted_char, setpredictedChar] = useState("");
  const [predicted_acc, setpredictedAcc] = useState(0.0);
  const [timer, settimer] = useState(2);
  const [canAddChar, setCanAddChar] = useState(true);
  const [timerRunning, settimerRunning] = useState(true);
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

  useEffect(() => {
    if (Math.round(predicted_acc) * 100 > 70 && canAddChar) {
      setWord((prevWord) => {
        setTimeout(() => {
          setCanAddChar(true); // allow new characters to be added after 2 seconds
        }, 2000);
        setCanAddChar(false); // prevent new characters from being added until the delay is over
        return prevWord + predicted_char;
      });
    }
  }, [predicted_char, predicted_acc, canAddChar]);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setCanAddChar(true);
    }, 2000);
    return () => clearTimeout(delayTimer);
  }, [word]);
  //   useEffect(() => {
  //     if (Math.round(predicted_acc) * 100 > 70) {
  //       setWord((prevWord) => prevWord + predicted_char);
  //     }
  //   }, [predicted_char, predicted_acc]);

  return (
    <>
      <div className="testpage-container">
        <div className="testpage-wrapper">
          
          <div className="test-word-part">
            <div className="converted-word-div">
              <p>Converted text</p>
              <div className="converted-word">
                {Array.from(word).map((char) => (
                  <span key={char}>{char}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="test-practise-part">
            <img
              className="main-test-page-video-stream"
              src={imageSrc}
              alt="video feed"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignToText;
