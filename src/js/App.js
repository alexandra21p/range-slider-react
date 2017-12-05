import React from "react";
import ReactDOM from "react-dom";

import RangeSlider from "./components/RangeSlider";

const firstObject = {
    width: 500,
    minimum: 0,
    maximum: 500,
    initialValueFirst: 50,
    initialValueSecond: 350,
};

const secondObject = {
    width: 700,
    minimum: 0,
    maximum: 1000,
    initialValueFirst: 100,
    initialValueSecond: 500,
};

const firstContainer = document.querySelector( ".first-container" );
const secondContainer = document.querySelector( ".second-container" );

ReactDOM.render( <RangeSlider { ...firstObject } />, firstContainer );
ReactDOM.render( <RangeSlider { ...secondObject } />, secondContainer );
