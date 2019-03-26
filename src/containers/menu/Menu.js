import React from 'react';
import TopBar from '../../components/topbar/TopBar.js';

const Menu = ({ clickNavigationButton }) => {
	return (
		<div>
			<TopBar clickNavigationButton={clickNavigationButton} screenTitle="Menu" previousPage="Friend's Lists"/>
			<button type="button" onClick={clickNavigationButton} value="My List">My List</button>
			<button type="button" onClick={clickNavigationButton} value="Friend's Lists">Friend's List</button>
		</div>
	);
}

export default Menu;