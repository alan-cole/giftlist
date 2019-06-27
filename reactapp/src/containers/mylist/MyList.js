import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../../components/topbar/TopBar.js';

const MyList = () => {
	return (
		<div>
			<TopBar screenTitle="My List" previousPage="/menu" />
			<Link to="/addgift"><button type="button">Add Gift</button></Link>
		</div>
	);
}

export default MyList;