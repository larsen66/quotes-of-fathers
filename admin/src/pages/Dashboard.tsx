import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  FormatQuote as QuoteIcon,
  Publish as PublishIcon,
  Drafts as DraftsIcon,
  Feedback as FeedbackIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabase';

interface Stats {
  totalFathers: number;
  totalQuotes: number;
  publishedQuotes: number;
  draftQuotes: number;
  unreadFeedback: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load fathers count
      const { count: fathersCount } = await supabase
        .from('fathers')
        .select('*', { count: 'exact', head: true })
        .eq('deleted', false);

      // Load quotes counts
      const { count: totalQuotesCount } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('deleted', false);

      const { count: publishedCount } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('deleted', false)
        .eq('is_published', true);

      // Load unread feedback count
      const { count: unreadCount } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      setStats({
        totalFathers: fathersCount || 0,
        totalQuotes: totalQuotesCount || 0,
        publishedQuotes: publishedCount || 0,
        draftQuotes: (totalQuotesCount || 0) - (publishedCount || 0),
        unreadFeedback: unreadCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t('totalFathers'),
      value: stats?.totalFathers,
      icon: <PeopleIcon sx={{ fontSize: 24 }} />,
      color: '#18181b',
      bgColor: '#fafafa',
    },
    {
      title: t('totalQuotes'),
      value: stats?.totalQuotes,
      icon: <QuoteIcon sx={{ fontSize: 24 }} />,
      color: '#18181b',
      bgColor: '#fafafa',
    },
    {
      title: t('publishedQuotes'),
      value: stats?.publishedQuotes,
      icon: <PublishIcon sx={{ fontSize: 24 }} />,
      color: '#10b981',
      bgColor: '#f0fdf4',
    },
    {
      title: t('draftQuotes'),
      value: stats?.draftQuotes,
      icon: <DraftsIcon sx={{ fontSize: 24 }} />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
    {
      title: t('unreadFeedback'),
      value: stats?.unreadFeedback,
      icon: <FeedbackIcon sx={{ fontSize: 24 }} />,
      color: '#ef4444',
      bgColor: '#fef2f2',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#18181b' }}>
        {t('dashboard')}
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={card.title}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: card.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#18181b', mb: 0.5 }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#71717a', fontSize: '0.8125rem' }}>
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 600, fontSize: '1rem' }}>
            {t('quickActions')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate('/fathers?action=new')}
            >
              {t('addFather')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate('/quotes?action=new')}
            >
              {t('addQuote')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
