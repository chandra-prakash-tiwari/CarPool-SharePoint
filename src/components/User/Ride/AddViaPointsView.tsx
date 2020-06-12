import * as React from 'react';
import { TextField,  Grid, ButtonBase } from '@material-ui/core';
import '../../../css/add-via-points.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import RideService from '../../../Services/RideService';
import DeleteIcon from '@material-ui/icons/Delete';
import Pagination from '@material-ui/lab/Pagination';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import { CityService } from '../../../Services/CityService';
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { RideConfirm, ServerError, UpdateRideStatus } from '../Response';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

export class ViaPointsDetails {
    cities: ViaCity[];
    availableSeats: number;
    ratePerKM: number;
    carCapacity: number;
    meta: ViaCityMeta;
    offerStatus: boolean;
    rideStatus: boolean;
    serverError: boolean;
    rateError: string;
    rideUpdateStatus: boolean;
    myRideRedirect: boolean;
    viaCityError: string;
    statusDialog: boolean;

    constructor() {
        this.cities = [new ViaCity()];
        this.availableSeats = 1;
        this.ratePerKM = 1;
        this.meta = new ViaCityMeta();
        this.carCapacity = 0;
        this.offerStatus = true;
        this.serverError = false;
        this.rideStatus = false;
        this.rideUpdateStatus = false;
        this.rateError = '';
        this.myRideRedirect = false;
        this.viaCityError = '';
        this.statusDialog = false;
    }
};

export class ViaCity {
    city: string;

    constructor() {
        this.city = '';
        
    }
}

export class ViaCityMeta {
    cityError: string
    switch: boolean;

    constructor() {
        this.cityError = '';
        this.switch = true;
    }
}

export default class AddViaPointsView extends React.Component<{}, ViaPointsDetails> {
    constructor(props: ViaPointsDetails) {
        super(props)
        this.state = new ViaPointsDetails()
    }


    componentDidMount() {
        const list = [...this.state.cities];
        list.splice(0, 1);
        this.setState({ cities: list });
        var carDetailsStr = sessionStorage.getItem('carDetails')
        if (carDetailsStr != null) {
            var carDetails = JSON.parse(carDetailsStr);
            this.setState({ ...this.state, carCapacity: carDetails.noofSeat });
        }

        if (window.location.pathname === '/edit/ride/details') {
            var viaDetails = sessionStorage.getItem('viaDetails');
            if (viaDetails !== null) {
                 var details = JSON.parse(viaDetails);
                // var viaCity = JSON.parse(details.viaPoints);
                // if (viaCity !== null) {
                //     for (let i = 1; i < (viaCity.length - 1); i++) {
                //         this.editViaCities(viaCity[i].city, i - 1)
                //         if (i !== viaCity.length - 2) {
                //             this.state.cities.push(new ViaCity());
                //             this.setState({ cities: this.state.cities })
                //         }
                //     }
                // }
                this.setState({ ratePerKM: details.ratePerKM });
            }
        }
    }

    addViaCities = () => {
        this.setState({ cities: [...this.state.cities, { city: '' }] })
    }

    editViaCities = (value: string, index: number) => {
        this.state.cities[index].city = value;
        this.setState({ cities: this.state.cities });
    }

    deleteViaCity = (index: any) => {
        const list = [...this.state.cities];
        list.splice(index, 1);
        this.setState({ cities: list });
    };

    editNoofSeats = (number: number) => {
        this.setState({ availableSeats:number })
    }

    isEmpty(value: string) {
        return !value || (value && value.trim().length === 0);
    }

    isValidCity(value: string) {
        var isValid = CityService.getValidCity(value);
        return isValid.length === 0;
    }

    isValidCityResponse(value: any,index:number) {
        let isEmpty = this.isEmpty(value);
        let isValid = this.isValidCity(value);
        this.setState({ meta: { ...this.state.meta, cityError: isEmpty ? 'Please enter all city details or remove' : (isValid ? 'Please enter valid city' : '')} })
        return isEmpty && !isValid;
    }

    isValidRate(value: number) {
        let isValid = (value > 0 && value <= 10) ? false : true;
        this.setState({ rateError: isValid ? 'Enter valid rate' : '' });
        return isValid;
    }

    onChanges = (event: any) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
        if (this.state.viaCityError !== '') {
            this.setState({ viaCityError: '' });
        }   
    }

    redirect = () => {
        this.setState({ myRideRedirect: true })
    }

    onSubmit = (event:any) => {
        event.preventDefault();       
        var isValid: any = this.isValidRate(this.state.ratePerKM);
        if (!isValid) {
            if (this.state !== null) {
                if (window.location.pathname === '/ride/details') {
                    RideService.addRides(this.state)?.then((response:any) => {
                        if (response === 'Ok') {
                            this.setState({ statusDialog: true })
                        }
                        else if (response === 'serverError') {
                            this.setState({ offerStatus: false });
                            this.setState({ serverError: true })
                        }
                        else if (response === 'cityError') {
                            alert('Please enter min 2 different city');
                        }
                        else if (response === 'duplicate') {
                            this.setState({ viaCityError: 'Stoppage is never same'});
                        }
                    })
                }

                else if (window.location.pathname === '/edit/ride/details') {
                    RideService.updateRide(this.state)?.then((response) => {
                        if (response === 'Ok') {
                            this.setState({ myRideRedirect: true })
                        }
                        else if (response === 'serverError') {
                            this.setState({ serverError: true })
                        } else if (response === 'cityError') {
                            this.setState({ statusDialog: true });
                        }
                        else if (response === 'duplicate') {
                            this.setState({ statusDialog: true });
                        }
                    })
                }
            }
        }
        else
            return;
    }

    render() {
        const dialog = (
            <Dialog fullScreen open={this.state.statusDialog} className='confirm-dialog'>
                <DialogTitle>Ride successfully created</DialogTitle>
                <DialogActions>
                    <Button onClick={this.redirect} color="primary">Ok</Button>
                </DialogActions>
            </Dialog>
        );

        const viaCity = this.state.cities.map((city: any, index: number) => (
            <div key={index} className='input-via-points'>
                <Autocomplete freeSolo options={CityService.getValidCity(city.city).map((option) => option.Title)} onChange={(event: any, newInputvalue: any) => { this.editViaCities(newInputvalue, index); }} value={this.state.cities[index].city} renderInput={(param) => (
                    <TextField {...param} label={'stop ' + (index + 1)} style={{ width: '70%', marginBottom: '6%' }} InputLabelProps={{ shrink: true }} type='text' onChange={(event: any) => { this.editViaCities(event.target.value, index); }} />
                )} />
                <ButtonBase className='icon' onClick={() => this.deleteViaCity(index)}><DeleteIcon /></ButtonBase>
            </div>
            ))

        return (this.state.offerStatus ?
            <Grid className='add-viaPoints' item md={4} id='viapointdetails'>
                <form className='form'>
                    <div className='header'>
                        <div className='head'>
                            <h1>Add Via Points</h1>
                            <ButtonBase onClick={() => { this.setState({ meta: { ...this.state.meta, switch: !this.state.meta.switch } }) }}>
                                {this.state.meta.switch ? <ToggleOnIcon className='switch' style={{ color: '#ac4fff' }} /> : <ToggleOffIcon className='switch' style={{ color: '#ffac19' }} />}
                            </ButtonBase>
                        </div>
                        <p>add all new via points</p>
                    </div>
                    {this.state.myRideRedirect ? <Redirect to='/myride' /> : ''}
                    {viaCity
                        //this.state.cities.map((city, index) => {
                        //    return (
                        //        <div key={index} className='input-via-points'>
                        //            <Autocomplete freeSolo options={CityService.getValidCity(city.city).map((option) => option.city)} onChange={(event: any, newInputvalue: any) => { this.editViaCities(newInputvalue, index); }} value={this.state.cities[index].city} renderInput={(param) => (
                        //                 <TextField {...param} label={'stop ' + (index + 1)} style={{ width: '70%', marginBottom: '6%' }} InputLabelProps={{ shrink: true }} type='text' onChange={(event: any) => { this.editViaCities(event.target.value, index); }} />
                        //             )} />
                        //             <ButtonBase className='icon' onClick={() => this.deleteViaCity(index)}><DeleteIcon /></ButtonBase>
                        //        </div>
                        //    )
                        //})
                    }
                    <ButtonBase className='add-icon' onClick={this.addViaCities}><AddCircleIcon /></ButtonBase><br />
                    <span className='helper'>{this.state.viaCityError}</span>
                    <span className='helper'>{this.state.meta.cityError}</span>
                    <div>
                        <span>Available seats</span>
                        <Pagination count={this.state.carCapacity} hideNextButton hidePrevButton onChange={(event, number) => this.editNoofSeats(number)} />
                    </div>
                    <TextField label='Rate per km' style={{ width: '70%', marginBottom: '6%' }} InputLabelProps={{ shrink: true }} type='number' name='ratePerKM' value={this.state.ratePerKM} onChange={this.onChanges} inputProps={{min:1, max:10}} />
                    <span className='helper'>{this.state.rateError}</span>
                    <button type='submit' className='submitButton' onClick={this.onSubmit}><span>Submit </span></button>                 
                </form>
                {dialog}
            </Grid> : (
                <div>
                    {this.state.rideStatus ? <RideConfirm /> : ''}
                    {this.state.serverError ? < ServerError /> : ''}
                    {this.state.rideUpdateStatus ? <UpdateRideStatus/>:''}
                </div>
                )
            )
    }
}