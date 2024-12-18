import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { Grid2 as Grid, Box, TextField, Typography, Checkbox, Button, FormControlLabel, Divider, Stack, CircularProgress } from '@mui/material';
import { Google, Apple, Facebook } from '@mui/icons-material';
import axios from 'axios';
import { connect } from 'react-redux';
import { ValidateString } from '../../utilities/UtilityFunction';
import * as actions from '../../redux/actions';
import { useNavigate } from 'react-router';

const Login = (props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
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
                minLength: 1,
                maxLength: 20,
            }
        }
    });

    const [keepUserSignedIn, setKeepUserSignedIn] = React.useState(true)
    const [error, setError] = React.useState(true);

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
            setLoading(true);
            let isValid = true;
            let newUserInfo = { ...userInfo }
            Object.keys(newUserInfo).forEach(key => {
                newUserInfo[key].error = ValidateString(newUserInfo[key].value, newUserInfo[key].validations, key === "email" ? "Email Address Format is invalid" : "Password must contain atleast one special character, lowercase character, uppercase character and a number");
                if (newUserInfo[key].error)
                    isValid = false;
            });
            if (isValid) {
                axios.post("http://localhost:3000/api/users/login", {
                    EmailID: userInfo.email.value,
                    Password: userInfo.password.value
                }).then(response => {
                    setLoading(false);
                    if (response.data.success) {
                        props.onLogin(response.data.result)
                        if (keepUserSignedIn)
                            localStorage.setItem("tokenDetails", JSON.stringify(response.data.result));
                        navigate("/");
                    }
                    else {
                        setLoading(false);
                        setError(response.data.error);
                    }
                }).catch(error => {
                    setLoading(false);
                    console.log("Error during login: ", error);
                    setError("Something went wrong!")
                });
            }
            else {
                setLoading(false);
                setUserInfo(newUserInfo)
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
                                <Box sx={{ position: "relative" }}>
                                    <Button variant='contained' fullWidth disabled={loading} onClick={handleSubmitClick}>
                                        Continue
                                    </Button>
                                    {loading &&
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                marginTop: '-12px',
                                                marginLeft: '-12px',
                                            }}
                                        />
                                    }
                                </Box>
                                {error ? <Typography variant="body2" sx={{ color: "red", width: "100%", textAlign: "center", mt: 1 }} >{error}</Typography> : null}
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
            </Box >
        </ErrorBoundary >
    )
}

const mapStateToProps = state => {
    return {
        userDetails: state.userReducer
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (token) => dispatch(actions.setAuthToken(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);