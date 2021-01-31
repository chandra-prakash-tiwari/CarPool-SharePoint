export class LoginMeta {
  userNameError: string;
  passwordError: string;
  passwordType: boolean;
  errorDisaplyOnSubmit: boolean;
  displaySpan: string;
  wrongPasswordError: boolean;
  serverError: boolean;
  redirectHome: boolean;
  redirectSignUp: boolean;
  onSubmitClick: boolean;

  constructor() {
    this.userNameError = "Required";
    this.passwordError = "Required";
    this.displaySpan = "none";
    this.passwordType = true;
    this.errorDisaplyOnSubmit = true;
    this.wrongPasswordError = false;
    this.serverError = false;
    this.redirectHome = false;
    this.redirectSignUp = false;
    this.onSubmitClick = false;
  }
}

export class SignUpMeta {
  nameError: string;
  mobileError: string;
  userNameError: string;
  addressError: string;
  drivingLicenceError: string;
  emailError: string;
  passwordError: string;
  passwordMatchError: string;
  userNameNotAvailable: boolean;
  emailNotAvailable: boolean;
  passwordType: boolean;
  redirectLogin: boolean;
  onSubmitClick: boolean;

  constructor() {
    this.nameError = "";
    this.mobileError = "";
    this.userNameError = "";
    this.addressError = "";
    this.drivingLicenceError = "";
    this.emailError = "";
    this.passwordError = "";
    this.passwordMatchError = "";
    this.passwordType = true;
    this.userNameNotAvailable = false;
    this.emailNotAvailable = false;
    this.redirectLogin = false;
    this.onSubmitClick = false;
  }
}
