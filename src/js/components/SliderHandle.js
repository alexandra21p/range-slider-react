/* eslint react/prop-types: off */
import React from "react";

export default class SliderHandle extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {};
    }

    render() {
        return (
            <div
                className={ `draggable ${ this.props.name }` }
                style={ { left: `${ this.props.left }px` } }
            >
                <div className="slider-value">
                    { this.props.value }
                </div>
                <div className="slider-handle" />
            </div>
        );
    }
}
