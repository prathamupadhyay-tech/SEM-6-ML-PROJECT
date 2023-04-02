
import React from 'react';
import "../css/VideoPlayer.css";
function VideoPlayer() {
  return (
    <img className='main-test-page-video-stream' src="http://127.0.0.1:5000/video_feed" alt="video stream" />
  );
}
export default VideoPlayer;