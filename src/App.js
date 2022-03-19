import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import { ToastContainer, toast } from "react-toastify";
import { baseurl } from "./config";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

export default function App() {
  return (
    <div>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          theme={"colored"}
        />
        <Routes>
          <Route exact path="/" element={<Login />} />

          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}
