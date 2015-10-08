/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./Utils.ts" />
/// <reference path="./SyncNode.ts" />
/// <reference path="./SyncNodeSocket.ts" />
/// <reference path="./BaseViews.tsx" />
/// <reference path="./Models.ts" />

"use strict"


namespace ShiftViews {





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
				//var sync = new SyncNodeSocket.SyncNodeSocket('shifts', data, 'http://timeclocker.azurewebsites.net');
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


					<List data={this.state.db.shifts} edit={this.edit.bind(this)} />


					{ this.state.selectedShift ? 
						<Edit item={this.state.selectedShift} employees={this.state.db.employees} />
					: null }
					

				</div>
			       );
		}
	}





	interface ListProps {
		data: {[key: string]: Models.Shift}; 
		edit: (shift: Models.Shift) => void;
	}
	interface ListState {
	}
	export class List extends BaseViews.SyncView<ListProps, ListState> {
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
		add() {
			var item: Models.Shift = {
			key: new Date().toISOString(),
			name: 'OPEN',
			day: 'Tuesday',
			start: '4pm',
			end: '10pm',
			note: ''
			};
			(this.props.data as SyncNode.ISyncNode).set(item.key, item);
		}
		render() {

			console.log('render list');

			var shifts = Utils.toArray(this.props.data); 
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
					<h4>List</h4>
					</div>
					<div role="main" className="ui-content">
					<ul data-role="listview" ref="listview">
					<li><button onClick={this.add.bind(this)}>Add Shift</button></li>
					{ nodes }
					</ul>
					</div>
					<div data-role="footer"><h4>-</h4></div>
					</div>
			       );
		}
	}


	interface EditProps {
		item: Models.Shift; 
		employees: {[key: string]: Models.Employee};
	}
	interface EditState {
		mutable: Models.Shift;
	}
	export class Edit extends BaseViews.SyncView<EditProps, EditState> {
		constructor(props: EditProps) {
			super(props);
			this.state = this.getMutableState(props.item);
		}
		componentWillReceiveProps(nextProps: EditProps) {
			console.log('nextProps', nextProps);
			this.setState(this.getMutableState(nextProps.item));
		}
		getMutableState(immutable: Models.Shift) {
			return { mutable: JSON.parse(JSON.stringify(immutable)) };
		}
		saveField(propName: string, e: React.FocusEvent) {
			this.props.item.set(propName, (e.target as HTMLInputElement).value);	
		}
		componentDidUpdate() {
			var domNode = React.findDOMNode(this.refs['listview']);
			$(domNode)['listview']('refresh');
		}
		remove() {
			this.props.item.parent.remove(this.props.item.key);
			window.history.back();
		}
		render() {
			var mutable: Models.Shift = (this.state.mutable || {}) as Models.Shift
			
			var names = Utils.toArray(this.props.employees, 'name').map((employee: Models.Employee) => {
				return ( <option key={employee.key}>{employee.name}</option> );
			});
			
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
					<label>Name: <select onBlur={this.saveField.bind(this, 'name')} value={mutable.name} onChange={this.handleChange.bind(this, 'mutable', 'name')}>
						<option>OPEN</option>
						{ names }
					</select></label>
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




}


$(document).bind("mobileinit", function(){
	// $.mobile.defaultPageTransition = 'slide';
});


$(document).ready(() => {
	// document.addEventListener('deviceready', () => {
	console.log('documentready');
	React.initializeTouchEvents(true);
	React.render(React.createElement(ShiftViews.Main, null), document.body);
});
