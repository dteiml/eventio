import React from 'react';
import { Route, Switch } from 'react-router-dom';


import { confirm } from './util/confirm';
import { myAlert } from './util/confirm';
import {Edit} from './ui/Scenes/Events/Edit';
import {Login} from './ui/Scenes/Auth/Login';
import {Signup} from './ui/Scenes/Auth/Signup';
import {Home} from './ui/Scenes/Home';
import {NotFound} from './ui/Scenes/NotFound';
import {Create} from './ui/Scenes/Events/Create';
import {Detail} from './ui/Scenes/Events/Detail';

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
    this.defaultEventForm = {title: '', date: '', time: '', description: '', capacity: ''};
    this.ops = {
          method: 'GET',
          url: constants.API_URL,
          headers: {
            'Content-Type': 'application/json',
            'APIKey': constants.API_KEY,
          },
          json: true
        }

    if (user) {
      this.ops.headers.Authorization = user.authorization;
    }

    this.state = {
      loading: true,
      display: 'grid',
      filter: 'all',
      user,
      err: {},
      formControl: Object.assign({firstName: '', lastName: '', email: '', password: '', repeatPassword: ''}, this.defaultEventForm),
      showPass: false
    }

    this.refreshToken = this.refreshToken.bind(this);
    this.login = this.login.bind(this);
    this.modifyAttendees = this.modifyAttendees.bind(this);
    this.fetchEvent = this.fetchEvent.bind(this);
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
    this.ops.headers.Authorization = user.authorization;
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
  componentDidMount() {
    this.setState({loading: false});
  }
  onAuthChange(isAuthenticated) {
    const pathname = this.props.location.pathname.split(':')[0];
    const isUnauthenticatedPage = unauthenticatedPages.indexOf(pathname) >= 0;
    const isAuthenticatedPage = authenticatedPages.indexOf(pathname) >= 0;
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
    myAlert('Your token has expired. Please login again.');
  }
  fetchEvents() {
    let fetchOps = Object.assign({}, this.ops); 
    fetchOps.url += '/events';

    this.setState({loading: true});

    axios(fetchOps)
      .then(response => {
        this.setState({events: response.data, loading: false});
      })
      .catch(err => {
        this.setState({loading: false});
        if(err.response && err.response.data.error === 'Auth.InvalidToken') {
          this.refreshToken();
        } else {
          this.props.location.reload();
          myAlert('An error occured. Here are the details:' + err);
        }
      });
  }
  handleError(err) {

  }
  handleBtnClick(a, b) {
    //filter btn
    if (a.target && a.target.value) {
      let filter = a.target.value;
      if (filter === 'all' || 'past' || 'future') {
        this.setState({filter});
      }
    }
    //an event is passed
    else if (b) {
      let id = b.id; //event id
      let url;
      if (a === 'join' || a === 'leave') {

        if (a === 'join' && b.attendees.length >= b.capacity) {
          myAlert('Event is at full capacity :(. Please try later when somebody leaves.');
        } //add/remove attendee:
        else {
          let joinOps = Object.assign({}, this.ops);
          joinOps.method = a === 'join' ? 'POST' : 'DELETE';
          joinOps.url += '/events/' + id + '/attendees/me';
          this.setState({loading: true});

          axios(joinOps)
            .then(response => {
              this.modifyAttendees(a, id);
              this.setState({loading: false});
            })
            .catch(err => {
              this.setState({loading: false});
              if(err.response && err.response.data.error === 'Auth.InvalidToken') {
                this.refreshToken();
              } else {
                myAlert('An error occured. Here are the details:' + err);
              }
            });
        }
      }
      else if (a === 'detail') {
        url = '/detail:' + id;
        this.props.history.push(url);
      }
    }
    //display btn clicks pass only a string, so this case must a display btn:
    else {
      this.setState({display: a})
    }
  }
  modifyAttendees(arg, id) {
    const findEventIndex = (state, id) => {
      const event = state.events.filter(event => event.id === id)[0];
      return state.events.indexOf(event);
    }
    const removeAttendee = (state, eventIndex) => {
      const event = eventIndex ? state.events[eventIndex] : state.event;
      const attendeeIndex = event.attendees.indexOf(this.state.user);
      return event.attendees.splice(attendeeIndex, 1);
    }
    if (arg === 'leave') {
      if(this.state.events) {
            this.setState(prevState => {
            const eventIndex = findEventIndex(prevState, id);
            return removeAttendee(prevState, eventIndex);
          })
      } else {
          this.setState(prevState => {
          return removeAttendee(prevState);
        })
      }
    }
    else if (arg === 'join') {
      if(this.state.events) {
        this.setState(prevState => {
          return prevState.events[findEventIndex(prevState, id)].attendees.push(this.state.user);
        })
        } else {
        this.setState(prevState => {
          return prevState.event.attendees.push(this.state.user);
        })
      }
    }
  }
  fetchEvent(arg) {
    const setFormControl = (event) => {
        this.setState(prevState => {
          prevState.event = event; 
          const date = event.startsAt.split('T')[0];
          const time = event.startsAt.split('T')[1].split('Z')[0];
          const {title, description, capacity} = event;
          prevState.formControl = {date, time, title, description, capacity};
          return prevState;
      });
    }
    let event;
    if (arg === 'create') {
      this.setState(prevState => {
        delete prevState.event;
        prevState.formControl = this.defaultEventForm;
        return prevState;
      })
    }
    //for detail or edit if all events are loaded:
    else if (this.state.events) {
      event = this.state.events.filter(event => event.id === arg)[0];
      setFormControl(event);
    }
    //for detail or edit if the all events are not loaded:
    else {
      let getOps = Object.assign({}, this.ops);
        getOps.url += '/events/' + arg;

      axios(getOps)
        .then(response => {
          setFormControl(response.data);
        })
        .catch(err => {
          myAlert('An error occured. Here are the details:' + err);
        })
    }
  }
  
  handleChange(type, evt) {
    const {name} = evt.target;
    const {value} = evt.target;
    this.setState(prevState => {
      prevState.formControl[name] = value;
      return prevState;
    });
  }

  handleShowPassword() {
    this.setState({showPass: !this.state.showPass});
  }
  handleSubmit(arg, evt) {
    let id, date, email, password, err;

    let errObj = {};

    this.setState({err: {}});

    const validate = (f, formItems) => {
      formItems.forEach((item, i) => {
        const test = item[2] ? item[2] : val => val;
        if (!test( f[item[0]] )) {
          err = true;
          errObj[item[0]] = item[3] ? item[3] : item[1] + ' has to be filled up.';
        }
      })
    }

    if (arg === 'signup') {
      err = false;
      const f = this.state.formControl;
      validate(f, [['firstName', 'First name'],
                 ['lastName', 'Last name'],
                 ['email', 'Email', val => emailFormat.test(val), 'Email must be a valid email.']]);

      const {firstName, lastName, email, password, repeatPassword} = f;

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

      if (!err) {
        let registerOps = Object.assign({}, this.ops);
        registerOps.method = 'POST';
        registerOps.url += '/users';
        registerOps.data = {firstName, lastName, email, password};

        axios(registerOps)
          .then(response => {
            let authOps = Object.assign({}, this.ops);
            authOps.method = 'POST';
            authOps.url += '/auth/native';
            authOps.data = {email, password};

            axios(authOps)
              .then(res => {
                let user = res.data;
                user.authorization = res.headers.authorization;
                this.login(user);
                this.props.history.push('/home');
              })
              .catch(err => {
                myAlert('An error occured. Here are the details:' + err);
              })
          })
          .catch(err => {
            myAlert('An error occured. Here are the details:' + err);
          })
        }
    }
    else if (arg === 'login') {
      const f = this.state.formControl;
      email = f.email.trim();
      const {password} = f;

      let loginOps = Object.assign({}, this.ops);
      loginOps.method = 'POST';
      loginOps.url += '/auth/native';
      loginOps.data = {email, password};
      delete loginOps.headers.Authorization;

      axios(loginOps)
        .then(response => {
          let user = response.data;
          user.authorization = response.headers.authorization;
          this.login(user);
          this.props.history.push('/home');
        })
        .catch(err => {
          if (err.response && err.response.error === 'User.InvalidPassword') {
            this.setState(prevState => {
              prevState.err.login = 'Oops! That email and password combination is not valid.'
              return prevState;
            })
          } else {
            myAlert('An error occured. Here are the details:' + err);
          }
        });
    }
    else if (arg === 'update' || arg === 'create') {
      const f = this.state.formControl;
      err = false; 

      validate(f, [['title', 'Title'],
                   ['description', 'Description'],
                   ['time', 'Time'],
                   ['capacity', 'Capacity', val => val > 0, 'Capacity has to be an integer at least 1.']]);

      const {title, description, date, time, capacity} = f;
      // if we're updating, we need to know the id of the event (for HTTP request) - we can get it from the state:
      const id = arg === 'update' ? this.state.event.id : '';

      let currentDate = new Date();
      let eventDate = new Date(date);
      if (!date || eventDate < currentDate) {
        err = true;
        errObj.date = 'Date has to be a valid date in the future.';
      }


      if (err) {
        this.setState(prevState => {
          prevState.err = errObj;
          return prevState;
        })
      } 

      else {
        const insertOps = Object.assign({}, this.ops);
        insertOps.method = arg === 'update' ? 'PATCH' : 'POST';
        insertOps.url += '/events/' + id;
        insertOps.data = {title, description, startsAt: date + 'T' + time + 'Z', capacity};

        this.setState({loading: true});
        
        axios(insertOps)
          .then(res => {
            this.fetchEvents();
            this.props.history.push('/home');
          })
          .catch(err => {
            if(err.response && err.response.data.error === 'Auth.InvalidToken') {
              this.refreshToken();
            } else {
              myAlert('An error occured. Here are the details:' + err);
            }
            this.setState({loading: false});     
          });
        }
    }
    else if (arg === 'delete') {
      confirm('Are you sure you want to delete this event?', {
            okLabbel: 'Yes',
            cancelLabel: 'No'
          }).then(
            (result) => {
              id = evt;
              const deleteOps = Object.assign({}, this.ops);
              deleteOps.method = 'DELETE';
              deleteOps.url += '/events/' + id;

              this.setState({loading: true});

              axios(deleteOps)
                .then(response => {
                  this.fetchEvents();
                  this.props.history.push('/home');
                })
                .catch(err => {
                  if(err.response && err.response.data.error === 'Auth.InvalidToken') {
                    this.refreshToken();
                  } else {
                    myAlert('An error occured. Here are the details:' + err);
                  }
                  this.setState({loading: false});
                });
            })
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
      if (page === 'auth') {
        formEl[0].push(<br/>) 
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
    const url = '/' + page;
    this.props.history.push(url);
  }
  userEvents() {
    if (this.state.events) {
    const id = this.state.user.id;
      const eventsFiltered = this.state.events.filter(event => {
        if (event.owner.id === id) {
          return true;
        }
        const attendeesFiltered = event.attendees.filter(attendee => {
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
            
            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange}
            handleShowPassword={this.handleShowPassword}
            renderForm={this.renderForm}
            navigate={this.navigate}/>}}
            onEnter={this.onEnterPublicPage}/>

          <Route exact path='/signup' render={(props) => {
            return <Signup {...props} 
            err={this.state.err}

            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange}
            renderForm={this.renderForm}
            navigate={this.navigate}/>}}
            onEnter={this.onEnterPublicPage} />

          <Route exact path='/home' render={(props) => {
            this.onEnterPrivatePage();
            return <Home {...props}
              pathname='home'
              loading={this.state.loading}
              user={this.state.user}
              events={this.state.events}
              filter={this.state.filter}
              display={this.state.display}

              fetchEvents={this.fetchEvents}
              handleBtnClick={this.handleBtnClick}
              onLogout={this.onLogout}/>
          }} />

          <Route exact path='/profile' render={(props) => {
            return <Home {...props}
            pathname='profile'
            loading={this.state.loading}
            user={this.state.user}
            events={this.userEvents()}
            filter='all'
            display={this.state.display}

            fetchEvents={this.fetchEvents}
            handleBtnClick={this.handleBtnClick}
            onLogout={this.onLogout}/>
          }} onEnter={this.onEnterPrivatePage}/>

          <Route exact path='/create' render={(props) => {
            return <Create {...props} user={this.state.user}
            err={this.state.err}
            event={this.state.event}
            loading={this.state.loading}

            fetchEvent={this.fetchEvent}
            renderForm={this.renderForm}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}/>
          }} onEnter={this.onEnterPrivatePage}/>

          <Route exact path='/detail:id' render={(props) => {
            return <Detail {...props} user={this.state.user}
            event={this.state.event}
            events={this.state.events}
            loading={this.state.loading}

            modifyEvents={this.modifyEvents}
            onLogout={this.onLogout}
            fetchEvent={this.fetchEvent}
            handleBtnClick={this.handleBtnClick}/>
          }} onEnter={this.onEnterPrivatePage}/>

          <Route exact path='/edit:id' render={(props) => {
            return <Edit {...props} user={this.state.user}
            event={this.state.event}
            events={this.state.events}
            loading={this.state.loading}

            renderForm={this.renderForm}
            onLogout={this.onLogout}
            fetchEvent={this.fetchEvent}
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
