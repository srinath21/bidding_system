import React from "react";
import PropTypes from "prop-types";
import { Box, Tooltip, IconButton, Avatar, Menu, MenuItem, Typography, Divider } from "@mui/material";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import * as actions from '../../../redux/actions'

const UserMenu = (props) => {
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Tooltip title="Open settings">
                <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}
                    name={props.userDetails.firstName + " " + props.userDetails.lastName}>
                    <Avatar alt={props.userDetails.firstName + " " + props.userDetails.lastName} src="/static/images/avatar/2.jpg" />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <div style={{ display: "flex", padding: "10px" }}>
                    <div style={{ paddingRight: "10px" }}>
                        <Avatar />
                    </div>
                    <div>
                        <div>{props.userDetails.firstName + " " + props.userDetails.lastName}</div>
                        <div>{props.userDetails.emailID}</div>
                    </div>
                </div>
                {props.items.profileSettings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                    </MenuItem>
                ))}
                <Divider />
                {props.items.transactionSettings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                    </MenuItem>
                ))}
                <Divider />
                {props.items.miscellaneousSettings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                    </MenuItem>
                ))}
                <Divider />
                <MenuItem key={"logout"} onClick={() => {
                    handleCloseUserMenu();
                    props.logout();
                    navigate("/");
                }}>
                    <Typography sx={{ textAlign: "center" }}>Log out</Typography>
                </MenuItem>
            </Menu>
        </Box>
    )
}

UserMenu.propTypes = {
    items: PropTypes.arrayOf(PropTypes.objectOf({
        profileSettings: PropTypes.array,
        transactionSettings: PropTypes.array,
        miscellaneous: PropTypes.array
    })).isRequired
}

UserMenu.defaultProps = {
    items: {
        profileSettings: [],
        transactionSettings: [],
        miscellaneousSettings: []
    }
}

const mapStateToProps = state => {
    return {
        userDetails: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logoutUser())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);