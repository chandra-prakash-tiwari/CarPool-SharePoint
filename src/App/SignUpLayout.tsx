import * as React from 'react';
import { Grid } from '@material-ui/core';
import SignUp from '../components/Anonymus/SignUp';
import Text from '../components/Anonymus/Text';

export default class SignUpLayout extends React.Component{
    render() {
        return (
            <Grid container className='page'>
                <Grid item xs={false} sm={4} md={8} className='image'>
                    <Text/>
                </Grid>
                <SignUp />
            </Grid>
            )
    }
}