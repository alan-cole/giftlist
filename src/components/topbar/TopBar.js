import React from 'react';
import './TopBar.css';

import BackIcon from './backicon.png'

const TopBar = ( {clickNavigationButton, screenTitle, previousPage} ) => {
	return (
		<div className="topbarheader">
			<div className="topbarmain">
				<button type="button" className="backbutton" onClick={clickNavigationButton} value={previousPage}><img height="32px" width="16px" alt='back' src={BackIcon}/></button>
				<h1 className="topbartext">{screenTitle}</h1>
			</div>
		</div>
	);
}

export default TopBar;