import React, { useState, useEffect } from "react";

function App() {
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

  return (
    <>
      <img
        className="main-test-page-video-stream"
        src={imageSrc}
        alt="video feed"
      />
      <p>{predicted_acc}</p>
      <p>{predicted_char}</p>
    </>
  );
}

export default App;
