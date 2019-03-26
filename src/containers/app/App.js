import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';

import Menu from '../menu/Menu.js';
import MyList from '../mylist/MyList.js';
import FriendsLists from '../friendslists/FriendsLists.js';

import { clickNavigationButton } from './appActions.js'

const mapStateToProps = state => {
	return {
		screenDisplayed: state.screenNavigation.screenDisplayed
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
      clickNavigationButton: (event) => dispatch(clickNavigationButton(event.target.value)),
  }
}

class App extends Component {
  render() {
    const { screenDisplayed, clickNavigationButton } = this.props;
    if (screenDisplayed === "My List") {
      return (<div><MyList clickNavigationButton={clickNavigationButton}/></div>);
    } else if (screenDisplayed === "Friend's Lists") {
      return (<div><FriendsLists clickNavigationButton={clickNavigationButton}/></div>);
    } else {
      return (<div><Menu clickNavigationButton={clickNavigationButton}/></div>);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);