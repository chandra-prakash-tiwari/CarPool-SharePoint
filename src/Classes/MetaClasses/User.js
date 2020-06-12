"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoginMeta = /** @class */ (function () {
    function LoginMeta() {
        this.userNameError = 'Required';
        this.passwordError = 'Required';
        this.displaySpan = 'none';
        this.passwordType = true;
        this.errorDisaplyOnSubmit = true;
        this.wrongPasswordError = false;
        this.serverError = false;
        this.redirectHome = false;
        this.redirectSignUp = false;
    }
    return LoginMeta;
}());
exports.LoginMeta = LoginMeta;
var SignUpMeta = /** @class */ (function () {
    function SignUpMeta() {
        this.nameError = '';
        this.mobileError = '';
        this.userNameError = '';
        this.addressError = '';
        this.drivingLicenceError = '';
        this.emailError = '';
        this.passwordError = '';
        this.passwordMatchError = '';
        this.passwordType = true;
        this.userNameNotAvailable = false;
        this.emailNotAvailable = false;
        this.redirectLogin = false;
    }
    return SignUpMeta;
}());
exports.SignUpMeta = SignUpMeta;
//# sourceMappingURL=User.js.map