export function getClosestSlider( position ) {
    const firstSlider = document.querySelector( ".draggable.first" );
    const secondSlider = document.querySelector( ".draggable.second" );

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
        };
    }
    return {
        secondHandleOffset: updatedOffset,
        secondHandleValue: updatedSliderValue,
    };
}
