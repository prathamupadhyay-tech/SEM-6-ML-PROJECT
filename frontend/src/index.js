import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import TestPage from "./components/TestPage";
import VideoPlayer from "./components/VideoPlayer";
import SignToText from "./components/SignToText";
import { Home } from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signtotext" element={<SignToText />} />
      <Route path="/learnsign" element={<TestPage />} />
    </Routes>
  </Router>
);

