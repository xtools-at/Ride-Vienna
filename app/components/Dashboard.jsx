import React from 'react';
import * as Redux from 'react-redux';

import RouteForm from 'RouteForm';


export var Dashboard = React.createClass({
	componentDidMount() {
			//$('h1').focus();  
	},

	render() {

		return (
				<div id="dashboard" >
					<section className="card-panel col s12 m10 offset-m1 l5 offset-l1">
						<h1 className="center">Need a Ride?</h1>
						<p className="center">Travel Vienna by Subway the easy way</p>
						<RouteForm />
					</section>
					<section className="card-panel col s12 m10 offset-m1 l4 offset-l1">
						Recent Trips
					</section>
				</div>
		)
	}
});

export default Redux.connect(
	(state) => {
		return state;
	}
)(Dashboard);
