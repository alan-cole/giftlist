import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from  'react-redux';
import { createStore, combineReducers } from 'redux';
import './index.css';
import App from './containers/app/App';
import * as serviceWorker from './serviceWorker';

import { screenNavigation } from './containers/app/appReducers.js';

const rootReducer = combineReducers({ screenNavigation })
const store = createStore(rootReducer);

ReactDOM.render(<Provider store={store}>
					<App />
				</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
