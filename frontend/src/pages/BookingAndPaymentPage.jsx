import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import logo from "../assets/image.jpg";

let squareSdkPromise;

function loadSquareSdk() {
  if (squareSdkPromise) return squareSdkPromise;

  squareSdkPromise = new Promise((resolve, reject) => {
    if (window.Square) {
      resolve();
      return;
    }