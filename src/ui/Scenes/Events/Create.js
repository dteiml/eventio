import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';
import MySpinner from '../../Components/Other/MySpinner'

export class Create extends React.Component {
  componentDidMount() {
    if (this.props.event) {
      this.props.fetchEvent('create');
    }
  }
  render() {
    const formItems = [['title', 'Title'],
                     ['description', 'Description'],
                     ['date', 'Date'],
                     ['time', 'Time'],
                     ['capacity', 'Capacity']];
    const {props} = this;
    let create;
    if (props.loading) {
      create = <MySpinner/>
    }
    else {
      create = (
        <div className='form__container--create'>
          <br/><h1>Create new event</h1>
          <p>Enter details below.</p><br/>
          <form className='form--create' onSubmit={(evt) => {evt.preventDefault(); props.handleSubmit('create', evt);}} 
            onChange={(evt) => {props.handleChange('update', evt)}} noValidate>

            {props.renderForm(formItems, 'create')}

            <button type='submit' className='btn -green'>Create new event</button>

          </form>
        </div>
        )
    }
    return (
    <div className='body__main'>
      <div className='header__nav'>
        <Link className='header__logo' to='/home'>E.</Link>
        <span onClick={() => props.history.goBack()} className='header__close'><img alt='' src='/x.png' height='12px'/><span className='header__close-text'> &nbsp;  Close</span></span>
      </div>
      {create}
    </div>
    )
  }
};

Create.propTypes = {
  renderForm: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired
}

