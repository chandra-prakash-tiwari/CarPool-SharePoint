import * as React from 'react';
import { Card, ButtonBase, Avatar, Grid } from '@material-ui/core';
import UserService from '../../../Services/UserService';
import { Dialog } from '@material-ui/core';
import BookingService from '../../../Services/BookingService';
import '../../../css/booking-search.css';
import { ServerError, BookingRequest } from '../Response';
import Pagination from '@material-ui/lab/Pagination';
import CloseIcon from '@material-ui/icons/Close';
import {CityService} from '../../../Services/CityService';
import '../../../css/ride-details-dialog.css';
import RideService from '../../../Services/RideService';

export class Bookings {
    bookings: Array<any>;
    rides: any;
    noofSeats: number;
    bookingConfirm: boolean;
    serverError: boolean;
    noOffer: boolean;
    requestSended: boolean;
    offer: boolean;
    bookingDetailsDisplay: boolean;
    bookingDetails: any;
    requestSeat: number;
    requestPermission: boolean;

    constructor() {
        this.bookings = [];
        this.rides = null;
        this.noofSeats = 0;
        this.bookingConfirm = false;
        this.serverError = false;
        this.noOffer = false;
        this.offer = true;
        this.requestSended = false;
        this.bookingDetailsDisplay = false;
        this.bookingDetails = null;
        this.requestSeat = 0;
        this.requestPermission = true;
    }
}

enum Time {
    '5am - 9am' = 1,
    '9am - 12pm',
    '12pm - 3pm',
    '3pm - 6pm',
    '6pm - 9pm'
}

export default class BookingSearch extends React.Component<{}, Bookings, Time> {
    constructor(props: Bookings) {
        super(props);
        this.state = new Bookings()
    }

    componentDidMount() {
        BookingService.searchRide(this.props.children).then((searchBooking:any) => {
            if (searchBooking !== undefined && searchBooking !== 'serverError')
                this.setState({ bookings: searchBooking })
            else if (searchBooking === 'serverError') {
                this.setState({ offer: false })
                this.setState({ serverError: true })
            }
        });
    }

    editNoofSeats(number: number) {
        this.setState({ noofSeats:number })
    }

    onSubmit = (booking: any) => {
        this.setState({ bookingDetailsDisplay: true })
        RideService.getRideById(booking.ID).then((response) => {
            if (response !== undefined) {
                this.setState({ bookingDetailsDisplay: true })
                if(response.length>0){
                    this.setState({ rides: response[0] })
                }
                if (UserService.currentUser.id === response[0].OwnerId)
                    this.setState({ requestPermission:false })

                BookingService.getByRideId(booking.ID, UserService.currentUser.id).then((response1) => {
                    if (response1 !== undefined) {
                        var seat = 0;
                        for (let i = 0; i < response1.length; i++) {
                            if (response1[i].Status === 3) {
                                seat = seat + response1[i].NoofSeats;
                            }
                        }
                        this.setState({ requestSeat: seat })
                    }
                })
            }
        })
    }

    onBookingConfirm=()=> {
        this.setState({ bookingDetailsDisplay: false });
        this.setState({ offer: false })
        BookingService.addBookings(this.state.rides, this.state.noofSeats).then((response) => {
            if (response === 'Ok') {
                this.setState({ rides: null })
                window.location.pathname='/myride'
            }
            else if (response === 'serverError') {
                this.setState({ serverError: true })
            }
        })
    }

    onDialogClose = () => {
        this.setState({ noofSeats:0 })
        this.setState({ bookingDetailsDisplay: false })
    }

    userDetails(id: any) {
        return UserService.getUser(id).then((user) => { return user });
    }

    render() {
        const Bookings = this.state.bookings != null ?
            this.state.bookings.length > 0 ? (
                this.state.bookings.map((booking: any, i) => (
                    <ButtonBase key={i} style={{ margin: '1rem' }} onClick={() => this.onSubmit(booking)} >
                        <Card className='bookings'>
                            <div className='head'>
                                <Grid item md={10}>
                                    <h1> </h1>
                                </Grid>
                                <Grid item md={2}>
                                    <Avatar></Avatar>
                                </Grid>
                            </div>
                            <div className='booking-line'>
                                <div className='left'>
                                    <span className='label'>From</span><br />
                                    <span>{CityService.getCityById(booking.FromId)}</span>
                                </div>
                                <div className='right'>
                                    <span className='label'>To</span><br />
                                    <span>{CityService.getCityById(booking.ToId)}</span>
                                </div>
                            </div>
                            <div className='booking-line'>
                                <div className='left'>
                                    <span className='label'>Date</span><br />
                                    <span>{CityService.dateUTCtoLocal(booking.TravelDate)}</span>
                                </div>
                                <div className='right'>
                                    <span className='label'>Time</span><br />
                                    <span>{Time[booking.Time]}</span>
                                </div>
                            </div>
                            <div className='booking-line'>
                                <div className='left'>
                                    <span className='label'>Price</span><br />
                                    <span>{Math.round(booking.RatePerKM * CityService.distanceCalculator(CityService.getCityById(booking.FromId), CityService.getCityById(booking.ToId)))}</span>
                                </div>
                                <div className='right'>
                                    <span className='label'>Seat availabilty</span><br />
                                    <span>{booking.AvailableSeats}</span>
                                </div>
                            </div>
                        </Card>
                    </ButtonBase>
                ))
            ) : (
                    <div style={{ margin: '1rem', fontSize:'1.5rem' }}>
                        <p>Sorry no offer currently available </p>
                        <p>Better for next time</p>
                    </div>
                ) : null

        const viaPoints = this.state.rides !== null ?
            ((this.state.rides.ViaPointsId).map((viacity: any, i: any) => (
                <p key={i} className='via-point'>Stop {i+1}:  {CityService.getCityById(viacity)}</p>
            ))) : null

        const dialog = (this.state.bookingDetailsDisplay && this.state.rides !== null) ? (
            <Dialog fullScreen open={this.state.bookingDetailsDisplay} className='dialog'>
                <ButtonBase onClick={this.onDialogClose} className='close'><CloseIcon className='icon' /></ButtonBase>
                <div className='ride-full-details'>
                    <div className='content'>
                        <p className='left'>From</p>
                        <p className='right'>{CityService.getCityById(this.state.rides.FromId)}</p>
                    </div>
                    <div className='content'>
                        <p className='left'>To</p>
                        <p className='right'>{CityService.getCityById(this.state.rides.ToId)}</p>
                    </div>
                    <div className='content'>
                        <p className='left'>Date</p>
                        <p className='right'>{CityService.dateUTCtoLocal(this.state.rides.TravelDate)}</p>
                    </div>
                    <div className='content'>
                        <p className='left'>Available Seats </p>
                        <p className='right'>{this.state.rides.AvailableSeats}</p>
                    </div>
                    <div className='content'>
                        <p className='left'>Rate</p>
                        <p className='right'>{this.state.rides.RatePerKM } RS/KM</p>
                    </div>
                    <div className='content'>
                        <p className='left'>Rate</p>
                        <p className='right'>{Math.round(this.state.rides.RatePerKM * CityService.distanceCalculator(CityService.getCityById(this.state.rides.FromId), CityService.getCityById(this.state.rides.ToId)))} RS</p>
                    </div>
                    <div className='content'>
                        <p className='left'>Time</p>
                        <p className='right'>{Time[this.state.rides.Time]}</p>
                    </div>
                    <div className='via-points'>
                        <p className='left'>Via Points</p>
                        <div className='right'>{viaPoints}</div>
                    </div>
                    <div className='via-points'>
                        <span>Select no of seats</span>
                        <Pagination count={this.state.rides.AvailableSeats - this.state.requestSeat} hideNextButton hidePrevButton defaultPage={0} onChange={(event, number) => this.editNoofSeats(number)} />
                    </div>
                    <div className='via-points'>
                        {this.state.requestSeat > 0 ? <span style={{color:'red'}}>You have already requested {this.state.requestSeat} for this ride</span> : ''}
                    </div>
                    <div className='via-points'>
                        {this.state.requestPermission ? '' : <span style={{ color: 'red' }}> you created this offer </span>}
                    </div>
                    <button className='submit' style={{ display: (this.state.noofSeats > 0 && this.state.requestPermission) ? '' : 'none' }} onClick={this.onBookingConfirm}>Request</button>
                </div>
            </Dialog>
        ) : null;

        return (
            this.state.offer ?
                <div className='bookingsearches'>
                    <div className='header'>
                        <p>Your Matches</p>
                    </div>
                    <div className='booking-search'>
                        {Bookings}
                    </div>
                    {dialog}
                </div> :
                (<div>
                    <div>{this.state.serverError ? <ServerError /> : ''}
                    </div>
                    <div>{this.state.requestSended ? <BookingRequest/>:''}</div>
                </div>
                )
        )
    }
}
