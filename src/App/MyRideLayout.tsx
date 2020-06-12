import * as React from 'react';
import { Grid } from '@material-ui/core';
import MyBookings from '../components/User/Booking/MyBooking';
import MyRides from '../components/User/Ride/MyRides';

export default class MyRideLayout extends React.Component {
    render() {
        return (
            <Grid container className='rides'>
                <Grid item md={5}>
                    <MyBookings />
                </Grid>
                <Grid item md={5}>
                    <MyRides />
                </Grid>
            </Grid>
        )
    }
}