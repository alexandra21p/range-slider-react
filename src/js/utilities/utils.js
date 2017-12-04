export function getClosestSlider( position, parentContainer ) {
    const firstSlider = parentContainer.querySelector( ".draggable.first" );
    const secondSlider = parentContainer.querySelector( ".draggable.second" );

    const firstSliderOffset = parseInt( firstSlider.getBoundingClientRect().left, 10 );
    const secondSliderOffset = parseInt( secondSlider.getBoundingClientRect().left, 10 );

    const firstDistance = Math.abs( position - firstSliderOffset );
    const secondDistance = Math.abs( position - secondSliderOffset );
    const closestSlider = firstDistance < secondDistance ? firstSlider : secondSlider;

    return closestSlider;
}

export function setCurrentHandleValues( closest, updatedOffset, updatedSliderValue ) {
    if ( closest.className.includes( "first" ) ) {
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
