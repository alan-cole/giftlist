import React from 'react';
import './Input.css';

const Input = ( {inputTitle} ) => {
	return (
		<div>
			<h2 className="inputTitle">{inputTitle}</h2>
			<input className="input" type="text"></input>
		</div>
	);
}

export default Input;