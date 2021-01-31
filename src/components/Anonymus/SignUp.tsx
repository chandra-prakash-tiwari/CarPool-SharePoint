import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import UserService from "../../Services/UserService";
import "../../css/sign-up-form.css";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  Button,
  InputAdornment,
  Tooltip,
  CircularProgress,
} from "@material-ui/core";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { User } from "../../Classes/DataClasses/User";
import { SignUpMeta } from "../../Classes/MetaClasses/User";
import {
  Required,
  Invalid,
  NameRegex,
  EmailRegex,
  MobileNumberRegex,
  PasswordRegex,
  UserNameAvailability,
} from "../../Classes/Constraint";
import { Redirect } from "react-router-dom";

export class SignUpProps {
  user: User;
  meta: SignUpMeta;

  constructor() {
    this.user = new User();
    this.meta = new SignUpMeta();
  }
}

export default class SignUp extends React.Component<{}, SignUpProps> {
  constructor(props: SignUpProps) {
    super(props);
    this.state = new SignUpProps();
  }

  isEmpty(value: string) {
    return !value || (value && value.trim().length === 0);
  }

  isValid(value: string, regex: RegExp) {
    return !value.match(regex);
  }

  hasEmail(value: string) {
    return UserService.validEmail(value).then((valid) => {
      return valid;
    });
  }

  isValidName(value: string) {
    this.state.user.name = value;
    this.setState({ user: this.state.user });
    let emptyStatus = !this.isEmpty(value);
    let isValidExp = !this.isValid(value, NameRegex);
    this.state.meta.nameError = !emptyStatus
      ? Required
      : !isValidExp
      ? Invalid
      : "";
    this.setState({ meta: this.state.meta });
    return (emptyStatus && isValidExp) === true ? 0 : 1;
  }

  isValidEmail(value: string) {
    this.state.user.email = value;
    this.setState({ user: this.state.user });
    let emptyStatus = this.isEmpty(value);

    if (!emptyStatus) {
      let isValidExp = !this.isValid(value, EmailRegex);
      this.state.meta.emailError = !isValidExp ? Invalid : "";
      this.setState({ meta: this.state.meta });
      if (isValidExp) {
        UserService.validEmail(value).then(async (response) => {
          this.state.meta.emailError = (await response)
            ? "email is registered"
            : "";
          this.setState({ meta: this.state.meta });
          return (await response) ? 1 : 0;
        });
      }
      return 0;
    }

    this.state.meta.emailError = emptyStatus ? Required : "";
    this.setState({ meta: this.state.meta });
    return 1;
  }

  isValidMobileNumber(value: string) {
    this.state.user.mobile = value;
    this.setState({ user: this.state.user });
    let emptyStatus = !this.isEmpty(value);
    let isValidExp = !this.isValid(value, MobileNumberRegex);
    this.state.meta.mobileError = !emptyStatus
      ? Required
      : !isValidExp
      ? Invalid
      : "";
    this.setState({ ...this.state, meta: this.state.meta });
    return (emptyStatus && isValidExp) === true ? 0 : 1;
  }

  isValidPassword(value: string) {
    this.state.user.password = value;
    this.setState({ user: this.state.user });
    let emptyStatus = !this.isEmpty(value);
    let validStatus = !this.isValid(value, PasswordRegex);
    this.state.meta.passwordError = !emptyStatus
      ? Required
      : !validStatus
      ? Invalid
      : "";
    this.setState({ meta: this.state.meta });
    return (emptyStatus && validStatus) === true ? 0 : 1;
  }

  isValidUserName(value: string) {
    this.state.user.userName = value;
    this.setState({ user: this.state.user });
    let emptyStatus = this.isEmpty(value);
    if (!emptyStatus) {
      UserService.validUserName(value).then((response) => {
        this.state.meta.userNameError = response ? UserNameAvailability : "";
        this.setState({ meta: this.state.meta });
        return response ? 1 : 0;
      });
    }

    this.state.meta.userNameError = emptyStatus ? Required : "";
    this.setState({ meta: this.state.meta });
    return emptyStatus === true ? 1 : 0;
  }

  isEqualPassword(value: string) {
    this.state.user.confirmPassword = value;
    this.setState({ user: this.state.user });
    let emptyStatus = this.isEmpty(value);
    let validStatus = value !== this.state.user.password;
    this.state.meta.passwordMatchError = emptyStatus
      ? Required
      : validStatus
      ? "password not matched"
      : "";
    this.setState({ meta: this.state.meta });
    return (emptyStatus && validStatus) === true ? 1 : 0;
  }

  isValidAddress(value: string) {
    this.state.user.address = value;
    this.setState({ user: this.state.user });
    let emptyStatus = !this.isEmpty(value);
    this.state.meta.addressError = !emptyStatus ? Required : "";
    this.setState({ ...this.state, meta: this.state.meta });
    return emptyStatus === true ? 0 : 1;
  }

  isValidDrivingLicence(value: string) {
    this.state.user.drivingLicence = value;
    this.setState({ user: this.state.user });
  }

  onLoginRedirect = () => {
    this.setState({
      ...this.state,
      meta: { ...this.state.meta, redirectLogin: true },
    });
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    let isValid =
      this.isValidName(this.state.user.name) +
      this.isValidAddress(this.state.user.address) +
      this.isValidMobileNumber(this.state.user.mobile) +
      this.isValidUserName(this.state.user.userName) +
      this.isValidPassword(this.state.user.password) +
      this.isEqualPassword(this.state.user.password) +
      this.isValidEmail(this.state.user.email);
    if (isValid === 0) {
      UserService.addNewUser(this.state.user).then((response: any) => {
        if (response === "Ok") {
          this.state.meta.redirectLogin = true;
          this.setState({ meta: this.state.meta });
        } else if (response === "Reject") {
        }
      });
    }
  };

  render() {
    return (
      <Grid style={{ height: "100%" }}>
        <div className="signup">
          <div className="header">
            <Typography className="head" component="h1" variant="h5">
              Sign Up
            </Typography>
            <div className="header-underline"></div>
          </div>
          <form className="form">
            <div className="input-box">
              <TextField
                className="input"
                variant="filled"
                onChange={(event: any) => {
                  this.isValidName(event.target.value);
                }}
                value={this.state.user.name}
                label="Name"
                type="text"
                name="name"
                autoFocus
              />
              <span className="helper">{this.state.meta.nameError}</span>
            </div>
            <div className="input-box">
              <TextField
                className="input"
                variant="filled"
                onChange={(event) => {
                  this.isValidMobileNumber(event.target.value);
                }}
                value={this.state.user.mobile}
                label="Mobile"
                name="mobile"
              />
              <span className="helper">{this.state.meta.mobileError}</span>
            </div>
            <div className="input-box">
              <TextField
                className="input"
                variant="filled"
                onChange={(event) => {
                  this.isValidUserName(event.target.value);
                }}
                value={this.state.user.userName}
                label="UserName"
                name="userName"
              />
              <span className="helper">{this.state.meta.userNameError}</span>
            </div>
            <div className="input-box">
              <TextField
                className="input"
                variant="filled"
                onChange={(event) => {
                  this.isValidAddress(event.target.value);
                }}
                value={this.state.user.address}
                label="Address"
                name="address"
              />
              <span className="helper">{this.state.meta.addressError}</span>
            </div>
            <div className="input-box">
              <TextField
                className="input"
                variant="filled"
                onChange={(event) => {
                  this.isValidDrivingLicence(event.target.value);
                }}
                value={this.state.user.drivingLicence}
                label="Driving Licenece"
                name="drivingLicence"
              />
              <span className="helper">
                {this.state.meta.drivingLicenceError}
              </span>
            </div>
            <div className="input-box">
              <TextField
                className="input"
                variant="filled"
                onChange={(event) => {
                  this.isValidEmail(event.target.value);
                }}
                value={this.state.user.email}
                label="Email Address"
                name="email"
                type="email"
              />
              <span className="helper">{this.state.meta.emailError}</span>
            </div>
            <div className="input-box">
              <Tooltip
                title="Password contain 8-15 character and atleast one numberic, upper alphabet, lower alphabet and special character"
                placement="bottom"
              >
                <TextField
                  className="input"
                  variant="filled"
                  onChange={(event) => {
                    this.isValidPassword(event.target.value);
                  }}
                  value={this.state.user.password}
                  name="password"
                  label="Password"
                  type={this.state.meta.passwordType ? "password" : "text"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        onClick={() => {
                          this.setState({
                            meta: {
                              ...this.state.meta,
                              passwordType: !this.state.meta.passwordType,
                            },
                          });
                        }}
                      >
                        {this.state.meta.passwordType ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOff />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Tooltip>
              <span className="helper">{this.state.meta.passwordError}</span>
            </div>
            <div className="input-box">
              <TextField
                className="input"
                variant="filled"
                onChange={(event) => {
                  this.isEqualPassword(event.target.value);
                }}
                value={this.state.user.confirmPassword}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
              />
              <span className="helper">
                {this.state.meta.passwordMatchError}
              </span>
            </div>
            <div className="submit-root">
              <div className="submit">
                <Button
                  variant="contained"
                  color="primary"
                  disabled={this.state.meta.onSubmitClick}
                  onClick={this.onSubmit}
                >
                  Submit
                </Button>
                {this.state.meta.onSubmitClick && (
                  <CircularProgress size={24} className="circularProcess" />
                )}
              </div>
            </div>
          </form>
          <div className="footer">
            <p>Already a member ? </p>
            <div className="link">
              <div onClick={this.onLoginRedirect} className="login">
                {" "}
                LOGIN
              </div>
              <div className="footer-underline"></div>
            </div>
          </div>
        </div>
        {this.state.meta.redirectLogin ? <Redirect to="/login" /> : ""}
      </Grid>
    );
  }
}
