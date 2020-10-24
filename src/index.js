import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import StickyNotes from "./StickyNotes";

import { PopupComponent } from "./PopupComponent";

const popupRoot = document.getElementById("popup-root");

const insertionPoint = document.createElement("div");
insertionPoint.id = "insertion-point";
document.body.parentNode.insertBefore(insertionPoint, document.body);

// StickyNotes / content script
!popupRoot &&
  ReactDOM.render(
    <React.StrictMode>
      <StickyNotes />
    </React.StrictMode>,
    document.getElementById("insertion-point")
  );

// PopupComponent / popup.html
popupRoot && // to suppress minified react error 200
  ReactDOM.render(
    <React.Fragment>
      <PopupComponent />
    </React.Fragment>,
    popupRoot
  );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
