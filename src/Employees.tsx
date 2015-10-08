/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./Utils.ts" />
/// <reference path="./SyncNode.ts" />
/// <reference path="./SyncNodeSocket.ts" />
/// <reference path="./BaseViews.tsx" />
/// <reference path="./Models.ts" />

"use strict"


namespace EmployeeViews {

	interface MainState {
		db?: Models.Db;
		selectedShift?: Models.Shift;
		selectedEmployee?: Models.Employee;
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

					<List data={this.state.db.employees}
						edit={(item: Models.Employee) => { this.setState({ selectedEmployee: item}); }} />

					{ this.state.selectedEmployee ? 
						<Edit item={this.state.selectedEmployee as any}>
						</Edit>
					: null }

					</div>
			       );
		}
	}


	interface ListProps {
		data: {[key: string]: Models.Employee}; 
		edit: (obj: Models.Employee) => void;
	}
	interface ListState {
		newItem: string;
	}
	export class List extends BaseViews.SyncView<ListProps, ListState> {
		constructor(props: ListProps) {
			super(props);
			this.state = { newItem: '' };
		}
		componentDidUpdate() {
			var domNode = React.findDOMNode(this.refs['listview']);
			$(domNode)['listview']('refresh');
		}
		handleKeyUp(element: any, e: any) {
			if (e.keyCode === 13) {
				var item: Models.Employee = {
					key: new Date().toISOString(),
					name: e.target.value,
					phone: '',
					note: ''
				};
				(this.props.data as any).set(item.key, item);
				this.setState({ newItem: '' });
			}
		}
		handleTextChanged(e: React.KeyboardEvent) {
			this.setState({ newItem: (e.target as any).value });
		}
		addNew() {
			var obj: Models.Employee = {
			key: new Date().toISOString(),
			name: 'New Employee',
			phone: '',
			note: ''
			};
			(this.props.data as SyncNode.ISyncNode).set(obj.key, obj);
		}
		render() {

			console.log('render list');

			var nodes = Utils.toArray(this.props.data, 'name').map((obj: Models.Employee) => {
				
				return (
					<li key={obj.key}><a href="#edit" data-transition="slide" onClick={() => { this.props.edit(obj); }}>
						{obj.name}
					</a></li>
					       );
			});



			return ( 
					<div data-role="page" id="employees" ref="listpage">
					<div data-role="header">
					<h4>Employees</h4>
					</div>
					<div role="main" className="ui-content">
					<ul data-role="listview" ref="listview">
					<li>
					<input type="text" value={this.state.newItem} 
						onChange={this.handleTextChanged.bind(this)}
						ref={(el) => {
							var input = (React.findDOMNode(el) as any);
							if(input) {
								input.focus();
								input['onkeyup'] = (e: any) => { this.handleKeyUp(input, e); };
							}
					}} />

					</li>
					{ nodes }
					</ul>
					</div>
					<div data-role="footer"><h4>-</h4></div>
					</div>
			       );
		}
	}








	interface EditProps {
		item: Models.Employee;
	}
	interface EditState {
		mutable: Models.Employee;
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
		getMutableState(immutable: Models.Employee) {
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
			return ( 
					<div data-role="page" id="edit" ref="editpage">
					<div data-role="header">
					<a href="#" data-rel="back" data-direction="reverse" className="ui-btn-left ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-back">Back</a>
					<h4>Edit</h4>
					<button onClick={this.remove.bind(this)} className="ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-delete">Delete</button>
					</div>
					<div role="main" className="ui-content">
					<ul data-role="listview" ref="listview">	
						<li>Hereeeeeee!</li>
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
	React.render(React.createElement(EmployeeViews.Main, null), document.body);
});
