import React from 'react';
import PropTypes from 'prop-types';

import {Nav} from './../../Components/Other/Nav';
import {Item} from './../../Components/Items/Item';
import {Attendees} from './../../Components/Items/Attendees';
import MySpinner from '../../Components/Other/MySpinner';

export class Detail extends React.Component {
  componentDidMount() {
    const {props} = this;
    const id = props.match.params.id.slice(1);
    this.id = id;
    //if we don't have an event loaded in state OR it's not the right one:
    if (!props.event || props.event.id !== id) {
      //set the right event to state
      props.fetchEvent(id);
    }
  }
  render() {
    const {props} = this;
    const {event} = props;
    let detail;
    if (!event || props.loading) {
      detail = <MySpinner/>
    }
    else if (event) {
      let attendeesNames = event.attendees.map(attendee => {
        let name = attendee.firstName + ' ' + attendee.lastName;
        return name;
      })
      detail = (
        <div className='items__detail'>
          <span className='item__cont--wide'>
            <Item
            type='wide'
            event={event}
            user={props.user}
            key={event.id}
            handleBtnClick={props.handleBtnClick}/>
          </span>
          <span className='item__cont--attendees'>
            <Attendees attendeesNames={attendeesNames}/>
          </span>
        </div>
      )
    } 
    return (
      <div className='body__main'>
        <Nav user={props.user} onLogout={props.onLogout} match={props.match} history={props.history}/>
        <div className='body__section'>
          <div className='header'>
            <span className='header__id'>Detail Event : {this.id}</span>
          </div>
          {detail}
        </div>
      </div>
    )
  }
}

Detail.propTypes = {
  event: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleBtnClick: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
}

