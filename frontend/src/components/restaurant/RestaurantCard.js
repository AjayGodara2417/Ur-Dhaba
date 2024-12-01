import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Rating,
    Box,
    Chip,
    Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccessTime, CurrencyRupee } from '@mui/icons-material';

const RestaurantCard = ({ restaurant }) => {
    const navigate = useNavigate();
    const {
        id,
        name,
        image,
        cuisine,
        rating,
        deliveryTime,
        priceRange,
        tags,
        isOpen,
        totalReviews
    } = restaurant;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out'
                }
            }}
            onClick={() => navigate(`/restaurant/${id}`)}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={image}
                    alt={name}
                />
                {!isOpen && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="h6" color="white">
                            Currently Closed
                        </Typography>
                    </Box>
                )}
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {cuisine}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({totalReviews})
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                            {deliveryTime} mins
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CurrencyRupee sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                            {priceRange}
                        </Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            color="primary"
                        />
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default RestaurantCard;
