/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./Utils.ts" />
/// <reference path="./SyncNode.ts" />
/// <reference path="./SyncNodeSocket.ts" />
/// <reference path="./BaseViews.tsx" />

"use strict"

namespace Models {

	export interface Db extends SyncNode.ISyncNode {
		employees: {[key: string]: Employee};
		//weeks: {[key: string]: Week};
		shifts: {[key: string]: Shift};
	}
	export interface Employee extends SyncNode.ISyncNode {
		key: string;
		name: string;
		phone: string;
	}
	export interface Week extends SyncNode.ISyncNode {
		key: string;
		shifts: {[key: string]: Shift};
	}
	export interface Shift extends SyncNode.ISyncNode {
		key: string;
		name: string;
		day: string;
		start: string;
		end: string;
		note: string;
	}

}

namespace Views {


	interface ShiftsProps {
		shifts: {[key: string]: Models.Shift}; 
		edit: (shift: Models.Shift) => void;
	}
	interface ShiftsState {
	}
	export class Shifts extends BaseViews.SyncView<ShiftsProps, ShiftsState> {
		componentDidUpdate() {
			var domNode = React.findDOMNode(this.refs['listview']);
			$(domNode)['listview']('refresh');
		}
		handleKeyUp(element: any, e: any) {
			if (e.keyCode === 13) {
				//var todoList: Models.TodoList = {
				//key: new Date().toISOString(),
				//text: e.target.value,
				//todos: {}
				//};
				//(this.props.lists as any).set(todoList.key, todoList);
				//this.setState({ newList: '' });
			}
		}
		handleTextChanged(e: React.KeyboardEvent) {
			//this.setState({ newList: (e.target as any).value });
		}
		addShift() {
			var shift: Models.Shift = {
			key: new Date().toISOString(),
			name: 'Daryl',
			day: 'Tuesday',
			start: '4pm',
			end: '10pm',
			note: 'A note.'
			};
			(this.props.shifts as SyncNode.ISyncNode).set(shift.key, shift);
		}
		render() {

			console.log('render list');

			var shifts = Utils.toArray(this.props.shifts); 
			var dayNames =  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			var days = Utils.group(shifts, 'day', dayNames);


			var nodes: any[] = [];
			console.log('groups', days);
			dayNames.forEach((day: string) => {
				nodes.push(<li data-role="list-divider" key={day}>{day}</li>);

				days[day].forEach((shift: Models.Shift) => {

					nodes.push(
						<li key={shift.key}><a href="#edit" data-transition="slide" onClick={() => { this.props.edit(shift); }}>
						<h3>{shift.name || '-'}</h3>
						<p className="ui-li-aside">{shift.day} {shift.start} - {shift.end}</p>
						<p>{shift.note}</p>
						</a></li>
					       );
				});

			});



			return ( 
					<div data-role="page" id="list" ref="listpage">
					<div data-role="header">
					<h4>Shifts</h4>
					</div>
					<div role="main" className="ui-content">
					<ul data-role="listview" ref="listview">
					<li><button onClick={this.addShift.bind(this)}>Add Shift</button></li>
					{ nodes }
					</ul>
					</div>
					<div data-role="footer"><h4>-</h4></div>
					</div>
			       );
		}
	}


	interface EditShiftProps {
		shift: Models.Shift; 
	}
	interface EditShiftState {
		mutable: Models.Shift;
	}
	export class EditShift extends BaseViews.SyncView<EditShiftProps, EditShiftState> {
		constructor(props: EditShiftProps) {
			super(props);
			this.state = this.getMutableState(props.shift);
		}
		componentWillReceiveProps(nextProps: EditShiftProps) {
			console.log('nextProps', nextProps);
			this.setState(this.getMutableState(nextProps.shift));
		}
		getMutableState(immutable: Models.Shift) {
			return { mutable: JSON.parse(JSON.stringify(immutable)) };
		}
		saveField(propName: string, e: React.FocusEvent) {
			this.props.shift.set(propName, (e.target as HTMLInputElement).value);	
		}
		componentDidUpdate() {
			var domNode = React.findDOMNode(this.refs['listview']);
			$(domNode)['listview']('refresh');
		}
		remove() {
			this.props.shift.parent.remove(this.props.shift.key);
			window.history.back();
		}
		render() {
			var mutable: Models.Shift = (this.state.mutable || {}) as Models.Shift
			return ( 
					<div data-role="page" id="edit" ref="editpage">
					<div data-role="header">
					<a href="#" data-rel="back" data-direction="reverse" className="ui-btn-left ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-back">Back</a>
					<h4>Edit</h4>
					<button onClick={this.remove.bind(this)} className="ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-delete">Delete</button>
					</div>
					<div role="main" className="ui-content">
					<ul data-role="listview" ref="listview">	
					<li data-role="fieldcontain">
					<label>Day: <select type="text" onBlur={this.saveField.bind(this, 'day')} value={mutable.day} onChange={this.handleChange.bind(this, 'mutable', 'day')}>
					<option>Sunday</option>
					<option>Monday</option>
					<option>Tuesday</option>
					<option>Wednesday</option>
					<option>Thursday</option>
					<option>Friday</option>
					<option>Saturday</option>
					</select>
					</label>
					</li>
					<li data-role="fieldcontain">
					<label>Name: <input type="text" onBlur={this.saveField.bind(this, 'name')} value={mutable.name} onChange={this.handleChange.bind(this, 'mutable', 'name')} /></label>
					</li>
					<li data-role="fieldcontain">
					<label>Start: <input type="text" onBlur={this.saveField.bind(this, 'start')} value={mutable.start} onChange={this.handleChange.bind(this, 'mutable', 'start')} /></label>
					<label>End: <input type="text" onBlur={this.saveField.bind(this, 'end')} value={mutable.end} onChange={this.handleChange.bind(this, 'mutable', 'end')} /></label>
					<label>Note: <input type="text" onBlur={this.saveField.bind(this, 'note')} value={mutable.note} onChange={this.handleChange.bind(this, 'mutable', 'note')} /></label>
					</li>
					</ul>
					</div>
					</div>
					);
		}
	}





	interface MainState {
		db?: Models.Db;
		selectedShift?: Models.Shift;
	}
	export class Main extends React.Component<{}, MainState> {
		constructor(props: {}) {
			super(props);

			var data: Models.Db = { employees: {},  shifts: {} };

			document.addEventListener('deviceready', () => {
				console.log('	deviceready 4');
				var sync = new SyncNodeSocket.SyncNodeSocket('shifts', data, 'http://localhost:1337');
				sync.onUpdated((updated: Models.Db) => {
					console.log('updated data!', updated);
					var newState: MainState = { db: updated };
					if(this.state.selectedShift) newState.selectedShift = updated.shifts[this.state.selectedShift.key];
					this.setState(newState);
				});

			});
			this.state = { db: data, selectedShift: null };
		}
		edit(shift: Models.Shift) {
			this.setState({ selectedShift: shift });
		}
		render() {
			return ( 
					<div>	

					<Shifts shifts={this.state.db.shifts} edit={this.edit.bind(this)} />

					{ this.state.selectedShift ? 
						<EditShift shift={this.state.selectedShift} />
				: null }

				</div>
			       );
		}
	}
}


$(document).bind("mobileinit", function(){
	// $.mobile.defaultPageTransition = 'slide';
});


$(document).ready(() => {
	// document.addEventListener('deviceready', () => {
	console.log('documentready');
	React.initializeTouchEvents(true);
	React.render(React.createElement(Views.Main, null), document.body);
});
