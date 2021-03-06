/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./Utils.ts" />
/// <reference path="./SyncNode.ts" />
/// <reference path="./SyncNodeSocket.ts" />
/// <reference path="./BaseViews.tsx" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var Shifts = (function (_super) {
        __extends(Shifts, _super);
        function Shifts() {
            _super.apply(this, arguments);
        }
        Shifts.prototype.componentDidUpdate = function () {
            var domNode = React.findDOMNode(this.refs['listview']);
            $(domNode)['listview']('refresh');
        };
        Shifts.prototype.handleKeyUp = function (element, e) {
            if (e.keyCode === 13) {
            }
        };
        Shifts.prototype.handleTextChanged = function (e) {
            //this.setState({ newList: (e.target as any).value });
        };
        Shifts.prototype.addShift = function () {
            var shift = {
                key: new Date().toISOString(),
                name: 'OPEN',
                day: 'Tuesday',
                start: '4pm',
                end: '10pm',
                note: ''
            };
            this.props.shifts.set(shift.key, shift);
        };
        Shifts.prototype.render = function () {
            var _this = this;
            console.log('render list');
            var shifts = Utils.toArray(this.props.shifts);
            var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var days = Utils.group(shifts, 'day', dayNames);
            var nodes = [];
            console.log('groups', days);
            dayNames.forEach(function (day) {
                nodes.push(React.createElement("li", {"data-role": "list-divider", "key": day}, day));
                days[day].forEach(function (shift) {
                    nodes.push(React.createElement("li", {"key": shift.key}, React.createElement("a", {"href": "#edit", "data-transition": "slide", "onClick": function () { _this.props.edit(shift); }}, React.createElement("h3", null, shift.name || '-'), React.createElement("p", {"className": "ui-li-aside"}, shift.day, " ", shift.start, " - ", shift.end), React.createElement("p", null, shift.note))));
                });
            });
            return (React.createElement("div", {"data-role": "page", "id": "list", "ref": "listpage"}, React.createElement("div", {"data-role": "header"}, React.createElement("h4", null, "Shifts")), React.createElement("div", {"role": "main", "className": "ui-content"}, React.createElement("ul", {"data-role": "listview", "ref": "listview"}, React.createElement("li", null, React.createElement("button", {"onClick": this.addShift.bind(this)}, "Add Shift")), nodes)), React.createElement("div", {"data-role": "footer"}, React.createElement("h4", null, "-"))));
        };
        return Shifts;
    })(BaseViews.SyncView);
    Views.Shifts = Shifts;
    var EditShift = (function (_super) {
        __extends(EditShift, _super);
        function EditShift(props) {
            _super.call(this, props);
            this.state = this.getMutableState(props.shift);
        }
        EditShift.prototype.componentWillReceiveProps = function (nextProps) {
            console.log('nextProps', nextProps);
            this.setState(this.getMutableState(nextProps.shift));
        };
        EditShift.prototype.getMutableState = function (immutable) {
            return { mutable: JSON.parse(JSON.stringify(immutable)) };
        };
        EditShift.prototype.saveField = function (propName, e) {
            this.props.shift.set(propName, e.target.value);
        };
        EditShift.prototype.componentDidUpdate = function () {
            var domNode = React.findDOMNode(this.refs['listview']);
            $(domNode)['listview']('refresh');
        };
        EditShift.prototype.remove = function () {
            this.props.shift.parent.remove(this.props.shift.key);
            window.history.back();
        };
        EditShift.prototype.render = function () {
            var mutable = (this.state.mutable || {});
            var names = Utils.toArray(this.props.employees, 'name').map(function (employee) {
                return (React.createElement("option", {"key": employee.key}, employee.name));
            });
            return (React.createElement("div", {"data-role": "page", "id": "edit", "ref": "editpage"}, React.createElement("div", {"data-role": "header"}, React.createElement("a", {"href": "#", "data-rel": "back", "data-direction": "reverse", "className": "ui-btn-left ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-back"}, "Back"), React.createElement("h4", null, "Edit"), React.createElement("button", {"onClick": this.remove.bind(this), "className": "ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-delete"}, "Delete")), React.createElement("div", {"role": "main", "className": "ui-content"}, React.createElement("ul", {"data-role": "listview", "ref": "listview"}, React.createElement("li", {"data-role": "fieldcontain"}, React.createElement("label", null, "Day: ", React.createElement("select", {"type": "text", "onBlur": this.saveField.bind(this, 'day'), "value": mutable.day, "onChange": this.handleChange.bind(this, 'mutable', 'day')}, React.createElement("option", null, "Sunday"), React.createElement("option", null, "Monday"), React.createElement("option", null, "Tuesday"), React.createElement("option", null, "Wednesday"), React.createElement("option", null, "Thursday"), React.createElement("option", null, "Friday"), React.createElement("option", null, "Saturday")))), React.createElement("li", {"data-role": "fieldcontain"}, React.createElement("label", null, "Name: ", React.createElement("select", {"onBlur": this.saveField.bind(this, 'name'), "value": mutable.name, "onChange": this.handleChange.bind(this, 'mutable', 'name')}, React.createElement("option", null, "OPEN"), names))), React.createElement("li", {"data-role": "fieldcontain"}, React.createElement("label", null, "Start: ", React.createElement("input", {"type": "text", "onBlur": this.saveField.bind(this, 'start'), "value": mutable.start, "onChange": this.handleChange.bind(this, 'mutable', 'start')})), React.createElement("label", null, "End: ", React.createElement("input", {"type": "text", "onBlur": this.saveField.bind(this, 'end'), "value": mutable.end, "onChange": this.handleChange.bind(this, 'mutable', 'end')})), React.createElement("label", null, "Note: ", React.createElement("input", {"type": "text", "onBlur": this.saveField.bind(this, 'note'), "value": mutable.note, "onChange": this.handleChange.bind(this, 'mutable', 'note')})))))));
        };
        return EditShift;
    })(BaseViews.SyncView);
    Views.EditShift = EditShift;
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main(props) {
            var _this = this;
            _super.call(this, props);
            var data = { employees: {}, shifts: {} };
            document.addEventListener('deviceready', function () {
                console.log('	deviceready 4');
                var sync = new SyncNodeSocket.SyncNodeSocket('shifts', data, 'http://localhost:1337');
                //var sync = new SyncNodeSocket.SyncNodeSocket('shifts', data, 'http://timeclocker.azurewebsites.net');
                sync.onUpdated(function (updated) {
                    console.log('updated data!', updated);
                    var newState = { db: updated };
                    if (_this.state.selectedShift)
                        newState.selectedShift = updated.shifts[_this.state.selectedShift.key];
                    _this.setState(newState);
                });
            });
            this.state = { db: data, selectedShift: null };
        }
        Main.prototype.edit = function (shift) {
            this.setState({ selectedShift: shift });
        };
        Main.prototype.render = function () {
            var _this = this;
            return (React.createElement("div", null, this.state.selectedShift ?
                React.createElement(EditShift, {"shift": this.state.selectedShift, "employees": this.state.db.employees})
                : null, React.createElement(Employees, {"data": this.state.db.employees, "edit": function (item) { _this.setState({ selectedEmployee: item }); }}), this.state.selectedEmployee ?
                React.createElement(EditItem, {"item": this.state.selectedEmployee}, React.createElement("h1", null, "From Children!"))
                : null));
        };
        return Main;
    })(React.Component);
    Views.Main = Main;
    var Employees = (function (_super) {
        __extends(Employees, _super);
        function Employees(props) {
            _super.call(this, props);
            this.state = { newItem: '' };
        }
        Employees.prototype.componentDidUpdate = function () {
            var domNode = React.findDOMNode(this.refs['listview']);
            $(domNode)['listview']('refresh');
        };
        Employees.prototype.handleKeyUp = function (element, e) {
            if (e.keyCode === 13) {
                var item = {
                    key: new Date().toISOString(),
                    name: e.target.value,
                    phone: '',
                    note: ''
                };
                this.props.data.set(item.key, item);
                this.setState({ newItem: '' });
            }
        };
        Employees.prototype.handleTextChanged = function (e) {
            this.setState({ newItem: e.target.value });
        };
        Employees.prototype.addNew = function () {
            var obj = {
                key: new Date().toISOString(),
                name: 'New Employee',
                phone: '',
                note: ''
            };
            this.props.data.set(obj.key, obj);
        };
        Employees.prototype.render = function () {
            var _this = this;
            console.log('render list');
            var nodes = Utils.toArray(this.props.data, 'name').map(function (obj) {
                return (React.createElement("li", {"key": obj.key}, React.createElement("a", {"href": "#edit", "data-transition": "slide", "onClick": function () { _this.props.edit(obj); }}, obj.name)));
            });
            return (React.createElement("div", {"data-role": "page", "id": "employees", "ref": "listpage"}, React.createElement("div", {"data-role": "header"}, React.createElement("h4", null, "Employees")), React.createElement("div", {"role": "main", "className": "ui-content"}, React.createElement("ul", {"data-role": "listview", "ref": "listview"}, React.createElement("li", null, React.createElement("input", {"type": "text", "value": this.state.newItem, "onChange": this.handleTextChanged.bind(this), "ref": function (el) {
                var input = React.findDOMNode(el);
                if (input) {
                    input.focus();
                    input['onkeyup'] = function (e) { _this.handleKeyUp(input, e); };
                }
            }})), nodes)), React.createElement("div", {"data-role": "footer"}, React.createElement("h4", null, "-"))));
        };
        return Employees;
    })(BaseViews.SyncView);
    Views.Employees = Employees;
    var EditItem = (function (_super) {
        __extends(EditItem, _super);
        function EditItem(props) {
            _super.call(this, props);
            this.state = this.getMutableState(props.item);
        }
        EditItem.prototype.componentWillReceiveProps = function (nextProps) {
            console.log('nextProps', nextProps);
            this.setState(this.getMutableState(nextProps.item));
        };
        EditItem.prototype.getMutableState = function (immutable) {
            return { mutable: JSON.parse(JSON.stringify(immutable)) };
        };
        EditItem.prototype.saveField = function (propName, e) {
            this.props.item.set(propName, e.target.value);
        };
        EditItem.prototype.componentDidUpdate = function () {
            var domNode = React.findDOMNode(this.refs['listview']);
            $(domNode)['listview']('refresh');
        };
        EditItem.prototype.remove = function () {
            this.props.item.parent.remove(this.props.item.key);
            window.history.back();
        };
        EditItem.prototype.render = function () {
            return (React.createElement("div", {"data-role": "page", "id": "edit", "ref": "editpage"}, React.createElement("div", {"data-role": "header"}, React.createElement("a", {"href": "#", "data-rel": "back", "data-direction": "reverse", "className": "ui-btn-left ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-back"}, "Back"), React.createElement("h4", null, "Edit"), React.createElement("button", {"onClick": this.remove.bind(this), "className": "ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-delete"}, "Delete")), React.createElement("div", {"role": "main", "className": "ui-content"}, React.createElement("ul", {"data-role": "listview", "ref": "listview"}, React.createElement("li", null, "Here!"), this.props.children))));
        };
        return EditItem;
    })(BaseViews.SyncView);
    Views.EditItem = EditItem;
})(Views || (Views = {}));
$(document).bind("mobileinit", function () {
    // $.mobile.defaultPageTransition = 'slide';
});
$(document).ready(function () {
    // document.addEventListener('deviceready', () => {
    console.log('documentready');
    React.initializeTouchEvents(true);
    React.render(React.createElement(Views.Main, null), document.body);
});
//# sourceMappingURL=Views.js.map