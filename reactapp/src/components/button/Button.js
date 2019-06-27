import React from 'react';
import './Button.css';

const Button = ( {buttonTitle, buttonWidth} ) => {
	return (
		<div>
			<button className="blueButton" style={buttonWidth} type="button">{buttonTitle}</button>
		</div>
	);
}

export default Button;