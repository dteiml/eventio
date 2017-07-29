import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

export const Nav = (props) => {
    let text;
    if(props.match.path === '/detail:id') {
      text = (
        <span onClick={() => {props.history.goBack()}} className='header__back'><img alt='' src='/arrow.png' height='12px'/>  &nbsp; Back to events</span>
      )
    }
    return (
      <div className='header__nav'>
        <Link className='header__logo' to='/home'>E.</Link>
        {text}
        <span>
          <span className='header__circle'>{props.user && props.user.firstName.charAt(0)} {props.user && props.user.lastName.charAt(0)}</span>
          <span className='dropdown'>
            <button className='dropbtn'>
              <span className='navName'>{props.user && props.user.firstName} {props.user && props.user.lastName} </span>  &nbsp; <i className='fa fa-caret-down dropdown__caret'></i>
            </button>
            <div className='dropdown-content'>
              <Link to='/profile'>My profile</Link>
              <Link to='/' onClick={props.onLogout}>Logout</Link>
            </div>
          </span>
        </span>
    </div>
    )
}

Nav.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired
}
