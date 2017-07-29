import React from 'react';
import PropTypes from 'prop-types';

export const Attendees = (props) => {
  const attendees = props.attendeesNames.map((attendee, index) => {
    return <span key={index} className='attendeeName'>{attendee}</span>
  });
  return (
    <div className='item__attendees'>
      <h1>Attendees</h1>
      <p>{attendees}</p>
    </div>
  )
}

Attendees.propTypes = {
	attendeesNames: PropTypes.array.isRequired
}
