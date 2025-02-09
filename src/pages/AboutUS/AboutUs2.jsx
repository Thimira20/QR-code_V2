import React from 'react';
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
  Paper
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

const AboutUs = () => {
  const handleScroll = (elementId) => {
    document.getElementById(elementId).scrollIntoView({ behavior: "smooth" });
  };

  const features = [
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
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                About Us
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Creating the future of QR code generation
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => handleScroll('generatorSection')}
              >
                Try Generator
              </Button>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <AnimatedLogo h={200} w={200} />
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {React.cloneElement(feature.icon, { sx: { fontSize: 40 } })}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Content */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Our Mission
              </Typography>
              <Typography paragraph>
                Welcome to our QR Code Generator app! Our mission is to make QR Code creation seamless,
                whether you're a business professional, a student, or just someone exploring digital tools.
                With easy-to-use features and a sleek design, we aim to provide the best QR Code generating experience.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => handleScroll('stepsSection')}
              >
                Learn How It Works
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Contact Us
                  </Typography>
                  <Stack spacing={2}>
                    <Typography variant="body1">
                      Have questions or feedback? We'd love to hear from you!
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Email />}
                      href="mailto:thimiranavodya20@gmail.com"
                      fullWidth
                    >
                      Email Us
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
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