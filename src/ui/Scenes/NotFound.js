import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

export const NotFound = (props) => {
  return (
    <div className='auth__main'>
      <div className='header__nav--signup'>
        <p className='header__logo'>E.</p>
        <p className='auth__nav-text--bg'>Don&#39;t have an account? <span onClick={() => 
          {props.navigate('signup')}} className='auth__nav-link'>Sign up</span></p>
      </div>

      <div className='auth__container'>

        <h1>404 Error - page not found</h1>
        <h3>Seems like Darth Vader just hit our website and dropped it down.<br />
        Please press the refresh button and everything should be fine.</h3>
          <Link to='/'><button className='btn -black'>Refresh</button></Link>
      </div>

    </div>
  )
}

NotFound.propTypes = {
  navigate: PropTypes.func.isRequired,
}
