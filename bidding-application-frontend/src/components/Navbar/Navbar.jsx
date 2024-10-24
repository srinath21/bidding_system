import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Container, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Button } from '@mui/material';
import NavItems from './NavItems';
import UserMenu from './User/UserMenu';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { connect } from 'react-redux';

const pages = ['Products', 'Pricing', 'Blog'];

const Navbar = (props) => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };


    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "pink", color: "black" }}>
            <Toolbar
                disableGutters
                sx={{
                    display: { xs: "flex" },
                    flexDirection: "row",
                    // backgroundColor: "blue",
                    justifyContent: "space-between",
                    paddingLeft: { xs: 0, md: "10%" },
                    paddingRight: { xs: 0, md: "10%" }
                }}>
                {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                <NavLink to={"/"}>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Genix Auctions
                    </Typography>
                </NavLink>
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        {/* <MenuIcon /> */}
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                        {pages.map((page) => (
                            <MenuItem key={page} onClick={handleCloseNavMenu}>
                                <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
                {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href="#app-bar-with-responsive-menu"
                    sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    LOGO
                </Typography>
                <div style={{ display: 'flex', flexDirection: "row" }} >
                    <NavItems pages={props.menu} />
                    {props.userDetails.isAuth ?
                        <UserMenu items={props.userMenu} /> :
                        <>
                            <Button
                                sx={{ my: "auto", marginRight: "5px", color: 'dodgerblue', display: 'block' }}
                                onClick={() => navigate("/login")}>
                                Login
                            </Button>
                            <Button size='small' sx={{ py: 2, maxHeight: "40px", my: "auto" }} variant='contained' onClick={() => navigate("/signup")}>
                                Get Started
                            </Button>
                        </>
                    }
                </div>
            </Toolbar>
        </AppBar >
    )
}

Navbar.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.object).isRequired,
    userMenu: PropTypes.arrayOf(PropTypes.object).isRequired
}

Navbar.defaultProps = {

}

const mapStateToProps = state => {
    return {
        userDetails: state.user
    }
}

export default connect(mapStateToProps, null)(Navbar);