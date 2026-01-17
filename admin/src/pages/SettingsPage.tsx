import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Save as SaveIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabase';
import { useLocale } from '../contexts/LocaleContext';

export default function SettingsPage() {
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSubscriberCount(data.subscriber_count);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      showSnackbar('Error loading settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveSubscriberCount = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          id: 1,
          subscriber_count: subscriberCount,
        });

      if (error) throw error;

      showSnackbar('Settings saved successfully', 'success');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      showSnackbar(error.message || 'Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
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
        {t('settings')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>
        {/* Language Settings */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {t('language')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('languageDescription')}
            </Typography>
            <ToggleButtonGroup
              value={locale}
              exclusive
              onChange={(_, newLocale) => newLocale && setLocale(newLocale)}
              size="large"
            >
              <ToggleButton value="ka" sx={{ px: 4 }}>
                🇬🇪 ქართული
              </ToggleButton>
              <ToggleButton value="ru" sx={{ px: 4 }}>
                🇷🇺 Русский
              </ToggleButton>
            </ToggleButtonGroup>
          </CardContent>
        </Card>

        {/* Subscriber Count */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {t('subscriberCount')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Количество подписчиков, отображаемое в приложении на экране "О нас"
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                type="number"
                value={subscriberCount}
                onChange={(e) => setSubscriberCount(parseInt(e.target.value) || 0)}
                sx={{ width: 200 }}
                inputProps={{ min: 0 }}
              />
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSaveSubscriberCount}
                disabled={saving}
              >
                {t('save')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Database Info */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              База данных
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Провайдер:</Typography>
                <Typography fontWeight={500}>Supabase (PostgreSQL)</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">URL проекта:</Typography>
                <Typography 
                  fontWeight={500} 
                  sx={{ 
                    maxWidth: 250, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {import.meta.env.VITE_SUPABASE_URL || 'Not configured'}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Хранилище:</Typography>
                <Typography fontWeight={500}>Supabase Storage</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Help */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Помощь
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Для управления контентом используйте разделы "Отцы" и "Цитаты" в меню слева.
              Все изменения автоматически синхронизируются с мобильным приложением.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                href="https://supabase.com/dashboard"
                target="_blank"
              >
                Открыть Supabase Dashboard
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

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
