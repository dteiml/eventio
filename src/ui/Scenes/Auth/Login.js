import React from 'react'; //for component
import PropTypes from 'prop-types';

export const Login = (props) => {
  const formItems = [['email', 'Email'],
                   ['password', 'Password']];
  const form = props.renderForm(formItems, 'auth');

  return (
    <div className='auth__main'> {/* for background */}
      <div className='header__nav--signup'>
        <p className='header__logo'>E.</p>
        <p className='auth__nav-text--bg'>Don&#39;t have an account? <span onClick={() => 
          {props.navigate('signup')}} className='auth__nav-link'>Sign up</span></p>
      </div>

      <div className='auth__container'>

        <h1>Sign in to Eventio.</h1>

        {props.err.login ? <div className='body__error'> {props.err.login} </div> : <p>Enter your details below.</p>}

        <form onSubmit={(evt) => {evt.preventDefault(); props.handleSubmit('login', evt)}} 
          onChange={(evt) => {props.handleChange('auth', evt)}} className='auth__form' noValidate>

          {form[0]}

          {form[1][0]}
          <span className='auth__passSpan'>
          {form[1][1]}
          <span className='auth__showPass'><i className='fa fa-eye' onClick={props.handleShowPassword}></i></span></span>  <br/>

          <p className='auth__nav-text'>Don&#39;t have an account? <span className='auth__nav-link' onClick={() => {props.navigate('signup')}}> Sign up</span></p>
          <button className='btn -green'>Sign in</button>

        </form>

      </div>
    </div>
  );
}

Login.propTypes = {
  renderForm: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleShowPassword: PropTypes.func.isRequired,
  err: PropTypes.object.isRequired
}
