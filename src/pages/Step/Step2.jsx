import React, { useState, useEffect } from 'react';
import { 
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  IconButton,
  useTheme,
  styled,
  Fade,
  Slide,
  Zoom,
  Grow
} from '@mui/material';
import {
  DoubleArrow as DoubleArrowIcon,
  Navigation as NavigationIcon,
  QrCode2 as QrCodeIcon,
  Download as DownloadIcon,
  Link as LinkIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import './enhancedStep.css';

// Enhanced styled components with modern design
const MainCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  borderRadius: '24px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  }
}));

const StepItem = styled(Paper)(({ theme, active }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  borderRadius: '16px',
  background: active 
    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
    : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover': {
    transform: 'translateX(12px) translateY(-4px)',
    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.2)',
    '&::before': {
      left: '100%',
    }
  }
}));

const StepNumber = styled(Box)(({ theme, active }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: active 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #e3e8f4 0%, #d1d9e6 100%)',
  color: active ? '#ffffff' : theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  marginRight: theme.spacing(2),
  transition: 'all 0.3s ease',
  boxShadow: active 
    ? '0 8px 25px rgba(102, 126, 234, 0.3)'
    : '0 4px 15px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  '&::after': active ? {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    opacity: 0.3,
    animation: 'pulse 2s ease-in-out infinite',
  } : {}
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  height: 450,
  position: 'relative',
  background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
  borderRadius: '20px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, transparent 49%, rgba(102, 126, 234, 0.03) 50%, transparent 51%)',
    backgroundSize: '20px 20px',
  }
}));

const StepImage = styled('img')(({ visible }) => ({
  maxWidth: '90%',
  maxHeight: '90%',
  objectFit: 'contain',
  borderRadius: '12px',
  opacity: visible ? 1 : 0,
  transform: visible ? 'scale(1)' : 'scale(0.9)',
  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'absolute',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  border: '2px solid rgba(255, 255, 255, 0.8)',
}));

const AnimatedArrow = styled(IconButton)(({ active }) => ({
  transform: active ? 'translateX(8px) scale(1.1)' : 'translateX(0) scale(1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: active 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'transparent',
  color: active ? '#ffffff' : 'inherit',
  '&:hover': {
    background: active 
      ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
      : 'rgba(102, 126, 234, 0.1)',
    transform: 'translateX(12px) scale(1.15)',
  }
}));

function Steps() {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  const steps = [
    {
      title: "Paste Link & Select Size",
      description: "Enter your URL and choose your preferred QR code dimensions for optimal scanning",
      image: "https://github.com/Thimira20/qr-code2/blob/master/public/images/step1.jpg?raw=true",
      icon: <LinkIcon />,
      color: "#667eea"
    },
    {
      title: "Generate QR Code",
      description: "Click the generate button to create your custom, high-resolution QR code instantly",
      image: "https://github.com/Thimira20/qr-code2/blob/master/public/images/step2.jpg?raw=true",
      icon: <QrCodeIcon />,
      color: "#764ba2"
    },
    {
      title: "Download & Share",
      description: "Save your QR code in multiple formats and share it across all platforms",
      image: "https://github.com/Thimira20/qr-code2/blob/master/public/images/step3.jpg?raw=true",
      icon: <DownloadIcon />,
      color: "#48bb78"
    }
  ];

  useEffect(() => {
    // Auto-advance steps for demo purposes (optional)
    const timer = setTimeout(() => {
      // Could add auto-advance logic here if needed
    }, 100);
    return () => clearTimeout(timer);
  }, [activeStep]);

  return (
    <MainCard elevation={0}>
      <CardContent sx={{ p: 4 }}>
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 2
              }}
            >
              How It Works
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                maxWidth: '600px', 
                mx: 'auto',
                lineHeight: 1.6,
                opacity: 0.8
              }}
            >
              Follow these simple steps to create your professional QR code in seconds
            </Typography>
          </Box>
        </Fade>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 5,
          alignItems: 'start'
        }}>
          {/* Enhanced Steps List */}
          <Box>
            {steps.map((step, index) => (
              <Slide
                key={index}
                direction="right"
                in
                timeout={600 + index * 200}
              >
                <StepItem
                  active={activeStep === index}
                  elevation={activeStep === index ? 8 : 2}
                  onClick={() => setActiveStep(index)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <StepNumber active={activeStep === index}>
                      {activeStep === index ? (
                        <Zoom in timeout={300}>
                          <Box sx={{ color: 'inherit' }}>
                            {step.icon}
                          </Box>
                        </Zoom>
                      ) : (
                        index + 1
                      )}
                    </StepNumber>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: activeStep === index ? 'primary.main' : 'text.primary',
                          mb: 0.5,
                          transition: 'color 0.3s ease'
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ lineHeight: 1.5 }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>
                  <AnimatedArrow 
                    active={activeStep === index}
                    size="small"
                  >
                    <DoubleArrowIcon />
                  </AnimatedArrow>
                </StepItem>
              </Slide>
            ))}
          </Box>

          {/* Enhanced Preview Area */}
          <Grow in timeout={1000}>
            <ImageContainer>
              {steps.map((step, index) => (
                <Fade
                  key={index}
                  in={activeStep === index}
                  timeout={400}
                >
                  <StepImage
                    src={step.image}
                    alt={`Step ${index + 1}: ${step.title}`}
                    visible={activeStep === index}
                  />
                </Fade>
              ))}
              
              {/* Dynamic Status Indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  px: 2,
                  py: 1,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: steps[activeStep]?.color || theme.palette.primary.main,
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: '0.75rem'
                  }}
                >
                  Preview
                </Typography>
              </Box>

              {/* Step Progress Indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '20px',
                  px: 2,
                  py: 1,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CheckIcon 
                  sx={{ 
                    color: steps[activeStep]?.color || theme.palette.primary.main,
                    fontSize: '1rem'
                  }} 
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  Step {activeStep + 1} of {steps.length}
                </Typography>
              </Box>

              {/* Floating Action Hint */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  background: `linear-gradient(135deg, ${steps[activeStep]?.color}20, ${steps[activeStep]?.color}10)`,
                  borderRadius: '16px',
                  px: 2,
                  py: 1,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${steps[activeStep]?.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  opacity: 0.8,
                  transition: 'all 0.3s ease'
                }}
              >
                <Box sx={{ color: 'inherit' }}>
                  {steps[activeStep]?.icon}
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600,
                    color: steps[activeStep]?.color,
                    fontSize: '0.75rem'
                  }}
                >
                  {steps[activeStep]?.title.split(' ')[0]}
                </Typography>
              </Box>
            </ImageContainer>
          </Grow>
        </Box>
      </CardContent>
    </MainCard>
  );
}

export default Steps;