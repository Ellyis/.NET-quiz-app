import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, CardHeader, CardMedia, LinearProgress, List, ListItemButton, Typography } from '@mui/material'
import { BASE_URL, ENDPOINTS, createAPIEndpoint } from '../api'
import { getFormattedTime } from '../helper'
import useStateContext from '../hooks/useStateContext'
import { useNavigate } from 'react-router-dom'

export default function Quiz() {
    const { context, setContext } = useStateContext();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);

    let timer = null;

    const startTimer = () => {
        if (timer !== null) {
            clearInterval(timer);
        }
        timer = setInterval(() => {
            setTimeTaken(prev => prev + 1);
        }, 1000);
    }

    useEffect(() => {
        setContext({
            timeTaken: 0,
            selectedOptions: []
        })
        createAPIEndpoint(ENDPOINTS.QUESTION).fetchAll()
            .then(res => {
                setQuestions(res.data);
                startTimer();
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const updateAnswer = (questionId, index) => {
        const temp = [...context.selectedOptions]
        temp.push({
            questionId,
            selected: index
        })

        if (questionIndex < 4) {
            setContext({ selectedOptions: [...temp] })
            setQuestionIndex(questionIndex + 1);
        }
        else {
            setContext({ selectedOptions: [...temp], timeTaken })
            navigate("/results");
        }
    }
    
    return (
        questions.length > 0 && (
            <Card sx={{ maxWidth: 640, marginX: 'auto', marginTop: 5,
                        '& .MuiCardHeader-action': { margin: 0, alignSelf: 'center' }
                }}>
                <CardHeader 
                    title={`Question ${questionIndex + 1} of 5`} 
                    action={<Typography>{getFormattedTime(timeTaken)}</Typography>}
                />
                <Box>
                    <LinearProgress variant='determinate' value={(questionIndex + 1) * 100 / 5} />
                </Box>
                {questions[questionIndex].imageName && 
                    <CardMedia 
                        component="img" 
                        image={`${BASE_URL}images/${questions[questionIndex].imageName}`}
                        sx={{ width: 'auto', margin: '2rem auto' }}
                    />
                }
                <CardContent>
                    <Typography variant='h6'>
                        {questions[questionIndex].questionInWords}
                    </Typography>
                    <List>
                        {questions[questionIndex].options.map((option, index) => 
                            <ListItemButton 
                                key={index}
                                onClick={() => updateAnswer(questions[questionIndex].questionId, index)}
                            >
                                <div>
                                    <b>{String.fromCharCode(65 + index) + " . "}</b>
                                    {option}
                                </div>
                            </ListItemButton>
                        )}
                            
                    </List>
                </CardContent>
            </Card>
        )
    )
}
