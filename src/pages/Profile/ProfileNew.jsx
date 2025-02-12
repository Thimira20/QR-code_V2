import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Divider,
  
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getCurrentUser } from '../../services/authService';
import { getUserData } from '../../services/userDataService';
import QRCodeGallery from '../../components/NewImagelisi'; // We'll create this next

const ProfileContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  background: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(8),
  height: theme.spacing(8),
  backgroundColor: theme.palette.secondary.main,
  fontSize: '2rem',
}));

const Profile = ({ refresh, count, setCount }) => {
  //const theme = useTheme();
 // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = getCurrentUser();
  //const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUserData();
        if (data && Array.isArray(data)) {
          //setUserData(data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProfileContainer maxWidth="lg">
      <ProfileHeader elevation={3}>
        <ProfileAvatar>{user.username[0].toUpperCase()}</ProfileAvatar>
        {/* <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {user.username}'s Profile
          </Typography>
          <Typography variant="subtitle1">{user.email}</Typography>
        </Box> */}
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {user.username}'s Profile
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            {user.email}
          </Typography>
        </Box>
      </ProfileHeader>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          My QR Codes
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <QRCodeGallery 
          userId={user.id}
          refresh={refresh}
          count={count}
          setCount={setCount}
        />
      </Paper>
    </ProfileContainer>
  );
};

export default Profile;