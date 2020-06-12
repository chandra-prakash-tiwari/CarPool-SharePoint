import React, { Component } from 'react';


export class RideConfirm extends Component {
    render() {
        return (
            <p style={{
                color: 'green', fontSize: '1.5rem', margin:'0.5rem' }}>Ride is created successfully</p>
            )
    }
}

export class UpdateRideStatus extends Component {
    render() {
        return (
            <p style={{
                color: 'green', fontSize: '1.5rem', margin: '0.5rem'
            }}>Ride is updated successfully</p>
        )
    }
}

export class WrongPassword extends Component {
    render() {
        return (
            <p style={{ color: 'red', fontSize: '0.8rem', margin:'0.5rem' }}>Incorrect username or password</p>
            )
    }
}

export class BookingRequest extends Component {
    constructor() {
        super();
        this.state = {
            from: '',
            to: '',
            date: '',
        }
    }

    componentDidMount() {
        var booking = JSON.parse(sessionStorage.getItem('bookingSearch'));
        this.setState({
            from: booking.from,
            to: booking.to,
            date: booking.date
        });
        sessionStorage.removeItem('bookingSearch');
    }

    render() {
        return (
            <div style={{ color: 'green', fontSize: '1.5rem', margin: '0.5rem' }}>
                <p>Booking request will be send</p>
                <p>From : {this.state.from}</p>
                <p>To   : {this.state.to}</p>
                <p>Date : {this.state.date}</p>
            </div>
            )
    }
}

export class ServerError extends Component {
    render() {
        return (
            <p style={{ color: 'red', fontSize: '0.8rem', margin: '0.5rem' }}>Sorry internal server is not working</p>
            )
    }
}

export class NoOffer extends Component {
    render() {
        return (
            <p style={{ color: 'blue', fontSize: '1.5rem' }}>No offer is found</p>
            )
    }
}