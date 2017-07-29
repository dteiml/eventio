import React from 'react'; //for component
import PropTypes from 'prop-types';

export const Signup = (props) => {
  const formItems = [['firstName', 'First name'],
                   ['lastName', 'Last name'],
                   ['email', 'Email'],
                   ['password', 'Password'],
                   ['repeatPassword', 'Repeat password']];
  return (
    <div className='auth__main'>
      <div className='header__nav--signup'>
        <p className='header__logo'>E.</p>
        <p className='auth__nav-text--bg'>Already have an account? <span className='auth__nav-link' onClick={() => {props.navigate('')}} >Sign in</span></p>
      </div>

      <div className='auth__container'>

        <h1>Get started absolutely free.</h1>

        <p>Enter your details below.</p>

        <form onSubmit={(evt) => {evt.preventDefault(); props.handleSubmit('signup', evt)}} className='auth__form' 
          onChange={(evt) => {props.handleChange('auth', evt)}}  noValidate>

          {props.renderForm(formItems, 'auth')}
          <br/>

          <p className='auth__nav-text'>Already have an account? <span className='auth__nav-link' onClick={() => {props.navigate('')}} >Sign in</span></p>
          <button className='btn -green'>Sign up</button>

        </form>
      </div>

    </div>
  );
}

Signup.propTypes = {
  renderForm: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired
}
