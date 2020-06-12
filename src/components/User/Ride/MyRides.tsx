import * as React from 'react';
import { ButtonBase, Card, Avatar, Grid } from '@material-ui/core';
import '../../../css/my-rides.css';
import RideService from '../../../Services/RideService'
import { ServerError } from '../Response';
import { Dialog } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import BookingService from '../../../Services/BookingService';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CityService } from '../../../Services/CityService';

export class Rides {
    rides: Array<any>;
    bookers: Array<any>;
    noofSeat: number;
    serverError: boolean;
    dialogRide: any;
    dialogDisplay: boolean;
    confirmDialog: boolean;
    dialogDetails: boolean;
    dialog1Display: boolean;
    editButton: string;
    editRedirect: boolean;
    rideId: string;
    bookingId: string;
    status: number;
    number: number;

    constructor() {
        this.rides = [];
        this.noofSeat = 0;
        this.serverError = false;
        this.dialogRide = null;
        this.bookers = [];
        this.dialogDisplay = false;
        this.dialogDetails = false;
        this.dialog1Display = false;
        this.confirmDialog = false;
        this.editButton = '';
        this.editRedirect = false;
        this.rideId = '';
        this.bookingId = '';
        this.status = 0;
        this.number = 0;
    }
}
 enum Time {
    '5am - 9am' = 1,
    '9am - 12pm',
    '12pm - 3pm',
    '3pm - 6pm',
    '6pm - 9pm'
}

enum Status {
    Confirmed = 1,
    Rejected,
    Pending,
    Completed,
    Canceled
}

export default class MyRides extends React.Component<{}, Rides, Time> {
    constructor(props: Rides) {
        super(props);
        this.state = new Rides()
    }

    componentDidMount() {
        RideService.allRides().then((response:any) => {
            if (response !== undefined && response !== 'serverError') {
                this.setState({ rides: response })
            }
            else if (response === 'serverError') {
                this.setState({ serverError:true })
            }
        })
    }

    onChoice = (ride: any) => {
        this.setState({ dialogDisplay: true })
        this.setState({ dialogRide: ride });
        RideService.getAllBookers(ride.ID).then((response) => {
            if (response.length>=0) {
                this.setState({ bookers: response })
            }
        })
    }

    onConfirm = () => {
        this.setState({ confirmDialog: false });
        BookingService.bookingResponse(this.state.rideId, this.state.bookingId, this.state.status).then((response:any) => {
            this.state.bookers[this.state.number].Status = response;
            this.setState({ bookers: this.state.bookers })
            if(response!==this.state.status)
            alert("Seat if full")
        })
    }

    onDisagree = () => {
        this.setState({ confirmDialog: false });
    }

    onConfirmation = (riderId: string, bookerId: string, status: number, i: number) => {
        this.setState({ bookingId: bookerId });
        this.setState({ rideId: riderId });
        this.setState({ status: status });
        this.setState({ number: i });
        this.setState({ confirmDialog: true });
    }

    onEditClick = () => {
        sessionStorage.setItem('rideId', this.state.dialogRide.ID)
        this.setState({ editRedirect: true })
    }

    onViewDetails = () => {
        this.setState({ dialogDetails:true })
    }

    onBookerDetails = () => {
        this.setState({ dialogDetails:false })
    }

    onDialogClose = () => {
        this.setState({ editButton:'' })
        this.setState({ dialogDisplay: false })
        this.setState({ dialog1Display: false })
    }

    render() {
        const Bookers = this.state.bookers.length > 0 ? (this.state.bookers.map((booker: any, i: any) => (
            <div key={i} className='ride-booking'>
                <div className='head'>
                    <Grid item md={10}>
                        <h4> </h4>
                    </Grid>
                    <Grid item md={2}>
                        <Avatar></Avatar>
                    </Grid>
                </div>
                <div className='ride-line'>
                    <div className='left'>
                        <span className='label'>From</span><br />
                        <span>{CityService.getCityById(booker.From)}</span>
                    </div>
                    <div className='right'>
                        <span className='label'>To</span><br />
                        <span>{CityService.getCityById(booker.To)}</span>
                    </div>
                </div>
                <div className='ride-line'>
                    <div className='left'>
                        <span className='label'>Date</span><br />
                        <span>{CityService.dateUTCtoLocal(booker.TravelDate)}</span>
                    </div>
                    <div className='right'>
                        <span className='label'>Status</span><br />
                        <span>{Status[booker.Status]}</span>
                    </div>
                </div>    
                <div className='ride-line'>
                    <div className='left'>
                        <span className='label'>No of seats</span><br />
                        <span>{booker.NoofSeats}</span>
                    </div>
                </div>
                <div className='ride-line'>
                    {this.state.editButton === '' ? ((booker.status === 1) ? this.setState({ editButton:'none' }):''):''}
                    <button className='confirm' disabled={booker.Status !== 3 ? true : false} onClick={() => this.onConfirmation(booker.RideId, booker.ID, 1,i)}>Accept</button>
                    <button className='cancel' disabled={booker.Status !== 3 ? true : false} onClick={() => this.onConfirmation(booker.RideId, booker.ID, 2,i)}>Reject</button>
                </div>
            </div>)
        )) : <div style={{ textAlignLast: 'center', fontSize: '2rem' }}>No bookers are available</div>;

        const viaPoints = this.state.dialogRide !== null ?
            ((this.state.dialogRide.ViaPointsId).map((viacity: any, i: any) => (
                <p key={i} className='via-point'>Stop {i + 1}: {CityService.getCityById(viacity)}</p>
            ))) : '';

        const dialog3 = (
            <Dialog open={this.state.confirmDialog} fullScreen className='confirm-dialog'>
                <DialogTitle>Do you want to {Status[this.state.status]} this booking</DialogTitle>
                <DialogActions>
                    <Button onClick={() => this.onDisagree()} color="primary">No</Button>
                    <Button onClick={() => this.onConfirm()} color="primary" autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>
        );

        const dialog1 = (this.state.dialogDetails)&&(this.state.dialogRide!==null) ? (
          <div className='ride-full-details'>
              <div className='content'>
                  <p className='left'>From</p>
                  <p className='right'>{CityService.getCityById(this.state.dialogRide.FromId)}</p>
              </div>
              <div className='content'>
                  <p className='left'>To</p>
                  <p className='right'>{CityService.getCityById(this.state.dialogRide.ToId)}</p>
              </div>
              <div className='content'>
                  <p className='left'>Date</p>
                  <p className='right'>{CityService.dateUTCtoLocal(this.state.dialogRide.TravelDate)}</p>
              </div>
              <div className='content'>
                  <p className='left'>Available Seats </p>
                  <p className='right'>{this.state.dialogRide.AvailableSeats}</p>
              </div>
              <div className='content'>
                  <p className='left'>Rate</p>
                  <p className='right'>{this.state.dialogRide.RatePerKM} RS/KM</p>
              </div>
              <div className='content'>
                  <p className='left'>Time</p>
                  <p className='right'>{Time[this.state.dialogRide.Time]}</p>
              </div>
              <div className='via-points'>
                  <p className='left'>Via Points</p>
                  <div className='right'>{viaPoints} </div>
              </div>                   
          </div>
        ):'';

        const dialog = (this.state.dialogDisplay) ?(
            <Dialog fullScreen open={this.state.dialogDisplay} className='ride-dialog'>
                <div className='header'>
                    <ButtonBase onClick={() => this.onViewDetails()}><span> View details </span></ButtonBase>
                    <ButtonBase onClick={() => this.onBookerDetails()}><span> All bookers </span></ButtonBase>
                    <ButtonBase style={{ display: this.state.editButton }} onClick={() => this.onEditClick()}><span> EDIT </span></ButtonBase>
                    <ButtonBase onClick={this.onDialogClose} className='close'><CloseIcon className='icon' /></ButtonBase>
                </div>
                {!this.state.dialogDetails ? Bookers : dialog1}
            </Dialog>

        ) : null;

        const RidesDetails =this.state.rides.length>0?(
            this.state.rides.map((ride: any, i) => (
                <ButtonBase key={i} style={{ margin: '1rem 4rem' }}>
                    <Card className='rides' onClick={()=>this.onChoice(ride)}>
                        <div className='head'>
                            <Grid item md={10}>
                                <h4> </h4>
                            </Grid>
                            <Grid item md={2}>
                                <Avatar></Avatar>
                            </Grid>
                        </div>
                        <div className='ride-line'>
                            <div className='left'>
                                <span className='label'>From</span><br />
                                <span>{CityService.getCityById(ride.FromId)}</span>
                            </div>
                            <div className='right'>
                                <span className='label'>To</span><br />
                                <span>{CityService.getCityById(ride.ToId)}</span>
                            </div>
                        </div>
                        <div className='ride-line'>
                            <div className='left'>
                                <span className='label'>Date</span><br />
                                <span>{CityService.dateUTCtoLocal(ride.TravelDate)}</span>
                            </div>
                                <div className='right'>
                                    <span className='label'>Time</span><br />
                                    <span>{Time[ride.Time]}</span>
                            </div>
                          </div>
                        <div className='ride-line'>
                        <div className='left'>
                            <span className='label'>Price(Per KM)</span><br />
                            <span>{ride.RatePerKM}</span>
                        </div>
                        <div className='right'>
                            <span className='label'>Available seats</span><br />
                            <span>{ride.AvailableSeats}</span>
                        </div>
                        </div>
                    </Card>
                    {this.state.editRedirect ? <Redirect to='/edit/ride/car' /> : ''}
                </ButtonBase>
            ))) : (<p className='no-bookings'>you have not created any ride offer</p>)
        return (!this.state.serverError?
            <div className='my-ride'>
                <div className='head-card'>
                    <Card className='header'>Offered rides</Card>
                </div>
                {dialog3}
                <div className='rides-cards'>{RidesDetails}</div>
                {dialog}
            </div> : <ServerError />
            )
    }
}