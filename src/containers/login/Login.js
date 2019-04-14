import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import Input from '../../components/input/Input.js';
import Button from '../../components/button/Button.js';

const Login = () => {
	return (
		<div>
			<h1 className="heading">Gift List</h1>
			<div className="centre"><Input inputTitle="Email" /></div>
			<div className="centre"><Input inputTitle="Password" /></div>
			<div className="centre buttonMargin"><Link to="/menu"><Button buttonTitle="Login" buttonWidth={{width: '330px'}} /></Link></div>
			<div className="centre buttonMargin"><Link to="/signup"><Button buttonTitle="Sign Up" buttonWidth={{width: '330px'}} /></Link></div>
		</div>
	);
}

export default Login;