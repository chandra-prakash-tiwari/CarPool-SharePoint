import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import UserService from '../../../Services/UserService'
import { Avatar, ButtonBase, SvgIcon } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';


export default function Profile() {
    const [open, close] = React.useState(null);
    const [profileRedirect, setProfileRedirect] = React.useState(false);
    const [myRideRedirect, setMyRideRedirect] = React.useState(false);
    const [dialogLogout, setDialogLogout] = React.useState(false);

    const handleClick = (event:any) => {
        close(event.currentTarget);
        setMyRideRedirect(false);
        setProfileRedirect(false);
    };

    const handleClose = () => {
        close(null);
    };

    const homeRedirect = () => {
        window.location.pathname='/home'
    };

    const onDisagree = () => {
        setDialogLogout(false);
    }

    const onLogout = () => {
        setDialogLogout(false);
        UserService.logout();
        window.location.pathname = '/login';
    }

    const logout = () => {
        close(null);
        setDialogLogout(true);
    }

    const dialog = (
        <Dialog fullScreen open={dialogLogout} className='confirm-dialog'>
            <DialogTitle>Do you want to logout</DialogTitle>
            <DialogActions>
                <Button onClick={() => onDisagree()} color="primary">No</Button>
                <Button onClick={() => onLogout()} color="primary" autoFocus>Yes</Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <div className='Avatar'>
            <Button aria-controls="menu" onClick={handleClick} style={{ margin: "0px 4px" }}>
                <p style={{ margin: '5px', fontFamily: 'Roboto', fontSize: '1.2rem', textTransform: "capitalize" }}>{UserService.currentUser.name}</p>
                <Avatar/>
            </Button>
            <Menu id="simple-menu"
                anchorEl={open}
                keepMounted
                open={Boolean(open)}
                onClose={handleClose} >
                <MenuItem onClick={() => { setProfileRedirect(true); close(null);}} >Profile</MenuItem>
                <MenuItem onClick={() => { setMyRideRedirect(true); close(null); }}>My Rides</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
                {profileRedirect ? <Redirect to='/profile' /> : ''}
                {myRideRedirect ? <Redirect to='/myride' /> : ''}
            </Menu>
            <ButtonBase style={{ height: '2.8rem', width: '2rem' }}>
                <SvgIcon onClick={homeRedirect}>
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </SvgIcon>
            </ButtonBase>
            {dialog}
        </div>
    );
} 
