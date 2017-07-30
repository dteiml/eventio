import React from 'react';
import PropTypes from 'prop-types';

import {Item} from './Item';

export const Items = (props) => {
  // eslint-disable-next-line
  const items = props.events.map((event) => { 

    const currentDate = new Date();
    const dateString = event.startsAt.split('T')[0];
    const eventDate = new Date(dateString);

    //for user experience, if eventDate === currentDate, the event will display in both past and future events

    if(
      (+eventDate <= +currentDate && props.filter === 'past') ||
    (+eventDate >= +currentDate && props.filter === 'future') ||
    (props.filter === 'all')) {

      if(props.display === 'grid') {
        return (
          <div className='item__cont--grid' key={event.id.toString()}
          onClick={() => props.handleBtnClick('detail', event)}>
            <Item
              type='grid'
              event={event}
              user={props.user}
              handleBtnClick={props.handleBtnClick}/>
          </div>
        )
      } else if(props.display === 'list') {
        return (
          <div className='item__cont--list' key={event.id.toString()}
          onClick={() => props.handleBtnClick('detail', event)}>
            <Item
              type='list'
              event={event}
              user={props.user}
              handleBtnClick={props.handleBtnClick}/>
          </div>
        )
      }
    }
  });
  return (
    <div className={props.display === 'grid' ? 'items--grid' : 'items--list' }>
    {items}
    </div>
  )
}

Items.propTypes = {
  events: PropTypes.array.isRequired,
  filter: PropTypes.string.isRequired,
  display: PropTypes.string.isRequired
}
