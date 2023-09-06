import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import Center from './Center'
import useForm from '../hooks/useForm'
import { ENDPOINTS, createAPIEndpoint } from '../api/index'
import useStateContext from '../hooks/useStateContext'
import { useNavigate } from 'react-router-dom'

const getFreshModelObject = () => ({
    name: "",
    email: ""
});

export default function Login() {
    const { context, setContext, resetContext } = useStateContext();
    const navigate = useNavigate();

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange
    } = useForm(getFreshModelObject);

    useEffect(() => {
        resetContext();
    }, [])
    
    const login = e => {
        e.preventDefault();
        if (validate()) {
            createAPIEndpoint(ENDPOINTS.PARTICIPANT).post(values)
                .then(res => {
                    setContext({ participantId: res.data.participantId });
                    navigate('/quiz');
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const validate = () => {
        let temp = {};
        temp.email = (/\S+@\S+\.\S+/).test(values.email) ? "" : "Invalid email.";
        temp.name = values.name !== "" ? "" : "This field is required.";

        setErrors(temp);

        return Object.values(temp).every(x => x === "");
    }

    return (
        <Center>
            <Card sx={{ width: 400 }}>
                <CardContent sx={{ textAlign: 'center'}}>
                    <Typography variant='h3' sx={{ marginY: 3 }}>
                        Quiz App
                    </Typography>
                    <Box sx={{
                        '& .MuiTextField-root': {
                            margin: 1,
                            width: '90%',
                        }
                    }}>
                        <form noValidate autoComplete='off' onSubmit={login}>
                            <TextField 
                                label="Email" 
                                name='email' 
                                variant='outlined'
                                value={values.email}
                                onChange={handleInputChange}
                                {...(errors.email && { error: true, helperText: errors.email })}
                            />
                            <TextField 
                                label="Name" 
                                name='name' 
                                variant='outlined'
                                value={values.name}
                                onChange={handleInputChange}
                                {...(errors.name && { error: true, helperText: errors.name })}
                            />
                            <Button type='submit' size='large' variant='contained' sx={{ width: '90%' }}>Start</Button>
                        </form>
                    </Box>
                </CardContent>
            </Card>
        </Center>
    )
}
