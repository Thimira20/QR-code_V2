import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Divider,
  Stack,
  Paper,
  Fade,
  Slide,
  Zoom
} from '@mui/material';
import {
  Instagram,
  Facebook,
  LinkedIn,
  GitHub,
  Email,
  ArrowForward,
  Timeline,
  Code,
  Security,
  Speed
} from '@mui/icons-material';
import AnimatedLogo from "../../components/AnimatedLogo";
import './enhancedAbout.css';

const AboutUs = () => {
  const features = useMemo(() => [
    {
      icon: <Code />,
      title: "Custom QR Codes",
      description: "Create personalized QR codes with custom colors and logos"
    },
    {
      icon: <Speed />,
      title: "Instant Generation",
      description: "Generate high-resolution QR codes instantly in your browser"
    },
    {
      icon: <Security />,
      title: "Secure Service",
      description: "Completely secure and reliable QR code generation"
    },
    {
      icon: <Timeline />,
      title: "Analytics",
      description: "Track and analyze your QR code performance"
    }
  ], []);

  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Hero animation trigger
    setTimeout(() => setHeroVisible(true), 300);

    // Features animation trigger with stagger
    const timer = setTimeout(() => {
      features.forEach((_, index) => {
        setTimeout(() => {
          setVisibleFeatures(prev => [...prev, index]);
        }, index * 200);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [features]);

  const handleScroll = (elementId) => {
    document.getElementById(elementId).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }} className="about-us-container">
      {/* Hero Section */}
      <Paper 
        elevation={0}
        className="hero-section"
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1a1a2e 100%)'
        }}
      >
        <div className="floating-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={heroVisible} timeout={1000}>
                <div>
                  <Typography 
                    variant="h2" 
                    fontWeight="bold" 
                    gutterBottom
                    className="hero-title"
                  >
                    About Us
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ mb: 4, opacity: 0.9 }}
                    className="hero-subtitle"
                  >
                    Creating the future of QR code generation
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="secondary"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => handleScroll('generatorSection')}
                    className="hero-button"
                  >
                    Try Generator
                  </Button>
                </div>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Zoom in={heroVisible} timeout={1200} style={{ transitionDelay: '300ms' }}>
                <div className="animated-logo-container">
                  <AnimatedLogo h={200} w={200} />
                </div>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }} className="features-section">
        <Fade in={true} timeout={1000}>
          <Typography 
            variant="h3" 
            textAlign="center" 
            gutterBottom 
            sx={{ mb: 6 }}
            className="features-title"
          >
            Our Features
          </Typography>
        </Fade>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Slide 
                direction="up" 
                in={visibleFeatures.includes(index)} 
                timeout={600}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }
                  }}
                  className={`feature-card feature-card-${index}`}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box 
                      sx={{ 
                        color: 'primary.main', 
                        mb: 2,
                        animation: `iconPulse 2s ease-in-out infinite`,
                        animationDelay: `${index * 0.2}s`
                      }}
                      className="feature-icon"
                    >
                      {React.cloneElement(feature.icon, { 
                        sx: { 
                          fontSize: 50,
                          transition: 'all 0.3s ease'
                        } 
                      })}
                    </Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      className="feature-title"
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      className="feature-description"
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Content */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }} className="about-content-section">
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Slide direction="right" in={true} timeout={1000}>
                <div>
                  <Typography variant="h4" gutterBottom className="mission-title">
                    Our Mission
                  </Typography>
                  <Typography paragraph className="mission-text">
                    Welcome to our QR Code Generator app! Our mission is to make QR Code creation seamless,
                    whether you're a business professional, a student, or just someone exploring digital tools.
                    With easy-to-use features and a sleek design, we aim to provide the best QR Code generating experience.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => handleScroll('stepsSection')}
                    className="learn-more-button"
                  >
                    Learn How It Works
                  </Button>
                </div>
              </Slide>
            </Grid>
            <Grid item xs={12} md={6}>
              <Slide direction="left" in={true} timeout={1000} style={{ transitionDelay: '200ms' }}>
                <Card className="contact-card">
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom className="contact-title">
                      Contact Us
                    </Typography>
                    <Stack spacing={3}>
                      <Typography variant="body1" className="contact-text">
                        Have questions or feedback? We'd love to hear from you!
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Email />}
                        href="mailto:thimiranavodya20@gmail.com"
                        fullWidth
                        className="email-button"
                      >
                        Email Us
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Navigation Buttons */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center"
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Button onClick={() => handleScroll('homeSection')}>Home</Button>
          <Button onClick={() => handleScroll('stepsSection')}>Steps</Button>
          <Button onClick={() => handleScroll('generatorSection')}>Generate</Button>
        </Stack>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="body2">
                © {new Date().getFullYear()} All rights reserved
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={1}>
                <IconButton 
                  href="https://www.instagram.com/thimira_navodya_?igsh=YXhxNjducGk3aGQx"
                  color="inherit"
                  size="small"
                >
                  <Instagram />
                </IconButton>
                <IconButton 
                  href="https://www.facebook.com/thimira.navodya.1?mibextid=kFxxJD"
                  color="inherit"
                  size="small"
                >
                  <Facebook />
                </IconButton>
                <IconButton 
                  href="https://www.linkedin.com/in/thimira-navodya-59157a244"
                  color="inherit"
                  size="small"
                >
                  <LinkedIn />
                </IconButton>
                <IconButton 
                  href="https://github.com/Thimira20"
                  color="inherit"
                  size="small"
                >
                  <GitHub />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutUs;