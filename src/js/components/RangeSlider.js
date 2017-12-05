/* eslint react/prop-types: off, react/no-did-mount-set-state: off */
import React from "react";
import SliderHandle from "./SliderHandle";

export default class RangeSlider extends React.Component {
    constructor( props ) {
        super( props );

        const { initialValueFirst, initialValueSecond } = this.props;

        this.state = {
            firstHandleOffset: 0,
            secondHandleOffset: 0,
            progressBarWidth: 0,
            progressBarOffset: 0,
            firstHandleValue: initialValueFirst,
            secondHandleValue: initialValueSecond,
            parentWidth: 0,
            parentLeftOffset: 0,
        };

        this.canMove = false;
        this.handleMouseDown = this.handleMouseDown.bind( this );
        this.handleMouseMove = this.handleMouseMove.bind( this );
        this.handleMouseUp = this.handleMouseUp.bind( this );
    }

    componentDidMount() {
        const parentProperties = this.rangeContainer.getBoundingClientRect();
        const parentWidth = parseInt( parentProperties.width, 10 );
        const parentLeftOffset = parentProperties.left;
        const { firstHandleOffset, secondHandleOffset } = this.computeLeftOffset( parentWidth );

        this.setState( {
            parentWidth,
            parentLeftOffset,
            firstHandleOffset,
            secondHandleOffset,
        }, this.renderProgressBar );

        this.addBodyEvents();
    }

    componentWillUnmount() {
        document.body.removeEventListener( "mousemove", this.handleMouseMove );
        document.body.removeEventListener( "mouseup", this.handleMouseUp );
    }

    getClosestSlider( position ) {
        const { left: firstHandleOffset } = this.firstHandle.props;
        const { left: secondHandleOffset } = this.secondHandle.props;
        const { parentLeftOffset } = this.state;

        const firstDistance = Math.abs( position - parentLeftOffset - firstHandleOffset );
        const secondDistance = Math.abs( position - parentLeftOffset - secondHandleOffset );
        const closestSlider = firstDistance < secondDistance ? this.firstHandle : this.secondHandle;

        return closestSlider;
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

    handleMouseDown( evt ) {
        const position = evt.clientX;
        const closest = this.getClosestSlider( position );

        this.updateValues( position, closest );
        this.canMove = true;
        evt.preventDefault();
    }

    handleMouseMove( evt ) {
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

    addBodyEvents() {
        document.body.addEventListener( "mousemove", this.handleMouseMove );
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
        const { minimum, maximum, width } = this.props;

        return (
            <div className="slider-container" style={ { width } }>
                <div className="range-value">
                    <h2>min</h2>
                    <span className="min-value">{ minimum }</span>
                </div>
                <div
                    ref={ ( parent ) => { this.rangeContainer = parent; } }
                    className="range-container"
                    onMouseDown={ this.handleMouseDown }
                    role="button"
                    tabIndex="0"
                >
                    <SliderHandle
                        ref={ ( handle ) => { this.firstHandle = handle; } }
                        name="first"
                        left={ firstHandleOffset }
                        value={ firstHandleValue }
                    />

                    <SliderHandle
                        ref={ ( handle ) => { this.secondHandle = handle; } }
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

function setCurrentHandleValues( closest, updatedOffset, updatedSliderValue ) {
    const { name } = closest.props;
    if ( name === "first" ) {
        return {
            firstHandleOffset: updatedOffset,
            firstHandleValue: updatedSliderValue,
            closestSlider: closest,
        };
    }
    return {
        secondHandleOffset: updatedOffset,
        secondHandleValue: updatedSliderValue,
        closestSlider: closest,
    };
}
