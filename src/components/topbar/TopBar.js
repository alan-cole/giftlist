import React from 'react';
import './TopBar.css';
import { Link } from 'react-router-dom';

import BackIcon from './backicon.svg'

const TopBar = ( {screenTitle, previousPage} ) => {
	switch(screenTitle) {
		case "Menu":
		return (
			<div className="topbarheader">
				<div className="topbarmain">
					<h1 className="topbartext">{screenTitle}</h1>
				</div>
			</div>
		);
		default:		
		return (
			<div className="topbarheader">
				<div className="topbarmain">
					<Link to={previousPage} className="backbutton">
						<button type="button" className="backbutton">
							<img height="32px" width="32px" alt='back' src={BackIcon}/>
						</button>
					</Link>
					<h1 className="topbartext">{screenTitle}</h1>
				</div>
			</div>
		);
	}
}

export default TopBar;