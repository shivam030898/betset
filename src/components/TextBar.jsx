import React, { useEffect, useState, useRef } from "react";
import "../css/Textbar.css";

const Welcome = () => {
  const [heading, setHeading] = useState("");
  const [intro, setIntro] = useState("");

  const headingText = "Welcome to BetSet";
  const introText = "Where insights converge with opportunity";

  const headingIndexRef = useRef(0);
  const introIndexRef = useRef(0);

  useEffect(() => {
    const typeHeading = () => {
      if (headingIndexRef.current < headingText.length) {
        setHeading(headingText.slice(0, headingIndexRef.current + 1));
        headingIndexRef.current++;
        setTimeout(typeHeading, 150);
      } else {
        setTimeout(typeIntro, 500); // Pause before starting the intro text
      }
    };

    const typeIntro = () => {
      if (introIndexRef.current < introText.length) {
        setIntro(introText.slice(0, introIndexRef.current + 1));
        introIndexRef.current++;
        setTimeout(typeIntro, 100);
      }
    };

    typeHeading();
  }, []); // Empty dependency array ensures useEffect runs only once

  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    for (let i = 1; i <= 20; i++) {
      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;
      const animationDelay = `${Math.random() * 5}s`;
      const animationDuration = `${Math.random() * 8 + 3}s`;
      styleSheet.insertRule(
        `
        .firefly:nth-child(${i}) {
          left: ${left};
          top: ${top};
          animation-delay: ${animationDelay};
          animation-duration: ${animationDuration};
        }
      `,
        styleSheet.cssRules.length
      );
    }
  }, []);

  const fireflies = Array.from({ length: 20 }, (_, index) => (
    <div key={index} className="firefly"></div>
  ));

  return (
    <div className="text-area">
      {/* <h1>{heading}</h1>
      <p>{intro}</p> */}
      {fireflies}
    </div>
  );
};

export default Welcome;
