import React from "react";
import RangeSlider from "./RangeSlider";

export default class SliderContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            minimum: 0,
            maximum: 1000,
            initialValueFirst: 100,
            initialValueSecond: 500,
            width: 700,
        };
    }

    render() {
        return (
            <div className="custom-container" style={ { width: this.state.width } }>
                <RangeSlider
                    minimum={ this.state.minimum }
                    maximum={ this.state.maximum }
                    initialValueFirst={ this.state.initialValueFirst }
                    initialValueSecond={ this.state.initialValueSecond }

                />
            </div>
        );
    }
}
