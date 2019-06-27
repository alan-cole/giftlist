import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../../components/topbar/TopBar.js';

const Friends = () => {
	return (
		<div>
			<TopBar screenTitle="Friends" previousPage="/menu" />
			<Link to="/addfriend"><button type="button">Add Friend</button></Link>
		</div>
	);
}

export default Friends;