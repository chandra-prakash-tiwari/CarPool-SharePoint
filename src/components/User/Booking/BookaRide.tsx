import * as React from 'react';
import { TextField, Chip, ButtonBase, Tooltip, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import '../../../css/book-a-ride.css';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import { Booking } from '../../../Classes/DataClasses/Booking';
import { BookARideMeta } from '../../../Classes/MetaClasses/Booking';
import { CityService } from '../../../Services/CityService';
import { Required } from '../../../Classes/Constraint';
import BookingSearch from './BookingSearch';

export class BookARideProps {
    data: Booking;
    meta: BookARideMeta;

    constructor() {
        this.data = new Booking();
        this.meta = new BookARideMeta();
    }
}

interface Details{
    data: Booking;
}

export default class BookaRide extends React.Component<{}, BookARideProps, Details> {
    constructor(props: BookARideProps) {
        super(props);
        this.state = new BookARideProps();
    } 

    componentDidMount() {
        var today = new Date();
        var todayDate = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        this.setState({ data: { ...this.state.data, date: todayDate } })
    }

    onChanges = (event: any) => {
        if (this.state.meta.bookingSearch === true) {
            this.state.meta.bookingSearch = false;
            this.setState({ meta: this.state.meta });
        }
        this.setState({
            ...this.state,
            data: { ...this.state.data, [event.target.name]: event.target.value}
        });
    }

    onSelect = (value: any, name: string) => {
        this.setState({
            data: { ...this.state.data, [name]: value }
        })
    }

    editTime = (number: number) => {
        this.setState({
            data: { ...this.state.data, time: number }
        })
    }

    isEmpty(value: string) {
        return !value || (value && value.trim().length === 0);
    }

    isValidFromCityName(value: any) {
        let emptyStatus = this.isEmpty(value);
        this.state.meta.fromError = emptyStatus ? Required : '';
        this.setState({ meta: this.state.meta })
        return emptyStatus ? 1 : 0;
    }

    isValidToCityName(value: any) {
        let emptyStatus = this.isEmpty(value);
        let isValid=(this.state.data.from===value)
        this.state.meta.toError = emptyStatus ? Required :(isValid?'Source and destination is different':'');
        this.setState({ meta: this.state.meta })

        return (emptyStatus || isValid) ? 1 : 0;
    }

    isValidDate(value: any) {
        let emptyStatus = this.isEmpty(value);
        this.state.meta.dateError = emptyStatus ? Required : '';
        this.setState({ meta: this.state.meta });
        return emptyStatus ? 1 : 0;
    }

    onSubmit = (event:any) => {
        event.preventDefault();
        let isValid = this.isValidFromCityName(this.state.data.from) + this.isValidToCityName(this.state.data.to) + this.isValidDate(this.state.data.date);
        if (isValid === 0) {
            sessionStorage.removeItem('bookingSearch');
            sessionStorage.setItem('bookingSearch', JSON.stringify(this.state.data));
            this.setState({ meta: { ...this.state.meta,bookingSearch:true } })
        }
    }

    render() {
        return (
            <Grid container className='booking'>    
                <Grid md={4} item className='booking-a-ride'>
                     <form className='journey-details'>
                         <div className='header'>
                             <div className='head'>
                                <h1>Book a Ride</h1>
                                <ButtonBase onClick={() => this.setState({ meta: { ...this.state.meta, switch: !this.state.meta.switch } })} style={{ marginLeft: '5rem' }}>
                                    {this.state.meta.switch ? <ToggleOnIcon className='switch' style={{ color: '#ac4fff' }} /> : <ToggleOffIcon className='switch' style={{ color: '#ffac19' }}/>}                              
                                </ButtonBase>
                             </div>
                            <p>we get you the matches asap!</p>
                        </div>
                        <div className='input-box'>
                            <Autocomplete options={CityService.getValidCity(this.state.data.from).map((option) => option.Title)} onChange={(event: any, newInputvalue: any) => { this.onSelect(newInputvalue, 'from') }} value={this.state.data.from} renderInput={(param) => (
                                <TextField {...param} label="From" style={{ width: '85%' }} InputLabelProps={{ shrink: true }} type='text' value={this.state.data.from} onChange={(event) => { this.onChanges(event); this.isValidFromCityName(event.target.value) }} name='from' className='input' />
                            )}
                            />
                            <span className='helper'>{this.state.meta.fromError}</span>
                        </div>
                        <div className='input-box'>
                            <Autocomplete freeSolo options={CityService.getValidCity(this.state.data.to).map((option) => option.Title)} onChange={(event: any, newInputvalue: any) => { this.onSelect(newInputvalue, 'to') }} value={this.state.data.to} renderInput={(param) => (
                                <TextField {...param} label="To" style={{ width: '85%' }} InputLabelProps={{ shrink: true }} type='text' value={this.state.data.to} onChange={(event) => { this.onChanges(event); this.isValidToCityName(event.target.value) }} name='to' className='input '/>
                            )}
                            />
                            <span className='helper'>{this.state.meta.toError}</span>
                        </div>
                        <div className='input-box'>
                            <TextField label="Date" style={{ width: '85%'}} InputLabelProps={{ shrink: true }} type='date' value={this.state.data.date} onChange={(event) => { this.onChanges(event); this.isValidDate(event.target.value) }} name='date' className='input'/>
                            <span>{this.state.meta.dateError}</span>
                        </div>
                         <div className='chips'>
                             <div className='label'>
                                 <span>Time</span>
                            </div>
                            <Chip label="5am - 9am" clickable className='chip' onClick={() => this.editTime(1)} style={{ backgroundColor: this.state.data.time === 1 ? '#ac4fff' : 'white' }}  />
                            <Chip label="9am - 12am" clickable className='chip'onClick={() => this.editTime(2)} style={{ backgroundColor: this.state.data.time === 2 ?'#ac4fff':'white' }} />
                            <Chip label="12pm - 3pm" clickable className='chip'onClick={() => this.editTime(3)} style={{ backgroundColor: this.state.data.time === 3 ?'#ac4fff':'white' }} />
                            <Chip label="3pm - 6pm" clickable className='chip' onClick={() => this.editTime(4)} style={{ backgroundColor: this.state.data.time === 4 ?'#ac4fff':'white' }} />
                            <Chip label="6pm - 9pm" clickable className='chip' onClick={() => this.editTime(5)} style={{ backgroundColor: this.state.data.time === 5 ?'#ac4fff':'white' }} />
                        </div>
                        <button type='submit' onClick={(event) => this.onSubmit(event)} className='submitButton'><span>Submit</span></button>
                    </form>
                </Grid>
                <Grid item md={8}>
                    {this.state.meta.bookingSearch ? <BookingSearch children={this.state.data} /> :''}
                </Grid>
            </Grid>

        )
    }
}