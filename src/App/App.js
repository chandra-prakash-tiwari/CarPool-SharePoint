import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import '../index.css';
import UserService from '../Services/UserService'
import Profile from '../components/User/User/Profile.tsx';
import Home from '../components/Home';
import CarSelector from '../components/User/Car/CarSelector';
import AddNewCar from '../components/User/Car/AddNewCar';
import CreateRide from '../components/User/Ride/CreateRide';
import LoginLayout from './LoginLayout';
import SignUpLayout from './SignUpLayout';
import BookaRide from '../components/User/Booking/BookaRide';
import MyRideLayout from './MyRideLayout';
import UserProfile from '../components/User/UserProfile';

export default class App extends Component {

    render() {
        return (
            <Router>
                {
                    UserService.currentUser !== null ?
                        <Grid className='cointainer'>
                            <Profile/>
                            <Switch>
                                <Route exact path='/home' component={Home} />
                                <Route exact path='/booking' component={BookaRide} />
                                <Route exact path='/ride/selectcar' component={CarSelector} />
                                <Route exact path='/edit/ride/car' component={CarSelector} />
                                <Route exact path='/edit/ride/details' component={CreateRide} />
                                <Route exact path='/car/addnewcar' component={AddNewCar} />
                                <Route exact path='/ride/details' component={CreateRide} />
                                <Route exact path='/myride' component={MyRideLayout} />
                                <Route exact path='/profile' component={UserProfile}/>
                                <Route path='/'>
                                    <Redirect to='/home' />
                                 </Route>
                            </Switch>
                        </Grid>
                    :
                        <Switch>
                            <Route exact path='/login' component={LoginLayout} />
                            <Route exact path='/signup' component={SignUpLayout}/>
                            <Route path='/'>
                                <Redirect to='/login'/>
                            </Route>
                        </Switch>
                    }
            </Router>
        )
    }
}