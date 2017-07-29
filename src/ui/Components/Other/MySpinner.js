import React from 'react';

import Spinner from 'react-spin';

export default function MySpinner(props) {
  const options = {
    lines: 8, // The number of lines to draw
    length: 10, // The length of each line
    width: 2, // The line thickness
    radius: 16, // The radius of the inner circle
    corners: 0.7, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#949ea8', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
  };
  return (
    <div className='body__spinner'>
      <Spinner config={options}/>
    </div>
  )
}
