import { Accordion, AccordionDetails, AccordionSummary, Box, CardMedia, List, ListItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import { BASE_URL } from '../api'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import { green, red } from '@mui/material/colors';

export default function Answer({ qna }) {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    const markCorrectOrNot = (item, index) => {
        if ([item.answer, item.selected].includes(index)) {
            return {
                sx: {
                    color: item.answer === index ? green[500] : red[500]
                }
            }
        }
    }
    return (
        <Box sx={{ mt: 5, maxWidth: 640, mx: 'auto' }}>
            {qna.map((item, index) =>
                <Accordion
                    disableGutters
                    key={index} 
                    expanded={expanded === index}
                    onChange={handleChange(index)}
                >
                    <AccordionSummary expandIcon={<ExpandCircleDownIcon
                        sx={{
                            color: item.answer === item.selected ? green[500] : red[500]
                        }}
                    />}>
                        <Typography sx={{
                            width: '90%',
                            flexShrink: 0
                        }}>
                            {item.questionInWords}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {item.imageName &&
                            <CardMedia 
                                component="img"
                                image={`${BASE_URL}images/${item.imageName}`}
                                sx={{ m: '10px auto', width: 'auto' }}
                            />
                        }
                        <List>
                            {item.options.map((option, index) => 
                                <ListItem key={index}>
                                    <Typography {...markCorrectOrNot(item, index)}>
                                        <b>{String.fromCharCode(65 + index) + " . "}</b>{option}
                                    </Typography>
                                </ListItem>
                            )}
                        </List>
                    </AccordionDetails>
                </Accordion>
            )}
        </Box>
    )
}
