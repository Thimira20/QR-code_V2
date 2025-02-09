import React, { useState } from 'react';
import { 
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  IconButton,
  useTheme,
  styled,
  CircularProgress
} from '@mui/material';
import {
  DoubleArrow as DoubleArrowIcon,
  Navigation as NavigationIcon
} from '@mui/icons-material';

// Styled components using MUI's styled API
const StepItem = styled(Paper)(({ theme, active }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  backgroundColor: active ? theme.palette.primary.light : theme.palette.background.paper,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.light : theme.palette.action.hover,
    transform: 'translateX(8px)'
  }
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  height: 400,
  position: 'relative',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StepImage = styled('img')(({ visible }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  padding: '16px',
  opacity: visible ? 1 : 0,
  transition: 'opacity 0.5s ease-in-out',
  position: 'absolute'
}));

function Steps() {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  const steps = [
    {
      title: "Paste Link & Select Size",
      description: "Enter your URL and choose your preferred QR code dimensions",
      image: "https://github.com/Thimira20/qr-code2/blob/master/public/images/step1.jpg?raw=true"
    },
    {
      title: "Generate QR Code",
      description: "Click the generate button to create your custom QR code",
      image: "https://github.com/Thimira20/qr-code2/blob/master/public/images/step2.jpg?raw=true"
    },
    {
      title: "Download",
      description: "Save your QR code in your preferred format",
      image: "https://github.com/Thimira20/qr-code2/blob/master/public/images/step3.jpg?raw=true"
    }
  ];

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Follow these simple steps to create your QR code
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4
        }}>
          {/* Steps List */}
          <Box>
            {steps.map((step, index) => (
              <StepItem
                key={index}
                active={activeStep === index}
                elevation={activeStep === index ? 2 : 1}
                onClick={() => setActiveStep(index)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: activeStep === index ? 'primary.main' : 'grey.300',
                      color: activeStep === index ? 'primary.contrastText' : 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: activeStep === index ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  size="small"
                  sx={{ 
                    transform: activeStep === index ? 'translateX(4px)' : 'none',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <DoubleArrowIcon 
                    color={activeStep === index ? 'primary' : 'action'}
                  />
                </IconButton>
              </StepItem>
            ))}
          </Box>

          {/* Preview Area */}
          <ImageContainer>
            {steps.map((step, index) => (
              <StepImage
                key={index}
                src={step.image}
                alt={`Step ${index + 1}`}
                visible={activeStep === index}
              />
            ))}
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                color: theme.palette.primary.main
              }}
            />
          </ImageContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Steps;