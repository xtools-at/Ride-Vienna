import moment from 'moment';
import axios from 'axios';
var {hashHistory} = require('react-router');
import Helper from 'Helper';

import firebase, {dbRef} from 'app/firebase/';
import idbRef from 'app/db/idb';


//Auth
export var login = (uid) => {
	return {
		type: 'LOGIN',
		uid
	};
};

export var startOauthLogin = (provider) => {
	return (dispatch, getState) => {
		return firebase.auth().signInWithPopup(provider).then((result) => {
			//console.log('Auth worked', result);
		}, (error) => {
			//console.log('Unable to Oauth', error);
		});
	};
};

export var startRegister = (email, encryptedPassword, username) => {
	return (dispatch) => {
		return firebase.auth().createUserWithEmailAndPassword(email, encryptedPassword).then(
			()=>{
				Helper.toast('You have registered succesfully!');
				//Save Username
				var user = firebase.auth().currentUser;
				user.updateProfile({
					displayName: username,
				}).then(function() {
					//console.log('saved displayName to DB');
				}, function(error) {
					//console.log('Error saving displayName to DB', error);
				});
			}, (error)=>{
			//console.log('Unable to Register', error);
			Helper.toast('Unable to Register - please try again!');
		});
	};
};

export var startLogin = (email, encryptedPassword) => {
	return (dispatch, getState) => {
		return firebase.auth().signInWithEmailAndPassword(email, encryptedPassword).then(
			()=>{
				Helper.toast('You have logged in succesfully!');
			}).catch((error)=>{
			//console.log('Unable to Login', error);
			Helper.toast('Could not log you in - please check your Email and Password!');
		});
	};
};

export var logout = () => {
	return {
		type: 'LOGOUT'
	};
};

export var startLogout = () => {
	return (dispatch, getState) => {
		return firebase.auth().signOut().then(() => {
			Helper.toast('Succesfully signed out!');
		});
	};
};




//Add Events
export var addEvent = (event) => {
	return {
		type: 'ADD_EVENT',
		event
	};
};

export var startAddEvent = (title, description, type, address, lat = '',lng = '', timeStart, timeEnd, host, guests) => {
	return (dispatch, getState) => {
		var event = {
			title, 
			description, 
			type, 
			address, 
			lat,
			lng, 
			timeStart, 
			timeEnd, 
			host, 
			guests
		};
		
		var eventSave = dbRef.child('events').push(event);
		return eventSave.then(() => {
			dispatch(addEvent(event));
			hashHistory.push('/');
			Helper.toast('Event has been created succesfully!');
		}).catch((error)=>{
			Helper.toast('Unable to save Event - please try again!');
		});
	};
};


export var getEvents = (events) => {
	return {
		type: 'GET_EVENTS',
		events
	};
};

export var startGetEvents = () => {
	return (dispatch, getState) => {

		var eventsRef = dbRef.child('events');

		return eventsRef.once('value').then((snapshot) => {
			var events = snapshot.val() || {};
			var parsedEvents = [];

			Object.keys(events).forEach((eventId) => {
				parsedEvents.push({
					id: eventId,
					...events[eventId]
				});
			});

			dispatch(getEvents(parsedEvents));
		});
	};
};

export var toggleAdditionalFields = () => {
	return {
		type: 'TOGGLE_SHOW'
	};
};



//####################################################

//Get Restaurant List
export var getRestaurants = (restaurants) => {
	return {
		type: 'GET_RESTAURANTS',
		restaurants
	};
};

export var startGetRestaurants = () => {
	return (dispatch, getState) => {

		var restaurantsRef = dbRef.child('restaurants');

		return restaurantsRef.once('value').then((snapshot) => {
			var restaurants = snapshot.val() || {};
			var parsedRestaurants = [];

			Object.keys(restaurants).forEach((restaurantId) => {
				parsedRestaurants.push({
					id: restaurantId,
					...restaurants[restaurantId]
				});
			});
			dispatch(getRestaurants(parsedRestaurants));
		});
	};
};

//Handle Ratings
export var getRatings = (ratings) => {
	return {
		type: 'GET_RATINGS',
		ratings
	};
};

export var startGetRatings = (restaurantId) => {
	return (dispatch) => {

		var ratingsRef = dbRef.child('ratings/');

		return ratingsRef.orderByChild('reference').equalTo(restaurantId).once('value').then((snapshot) => {
			var ratings = snapshot.val() || {};
			var parsedRatings = [];

			Object.keys(ratings).forEach((ratingId) => {
				parsedRatings.push({
					id: ratingId,
					...ratings[ratingId]
				});
			});

			dispatch(getRatings(parsedRatings));
		});
	};
};

export var clearRatings = () => {
	return {
		type: 'CLEAR_RATINGS'
	};
};


//Add Review
export var addReview = (rating) => {
	return {
		type: 'ADD_RATING',
		rating
	};
};

export var startAddReview = (rating, name, comment, reference, date) => {
	return (dispatch, getState) => {
		var review = {
			rating, name, comment, reference, date
		};
		
		var reviewSave = dbRef.child('ratings').push(review);
		return reviewSave.then(() => {
			dispatch(addReview(review));
			Helper.toast('Review has been saved succesfully!');
		}).catch((error)=>{
			Helper.toast('Unable to save Review - please try again!');
		});
	};
};

//Store custom Data
export var setCheckedRadio = (checkedRadio) => {
	return {
		type: 'CHECKED_RADIO',
		checkedRadio
	};
};

export var storeLocation = (lat, lng) => {
	return {
		type: 'STORE_LOCATION',
		userLat: lat,
		userLng: lng
	};
};

export var showModal = (setTo) => {
	return {
		type: 'SHOW_MODAL',
		showModal: setTo
	}
}

//Filters
export var setFilters = (filters, sortBy) => {
	//filters = {id: bool, id2: bool2}
	//sortBy = "string"
	return {
		type: 'SET_FILTERS',
		filters,
		sortBy
	}
}


//Request Route
export var requestRoute = (from, to, date, time, arrOrDep) => {
	//from, to: Station ID Strings
	//date: String, format YYYYMMDD
	//time: String, format HH:MM
	//arrOrDep: "arr" | "dep"

	return (dispatch) => {
		//base url
		var url = "http://www.wienerlinien.at/ogd_routing/XML_TRIP_REQUEST2?locationServerActive=1&ptOptionsActive=1&outputFormat=JSON";
		url += `&type_origin=stop&name_origin=${encodeURIComponent(from)}&type_destination=stop&name_destination=${encodeURIComponent(to)}&itdDate=${date}&itdTime=${time}&itdTripDateTimeDepArr=${arrOrDep}`;
		//number of routes calculated
		url += "&calcNumberOfTrips=5";
		//coords settings
		//url += "&coordListOutputFormat=list&coordOutputFormat=WGS84";
		//excluding everything but subway (would be ID 2)
		url += "&excludedMeans=0&excludedMeans=1&excludedMeans=3&excludedMeans=4&excludedMeans=5&excludedMeans=6&excludedMeans=7&excludedMeans=8&excludedMeans=9&excludedMeans=10&excludedMeans=11";
		
		//var base64Url = btoa(url);
		var apiUrl = "https://uncors.herokuapp.com/api?url="+encodeURIComponent(url);

		console.log('apiUrls',url,apiUrl);

		return axios.get(apiUrl).then((res) => {
			console.log('api response: ',res.data);
			if (res.data){
				try{

					var tripsArray = [];

					for (var i = 0; i < res.data.trips.length; i++) {
						var trip = res.data.trips[i];
						var tripObj = {};

						//console.log(trip);
						//console.log(trip.trip);

						//make liefe easier - data structure: {trips: [ { trip: {...obj} },   { trip: {...obj} }  ]}
						trip = trip.trip;

						tripObj['duration'] = trip.duration;
						tripObj['interchange'] = trip.interchange;

						//easy access to all used lines
						var linesArray = [];

						//get the parts of the route
						var partsArray = [];
						for (var ip = 0; ip < trip.legs.length; ip++) {
							var part = trip.legs[ip];

							var partObj = {};
							
							//easy access to all used lines
							linesArray.push(part.mode.number);

							partObj['line'] = part.mode.number;
							partObj['lineTo'] = part.mode.destination;
							partObj['depTime'] = part.points[0].dateTime.time;
							partObj['arrTime'] = part.points[1].dateTime.time;

							//station sequence the train passes
							var sequenceArray = [];
							for (var is = 0; is < part.stopSeq.length; is++) {
								sequenceArray.push(part.stopSeq[is].nameWO);
							}
							partObj['stops'] = sequenceArray;


							partsArray.push(partObj);
						}


						tripObj['parts'] = partsArray;
						//easy access to all used lines
						tripObj['lines'] = linesArray;

						//high-level departure is easy...
						tripObj['depStation'] = tripObj.parts[0].stops[0];
						tripObj['depTime'] = tripObj.parts[0].depTime;
						//...arrival more tricky
						var partsLength = tripObj.parts.length -1;
						var lastStopsLength = tripObj.parts[partsLength].stops.length -1;
						tripObj['arrStation'] = tripObj.parts[partsLength].stops[lastStopsLength];
						tripObj['arrTime'] = tripObj.parts[partsLength].depTime;
						

						console.log('tripObj',tripObj);
						tripsArray.push(tripObj);

					}


					console.log('tripsArray',tripsArray);
					dispatch({
						type: 'GET_TRIPS',
						trips: tripsArray
					});
					hashHistory.push('/trips');

				} catch (e){
					console.log(e);
				}
			}
		});
	}
}

//Get recent Routes
export var getLastRoutes = () => {
	return (dispatch) => {
		return idbRef.get('lastRoutes').then((lastRoutes) => {
			dispatch(dispatchLastRoutes(lastRoutes));
		});
	}
}
var dispatchLastRoutes = (array) => {
	if (typeof array == 'undefined' || array.length <= 0){
		return {
			type: 'GET_LAST_ROUTES',
			lastRoutes: []
		};
	}
	return {
		type: 'GET_LAST_ROUTES',
		lastRoutes: array
	};
}


//Set recent Route
export var setLastRoute = (routeObj) => {
	return (dispatch) => {
		return idbRef.get('lastRoutes').then((storedRoutes) => {

			if (typeof storedRoutes == 'undefined' || storedRoutes.length <= 0){
				storedRoutes = [
					routeObj
				];
			} else {
				//there are objects stored!

				if (storedRoutes.length > 9){
					//we want 10 entries max
					storedRoutes.pop();
				}
				//insert new route on top of array
				storedRoutes.splice(0, 0, routeObj);
			}

			//console.log('routeArray: ',storedRoutes);
			
			//store it
			idbRef.set('lastRoutes', storedRoutes);
			
			//refresh view
			getLastRoutes();

			return;
		});
	}
}

//Fetch Stations
export var getStations = () => {
	return (dispatch) => {
		return axios.get('/data/stations.json').then((res) => {
			if (res.data) {
				dispatch(dispatchGetStations(res.data));
			}
		});
	}
}

var dispatchGetStations = (array) => {
	if (typeof array == 'undefined' || array.length <= 0){
		return {
			type: 'GET_STATIONS',
			stations: []
		};
	}
	return {
		type: 'GET_STATIONS',
		stations: array
	};
}


//Fetch Lines
export var getLines = () => {
	return (dispatch) => {
		return axios.get('/data/lines.json').then((res) => {
			if (res.data) {
				dispatch(dispatchGetLines(res.data));
			}
		});
	}
}

var dispatchGetLines = (obj) => {
	if (typeof obj == 'undefined'){
		return {
			type: 'GET_LINES',
			lines: {}
		};
	}
	return {
		type: 'GET_LINES',
		lines: obj
	};
}

//Set active Station for offline View
export var setActiveStation = (stationId, allStationsArray) => {
	var activeStation = {};

	allStationsArray.map((station, index) => {
		if (station.id == stationId) {
			//found it!
			activeStation = station;
		}
    });
	hashHistory.push('/station');
    return {
		type: 'SET_SELECTED_STATION',
		activeStation
	};

}
