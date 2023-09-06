import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useStateContext from '../hooks/useStateContext'

export default function Layout() {
    const { resetContext } = useStateContext();
    const navigate = useNavigate();

    const logout = () => {
        resetContext();
        navigate("/");
    }

    return (
        <>
            <AppBar position='sticky'>
                <Toolbar sx={{ width: 640, margin: 'auto' }}>
                    <Typography variant='h4' align='center' sx={{ flex: 1}}>Quiz App</Typography>
                    <Button onClick={logout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
        </>
    )
}
