import React from 'react';
import PropTypes from 'prop-types';

import {Nav} from './../../Components/Other/Nav';
import {Attendees} from './../../Components/Items/Attendees';
import MySpinner from '../../Components/Other/MySpinner';

export class Edit extends React.Component {
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
    const formItems = [['title', 'Title'],
                 ['description', 'Description'],
                 ['date', 'Date'],
                 ['time', 'Time'],
                 ['capacity', 'Capacity']];
    let edit;
    if (!event || props.loading) {
      edit = <MySpinner/>
    }
    else if (event) {
      const attendeesNames = event.attendees.map(attendee => {
        const name = attendee.firstName + ' ' + attendee.lastName;
        return name;
      })
      edit = (
        <div className='items__detail'>
          <span className='form__container--edit'>
            <form className='form--edit' onSubmit={(evt) => {evt.preventDefault(); props.handleSubmit('update', evt)}} 
              onChange={(evt) => {props.handleChange('update', evt)}} noValidate >

              {props.renderForm(formItems, 'edit')}

              <button type='submit' className='btn--submit'><img alt='' src='/check.png' height='20px'/></button>

            </form>
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
          <span className='header__id'>Detail Event: {this.id}</span>
          <span className='header__delete'
              onClick={() => {props.handleSubmit('delete', this.id)}}><i className='fa fa-trash'></i>  &nbsp;   Delete Event</span>
        </div>
        {edit}
      </div>
    </div>
    )
  }
}

Edit.propTypes = {
  event: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  fetchEvent: PropTypes.func.isRequired,
  renderForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired
}
