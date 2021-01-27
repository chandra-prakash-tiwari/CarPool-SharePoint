import * as React from "react";
import { Grid, Paper } from "@material-ui/core";
import SignUp from "../components/Anonymus/SignUp";
import Text from "../components/Anonymus/Text";

export default class SignUpLayout extends React.Component {
  render() {
    return (
      <Grid container className="page">
        <Grid item xs={false} sm={6} md={8} className="image">
          <Text />
        </Grid>
        <Grid item xs={12} sm={6} md={4} component={Paper} elevation={6} square>
          <SignUp />
        </Grid>
      </Grid>
    );
  }
}
