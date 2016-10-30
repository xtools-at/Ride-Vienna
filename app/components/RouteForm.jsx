import React from 'react';
import * as Redux from 'react-redux';
import moment from 'moment';

import * as actions from 'actions';


export var RouteForm = React.createClass({

	onRouteSubmit(ev) {
		ev.preventDefault();
		var {dispatch} = this.props;
		dispatch(actions.requestRoute("Wien Hauptbahnhof", "Westbahnhof", moment().format('YYYYMMDD'), moment().format('HH:MM'), "dep"));
	},

	render() {

		return (
				<form>
					<div className="center mb">
						<button className="waves-effect btn btn-large" onClick={this.onRouteSubmit}>
							<i className="material-icons left">subway</i>Do it!
						</button>
					</div>
				</form>
		)
	}
});

export default Redux.connect()(RouteForm);
