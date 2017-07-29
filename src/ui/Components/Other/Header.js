import React from 'react';
import PropTypes from 'prop-types';


const Display = (props) => {
  return (
    <span>
      <span className='header__display' onClick={() => props.handleBtnClick('grid')}> { props.display === 'grid' ? <img alt='' src='/grid-black.png' height='12px'/> : <img alt='' src='/grid-grey.png' height='12px'/>} </span>
      <span className='header__display' onClick={() => props.handleBtnClick('list')}> { props.display === 'list' ? <img alt='' src='/list-black.png' height='12px'/> : <img alt='' src='/list-grey.png' height='12px'/>}</span>
    </span>
  )
}

Display.propTypes = {
  display: PropTypes.string.isRequired
}

export const Header = (props) => {
  if (props.pathname === 'home') {
    return (
      <div className='header'>
        <span>
            <span className='header__filter--bg'>
              <button style={ props.filter === 'all' ? {color: 'black'} : {color: '#cccccc'}}
                value='all' className='btn btn--filter' onClick={props.handleBtnClick}>All events</button>
              <button style={ props.filter === 'future' ? {color: 'black'} : {color: '#cccccc'}}
                value='future' className='btn btn--filter' onClick={props.handleBtnClick}>Future events</button>
              <button style={ props.filter === 'past' ? {color: 'black'} : {color: '#cccccc'}}
                value='past' className='btn btn--filter' onClick={props.handleBtnClick}>Past events</button>
            </span>
            <span className='header__filter'>Show:
              <form style={{display: 'inline', marginLeft: '10px'}}>
                <select onChange={props.handleBtnClick}>
                  <option style={{color: 'black'}} value='all'>All events</option>
                  <option style={{color: 'black'}} value='future'>Future events</option>
                  <option style={{color: 'black'}} value='past'>Past events</option>
                </select>
              </form>
            </span>
        </span>
        <Display display={props.display}
        handleBtnClick={props.handleBtnClick}/>
      </div>
    )
  }
  else if (props.pathname === 'profile') {
    return (
      <div>
        <div className='header__profile'>
          <span className='header__profile-circle'>{props.user && props.user.firstName.charAt(0) + ' ' + props.user.lastName.charAt(0)} </span>
          <span className='header__profile-footer'>
            <span className='header__profile-name'>{props.user && props.user.firstName + ' ' + props.user.lastName}</span>
            <span className='header__profile-email'>{props.user && props.user.email}</span>
          </span>
        </div>
        <div className='header'>
          <span>
            <h1>My events</h1>
          </span>
          <Display display={props.display}
          handleBtnClick={props.handleBtnClick}/>
        </div>
    </div>
    )
  }
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
  display: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired
}
