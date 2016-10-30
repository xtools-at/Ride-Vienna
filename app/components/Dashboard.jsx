import React from 'react';
import * as Redux from 'react-redux';

import RouteForm from 'RouteForm';


export var Dashboard = React.createClass({
	componentDidMount() {
			//$('h1').focus();  
	},

	render() {

		return (
				<div className="card-panel" id="dashboard">
					<h1 className="center">Travel Vienna by Subway</h1>
					<RouteForm />
				</div>
		)
	}
});

export default Redux.connect(
	(state) => {
		return state;
	}
)(Dashboard);
