import React from "react";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import PropTypes from "prop-types";

const NavItems = (props) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState({});
    const [anchorElPage, setAnchorElPage] = React.useState(null);

    React.useEffect(() => {
        let menuOpenStatus = {};
        if (Array.isArray(props.pages)) {
            props.pages.forEach((page) => {
                if (page.subPages) {
                    menuOpenStatus[page.Name] = false
                }
            })
        }

        setIsMenuOpen(menuOpenStatus);
    }, [props.pages])

    const handleMenuItemClick = (event, page) => {
        setAnchorElPage(event.currentTarget)
        if (page.subPages) {
            let menuOpenStatus = { ...isMenuOpen }
            Object.keys(menuOpenStatus).forEach(key => {
                if (key === page.Name)
                    menuOpenStatus[key] = !menuOpenStatus[key];
                else
                    menuOpenStatus[key] = false;
            })

            setIsMenuOpen(menuOpenStatus)
        }
    };

    return (
        <Box sx={{ display: "flex" }} marginRight={2}>
            {props.pages.map((page) => (
                <>
                    <Button
                        key={page}
                        onClick={(event) => handleMenuItemClick(event, page)}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        {page.Name}
                    </Button>
                    {
                        page.subPages ?
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElPage}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={isMenuOpen[page.Name]}
                                onClose={() => setIsMenuOpen({
                                    ...isMenuOpen,
                                    [page.Name]: false
                                })}
                            >
                                {page.subPages.map((subPage) => (
                                    <MenuItem key={subPage.Name} onClick={() => { }}>
                                        <Typography sx={{ textAlign: 'center' }}>{subPage.Name}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu> : null
                    }
                </>
            ))}
        </Box>
    )
}

NavItems.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.objectOf({
            Name: PropTypes.string.isRequired,
            subPages: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object))
        })
    ).isRequired
}

export default NavItems;