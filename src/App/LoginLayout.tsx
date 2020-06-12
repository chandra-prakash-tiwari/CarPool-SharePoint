import * as React from 'react';
import { Grid } from '@material-ui/core';
import Login from '../components/Anonymus/Login';
import Text from '../components/Anonymus/Text'

export default class LoginLayout extends React.Component{
    render() {
        return (
            <Grid container>
                <Grid item xs={false} sm={true} md={8} className='page image'>
                    <Text/>
                </Grid>
                <Login />
            </Grid>
            )
    }
}