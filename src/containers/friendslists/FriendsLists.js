import React from 'react';
import TopBar from '../../components/topbar/TopBar.js';

const FriendsLists = ( { clickNavigationButton } ) => {
	return (
		<div>
			<TopBar clickNavigationButton={clickNavigationButton} screenTitle="Friend's Lists" previousPage="My List" />
		</div>
	);
}

export default FriendsLists;