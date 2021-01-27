import * as React from 'react';
import { Grid } from '@material-ui/core';
import Login from '../components/Anonymus/Login';
import Text from '../components/Anonymus/Text'

export default class LoginLayout extends React.Component{
    render() {
        return (
            <Grid container>
                <Grid item xs={false} sm={4} md={8} className='page image'>
                    <Text/>
                </Grid>
                <Grid item xs={12} sm={8} md={4} className='page image'>
                    <Login />
                </Grid>
            </Grid>
            )
    }
}
