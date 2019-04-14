import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import './App.css';

import Login from '../login/Login.js';
import Menu from '../menu/Menu.js';
import MyList from '../mylist/MyList.js';
import FriendsLists from '../friendslists/FriendsLists.js';
import Friends from '../friends/Friends.js';
import SignUp from '../signup/SignUp.js';
import AddFriend from '../addfriend/AddFriend.js';
import AddGift from '../addgift/AddGift.js';

import {  } from './appActions.js'

const mapStateToProps = state => {
	return {

	}
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

class App extends Component {
  render() {
    const {} = this.props;
    return(
      <div>
        <Route exact path="/" component={Login} />
        <Route path="/menu" component={Menu} />
        <Route path="/mylist" component={MyList} />
        <Route path="/friendslists" component={FriendsLists} />
        <Route path="/friends" component={Friends} />
        <Route path="/signup" component={SignUp} />
        <Route path="/addfriend" component={AddFriend} />
        <Route path="/addgift" component={AddGift} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);