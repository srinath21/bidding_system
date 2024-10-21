import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { Grid2 as Grid, Box, TextField, Typography, Checkbox, Button, FormControlLabel, Divider, Stack, CircularProgress } from '@mui/material';
import { ValidateString } from '../../utilities/UtilityFunction';
import { Google, Apple, Facebook } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router';

const SignUp = (props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [userInfo, setUserInfo] = React.useState({
        firstName: {
            label: 'First Name',
            value: '',
            error: null,
            type: 'text',
            validations: {
                minLength: 1,
                maxLength: 20
            }
        },
        lastName: {
            label: 'Last Name',
            value: '',
            error: null,
            type: 'text',
            validations: {
                minLength: 1,
                maxLength: 20
            }
        },
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
                minLength: 8,
                maxLength: 20,
                expression: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
            }
        }
    });

    const [error, setError] = React.useState(null);

    const [emailSubscription, setEmailSubscription] = React.useState(false);

    const [signUpSuccessful, setSignUpSuccessful] = React.useState(false);

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
                setError(null);
                axios.post("http://localhost:3000/api/users/", {
                    FirstName: userInfo.firstName.value,
                    LastName: userInfo.lastName.value,
                    EmailID: userInfo.email.value,
                    Password: userInfo.password.value,
                    EmailSubscription: emailSubscription
                }).then(response => {
                    if (response.data.success) {
                        setSignUpSuccessful(true);
                    }
                    else {
                        setError(response.data.error);
                    }
                    setLoading(false);
                }).catch(error => {
                    setLoading(false);
                    console.log("Error signing up the user: ", error);
                    setError("Something went wrong!");
                })
            } else {
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
                <Grid container spacing={2}>
                    {!signUpSuccessful ?
                        <>
                            <Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
                                <ErrorBoundary>
                                    <Typography variant='h5' sx={{ paddingBottom: "10px" }}>
                                        Sign Up
                                    </Typography>
                                    <Typography variant='span' sx={{ paddingBottom: "10px" }}>
                                        New bidders, as soon as you have submitted your information you will be eligible to bid in the auction
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
                                            control={<Checkbox value={emailSubscription} onClick={(event) => { setEmailSubscription(!emailSubscription) }} />}
                                            label="Receive outbid emails"
                                        />
                                    </Grid>
                                    <Grid size={12} sx={{ my: 2 }}>
                                        <Box sx={{ position: "relative" }}>
                                            <Button variant='contained' fullWidth onClick={handleSubmitClick} disabled={loading}>
                                                Submit
                                            </Button>
                                            {
                                                loading && (
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
                                                )
                                            }
                                        </Box>
                                        {error ? <Typography variant="body2" sx={{ color: "red", width: "100%", textAlign: "center", mt: 1 }} >{error}</Typography> : null}
                                    </Grid>
                                    <Divider>or sign up with</Divider>
                                    <Grid size={12} sx={{ my: 2 }}>
                                        <Stack spacing={3} direction="row">
                                            <Button size='medium' variant='outlined' startIcon={<Google />}>Google</Button>
                                            <Button size='medium' variant='outlined' startIcon={<Apple />}>Apple</Button>
                                            <Button size='medium' variant='outlined' startIcon={<Facebook />}>Facebook</Button>
                                        </Stack>
                                    </Grid>
                                </ErrorBoundary>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, lg: 8, xl: 9 }}>

                            </Grid>
                        </> :
                        <>
                            <Grid size={{ xs: 12 }} sx={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                                <Typography variant='h2'>
                                    Uncover Deals, Unleash Excitement: Dive into Our Auctions Today!
                                </Typography>
                                <Typography sx={{ mt: 4, mb: 10 }} variant='h4'>
                                    SIGNED UP SUCCESSFULLY!
                                </Typography>
                                <Button variant='contained' sx={{ alignSelf: "center" }} onClick={() => navigate("/login")}>
                                    Login Now
                                </Button>
                            </Grid>
                        </>
                    }
                </Grid>
            </Box>
        </ErrorBoundary>
    )
}

export default SignUp;