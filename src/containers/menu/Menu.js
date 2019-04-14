import React from 'react';
import TopBar from '../../components/topbar/TopBar.js';
import { Link } from 'react-router-dom';

const Menu = () => {
	return (
		<div>
			<TopBar screenTitle="Menu" previousPage="/"/>
				<Link to="/mylist"><button type="button">My List</button></Link>
				<Link to="/friendslists"><button type="button">Friend's List</button></Link>
				<Link to="/friends"><button type="button">Friends</button></Link>
				<Link to="/"><button type="button">Log Out</button></Link>
		</div>
	);
}

export default Menu;