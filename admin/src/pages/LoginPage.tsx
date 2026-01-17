import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#fafafa',
        p: 2,
      }}
    >
      <Card 
        sx={{ 
          maxWidth: 420, 
          width: '100%', 
          borderRadius: 2,
          border: '1px solid #f4f4f5',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: '#18181b',
                letterSpacing: '-0.01em',
                mb: 0.5,
              }}
            >
              TAMARI
            </Typography>
            <Typography variant="body2" sx={{ color: '#71717a', fontSize: '0.875rem' }}>
              Admin Panel
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 1.5,
                bgcolor: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                '& .MuiAlert-icon': {
                  color: '#ef4444',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoFocus
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t('password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.25,
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : t('login')}
            </Button>
          </form>

          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              mt: 3, 
              textAlign: 'center',
              color: '#a1a1aa',
              fontSize: '0.75rem',
            }}
          >
            Для входа используйте учётные данные Supabase Auth
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
