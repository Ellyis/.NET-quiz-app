import React, { useEffect, useState } from 'react'
import useStateContext from '../hooks/useStateContext'
import { ENDPOINTS, createAPIEndpoint } from '../api';
import { Alert, Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { getFormattedTime } from '../helper';
import { useNavigate } from 'react-router-dom';
import Answer from './Answer';

export default function Results() {
    const { context, setContext } = useStateContext();
    const navigate = useNavigate();

    const [score, setScore] = useState(0);
    const [qna, setQna] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const questionIds = context.selectedOptions.map(x => x.questionId);
        createAPIEndpoint(ENDPOINTS.GETANSWERS).post(questionIds)
            .then(res => {
                const temp = context.selectedOptions.map(x => ({
                    ...x,
                    ...(res.data.find(y => y.questionId === x.questionId))
                }))
                setQna(temp);
                calculateScore(temp);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const calculateScore = qna => {
        let tempScore = qna.reduce((acc, x) => {
            return x.answer === x.selected ? acc + 1 : acc;
        }, 0)
        setScore(tempScore);
    }

    const restart = () => {
        setContext({
            timeTaken: 0,
            selectedOptions: []
        })
        navigate("/quiz");
    }

    const submitScore = () => {
        createAPIEndpoint(ENDPOINTS.PARTICIPANT)
            .put(context.participantId, {
                score: score,
                timeTaken: context.timeTaken
            })
            .then(res => {
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 4000);
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            <Card sx={{ mt: 5, display: 'flex', width: '100%', mx: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
                        <Typography variant="h4">Congratulations!</Typography>
                        <Typography variant="h6">YOUR SCORE</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            <Typography variant="span" color={green[500]}>
                                {score}
                            </Typography>/5
                        </Typography>
                        <Typography variant="h6">
                            Took {getFormattedTime(context.timeTaken) + ' mins'}
                        </Typography>
                        <Button size='small' variant='contained' sx={{ mx: 1 }} onClick={submitScore}>
                            Submit
                        </Button>
                        <Button size='small' variant='contained' sx={{ mx: 1 }} onClick={restart}>
                            Retry
                        </Button>
                        <Alert variant='string' severity='success'sx={{
                            width: '60%',
                            m: 'auto',
                            visibility: showAlert ? 'visible' : 'hidden'
                        }}>
                            Score Updated
                        </Alert>
                    </CardContent>
                </Box>
                <CardMedia component="img" image='./result.png' sx={{ width: 220 }} />
            </Card>
            <Answer qna={qna} />
        </>
    )
}
