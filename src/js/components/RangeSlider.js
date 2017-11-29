/* eslint react/prop-types: off, react/no-unused-state: off, react/no-did-mount-set-state: off */
import React from "react";
import SliderHandle from "./SliderHandle";

export default class RangeSlider extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            canMove: false,
        };

        this.setInitialCoordinates = this.setInitialCoordinates.bind( this );
        this.moveSlider = this.moveSlider.bind( this );
        this.handleMouseUp = this.handleMouseUp.bind( this );
    }

    componentDidMount() {
        const rangeContainer = document.querySelector( ".range-container" );
        const parentProperties = rangeContainer.getBoundingClientRect();
        const parentWidth = parseInt( parentProperties.width, 10 );
        const parentLeftOffset = parentProperties.left;
        const { firstHandleOffset, secondHandleOffset } = this.computeLeftOffset( parentWidth );
        // const secondSliderOffset = this.computeLeftOffset( parentWidth );

        this.setState( {
            parentWidth,
            parentLeftOffset,
            firstHandleOffset,
            secondHandleOffset,
        } );
    }

    componentWillUnmount() {
        document.body.removeEventListener( "mousemove", this.moveSlider );
        document.body.removeEventListener( "mouseup", this.handleMouseUp );
    }

    setInitialCoordinates( evt ) {
        const { parentLeftOffset, parentWidth } = this.state;
        const position = evt.clientX;
        const updatedOffset = Math.min( Math.max( position - parentLeftOffset, 0 ), parentWidth );
        const updatedSliderValue = this.changeCurrentValue( updatedOffset );

        this.setState( {
            canMove: true,
            sliderOffset: updatedOffset,
            currentValue: updatedSliderValue,
        } );

        this.addBodyEvents();
        evt.preventDefault();
    }

    moveSlider( evt ) {
        const { canMove, parentLeftOffset, parentWidth } = this.state;
        if ( !canMove ) {
            return;
        }

        const positionX = evt.clientX;
        const rightLimit = parentWidth + parentLeftOffset;
        const computedPosition = Math.min( Math.max( positionX, parentLeftOffset ), rightLimit );
        const updatedOffset = computedPosition - parentLeftOffset;
        const updatedSliderValue = this.changeCurrentValue( updatedOffset );

        this.setState( {
            sliderOffset: updatedOffset,
            currentValue: updatedSliderValue,
        } );

        // this.renderProgressBar();
        // evt.preventDefault();
        // evt.stopPropagation();
    }

    handleMouseUp( ) {
        this.setState( {
            canMove: false,
        } );

        // evt.preventDefault();
        // evt.stopPropagation();
    }

    changeCurrentValue( leftOffset ) {
        const unitPerPixel = this.props.maximum / parseInt( this.state.parentWidth, 10 );
        return Math.round( leftOffset * unitPerPixel );
    }

    computeLeftOffset( parentWidth ) {
        const unitPerPixel = this.props.maximum / parseInt( parentWidth, 10 );
        const firstHandleValue = !this.state.currentValueFirst ? this.props.initialValueFirst : this.state.currentValueFirst;
        const secondHandleValue = !this.state.currentValueSecond ? this.props.initialValueSecond : this.state.currentValueSecond;

        return {
            firstHandleOffset: firstHandleValue / unitPerPixel,
            secondHandleOffset: secondHandleValue / unitPerPixel,
        };
    }

    addBodyEvents() {
        document.body.addEventListener( "mousemove", this.moveSlider );
        document.body.addEventListener( "mouseup", this.handleMouseUp );
    }

    render() {
        const { currentValue } = this.state;
        const value = currentValue === undefined ? this.props.initialValue : currentValue;

        return (
            <div className="slider-container">
                <div className="range-value">
                    <h2>min</h2>
                    <span className="min-value">{this.props.minimum}</span>
                </div>
                <div
                    className="range-container"
                    onMouseDown={ this.setInitialCoordinates }
                    role="button"
                    tabIndex="0"
                >
                    <SliderHandle
                        name="first"
                        left={ this.state.firstHandleOffset }
                        value={ value }
                    />

                    <SliderHandle
                        name="second"
                        left={ this.state.secondHandleOffset }
                        value={ value }
                    />
                    <div className="progress-bar">
                        <span />
                    </div>
                </div>
                <div className="range-value">
                    <h2>max</h2>
                    <span className="max-value">{this.props.maximum}</span>
                </div>
            </div>

        );
    }
}
