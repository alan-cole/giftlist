import React from 'react';
import TopBar from '../../components/topbar/TopBar.js';

const MyList = ( { clickNavigationButton } ) => {
	return (
		<div>
			<TopBar clickNavigationButton={clickNavigationButton} screenTitle="My List" previousPage="Friend's Lists" />
		</div>
	);
}

export default MyList;