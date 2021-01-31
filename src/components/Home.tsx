import * as React from "react";
import { CardContent, Typography, Card, ButtonBase } from "@material-ui/core";
import "../css/home.css";
import "../css/add-new-car.css";
import UserService from "../Services/UserService";
import { Redirect } from "react-router-dom";

export class HomeMeta {
  redirectBooking: boolean;
  redirectRide: boolean;

  constructor() {
    this.redirectBooking = false;
    this.redirectRide = false;
  }
}

export default class Home extends React.Component<{}, HomeMeta> {
  constructor(props: HomeMeta) {
    super(props);
    this.state = new HomeMeta();
  }

  onBookingChoice = () => {
    this.setState({ redirectBooking: true });
  };

  onRideChoice = () => {
    this.setState({ redirectRide: true });
  };

  render() {
    return (
      <div className="home">
        <div className="cards">
          <div className="welcome">
            <p>Hey {UserService.currentUser.name.split(" ")[0]}!</p>
          </div>
          <ButtonBase onClick={this.onBookingChoice}>
            <Card className="ride">
              <span className="cards-element">Book a ride</span>
            </Card>
          </ButtonBase>
          <ButtonBase onClick={this.onRideChoice}>
            <Card className="booking">
              <span className="cards-element">Offer a ride</span>
            </Card>
          </ButtonBase>
        </div>
        {this.state.redirectBooking ? <Redirect to="/booking" /> : ""}
        {this.state.redirectRide ? <Redirect to="/ride/selectcar" /> : ""}
      </div>
    );
  }
}
