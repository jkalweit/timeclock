/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./Utils.ts" />
/// <reference path="./SyncNode.ts" />
/// <reference path="./SyncNodeSocket.ts" />
/// <reference path="./BaseViews.tsx" />
/// <reference path="./Models.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ShiftViews;
(function (ShiftViews) {
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
            return (React.createElement("div", null, React.createElement(List, {"data": this.state.db.shifts, "edit": this.edit.bind(this)}), this.state.selectedShift ?
                React.createElement(Edit, {"item": this.state.selectedShift, "employees": this.state.db.employees})
                : null));
        };
        return Main;
    })(React.Component);
    ShiftViews.Main = Main;
    var List = (function (_super) {
        __extends(List, _super);
        function List() {
            _super.apply(this, arguments);
        }
        List.prototype.componentDidUpdate = function () {
            var domNode = React.findDOMNode(this.refs['listview']);
            $(domNode)['listview']('refresh');
        };
        List.prototype.handleKeyUp = function (element, e) {
            if (e.keyCode === 13) {
            }
        };
        List.prototype.handleTextChanged = function (e) {
            //this.setState({ newList: (e.target as any).value });
        };
        List.prototype.add = function () {
            var item = {
                key: new Date().toISOString(),
                name: 'OPEN',
                day: 'Tuesday',
                start: '4pm',
                end: '10pm',
                note: ''
            };
            this.props.data.set(item.key, item);
        };
        List.prototype.render = function () {
            var _this = this;
            console.log('render list');
            var shifts = Utils.toArray(this.props.data);
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
            return (React.createElement("div", {"data-role": "page", "id": "list", "ref": "listpage"}, React.createElement("div", {"data-role": "header"}, React.createElement("h4", null, "List")), React.createElement("div", {"role": "main", "className": "ui-content"}, React.createElement("ul", {"data-role": "listview", "ref": "listview"}, React.createElement("li", null, React.createElement("button", {"onClick": this.add.bind(this)}, "Add Shift")), nodes)), React.createElement("div", {"data-role": "footer"}, React.createElement("h4", null, "-"))));
        };
        return List;
    })(BaseViews.SyncView);
    ShiftViews.List = List;
    var Edit = (function (_super) {
        __extends(Edit, _super);
        function Edit(props) {
            _super.call(this, props);
            this.state = this.getMutableState(props.item);
        }
        Edit.prototype.componentWillReceiveProps = function (nextProps) {
            console.log('nextProps', nextProps);
            this.setState(this.getMutableState(nextProps.item));
        };
        Edit.prototype.getMutableState = function (immutable) {
            return { mutable: JSON.parse(JSON.stringify(immutable)) };
        };
        Edit.prototype.saveField = function (propName, e) {
            this.props.item.set(propName, e.target.value);
        };
        Edit.prototype.componentDidUpdate = function () {
            var domNode = React.findDOMNode(this.refs['listview']);
            $(domNode)['listview']('refresh');
        };
        Edit.prototype.remove = function () {
            this.props.item.parent.remove(this.props.item.key);
            window.history.back();
        };
        Edit.prototype.render = function () {
            var mutable = (this.state.mutable || {});
            var names = Utils.toArray(this.props.employees, 'name').map(function (employee) {
                return (React.createElement("option", {"key": employee.key}, employee.name));
            });
            return (React.createElement("div", {"data-role": "page", "id": "edit", "ref": "editpage"}, React.createElement("div", {"data-role": "header"}, React.createElement("a", {"href": "#", "data-rel": "back", "data-direction": "reverse", "className": "ui-btn-left ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-back"}, "Back"), React.createElement("h4", null, "Edit"), React.createElement("button", {"onClick": this.remove.bind(this), "className": "ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-delete"}, "Delete")), React.createElement("div", {"role": "main", "className": "ui-content"}, React.createElement("ul", {"data-role": "listview", "ref": "listview"}, React.createElement("li", {"data-role": "fieldcontain"}, React.createElement("label", null, "Day: ", React.createElement("select", {"type": "text", "onBlur": this.saveField.bind(this, 'day'), "value": mutable.day, "onChange": this.handleChange.bind(this, 'mutable', 'day')}, React.createElement("option", null, "Sunday"), React.createElement("option", null, "Monday"), React.createElement("option", null, "Tuesday"), React.createElement("option", null, "Wednesday"), React.createElement("option", null, "Thursday"), React.createElement("option", null, "Friday"), React.createElement("option", null, "Saturday")))), React.createElement("li", {"data-role": "fieldcontain"}, React.createElement("label", null, "Name: ", React.createElement("select", {"onBlur": this.saveField.bind(this, 'name'), "value": mutable.name, "onChange": this.handleChange.bind(this, 'mutable', 'name')}, React.createElement("option", null, "OPEN"), names))), React.createElement("li", {"data-role": "fieldcontain"}, React.createElement("label", null, "Start: ", React.createElement("input", {"type": "text", "onBlur": this.saveField.bind(this, 'start'), "value": mutable.start, "onChange": this.handleChange.bind(this, 'mutable', 'start')})), React.createElement("label", null, "End: ", React.createElement("input", {"type": "text", "onBlur": this.saveField.bind(this, 'end'), "value": mutable.end, "onChange": this.handleChange.bind(this, 'mutable', 'end')})), React.createElement("label", null, "Note: ", React.createElement("input", {"type": "text", "onBlur": this.saveField.bind(this, 'note'), "value": mutable.note, "onChange": this.handleChange.bind(this, 'mutable', 'note')})))))));
        };
        return Edit;
    })(BaseViews.SyncView);
    ShiftViews.Edit = Edit;
})(ShiftViews || (ShiftViews = {}));
$(document).bind("mobileinit", function () {
    // $.mobile.defaultPageTransition = 'slide';
});
$(document).ready(function () {
    // document.addEventListener('deviceready', () => {
    console.log('documentready');
    React.initializeTouchEvents(true);
    React.render(React.createElement(ShiftViews.Main, null), document.body);
});
//# sourceMappingURL=Shifts.js.map