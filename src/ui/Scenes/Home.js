import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; //for Create event button

import {Nav} from '../Components/Other/Nav';
import {Header} from '../Components/Other/Header'
import {Items} from '../Components/Items/Items';
import MySpinner from '../Components/Other/MySpinner';

export class Home extends React.Component {
  componentDidMount() {
    const {props} = this;
    if (!props.events) {
      props.fetchEvents();
    }
  }
  render() {
    const {props} = this;
    let home, link;
    if (!props.events || props.loading) {
    home = <MySpinner/>
    } else if (props.events) {
    home =  <Items events={props.events}
              filter={props.filter}
              user={props.user}
              handleBtnClick={props.handleBtnClick}
              display={props.display}/>
    }
    if (props.pathname === 'home') {
      link = <Link to='/create'><button className='btn--add'>+</button></Link>
    }
    return (
      <div className='body__main'>
        <Nav user={props.user} onLogout={props.onLogout} match={props.match} history={props.history}/>

        <div className='body__section'>
          <Header pathname={props.pathname}
            filter={props.filter}
            handleBtnClick={props.handleBtnClick}
            display={props.display}
            user={props.user}/>

          {home}
        </div>

        {link}
      </div>
    )
  }
};

Home.propTypes = {
  events: PropTypes.array,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired,
  display: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  fetchEvents: PropTypes.func.isRequired,
  handleBtnClick: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
}