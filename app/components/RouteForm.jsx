import React from 'react';
import * as Redux from 'react-redux';
import moment from 'moment';

import * as actions from 'actions';


export var RouteForm = React.createClass({

	onRouteSubmit(ev) {
		ev.preventDefault();
		var {dispatch} = this.props;

		var fromID, toID, date, time, mode;
		//fromID = this.refs.station_from.value;
		//toID = this.refs.station_to.value;
		fromID = $('#stations_list [value="' + this.refs.station_from.value + '"]').data('value');
		toID = $('#stations_list [value="' + this.refs.station_to.value + '"]').data('value');
		date = moment(this.refs.station_datetime.value).format('YYYYMMDD');
		time = moment(this.refs.station_datetime.value).format('hh:mm');
		mode = $('#radio-group input[type="radio"]:checked').val();

		console.log('calling w/ ',fromID,toID,date,time,mode);

		$('#stations_list [value="' + this.refs.station_from.value + '"]').data('value');

		dispatch(actions.requestRoute(fromID, toID, date, time, mode));
	},

	render() {

		return (
				<form autoComplete="on" className="row">
					<div className="input-field col s12 m8 offset-m2 l8 offset-l2">
              <input type="text" 
              	list="stations_list" 
              	id="station_from" 
              	ref="station_from" 
              	placeholder="Westbahnhof" 
              	className="validate" 
              	autoFocus="true" 
              	autoComplete="from" 
              	name="from" 
              	required/>
              <label htmlFor="station_from" className="active" data-error="Please enter a Departure Station">Departure Station</label>
          </div>
					<div className="input-field col s12 m8 offset-m2 l8 offset-l2">
              <input type="text" 
              	list="stations_list" 
              	id="station_to" 
              	ref="station_to" 
              	placeholder="Hauptbahnhof" 
              	className="validate" 
              	autoComplete="to" 
              	name="to" 
              	required/>
              <label htmlFor="station_to" className="active" data-error="Please enter an Arrival Station">Arrival Station</label>
          </div>

          <div className="clearfix"></div>

          <div className="col s12 m8 offset-m2 l8 offset-l2">
	          <div className="row input-row">
		          <div className="input-field col s8">
		              <input type="datetime-local" 
		              	id="station_datetime" 
		              	ref="station_datetime" 
		              	defaultValue={moment().format('YYYY-MM-DDTHH:mm')} 
		              	className="validate" 
		              	autoComplete="date" 
		              	name="date" 
		              	required/>
		              <label htmlFor="station_datetime" className="active" data-error="Please enter Date and Time">Date and Time</label>
		          </div>
		          <div className="col s4" id="radio-group">
		          	<input className="validate" defaultChecked name="arrival_or_departure" type="radio" id="radio_dep" value="dep" required />
		      			<label className="" htmlFor="radio_dep" data-error="Please select wether you want to depart or arrive on entered time">Departure</label>

		      			<input name="arrival_or_departure" type="radio" id="radio_arr" value="arr" />
		      			<label className="" htmlFor="radio_arr">Arrival</label>
		      		</div>
	          </div>
          </div>

          <div className="clearfix"></div>
          
					<div className="row center">
						<button className="waves-effect btn btn-large" onClick={this.onRouteSubmit}>
							<i className="material-icons left">subway</i>Do it!
						</button>
					</div>
					<datalist id="stations_list">
                <option data-value="60201040" value="Praterstern" />
                <option data-value="60201235" value="Siebenhirten" />
								<option data-value="60201349" value="Hauptbahnhof" />
								<option data-value="60200560" value="Hütteldorf" />
								<option data-value="60201468" value="Westbahnhof" />
          </datalist>
				</form>
		)
	}
});

export default Redux.connect()(RouteForm);
