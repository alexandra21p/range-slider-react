import React from "react";
import ReactDOM from "react-dom";

import SliderContainer from "./components/SliderContainer";

const firstObject = {
    containerName: "custom-slider-container",
    width: 500,
    minimum: 0,
    maximum: 500,
    initialValueFirst: 10,
    initialValueSecond: 350,
};

// const secondObject = {
//     containerName: "second-custom-slider-container",
//     width: 700,
//     minimum: 0,
//     maximum: 1000,
//     initialValueFirst: 100,
//     initialValueSecond: 500,
// };

const firstContainer = document.querySelector( ".first-container" );
// const secondContainer = document.querySelector( ".second-container" );

ReactDOM.render( <SliderContainer { ...firstObject } />, firstContainer );
// ReactDOM.render( <SliderContainer { ...secondObject } />, secondContainer );
