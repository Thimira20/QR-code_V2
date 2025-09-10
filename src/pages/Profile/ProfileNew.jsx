import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
  Fade,
  useTheme,
  useMediaQuery,
  Chip,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person, QrCode2, Stars, CalendarToday } from '@mui/icons-material';
import { getCurrentUser } from '../../services/authService';
import { getUserData } from '../../services/userDataService';
import QRCodeGallery from '../../components/NewImagelisi';
import './profileNew.css';

const ProfileContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),
  position: 'relative',
  zIndex: 1,
}));

const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(4),
  borderRadius: 16,
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  position: 'relative',
  overflow: 'hidden',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  backgroundColor: theme.palette.secondary.main,
  fontSize: '2.5rem',
  fontWeight: 'bold',
  border: '4px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.25)',
  },
}));

const StatCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.15)',
  borderRadius: 12,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 100,
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.25)',
  },
}));

const Profile = ({ refresh, count, setCount }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = getCurrentUser();
  const [userData, setUserData] = useState({
    qrCodesCount: 0,
    favoritesCount: 0,
    createdAt: ''
  });
  const [loading, setLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    // Add animation completion after a delay
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUserData();
        if (data && Array.isArray(data)) {
          // Calculate stats
          const favorites = data.filter(item => item.isFavorite).length;
          const joinDate = user.createdAt ? new Date(user.createdAt) : new Date();
          
          setUserData({
            qrCodesCount: data.length,
            favoritesCount: favorites,
            createdAt: joinDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setTimeout(() => setLoading(false), 600); // Add slight delay for smoother transitions
      }
    };
    fetchData();
  }, [count, user.createdAt]);

  if (loading) {
    return (
      <Fade in={true} timeout={800}>
        <Box className="profile-loading-container" display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="70vh" gap={3}>
          <Skeleton variant="circular" width={100} height={100} animation="wave" />
          <Box width="80%" maxWidth={600}>
            <Skeleton variant="text" height={60} animation="wave" />
            <Skeleton variant="text" height={30} animation="wave" width="60%" />
            <Box display="flex" gap={2} mt={4} width="100%">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={80} width="33%" animation="wave" />
              ))}
            </Box>
          </Box>
          <CircularProgress className="pulse-animation" />
          <Typography variant="body2" color="textSecondary">Loading your profile...</Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <div className="profile-page">
      <ProfileContainer maxWidth="lg">
        <Fade in={true} timeout={800}>
          <ProfileHeader elevation={3}>
            <div className="profile-header-background"></div>
            <ProfileAvatar>{user.username[0].toUpperCase()}</ProfileAvatar>
            <Box className="profile-info">
              <Typography variant="h4" component="h1" gutterBottom sx={{ 
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {user.username}'s Profile
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                {user.email}
              </Typography>
              <Box display="flex" gap={2} mt={2}>
                <Chip 
                  icon={<Person />} 
                  label={user.role || 'User'} 
                  variant="outlined" 
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
                <Chip 
                  icon={<CalendarToday />} 
                  label={`Joined ${userData.createdAt}`} 
                  variant="outlined"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
              </Box>
            </Box>
            
            <Box display="flex" gap={2} ml="auto" className="profile-stats">
              <StatCard>
                <QrCode2 sx={{ fontSize: 30, mb: 1, color: 'rgba(255,255,255,0.9)' }} />
                <Typography variant="h6" fontWeight="bold">{userData.qrCodesCount}</Typography>
                <Typography variant="caption">QR Codes</Typography>
              </StatCard>
              
              <StatCard>
                <Stars sx={{ fontSize: 30, mb: 1, color: 'rgba(255,255,255,0.9)' }} />
                <Typography variant="h6" fontWeight="bold">{userData.favoritesCount}</Typography>
                <Typography variant="caption">Favorites</Typography>
              </StatCard>
            </Box>
          </ProfileHeader>
        </Fade>

        <Fade in={true} timeout={1000} style={{ transitionDelay: '300ms' }}>
          <Paper elevation={3} className="qr-code-container">
            <Box className="section-header">
              <Typography variant="h5" className="section-title">
                My QR Codes
              </Typography>
              <Typography variant="body2" color="textSecondary" className="section-subtitle">
                Manage your generated QR codes
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <QRCodeGallery 
              userId={user.id}
              refresh={refresh}
              count={count}
              setCount={setCount}
            />
          </Paper>
        </Fade>
      </ProfileContainer>
    </div>
  );
};

export default Profile;