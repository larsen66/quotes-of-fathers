import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabase';

interface Feedback {
  id: string;
  message: string;
  contact: string | null;
  language: 'ka' | 'ru';
  platform: 'ios' | 'android' | null;
  app_version: string | null;
  is_read: boolean;
  created_at: string;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const { t } = useTranslation();

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      showSnackbar('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleView = async (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setDialogOpen(true);

    // Mark as read if not already
    if (!feedback.is_read) {
      try {
        const { error } = await supabase
          .from('feedback')
          .update({ is_read: true })
          .eq('id', feedback.id);

        if (error) throw error;

        setFeedbacks(prev =>
          prev.map(f => f.id === feedback.id ? { ...f, is_read: true } : f)
        );
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleMarkAsRead = async (feedback: Feedback) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ is_read: true })
        .eq('id', feedback.id);

      if (error) throw error;

      setFeedbacks(prev =>
        prev.map(f => f.id === feedback.id ? { ...f, is_read: true } : f)
      );
      showSnackbar('Marked as read', 'success');
    } catch (error: any) {
      console.error('Error marking as read:', error);
      showSnackbar(error.message || 'Error', 'error');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        {t('feedback')}
      </Typography>

      <Card sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('status')}</TableCell>
                <TableCell>{t('message')}</TableCell>
                <TableCell>{t('contact')}</TableCell>
                <TableCell>{t('language')}</TableCell>
                <TableCell>{t('date')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">{t('noData')}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                feedbacks.map((feedback) => (
                  <TableRow 
                    key={feedback.id} 
                    hover
                    sx={{ 
                      bgcolor: feedback.is_read ? 'inherit' : 'rgba(63, 81, 181, 0.05)',
                      fontWeight: feedback.is_read ? 400 : 600,
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={feedback.is_read ? t('read') : t('unread')}
                        color={feedback.is_read ? 'default' : 'primary'}
                        size="small"
                        variant={feedback.is_read ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 300, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: feedback.is_read ? 400 : 600,
                        }}
                      >
                        {feedback.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {feedback.contact || '-'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={feedback.language.toUpperCase()} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {formatDate(feedback.created_at)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleView(feedback)} color="primary">
                        <ViewIcon />
                      </IconButton>
                      {!feedback.is_read && (
                        <IconButton onClick={() => handleMarkAsRead(feedback)} color="success">
                          <MarkReadIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* View Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('feedback')}
        </DialogTitle>
        <DialogContent dividers>
          {selectedFeedback && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('message')}
                </Typography>
                <Typography sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                  {selectedFeedback.message}
                </Typography>
              </Box>
              
              {selectedFeedback.contact && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('contact')}
                  </Typography>
                  <Typography sx={{ mt: 0.5 }}>
                    {selectedFeedback.contact}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('language')}
                  </Typography>
                  <Typography sx={{ mt: 0.5 }}>
                    {selectedFeedback.language === 'ka' ? '🇬🇪 Georgian' : '🇷🇺 Russian'}
                  </Typography>
                </Box>
                
                {selectedFeedback.platform && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Platform
                    </Typography>
                    <Typography sx={{ mt: 0.5 }}>
                      {selectedFeedback.platform === 'ios' ? '🍎 iOS' : '🤖 Android'}
                    </Typography>
                  </Box>
                )}
                
                {selectedFeedback.app_version && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      App Version
                    </Typography>
                    <Typography sx={{ mt: 0.5 }}>
                      {selectedFeedback.app_version}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('date')}
                </Typography>
                <Typography sx={{ mt: 0.5 }}>
                  {formatDate(selectedFeedback.created_at)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
