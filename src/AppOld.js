import React from 'react';
import { Route, Switch } from 'react-router-dom';


import { confirm } from './util/confirm';
import {Edit} from './ui/Scenes/Events/Edit';
import {Login} from './ui/Scenes/Auth/Login';
import {Signup} from './ui/Scenes/Auth/Signup';
import {Home} from './ui/Scenes/Home';
import {NotFound} from './ui/Scenes/NotFound';
import {Create} from './ui/Scenes/Events/Create';
import {Detail} from './ui/Scenes/Events/Detail';
import {Profile} from './ui/Scenes/Profile';

import * as constants from './constants';
import axios from 'axios';

const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const minPasswordLength = 4;
const passwordFormat = /[0-9!@#$%^&*]/; //at least 1 number or special character
const unauthenticatedPages = ['/', '/signup'];
const authenticatedPages = ['/home', '/detail', '/profile', '/edit', '/create'];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    let user;
    if(localStorage.getItem('user')) {
      user = JSON.parse(localStorage.getItem('user'));
    }
    const isAuthenticated = !!user;
    this.onAuthChange(isAuthenticated);
    this.state = {
      loading: true,
      display: 'grid',
      filter: 'all',
      user,
      err: {},
      formControl: {firstName: '', lastName: '', email: '', password: '', repeatPassword: ''},
      showPass: false
    }

    this.refreshToken = this.refreshToken.bind(this);
    this.onEnterPublicPage = this.onEnterPublicPage.bind(this);
    this.storeEvents = this.storeEvents.bind(this);
    this.login = this.login.bind(this);
    this.modifyAttendees = this.modifyAttendees.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
    this.setEvent = this.setEvent.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowPassword = this.handleShowPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.navigate = this.navigate.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
    this.userEvents = this.userEvents.bind(this);
  }
  login(user) {
    this.setState({user})
    localStorage.setItem('user', JSON.stringify(user));
  }
  onEnterPublicPage() {
    if (this.state.user) {
      this.props.history.replace('/home');
    }
  }
  onEnterPrivatePage() {
    if (!this.state.user) {
      this.props.history.replace('/');
    }
  }
  onAuthChange(isAuthenticated) {
    const pathname = this.props.location.pathname;
    const pathnameWithoutId = pathname.split(':')[0];
    const isUnauthenticatedPage = unauthenticatedPages.indexOf(pathnameWithoutId) >= 0;
    const isAuthenticatedPage = authenticatedPages.indexOf(pathnameWithoutId) >= 0;
    if (isUnauthenticatedPage && isAuthenticated) {
      this.props.history.replace('/home');
    } else if (isAuthenticatedPage && !isAuthenticated) {
      this.props.history.replace('/');
    }
  }
  onLogout() {
    localStorage.removeItem('user');
    this.props.history.push('/');
  }
  refreshToken() {
    localStorage.removeItem('user');
    this.props.history.push('/');
    alert('Your token has expired. Please login again.');
  }
  fetchEvents() {
    let fetchOps = {
      method: 'GET',
      url: constants.API_URL + '/events',
      headers: {
        'Content-Type': 'application/json',
        'APIKey': constants.API_KEY
      },
      json: true
    }

    axios(fetchOps)
      .then(res => {
        this.storeEvents(res.data);
        this.setState({loading: false});
      })
  }
  handleBtnClick(a, b) {
    //filter btn
    if (a.target && a.target.value) {
      let val = a.target.value;
      if (val === 'all' || 'past' || 'future') {
        this.setState({filter: a.target.value});
      }
    }
    //an event is passed
    else if (b) {
      let id = b.id; //event id
      let url;
      switch(a) {
        case 'join':
          let joinOps = {
            method: 'POST',
            url: constants.API_URL + '/events/' + id + '/attendees/me',
            headers: {
              'Content-Type': 'application/json',
              'APIKey': constants.API_KEY,
              'Authorization': this.state.user.authorization
            },
            json: true
          }

          this.setState({loading: true});

          axios(joinOps)
            .then(res => {
              this.modifyAttendees('join', id);
              this.setState({loading: false});
            })
            .catch(err => {
              if(err.response.data.error === 'Auth.InvalidToken') {
                this.refreshToken();
                this.setState({loading: false});
              }     
            });
          break;
        case 'leave':
          let leaveOps = {
            method: 'DELETE',
            url: constants.API_URL + '/events/' + id + '/attendees/me',
            headers: {
              'Content-Type': 'application/json',
              'APIKey': constants.API_KEY,
              'Authorization': this.state.user.authorization
            },
            json: true
          }

          axios(leaveOps)
            .then(res => {
              this.modifyAttendees('leave', id);
            })
            .catch(err => {
              if(err.response.data.error === 'Auth.InvalidToken') {
                this.refreshToken();
                }     
            });
          break;
        case 'detail':
          url = '/detail:' + id;
          this.props.history.push(url);
          break;
        default:
          console.log('No argument found');
      }
    }
    //display btn clicks pass only a string, so this case must a display btn:
    else {
      this.setState({display: a})
    }
  }
  storeEvents(events) {
    this.setState({
      events
    })
  }
  modifyAttendees(arg1, id) {
    switch(arg1) {
      case 'leave':
        if(this.state.events) {
          this.setState(prevState => {
            let event = prevState.events.filter(event => event.id === id)[0];
            let eventIndex = prevState.events.indexOf(event);
            let attendeeIndex = prevState.events[eventIndex].attendees.indexOf(this.state.user);
            return prevState.events[eventIndex].attendees.splice(attendeeIndex, 1);
          })
          break;
        } else {
          this.setState(prevState => {
            let attendeeIndex = prevState.event.attendees.indexOf(this.state.user);
            return prevState.event.attendees.splice(attendeeIndex, 1);
          })
        }
        break;
      case 'join':
        if(this.state.events) {
          this.setState(prevState => {
            let event = prevState.events.filter(event => event.id === id)[0];
            let eventIndex = prevState.events.indexOf(event);
            return prevState.events[eventIndex].attendees.push(this.state.user);
          })
        } else {
          this.setState(prevState => {
            return prevState.event.attendees.push(this.state.user);
          })
        }
        break;
      default:
        console.log('No arg found.');
        break;
    }
  }
  addEvent(event) {
    this.setState(prevState => {
      prevState.events.push(event);
      return prevState;
    })
  }
  removeEvent(id) {
    this.setState(prevState => {
        let events = prevState.events.filter(event => {
        if (event.id === id) {
          return false;
        }
        else {
          return true;
        }
      });
      prevState.events = events;
      return prevState;
    })
  }
  setEvent(id) {
    let event;
    if (this.state.events) {

      event = this.state.events.filter(event => event.id === id)[0];
      this.setState(prevState => {
        prevState.event = event;
        prevState.formControl.date = event.startsAt.split('T')[0];
        prevState.formControl.time = event.startsAt.split('T')[1].split('Z')[0];
        prevState.formControl.title = event.title;
        prevState.formControl.description = event.description;
        prevState.formControl.capacity = event.capacity;
        console.log('3', prevState);
        return prevState;
      });
    }
    else {
      let getOps = {
        method: 'GET',
        url: constants.API_URL + '/events/' + id,
        headers: {
          'Content-Type': 'application/json',
          'APIKey': constants.API_KEY
        },
        json: true
      }

      axios(getOps)
        .then(res => {
          event = res.data;
          this.setState(prevState => {
            prevState.event = event;
            prevState.formControl.date = event.startsAt.split('T')[0];
            prevState.formControl.time = event.startsAt.split('T')[1].split('Z')[0];
            prevState.formControl.title = event.title;
            prevState.formControl.description = event.description;
            prevState.formControl.capacity = event.capacity;
            console.log('4', prevState);
            return prevState;
          });
        });
    }
  }
  handleChange(type, evt) {
    let field = evt.target.name;
    let value = evt.target.value;
    switch(type) {
      case 'auth':
        this.setState(prevState => {
          prevState.formControl[field] = value;
          return prevState;
        })
        break;
      case 'update':
        this.setState(prevState => {
          prevState.formControl[field] = value;
          return prevState;
        })
        break;
      default:
        break;
    }
  }
  handleShowPassword() {
    this.setState({showPass: !this.state.showPass});
  }
  handleSubmit(arg, evt) {
    let id, title, description, date, time, capacity, email, password, data, err;
    let ops = {
      url: constants.API_URL,
      headers: {
        'Content-Type': 'application/json',
        'APIKey': constants.API_KEY
      },
      json: true
    }
    this.setState({err: {}});
    switch(arg) {
      case 'signup':

        err = false;

        let firstName = this.state.formControl.firstName.trim();
        let lastName = this.state.formControl.lastName.trim();
        email = this.state.formControl.email.trim();
        password = this.state.formControl.password;
        let repeatPassword = this.state.formControl.repeatPassword;

        if (!firstName) {
          err = true;
          this.setState(prevState => {
            prevState.err.firstName = 'First name has to be filled up.';
            return prevState;
          })
        }

        if (!lastName) {
          err = true;
          this.setState(prevState => {
            prevState.err.lastName = 'Last name has to be filled up.';
            return prevState;
          })
        }

        if ( ! emailFormat.test( email ) ) {
          err = true;
          this.setState(prevState => {
            prevState.err.email = 'Email must be a valid email.';
            return prevState;
          })
        }

        if (password.length < minPasswordLength || !passwordFormat.test(password)) {
          err = true;
          this.setState(prevState => {
            prevState.err.password = 'Password must be at least ' + minPasswordLength +
            ' characters long and include at least one number or special character.';
            return prevState;
          })
        }

        if (password !== repeatPassword) {
          err = true;
          this.setState(prevState => {
            prevState.err.password = "Passwords don't match.";
            prevState.err.repeatPassword = "Passwords don't match."
            return prevState;
          })
        }

        let data = {firstName, lastName, email, password};

        if (!err) {
          let registerOps = {
            method: 'POST',
            url: constants.API_URL + '/users',
            data,
            headers: {
              'Content-Type': 'application/json',
              'APIKey': constants.API_KEY
            },
            json: true
          }
          axios(registerOps)
            .then(response => {
              data = {email, password};
              let authOps = {
                method: 'POST',
                url: constants.API_URL + '/auth/native',
                data,
                headers: {
                  'Content-Type': 'application/json',
                  'APIKey': constants.API_KEY
                },
                json: true
              };
              axios(authOps)
                .then(res => {
                  let user = res.data;
                  user.authorization = res.headers.authorization;
                  this.props.login(user);
                  this.props.history.push('/home');
                })
            })
            .catch(() => {
              // If request is bad show an error to the user
              // dispatch(authenticationError('Incorrect email or password!'));
            });
          }
          break;
      case 'login':
          email = evt.target.email.value.trim();
          password = evt.target.password.value;
          data = {email, password};

          ops.method = 'POST';
          ops.url += '/auth/native';
          ops.data = data;

          axios(ops)
            .then(response => {
              let user = response.data;
              user.authorization = response.headers.authorization;
              this.login(user);
              this.props.history.push('/home');
            })
            .catch(() => {
              this.setState(prevState => {
                prevState.err.login = 'Oops! That email and password combination is not valid.'
                return prevState;
              })
            });
        break;
      case 'update':
        title = this.state.formControl.title;
        description = this.state.formControl.description;
        date = this.state.formControl.date;
        time = this.state.formControl.time;
        capacity = this.state.formControl.capacity;

        data = {title, description, startsAt: date + 'T' + time + 'Z', capacity}

        id = this.state.event.id;

        var updateOps = {
          method: 'PATCH',
          url: constants.API_URL + '/events/' + id,
          data,
          headers: {
            'Content-Type': 'application/json',
            'APIKey': constants.API_KEY,
            'Authorization': this.state.user.authorization
          },
          json: true
        }

        axios(updateOps)
          .then(res => {
            this.props.history.push('/home');
          })
          .catch(err => {
              if(err.response.data.error === 'Auth.InvalidToken') {
                this.refreshToken();
              }     
          });
        break;
      case 'delete':
          confirm('Are you sure you want to delete this event?', {
            okLabbel: 'Yes',
            cancelLabel: 'No'
          }).then(
            (result) => {
              id = evt;
              let deleteOps = {
                method: 'DELETE',
                url: constants.API_URL + '/events/' + id,
                headers: {
                  'Content-Type': 'application/json',
                  'APIKey': constants.API_KEY,
                  'Authorization': this.state.user.authorization
                },
                json: true
              }

              axios(deleteOps)
                .then(response => {
                  this.props.history.push('/home');
                  this.removeEvent(id);
                })
                .catch(err => {
                  if(err.response.data.error === 'Auth.InvalidToken') {
                    this.refreshToken();
                  }     
                });
            })
          break;
      case 'create':

        err = false; 

        title = evt.target.title.value;
        if (!title) {
          err = true;
          this.setState((prevState) => {
            let newState = prevState;
            newState.err.title = 'Title has to be filled up.';
            return newState;
          })
        }
        description = evt.target.description.value;
        if (!description) {
          err = true;
          this.setState((prevState) => {
            let newState = prevState;
            newState.err.description = 'Description has to be filled up.';
            return newState;
          })
        }
        date = evt.target.date.value;
        let currentDate = new Date();
        let eventDate = new Date(date);
        if (!date || eventDate < currentDate) {
          err = true;
          this.setState((prevState) => {
            let newState = prevState;
            newState.err.date = 'Date has to be a valid date in the future.';
            return newState;
          })
        }
        time = evt.target.time.value;
        if (!time) {
          err = true;
          this.setState((prevState) => {
            let newState = prevState;
            newState.err.time = 'Time has to be filled up.';
            return newState;
          })
        }
        capacity = evt.target.capacity.value;
        if (!capacity) {
          err = true;
          this.setState((prevState) => {
            let newState = prevState;
            newState.err.capacity = 'Capacity has to be filled up.';
            return newState;
          })
        }

        if (!err) {

          data = {title, description, startsAt: date + 'T' + time + 'Z', capacity}

          let insertOps = {
            method: 'POST',
            url: constants.API_URL + '/events',
            data,
            headers: {
              'Content-Type': 'application/json',
              'APIKey': constants.API_KEY,
              'Authorization': this.state.user.authorization
            },
            json: true
          }

          axios(insertOps)
            .then(response => {
              this.addEvent(response.data);
              this.props.history.push('/home');
            })
            .catch(err => {
              if(err.response.data.error === 'Auth.InvalidToken') {
                this.refreshToken();
              }     
            });

        }
        break;
      default:
        console.log('No arg found.');
        break;
    }
  }
  renderForm(formItems, page) {
    let form = [];
    for (let i=0; i<formItems.length; i++) {
      let formEl = [];
      formEl[0]=[];
      if (page !== 'create') {
        formEl[0].push(
          <label htmlFor={formItems[i][0]} className={this.state.formControl[formItems[i][0]] ? null : '-displayNone'}> {formItems[i][1]} </label>
      )
      if (page === 'auth' || page === 'edit') {
        formEl[0].push(
          <br/>)
      }
      }
      let type;
      switch(formItems[i][0]) {
        case 'password':
          if (!this.state.showPass) {
            type = 'password'
          } else {
            type = 'text'
          }
          break;
        case 'repeatPassword':
          type = 'password';
          break;
        case 'date':
          type = 'date';
          break;
        case 'time':
          type='time';
          break;
        default:
          type='text';
          break;
      };
      formEl[1]=[];
      formEl[1].push(
          <input id={formItems[i][0]} type={type} style={this.state.err[formItems[i][0]] || this.state.err.login ? {borderBottomColor: 'red'} : null}
          value={this.state.formControl[formItems[i][0]]} name={formItems[i][0]} placeholder={formItems[i][1]}/>
      )
      formEl[1].push(<div className='body__error'>{this.state.err[formItems[i][0]]}</div>);

      form.push(formEl);
    }

    return form;
  }
  navigate(page) {
    this.setState({err: {}});
    let url = '/' + page;
    this.props.history.push(url);
  }
  userEvents() {
    if (this.state.events) {
    let id = this.state.user.id;
      let eventsFiltered = this.state.events.filter(event => {
        if (event.owner.id === id) {
          return true;
        }
        let attendeesFiltered = event.attendees.filter(attendee => {
          if (attendee.id === id) {
            return true;
          }
        })
        if (attendeesFiltered.length > 0) {
          return true;
        }
      })

      return eventsFiltered;
    }
  }

  render() {
    return (
      <Switch>
          <Route exact path='/' render={(props) => {
            return <Login {...props} 
            err={this.state.err}
            
            login={this.login}
            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange}
            handleShowPassword={this.handleShowPassword}
            renderForm={this.renderForm}
            navigate={this.navigate}/>}}
            onEnter={this.onEnterPublicPage}/>

          <Route exact path='/signup' render={(props) => {
            return <Signup {...props} login={this.login}
            err={this.state.err}

            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange}
            renderForm={this.renderForm}
            navigate={this.navigate}/>}}
            onEnter={this.onEnterPublicPage} />

          <Route exact path='/home' render={(props) => {
            return <Home {...props}
              loading={this.state.loading}
              user={this.state.user}
              events={this.state.events}
              filter={this.state.filter}
              display={this.state.display}

              fetchEvents={this.fetchEvents}
              handleBtnClick={this.handleBtnClick}
              storeEvents={this.storeEvents}
              onLogout={this.onLogout}/>
          }} onEnter={this.onEnterPrivatePage} />

          <Route exact path='/profile' render={(props) => {
            return <Profile {...props}
            user={this.state.user}
            events={this.userEvents()}
            filter='all'
            display={this.state.display}

            fetchEvents={this.fetchEvents}
            handleBtnClick={this.handleBtnClick}
            storeEvents={this.storeEvents}
            onLogout={this.onLogout}/>
          }} onEnter={this.onEnterPrivatePage}/>

          <Route exact path='/create' render={(props) => {
            return <Create {...props} user={this.state.user}
            err={this.state.err}
            addEvent={this.addEvent}
            renderForm={this.renderForm}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}/>
          }} onEnter={this.onEnterPrivatePage}/>

          <Route exact path='/detail:id' render={(props) => {
            return <Detail {...props} user={this.state.user}
            event={this.state.event}
            events={this.state.events}

            modifyEvents={this.modifyEvents}
            onLogout={this.onLogout}
            setEvent={this.setEvent}
            handleBtnClick={this.handleBtnClick}/>
          }} onEnter={this.onEnterPrivatePage}/>

          <Route exact path='/edit:id' render={(props) => {
            return <Edit {...props} user={this.state.user}
            event={this.state.event}
            events={this.state.events}

            renderForm={this.renderForm}
            onLogout={this.onLogout}
            setEvent={this.setEvent}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}/>
          }} onEnter={this.onEnterPrivatePage} />

          <Route path='*' render={(props) => {
            return <NotFound 
            navigate={this.navigate}/>
          }}/>
      </Switch>
    )
  }
}
