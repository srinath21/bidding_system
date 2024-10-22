import { Alert, Stack } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';

const Notification = (props) => {
    let timer = null;

    React.useEffect(() => {
        try {
            if (props.userDetails.isAuth) {
                if (!timer)
                    timer = setInterval(fetchNotifications, 10000);
            }
            else {
                if (timer)
                    clearInterval(timer);
            }
        }
        catch (error) {

        }
    }, [props.userDetails.isAuth]);

    const fetchNotifications = () => {
        try {
            axios.get("http://localhost:3000/api/notifications", {
                headers: {
                    'Authorization': 'Bearer ' + props.userDetails.token
                }
            }).then(response => {
                if (response.data.success) {
                    if (Array.isArray(response.data.result)) {
                        let newNotifications = []
                        response.data.result.forEach((r, k) => {
                            newNotifications.push({ index: k + props.notifications.items.length, message: r.Message, isOpen: true })
                        })

                        props.addNotifications(newNotifications);
                    }
                }
                else {
                    console.log("Error retrieving notifications from API: ", response.data.error);
                }
            }).catch(error => {
                console.log("Error in fetching notifications: ", error);
            })
        }
        catch (error) {
            console.log("Error in fetching notifications: ", error);
        }
    }

    console.log(props.notifications);

    return (
        (
            props.userDetails.isAuth && props.notifications.items.length > 0 ?
                (
                    <Stack sx={{ position: 'absolute', bottom: 24, right: 24 }} spacing={2} direction={'column'}>
                        {props.notifications.items.map(n => {
                            return (
                                <Alert
                                    onClose={() => props.removeNotification(n.index)}
                                    elevation={6}
                                    variant='filled'
                                    severity='info'>
                                    {n.message}
                                </Alert>
                            )
                        })}
                    </Stack>
                ) : null
        )
    )
}

const mapStateToProps = state => {
    return {
        userDetails: state.user,
        notifications: state.notification
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addNotifications: (notifications) => dispatch(actions.addNotifications(notifications)),
        removeNotification: (index) => dispatch(actions.removeNotification(index))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);