import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import "../../css/login-form.css";
import UserService from "../../Services/UserService";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { InputAdornment, CircularProgress, Button } from "@material-ui/core";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { LoginRequest } from "../../Classes/DataClasses/User";
import { LoginMeta } from "../../Classes/MetaClasses/User";
import { WrongPassword, ServerError } from "../User/Response";
import { Required } from "../../Classes/Constraint";
import { Redirect } from "react-router-dom";

export class LoginProps {
  credentials: LoginRequest;
  meta: LoginMeta;

  constructor() {
    this.credentials = new LoginRequest();
    this.meta = new LoginMeta();
  }
}

export default class Login extends React.Component<{}, LoginProps> {
  constructor(props: LoginProps) {
    super(props);
    this.state = new LoginProps();
  }

  componentDidMount = () => {
    UserService.initialStep();
  };

  onChanges = (event: any) => {
    this.setState({
      ...this.state,
      credentials: {
        ...this.state.credentials,
        [event.target.name]: event.target.value,
      },
    });
  };

  isEmpty(value: string) {
    return !value || (value && value.trim().length === 0);
  }

  isValidUserName(value: string) {
    let emptyStatus = this.isEmpty(value);
    this.setState({
      meta: { ...this.state.meta, userNameError: emptyStatus ? Required : "" },
    });
    return emptyStatus;
  }

  isValidPassword(value: string) {
    let emptyStatus = this.isEmpty(value);
    this.setState({
      meta: { ...this.state.meta, passwordError: emptyStatus ? Required : "" },
    });
    this.setState({});
    return emptyStatus;
  }

  onSubmit = (event: any) => {
    event.preventDefault();
    var isValid = this.isValidUserName(this.state.credentials.userName);
    isValid = isValid && this.isValidPassword(this.state.credentials.password);
    this.setState({
      ...this.state,
      meta: { ...this.state.meta, displaySpan: "", onSubmitClick: true },
    });

    if (!isValid) {
      UserService.login(this.state.credentials).then((value: any) => {
        if (value === "ok") {
          window.location.pathname = "/home";
        } else if (value === "wrong") {
          this.setState({
            ...this.state,
            meta: { ...this.state.meta, wrongPasswordError: true },
          });
        } else if (value === "servererror") {
          this.setState({
            ...this.state,
            meta: { ...this.state.meta, serverError: true },
          });
        }
      });
    }

    this.setState({
      ...this.state,
      meta: { ...this.state.meta, onSubmitClick: false },
    });
  };

  onSignUpRedirect = () => {
    this.setState({
      ...this.state,
      meta: { ...this.state.meta, redirectSignUp: true },
    });
  };

  onChangePasswordType = () => {
    this.state.meta.passwordType = !this.state.meta.passwordType;
    this.setState({ meta: this.state.meta });
  };

  render() {
    return (
      <Grid style={{ height: "100%" }}>
        <div className="login">
          <div className="header">
            <Typography component="h1" variant="h5" className="head">
              Log In
            </Typography>
            <div className="header-underline"></div>
          </div>
          <form className="form">
            <div className="input-box">
              <TextField
                variant="filled"
                className="input"
                value={this.state.credentials.userName}
                onChange={(event) => {
                  this.onChanges(event);
                  this.isValidUserName(event.target.value);
                }}
                name="userName"
                type="text"
                label="Enter Email or UserName Id "
                autoFocus
              />
              <span
                style={{ display: this.state.meta.displaySpan }}
                className="helper"
              >
                {this.state.meta.userNameError}
              </span>
            </div>
            <div className="input-box">
              <TextField
                variant="filled"
                className="input"
                value={this.state.credentials.password}
                onChange={(event) => {
                  this.onChanges(event);
                  this.isValidPassword(event.target.value);
                }}
                name="password"
                type={this.state.meta.passwordType ? "password" : "text"}
                label="Enter Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={this.onChangePasswordType}
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
              <span
                style={{ display: this.state.meta.displaySpan }}
                className="helper"
              >
                {this.state.meta.passwordError}
              </span>
            </div>
            {this.state.meta.wrongPasswordError ? <WrongPassword /> : ""}
            {this.state.meta.serverError ? <ServerError /> : ""}
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
            <p>Not a member yet ? </p>
            <div className="link">
              <div onClick={this.onSignUpRedirect} className="signup">
                {" "}
                SIGN UP
              </div>
              <div className="footer-underline"></div>
            </div>
          </div>
        </div>
        {this.state.meta.redirectSignUp ? <Redirect to="/signup" /> : ""}
        {this.state.meta.redirectHome ? <Redirect to="/home" /> : ""}
      </Grid>
    );
  }
}
