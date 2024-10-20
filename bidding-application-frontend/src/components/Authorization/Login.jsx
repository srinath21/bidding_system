import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { Grid2 as Grid, Box, TextField, Typography, Checkbox, Button, FormControlLabel, Divider, Stack } from '@mui/material';
import { Google, Apple, Facebook } from '@mui/icons-material';

const Login = (props) => {
    const [userInfo, setUserInfo] = React.useState({
        email: {
            label: 'Email Address',
            value: '',
            error: null,
            type: 'email',
            validations: {
                expression: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            }
        },
        password: {
            label: 'Password',
            value: '',
            error: null,
            type: 'password',
            validations: {
                maxLength: 20,
            }
        }
    });

    const [keepUserSignedIn, setKeepUserSignedIn] = React.useState(true)

    const handleInputChange = (key, value) => {
        try {
            let newUserInfo = { ...userInfo };
            newUserInfo[key].value = value;
            newUserInfo[key].error = ValidateString(value, newUserInfo[key].validations, key === "email" ? "Email Address Format is invalid" : "Password must contain atleast one special character, lowercase character, uppercase character and a number")
            setUserInfo(newUserInfo);
        }
        catch (error) {
            console.log("Error in handleInputChange: ", error);
        }
    }

    const handleSubmitClick = () => {
        try {
            let isValid = true;
            Object.keys(userInfo).forEach(key => {
                if (userInfo[key].error)
                    isValid = false;
            });
            if (isValid) {
                // TODO
            }
        }
        catch (error) {
            console.log("Error in handleSubmitClick: ", error);
        }
    }

    return (
        <ErrorBoundary>
            <Box sx={{ flexGrow: 1, my: 10 }}>
                <Grid container spacing={2} >
                    <Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
                        <ErrorBoundary>
                            <Typography variant='h5' sx={{ paddingBottom: "10px" }}>
                                Login
                            </Typography>
                            <Typography variant='span' sx={{ paddingBottom: "10px" }}>
                                Welcome back. Enter your credentials to access your account
                            </Typography>
                            {
                                Object.keys(userInfo).map(key => (
                                    <Grid key={key} size={12} sx={{ my: 2 }}>
                                        <TextField
                                            error={userInfo[key].error !== null}
                                            variant='outlined'
                                            value={userInfo[key].value}
                                            label={userInfo[key].label}
                                            type={userInfo[key].type}
                                            fullWidth
                                            helperText={userInfo[key].error}
                                            onChange={(event) => { handleInputChange(key, event.target.value) }}
                                        />
                                    </Grid>
                                ))
                            }
                            <Grid size={12} sx={{ my: 2 }}>
                                <FormControlLabel
                                    control={<Checkbox checked={keepUserSignedIn} onClick={(event) => { setKeepUserSignedIn(!emailSubscription) }} />}
                                    label="Keep me signed in"
                                />
                            </Grid>
                            <Grid size={12} sx={{ my: 2 }}>
                                <Button variant='contained' fullWidth onClick={handleSubmitClick}>
                                    Continue
                                </Button>
                            </Grid>
                            <Divider>or sign up with</Divider>
                            <Grid size={12} sx={{ my: 2 }}>
                                <Stack spacing={3} direction="row">
                                    <Button size="small" variant='outlined' startIcon={<Google />}>Google</Button>
                                    <Button size="small" variant='outlined' startIcon={<Apple />}>Apple</Button>
                                    <Button size="small" variant='outlined' startIcon={<Facebook />}>Facebook</Button>
                                </Stack>
                            </Grid>
                        </ErrorBoundary>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 8, xl: 9 }}>

                    </Grid>
                </Grid>
            </Box>
        </ErrorBoundary>
    )
}

export default Login;