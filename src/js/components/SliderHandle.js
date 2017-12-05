/* eslint react/prop-types: off */
import React from "react";

export default class SliderHandle extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {};
    }

    render() {
        const { name, left, value } = this.props;

        return (
            <div
                className={ `draggable ${ name }` }
                style={ { left: `${ left }px` } }
            >
                <div className="slider-value">
                    { value }
                </div>
                <div className="slider-handle" />
            </div>
        );
    }
}
