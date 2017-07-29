import React from 'react';

import Nav from './../../Components/Other/Nav';
import Attendees from './../../Components/Items/Attendees';

export default function Edit(props) {
  let id = props.match.params.id.slice(1);
  if (!props.event) {
    props.setEvent(id);
  }
  let edit;
  let formItems = [['title', 'Title'],
                   ['description', 'Description'],
                   ['date', 'Date'],
                   ['time', 'Time'],
                   ['capacity', 'Capacity']];
  if (props.event) {
    let attendeesNames = props.event.attendees.map(attendant => {
      let name = attendant.firstName + ' ' + attendant.lastName;
      return name;
    })
    edit = (
      <div className='items__detail'>
        <span className='form__container--edit'>
          <form className='form--edit' onSubmit={(evt) => {evt.preventDefault(); props.handleSubmit('update', evt)}} 
            onChange={(evt) => {props.handleChange('update', evt)}} noValidate >

            {props.renderForm(formItems, 'edit')}
            <label>Date <br/> </label>
            <input type='date' name='date' value={props.event.startsAt.split('T')[0]} />

            <label>Time <br/> </label>
            <input type='time' name='time' value={props.event.startsAt.split('T')[1].split('Z')[0]} />

            <label>Title <br/> </label>
            <input type='text' name='title' value={props.event.title} /> 

            <label>Description <br/> </label>
            <input type='text' name='description' value={props.event.description} />

            <label>Capacity <br/> </label>
            <input  type='number' name='capacity' value={props.event.capacity} />

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
          <span className='header__id'>Detail Event: {id}</span>
          <span className='header__delete'
              onClick={() => {props.handleSubmit('delete', id)}}><i className='fa fa-trash'></i>  &nbsp;   Delete Event</span>
        </div>
        {edit}
      </div>
  </div>
  )
}
