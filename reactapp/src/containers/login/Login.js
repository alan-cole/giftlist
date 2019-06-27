import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import Input from '../../components/input/Input.js';

import API from '../../lib/api';
// const api = new API('http://localhost:3000'); // For dev.
const api = new API(window.location.origin);

class Login extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			isLoggedIn: false,
			email: '',
			password: ''
		}
		this.requestLogin = this.requestLogin.bind(this)
	}

	async requestLogin (event) {
		event.preventDefault()
		try {
			const result = await api.login(this.state.email, this.state.password)
			if (result.error === false) {
				localStorage.setItem('token', result.result.token)
				// Redirect to menu
				this.props.history.push('/menu')
			}
		} catch (err) {
			alert('Unable to log in.')
		}
	}

	render () {
		return (
			<div className="page-login">
				<h1 className="page-login__heading">Gift List</h1>
				<form onSubmit={this.requestLogin}>
					<Input label="Email" value={this.state.email} onChange={ (event) => { this.setState({ email: event.target.value }) } } />
					<Input label="Password" value={this.state.password} type="password" onChange={ (event) => { this.setState({ password: event.target.value }) } } />
					<input className="blueButton" type="submit" value="Log in" />
				</form>
				<Link className="blueButton" to="/signup">Sign Up</Link>
			</div>
		)
	}
}

export default Login;