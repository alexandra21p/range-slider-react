/* eslint react/prop-types: off, react/no-did-mount-set-state: off */
import React from "react";
import SliderHandle from "./SliderHandle";
import { getClosestSlider, setCurrentHandleValues } from "../utilities/utils";

export default class RangeSlider extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            firstHandleOffset: 0,
            secondHandleOffset: 0,
            progressBarWidth: 0,
            progressBarOffset: 0,
            firstHandleValue: this.props.initialValueFirst,
            secondHandleValue: this.props.initialValueSecond,
        };

        this.canMove = false;
        this.setInitialCoordinates = this.setInitialCoordinates.bind( this );
        this.moveSlider = this.moveSlider.bind( this );
        this.handleMouseUp = this.handleMouseUp.bind( this );
    }

    componentDidMount() {
        const parentContainer = document.querySelector( `.${ this.props.parentClass }` );
        const rangeContainer = parentContainer.querySelector( ".range-container" );
        const parentProperties = rangeContainer.getBoundingClientRect();
        const parentWidth = parseInt( parentProperties.width, 10 );
        const parentLeftOffset = parentProperties.left;
        const { firstHandleOffset, secondHandleOffset } = this.computeLeftOffset( parentWidth );

        this.setState( {
            parentContainer,
            parentWidth,
            parentLeftOffset,
            firstHandleOffset,
            secondHandleOffset,
        }, this.renderProgressBar );

        this.addBodyEvents();
    }

    componentWillUnmount() {
        document.body.removeEventListener( "mousemove", this.moveSlider );
        document.body.removeEventListener( "mouseup", this.handleMouseUp );
    }

    setInitialCoordinates( evt ) {
        const { parentContainer } = this.state;
        const position = evt.clientX;
        const closest = getClosestSlider( position, parentContainer );

        this.updateValues( position, closest );
        this.canMove = true;
        evt.preventDefault();
    }

    updateValues( position, closest ) {
        const { parentLeftOffset, parentWidth } = this.state;
        const updatedOffset = Math.min( Math.max( position - parentLeftOffset, 0 ), parentWidth );
        const updatedSliderValue = this.changeCurrentValue( updatedOffset );

        const updatedState = setCurrentHandleValues( closest, updatedOffset, updatedSliderValue );
        this.setState(
            updatedState,
            this.renderProgressBar,
        );
    }

    moveSlider( evt ) {
        const {
            parentLeftOffset, parentWidth, closestSlider: closest,
        } = this.state;

        if ( !this.canMove ) {
            return;
        }

        const positionX = evt.clientX;
        const rightLimit = parentWidth + parentLeftOffset;
        const computedPosition = Math.min( Math.max( positionX, parentLeftOffset ), rightLimit );
        const updatedOffset = computedPosition - parentLeftOffset;
        const updatedSliderValue = this.changeCurrentValue( updatedOffset );

        const updatedState = setCurrentHandleValues( closest, updatedOffset, updatedSliderValue );
        this.setState(
            updatedState,
            this.renderProgressBar,
        );
    }

    handleMouseUp( ) {
        this.canMove = false;
    }

    changeCurrentValue( leftOffset ) {
        const unitPerPixel = this.props.maximum / parseInt( this.state.parentWidth, 10 );
        return Math.round( leftOffset * unitPerPixel );
    }

    computeLeftOffset( parentWidth ) {
        const { initialValueFirst, initialValueSecond, maximum } = this.props;
        const unitPerPixel = maximum / parseInt( parentWidth, 10 );

        return {
            firstHandleOffset: initialValueFirst / unitPerPixel,
            secondHandleOffset: initialValueSecond / unitPerPixel,
        };
    }

    addBodyEvents() {
        document.body.addEventListener( "mousemove", this.moveSlider );
        document.body.addEventListener( "mouseup", this.handleMouseUp );
    }

    renderProgressBar() {
        const { firstHandleOffset, secondHandleOffset } = this.state;
        const minimumOffsetValue = Math.min( firstHandleOffset, secondHandleOffset );
        const maximumOffsetValue = Math.max( firstHandleOffset, secondHandleOffset );

        this.setState( {
            progressBarWidth: maximumOffsetValue - minimumOffsetValue,
            progressBarOffset: minimumOffsetValue,
        } );
    }

    render() {
        const {
            firstHandleValue, secondHandleValue, firstHandleOffset,
            secondHandleOffset, progressBarWidth, progressBarOffset,
        } = this.state;
        const { minimum, maximum } = this.props;

        // const firstValue = firstHandleValue === undefined ? initialValueFirst : firstHandleValue;
        // const secondValue = secondHandleValue === undefined
        //     ? initialValueSecond : secondHandleValue;

        return (
            <div className="slider-container">
                <div className="range-value">
                    <h2>min</h2>
                    <span className="min-value">{ minimum }</span>
                </div>
                <div
                    className="range-container"
                    onMouseDown={ this.setInitialCoordinates }
                    role="button"
                    tabIndex="0"
                >
                    <SliderHandle
                        name="first"
                        left={ firstHandleOffset }
                        value={ firstHandleValue }
                    />

                    <SliderHandle
                        name="second"
                        left={ secondHandleOffset }
                        value={ secondHandleValue }
                    />
                    <div
                        className="progress-bar"
                        style={ {
                            width: `${ progressBarWidth }px`,
                            left: `${ progressBarOffset }px`,
                        } }
                    />
                </div>
                <div className="range-value">
                    <h2>max</h2>
                    <span className="max-value">{ maximum }</span>
                </div>
            </div>

        );
    }
}
