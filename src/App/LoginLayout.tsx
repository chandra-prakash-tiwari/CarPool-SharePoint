import * as React from "react";
import { CssBaseline, Grid, Paper } from "@material-ui/core";
import Login from "../components/Anonymus/Login";
import Text from "../components/Anonymus/Text";

export default class LoginLayout extends React.Component {
  render() {
    return (
      <Grid container component="main">
        <Grid item xs={false} sm={6} md={8} className="page image"></Grid>
        <Grid item xs={12} sm={6} md={4} component={Paper} elevation={6} square>
          <Login />
        </Grid>
      </Grid>
    );
  }
}
