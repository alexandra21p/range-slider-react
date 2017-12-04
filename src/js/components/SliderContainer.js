/* eslint react/prop-types: off */
import React from "react";
import RangeSlider from "./RangeSlider";

export default function SliderContainer( props ) {
    const {
        containerName, width, minimum, maximum, initialValueFirst, initialValueSecond,
    } = props;
    return (
        <div className={ containerName } style={ { width } }>
            <RangeSlider
                parentClass={ containerName }
                minimum={ minimum }
                maximum={ maximum }
                initialValueFirst={ initialValueFirst }
                initialValueSecond={ initialValueSecond }

            />
        </div>
    );
}
