import React from 'react';
import './Input.css';

const Input = ( { label, value, type = 'text', onChange } ) => {
	return (
		<label className="label">
			<span>{label}</span>
			<input className="input" type={type} value={value} onChange={onChange} />
		</label>
	);
}

export default Input;