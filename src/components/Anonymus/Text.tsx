import { Grid } from "@material-ui/core";
import * as React from "react";
import "../../css/text.css";

export default class Text extends React.Component {
  render() {
    return (
      <Grid className="text">
        <div>
          <span className="turn">TURN</span>
          <span className="miles"> MILES</span>
        </div>
        <div>
          <span className="into"> INTO</span>
          <span className="money"> MONEY</span>
        </div>
        <span className="ride">RIDES ON TAP</span>
      </Grid>
    );
  }
}
