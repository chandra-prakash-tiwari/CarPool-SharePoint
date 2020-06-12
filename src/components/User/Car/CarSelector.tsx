import * as React from 'react'
import { Card, ButtonBase } from '@material-ui/core';
import '../../../css/car-selector.css';
import DeleteIcon from '@material-ui/icons/Delete';
import CarService from '../../../Services/CarService'
import { ServerError } from '../Response';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

export class UserCar {
    cars: Array<any>;
    serverError: boolean;
    deleteButton: boolean;
    deleteStatus: boolean;
    createRideRedirect: boolean;
    editRideRedirect: boolean;
    confirmDialog: boolean;
    carId: string;
    number: number;

    constructor() {
        this.cars = [];
        this.serverError = true;
        this.deleteButton = false;
        this.deleteStatus = false;
        this.createRideRedirect = false;
        this.editRideRedirect = false;
        this.confirmDialog = false;
        this.carId = '';
        this.number = 0;
    }
}

export default class CarSelector extends React.Component<{}, UserCar> {
    constructor(props: UserCar) {
        super(props);
        this.state = new UserCar()
    }

    componentDidMount() {
        CarService.getCars().then((response) => {
            if (response !== undefined && response === 'serverError') {
                this.setState({ serverError:false })
            }
            else if (response !== undefined) {
                this.setState({ cars: response })
            }
            this.setState({cars:response.value})
        })
    }

    onDelete(id: any,i:number) {
        this.setState({ deleteStatus: false })
        this.setState({ carId: id });
        this.setState({ number: i });
        this.setState({ confirmDialog: true })
    }

    onAgree = () => {
        this.setState({ confirmDialog: false })
        CarService.deleteCar(this.state.carId).then((response) => {
            if (response === 'Ok') {
                window.location.reload(false);
            }
            else {
                this.setState({ deleteStatus: true })
            }
        })
    }

    onDisagree = () => {
        this.setState({ confirmDialog: false })
    }

    onSubmit = (carRecord: any) => {
        if (!this.state.deleteButton) {
            sessionStorage.setItem('carDetails', JSON.stringify(carRecord));
            if (window.location.pathname === '/ride/selectcar') {
                this.setState({ createRideRedirect: true })
            }
            else if (window.location.pathname === '/edit/ride/car') {
                this.setState({ editRideRedirect: true })
            }
        }
    }

    render() {
        const carDetails = this.state.cars!==null&&this.state.cars.length>0?
        this.state.cars.map((carRecord: any, i) => (
            <ButtonBase key={i}>
                <Card className='car-cards'>
                    <div className='delete' onClick={() => this.onDelete(carRecord.ID,i)}><DeleteIcon style={{ color: 'white', fontSize: '1.4rem' }} /></div>
                    <div className='cards' onClick={() => this.onSubmit(carRecord)}>
                        <p className='car-details'>Model : {carRecord.Model}</p>
                        <p className='car-details'>Car Number : {carRecord.Number}</p>
                        <p className='car-details'>MAX NUMBER OF SEAT: {carRecord.NoofSeats}</p>
                    </div>
                </Card>
            </ButtonBase>
        )):'';

        const dialog = (
            <Dialog fullScreen open={this.state.confirmDialog} className='confirm-dialog'>
                <DialogTitle>Do you want to delete this car</DialogTitle>
                <DialogActions>
                    <Button onClick={() => this.onDisagree()} color="primary">No</Button>
                    <Button onClick={() => this.onAgree()} color="primary" autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>
        );

        return (this.state.serverError?
            <div className='car-selectors'>
                <div className='header'>
                    <p className='head'>Select a car for a ride or add new car</p>
                    {this.state.deleteStatus ? <p className='error'>This car is booked for a ride delete after ride</p> : null}
                </div>
                <div className='user-cars'>{carDetails}</div>
                {this.state.createRideRedirect ? <Redirect to='/ride/details' /> : ''}
                {this.state.editRideRedirect ? <Redirect to='/edit/ride/details' />:''}
                {window.location.pathname ==='/ride/selectcar'?
                    <ButtonBase href='/car/addnewcar' >
                        < Card className='car-cards'>
                            <div className='add-car'>+</div>
                        </Card>
                        {dialog}
                    </ButtonBase>:''}
            </div> : <ServerError/>
        )
    }
}