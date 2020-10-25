/* global chrome */
import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";

import { localMode } from "./constants";
import { ShadowRoot } from "./ShadowRoot";

const Container = styled.div`
  z-index: 2;
  border: 1px solid grey;
  position: absolute;
  background: white;
  top: ${(props) => props.y + "px"};
  left: ${(props) => props.x + "px"};
`;

const Header = styled.div`
  height: 20px;
  background-color: papayawhip;
`;

const StyledButton = styled.button`
  height: 20px;
  border: none;
  opacity: 0.5;
  float: right;
`;

const StyledTextArea = styled.textarea`
  color: dark grey;
  height: 200px;
  width: 200px;
  border: none;
  background-color: hsla(0, 0%, 100%, 0.2);
`;

const StickyNotes = () => {
  const [notes, setNotes] = useState([]);
  const url = window.location.href;

  // listen for shift + click to add note
  useEffect(() => {
    const clickListener = (e) => {
      if (e.shiftKey) {
        setNotes((prevNotes) => [...prevNotes, { x: e.pageX, y: e.pageY }]);
      }
    };
    document.addEventListener("click", clickListener);
    return () => document.removeEventListener("click", clickListener);
  }, []);

  // get notes if they're there
  useEffect(() => {
    if (!localMode) {
      chrome.storage.local.get(url, (items) => {
        items[url] && setNotes(items[url]);
      });
    }
  }, []);

  // set()
  useEffect(() => {
    if (!localMode) {
      notes.length > 0
        ? chrome.storage.local.set({ [url]: notes })
        : chrome.storage.local.remove(url);
    }
  }, [notes]);

  console.log("notes, ", notes);

  return (
    <div>
      {notes.map((note) => {
        const handleChange = (e) => {
          const editedText = e.target.value;
          setNotes((prevNotes) =>
            prevNotes.reduce(
              (acc, cv) =>
                cv.x === note.x && cv.y === note.y
                  ? acc.push({ ...cv, note: editedText }) && acc
                  : acc.push(cv) && acc,
              []
            )
          );
        };

        const handleDelete = () => {
          setNotes((prevNotes) =>
            prevNotes.reduce(
              (acc, cv) =>
                cv.x === note.x && cv.y === note.y ? acc : acc.push(cv) && acc,
              []
            )
          );
        };

        return (
          <ShadowRoot>
            <Container x={note.x} y={note.y}>
              <Header>
                <StyledButton onClick={handleDelete}>X</StyledButton>
              </Header>
              <StyledTextArea
                onChange={handleChange}
                value={note.note ? note.note : ""}
              />
            </Container>
          </ShadowRoot>
        );
      })}
    </div>
  );
};

export default StickyNotes;
