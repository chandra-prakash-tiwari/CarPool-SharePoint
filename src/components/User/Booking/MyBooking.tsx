import * as React from 'react';
import { ButtonBase, Card, Avatar, Grid } from '@material-ui/core';
import BookingService from '../../../Services/BookingService';
import '../../../css/my-bookings.css';
import { ServerError } from '../Response';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CityService } from '../../../Services/CityService';

export class Bookings {
    bookings: Array<any>;
    serverError: boolean;
    redirectMyRide: boolean;
    bookingId: string;
    number: number;
    confirmDialog: boolean;

    constructor() {
        this.bookings = [];
        this.serverError = false;
        this.redirectMyRide = false;
        this.bookingId = '';
        this.number = 0;
        this.confirmDialog = false;
    }
}

enum Status {
    Confirmed = 1,
    Rejected,
    Pending,
    Completed,
    Canceled
}

enum Time {
    '5am - 9am' = 1,
    '9am - 12pm',
    '12pm - 3pm',
    '3pm - 6pm',
    '6pm - 9pm'
}

export default class MyBookings extends React.Component<{}, Bookings, Status> {
    constructor(props: Bookings) {
        super(props);
        this.state = new Bookings()
    }

    componentDidMount() {
        this.setState({ redirectMyRide: false })
        BookingService.myBookings().then((response) => {
            if (response === 'serverError') {
                this.setState({ serverError: true })
            }

            if (response !== undefined && response !== 'serverError')
                this.setState({ bookings: response })
        })
    }

    // componentDidUpdate() {
    //     BookingService.myBookings().then((response) => {
    //         if (response === 'serverError') {
    //             this.setState({ serverError: true })
    //         }

    //         if (response !== undefined && response !== 'serverError')
    //             this.setState({ bookings: response })
    //     })
    // }

    onCancel = () => {
        this.setState({ confirmDialog: false })
        BookingService.cancelBooking(this.state.bookingId).then((response) => {
            if (response !== undefined) {
                this.setState({ redirectMyRide: true })
                this.state.bookings[this.state.number].Status = 5;
                this.setState({ bookings: this.state.bookings })
            }
        })
    }

    onDisagree = () => {
        this.setState({ confirmDialog: false });
    }

    onSelect = (id: string, i: number) => {
        this.setState({ bookingId: id });
        this.setState({ number: i });
        this.setState({ confirmDialog: true });
    }

    render() {
        const dialog = (
            <Dialog fullScreen open={this.state.confirmDialog} className='confirm-dialog'>
                <DialogTitle>Do you want to cancel booking</DialogTitle>
                <DialogActions>
                    <Button onClick={() => this.onDisagree()} color="primary">No</Button>
                    <Button onClick={() => this.onCancel()} color="primary" autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>
        );

        const BookingsDetails = this.state.bookings.length > 0 ?(
            this.state.bookings.map((booking: any, i) => (
            <div key={i} style={{ margin: '1rem 4rem' }}>
                    <Card className='bookings'>
                        <div className='head'>{dialog}
                        <Grid item md={10}>
                            <h4> </h4>
                        </Grid>
                        <Grid item md={2}>
                            <Avatar></Avatar>
                        </Grid>
                    </div>
                    <div className='booking-line'>
                        <div className='left'>
                            <span className='label'>From</span><br />
                            <span>{CityService.getCityById(booking.From)}</span>
                        </div>
                        <div className='right'>
                            <span className='label'>To</span><br />
                            <span>{CityService.getCityById(booking.To)}</span>
                        </div>
                    </div>
                    <div className='booking-line'>
                        <div className='left'>
                            <span className='label'>Date</span><br />
                            <span>{CityService.dateUTCtoLocal(booking.TravelDate)}</span>
                        </div>
                        <div className='right'>
                            <span className='label'>No of seats</span><br />
                            <span>{booking.NoofSeats}</span>
                        </div>
                    </div>
                    <div className='booking-line'>
                        <div className='left'>
                            <span className='label'>Time</span><br />
                            <span>{Time[booking.Time]}</span>
                        </div>
                        <div className='right'>
                            <span className='label'>Status</span><br />
                            <span>{Status[booking.Status]}</span>
                        </div>
                    </div>
                        <div className='booking-line'>
                            <ButtonBase disabled={booking.Status === 3 ? false : true} onClick={() => { this.onSelect(booking.ID, i); }} className='cancel'>Cancel</ButtonBase>
                    </div>
                </Card>
            </div>
            ))) : (<p className='no-bookings'>you have not booked any offer</p>)

        return (
            !this.state.serverError?
                <div className='my-bookings'>
                    <div className='head-card'>
                        <Card className='header'>Booked rides</Card>
                    </div>
                    <div className='all-bookings'>{BookingsDetails}</div>
                    {this.state.redirectMyRide ? <Redirect to='/myride' /> : ''}
                    {dialog}
                </div> : <ServerError />
        )
    }
}
