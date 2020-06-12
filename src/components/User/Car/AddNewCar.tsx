import * as React from 'react';
import { TextField, Grid, ButtonBase } from '@material-ui/core';
import CarService from '../../../Services/CarService'
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import '../../../css/add-new-car.css'
import { Car } from '../../../Classes/DataClasses/Car';
import { AddNewCarMeta } from '../../../Classes/MetaClasses/Car';
import { ServerError } from '../Response';

export class AddNewCarProps {
    data: Car;
    meta: AddNewCarMeta

    constructor() {
        this.data = new Car();
        this.meta = new AddNewCarMeta();
    }
}

export default class AddNewCar extends React.Component<{}, AddNewCarProps> {
    constructor(props: AddNewCarProps) {
        super(props);
        this.state = new AddNewCarProps()
    }

    onChanges = (event: any) => {
        this.setState({
            ...this.state,
            data: { ...this.state.data, [event.target.name]: event.target.value}
        });
    }

    hasCarNumber(value: any) {
        return CarService.hasNumber(value).then(async (response) => {
            this.setState({ meta: { ...this.state.meta, hasCarNumber: await response } })
        })
    }

    isEmpty(value: string) {
        return !value || (value && value.trim().length === 0);
    }

    isValidCarNumber(value: any) {
        this.hasCarNumber(value)
        let emptyStatus = this.isEmpty(value);
        let isValid = this.state.meta.hasCarNumber;
        this.state.meta.carNumberError = emptyStatus ? 'Please enter car number' : (isValid ? 'This car is already registered' : '');
        this.setState({ meta: this.state.meta });
        return (emptyStatus === false && isValid === false) ? 0 : 1;
    }

    isValiCarModel(value: any) {
        let emptyStatus = this.isEmpty(value);
        this.state.meta.carModelError = emptyStatus ? 'Please enter car model' : '';
        this.setState({ meta: this.state.meta });
        return emptyStatus === false ? 0 : 1;
    }

    isValidSeat(value: any) {
        let seatValidStatus = value <= 0 ? true : false
        this.state.meta.seatError = seatValidStatus ? 'Please enter correct seat' : ''
        this.setState({ meta: this.state.meta });
        return seatValidStatus === false ? 0 : 1;
    }

    onSubmit = (event: any) => {
        event.preventDefault();
        this.hasCarNumber(this.state.data.number)
        let isValid = this.isValidCarNumber(this.state.data.number) + this.isValiCarModel(this.state.data.model) + this.isValidSeat(this.state.data.noofSeats);
        if (isValid === 0) {
            CarService.addNewCar(this.state.data).then((response) => {
                if (response === 'Ok') {
                    window.location.pathname = '/ride/selectcar';
                }
                else if (response === 'Server error') {
                    this.setState({ meta: { ...this.state.meta, serverError: true } })
                }
            }) 
        }
    }

    render() {
        return (!this.state.meta.serverError?
            <Grid item md={4} className='add-new-car'>
                <form className='car-details'>
                    <div className='header'>
                        <div className='head'>
                            <h1>Add new car</h1>
                            <ButtonBase onClick={() => { this.setState({ meta: { ...this.state.meta, switch: !this.state.meta.switch } }) }} style={{ marginLeft: '5rem' }}>
                                {this.state.meta.switch ? <ToggleOnIcon className='switch' style={{ color: '#ac4fff' }} /> : <ToggleOffIcon className='switch' style={{ color: '#808080' }} />}
                            </ButtonBase>
                        </div>
                        <p>we get you the matches asap!</p>
                    </div>
                    <div className='input-box'>
                        <TextField className='input' label="CarNumber" InputLabelProps={{ shrink: true }} type='text' value={this.state.data.number} onChange={(event) => { this.onChanges(event); this.isValidCarNumber(event.target.value) }} name='number' />
                        <span className='helper'>{this.state.meta.carNumberError}</span>
                    </div>
                    <div className='input-box'>
                        <TextField className='input' label="Model" InputLabelProps={{ shrink: true }} type='text' value={this.state.data.model} onChange={(event) => { this.onChanges(event); this.isValiCarModel(event.target.value) }} name='model' />
                        <span className='helper'>{this.state.meta.carModelError}</span>
                    </div>
                    <div className='input-box'>
                        <TextField className='input' label="Max Number Of Seat" InputLabelProps={{ shrink: true }} type='number' value={this.state.data.noofSeats} onChange={(event) => { this.onChanges(event); this.isValidSeat(event.target.value) }} name='noofSeats' inputProps={{ min: 0, max: 8 }} />
                        <span className='helper'>{this.state.meta.seatError}</span>
                    </div>
                    <div>
                        <button type='submit' className='submitButton' onClick={this.onSubmit}>Submit</button>
                    </div>
                </form>
            </Grid> : <ServerError/>
        )
    }
}