import * as React from 'react';
import { User } from '../../Classes/DataClasses/User';
import UserService from '../../Services/UserService';
import CloseIcon from '@material-ui/icons/Close';
import { ButtonBase } from '@material-ui/core';
import '../../css/user-profile.css';
import { Redirect } from 'react-router-dom';

export class UserProfileProps {
    data: User;
    homeRedirect: boolean;

    constructor() {
        this.data = new User();
        this.homeRedirect = false;
    }
}

export default class UserProfile extends React.Component<{}, UserProfileProps> {
    constructor(props: UserProfileProps) {
        super(props);
        this.state = new UserProfileProps();
    }
    componentDidMount() {
        UserService.getUser(UserService.currentUser.email).then((user: any) => {
            this.state.data.name = user.name;
            this.state.data.mobile = user.mobile;
            this.state.data.address = user.address;
            this.state.data.drivingLicence = user.drivingLicence;
            this.state.data.email = user.email;
            this.state.data.userName = user.userName;
            this.setState({ data: this.state.data })
        })
    }

    onClose = () => {
        this.setState({ homeRedirect: true });
    }

    render() {
        return (
            <div className='profile-display'>
                <ButtonBase onClick={this.onClose} className='close'><CloseIcon className='icon' /></ButtonBase>
                <div className='block'>
                    <p className='left'>Name</p>
                    <p className='right'> : {this.state.data.name}</p>
                </div>
                <div className='block'>
                    <p className='left'>Mobile</p>
                    <p className='right'> : {this.state.data.mobile}</p>
                </div>
                <div className='block'>
                    <p className='left'>Address</p>
                    <p className='right'> : {this.state.data.address}</p>
                </div>
                <div className='block'>
                    <p className='left'>Driving Licence</p>
                    <p className='right'> : {this.state.data.drivingLicence}</p>
                </div>
                <div className='block'>
                    <p className='left'>Email</p>
                    <p className='right'> : {this.state.data.email}</p>
                </div>
                <div className='block'>
                    <p className='left'>UserName</p>
                    <p className='right'>: {this.state.data.userName}</p>
                </div>
                {this.state.homeRedirect ? <Redirect to='/home' />:''}
            </div>
            )
    }
}