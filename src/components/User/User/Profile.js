"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Button_1 = require("@material-ui/core/Button");
var Menu_1 = require("@material-ui/core/Menu");
var MenuItem_1 = require("@material-ui/core/MenuItem");
var UserService_1 = require("../../../Services/UserService");
var core_1 = require("@material-ui/core");
var react_router_dom_1 = require("react-router-dom");
var Dialog_1 = require("@material-ui/core/Dialog");
var DialogActions_1 = require("@material-ui/core/DialogActions");
var DialogTitle_1 = require("@material-ui/core/DialogTitle");
function Profile() {
    var _a = React.useState(null), open = _a[0], close = _a[1];
    var _b = React.useState(false), profileRedirect = _b[0], setProfileRedirect = _b[1];
    var _c = React.useState(false), myRideRedirect = _c[0], setMyRideRedirect = _c[1];
    var _d = React.useState(false), dialogLogout = _d[0], setDialogLogout = _d[1];
    var handleClick = function (event) {
        close(event.currentTarget);
        setMyRideRedirect(false);
        setProfileRedirect(false);
    };
    var handleClose = function () {
        close(null);
    };
    var homeRedirect = function () {
        window.location.pathname = '/home';
    };
    var onDisagree = function () {
        setDialogLogout(false);
    };
    var onLogout = function () {
        setDialogLogout(false);
        UserService_1.default.logout();
        window.location.pathname = '/login';
    };
    var logout = function () {
        close(null);
        setDialogLogout(true);
    };
    var dialog = (React.createElement(Dialog_1.default, { fullScreen: true, open: dialogLogout, className: 'confirm-dialog' },
        React.createElement(DialogTitle_1.default, null, "Do you want to logout"),
        React.createElement(DialogActions_1.default, null,
            React.createElement(Button_1.default, { onClick: function () { return onDisagree(); }, color: "primary" }, "No"),
            React.createElement(Button_1.default, { onClick: function () { return onLogout(); }, color: "primary", autoFocus: true }, "Yes"))));
    return (React.createElement("div", { className: 'Avatar' },
        React.createElement(Button_1.default, { "aria-controls": "menu", onClick: handleClick, style: { margin: "0px 4px" } },
            React.createElement("p", { style: { margin: '5px', fontFamily: 'Roboto', fontSize: '1.2rem', textTransform: "capitalize" } }, UserService_1.default.currentUser.name),
            React.createElement(core_1.Avatar, null)),
        React.createElement(Menu_1.default, { id: "simple-menu", anchorEl: open, keepMounted: true, open: Boolean(open), onClose: handleClose },
            React.createElement(MenuItem_1.default, { onClick: function () { setProfileRedirect(true); close(null); } }, "Profile"),
            React.createElement(MenuItem_1.default, { onClick: function () { setMyRideRedirect(true); close(null); } }, "My Rides"),
            React.createElement(MenuItem_1.default, { onClick: logout }, "Logout"),
            profileRedirect ? React.createElement(react_router_dom_1.Redirect, { to: '/profile' }) : '',
            myRideRedirect ? React.createElement(react_router_dom_1.Redirect, { to: '/myride' }) : ''),
        React.createElement(core_1.ButtonBase, { style: { height: '2.8rem', width: '2rem' } },
            React.createElement(core_1.SvgIcon, { onClick: homeRedirect },
                React.createElement("path", { d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" }))),
        dialog));
}
exports.default = Profile;
//# sourceMappingURL=Profile.js.map