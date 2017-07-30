import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'; //for linking to edit component
import { myAlert } from '../../../util/confirm';


export const Item = (props) => {
  const {event} = props;
  const attendeesIds = event.attendees.map(attendant => attendant.id)
  const leave = attendeesIds.indexOf(props.user.id) >= 0;

  const dateTimeArray =  event.startsAt.split('T');
  const dateArray = dateTimeArray[0].split('-');
  const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);

  let future = true;
  const currentDate = new Date();
  if (date < currentDate) {
    future = false;
  }

  const full = event.attendees.length >= event.capacity ? true : false;
  let btn;

  if (props.user && event.owner.id === props.user.id && props.type !== 'wide') {
    const url = '/edit:' + event.id;
    btn = (
      <Link to={url} onClick={(evt) => {evt.stopPropagation();}}>
      <button className='btn--edit'>Edit</button></Link>
    )} 
  else if (future && leave) {
    btn = <button className='btn--leave' onClick={(evt) => {evt.stopPropagation(); props.handleBtnClick('leave', event)}}>Leave</button>
  }
  else if (!future && leave) {
    btn = <button className='btn--disabled' onClick={(evt) => {evt.stopPropagation(); myAlert('Cannot leave event as it has already happened!')}}>Leave</button>
  }
  else if (future && !leave && full) {
    btn = <button className='btn--disabled' onClick={(evt) => {evt.stopPropagation(); myAlert('Cannot join event as it is at full capacity :(.')}}>Join</button>;
  }
  else if (future && !leave && !full) {
    btn = <button className='btn--join' onClick={(evt) => {evt.stopPropagation(); props.handleBtnClick('join', event)}}>Join</button>
  }
  else if (!future && !leave) {
    btn = <button className='btn--disabled' onClick={(evt) => {evt.stopPropagation(); myAlert('Cannot join event as it has already happened!')}}>Join</button>
  }

  const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const time24 = dateTimeArray[1].substr(0,5);

  let hour = time24.split(':')[0];
  let am = 'AM';
  if (hour > 12) {
    hour -= 12;
    am = 'PM';
  }

  const time = hour + ':' + time24.split(':')[1] + ' ' + am;

  const dateString = month + ' ' + day + ', ' + year + ' - ' + time;
  if (props.type === 'grid' || props.type === 'wide') {
    return (
      <div className={props.type === 'grid' ? 'item--grid' : 'item--wide'}>
        <div className='item__date'>{dateString}</div>
        <div className='item__title'>{event.title}</div>
        <div className='item__owner'>{event.owner.firstName + ' ' + event.owner.lastName}</div>
        <div className='item__description'>{event.description}</div>
        <div className='item__footer'>
          <span className='item__capacity'><img alt='' src='/user-icon.png' className='item__icon' height='25px'/>{event.attendees.length} of {event.capacity}</span>
          <span className='item__btn--list'> {btn} </span>
        </div>
      </div>
    )
  }
  else if (props.type === 'list') {
    return (
      <div className='item--list'>
        <span className='item__title'>{event.title}</span>
        <span className='item__description'>{event.description}</span>
        <span className='item__owner'>{event.owner.firstName + ' ' + event.owner.lastName}</span>
        <span className='item__footer'>
          <span className='item__dateAndCapacity'>
            <span className='item__date'>{dateString}</span>
            <span className='item__dapacity'><img alt='' src='/user-icon.png' className='item__icon' height='25px'/>{event.attendees.length} of {event.capacity}</span>
          </span>
          <span className='item__btn--list'>{btn}</span>
        </span>
      </div>
    )
  }
}

Item.propTypes = {
  event: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
}
