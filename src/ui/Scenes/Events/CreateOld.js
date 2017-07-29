import React from 'react';
import {Link} from 'react-router-dom';

export default function Create(props) {
  return (
    <div className='body__main'>
      <div className='header__nav'>
        <Link className='header__logo' to='/home'>E.</Link>
        <span onClick={() => props.history.goBack()} className='header__close'><img alt='' alt='' src='/x.png' height='12px'/><span className='header__close-text'> &nbsp;  Close</span></span>
      </div>
      <div className='form__container--create'>
        <br/><h1>Create new event</h1>
        <p>Enter details below.</p><br/>
        <form onSubmit={(evt) => {evt.preventDefault(); props.handleSubmit('create', evt);}} className='form--create' noValidate>

          <input type='text' name='title' placeholder='Title'
          style={props.err.title ? {borderBottomColor: 'red'} : null}/>
          <div className='body__error'>{props.err.title}</div>

          <input type='text' name='description' placeholder='Description'
          style={props.err.description ? {borderBottomColor: 'red'} : null}/>
          <div className='body__error'>{props.err.description}</div>

          <input type='date' name='date' placeholder='Date'
          style={props.err.date ? {borderBottomColor: 'red'} : null}/>
          <div className='body__error'>{props.err.date}</div>

          <input type='time' name='time' placeholder='Time' 
          style={props.err.time ? {borderBottomColor: 'red'} : null}/>
          <div className='body__error'>{props.err.time}</div>

          <input type='number' name='capacity' placeholder='Capacity'
          style={props.err.capacity ? {borderBottomColor: 'red'} : null}/>
          <div className='body__error'>{props.err.capacity}</div>

          <button type='submit' className='btn -green'>Create new event</button>
      </form>
      </div>
    </div>
  )
};
