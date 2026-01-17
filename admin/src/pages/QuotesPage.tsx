import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabase';
import { useLocale } from '../contexts/LocaleContext';

interface Father {
  id: string;
  name_ka: string;
  name_ru: string | null;
  avatar_url: string;
}

interface Quote {
  id: string;
  father_id: string;
  text_ka: string;
  text_ru: string | null;
  source_ka: string | null;
  source_ru: string | null;
  quote_date: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  fathers?: Father;
}

interface QuoteForm {
  father_id: string;
  text_ka: string;
  text_ru: string;
  quote_date: string;
  is_published: boolean;
}

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const emptyForm: QuoteForm = {
  father_id: '',
  text_ka: '',
  text_ru: '',
  quote_date: getTodayDate(),
  is_published: true,
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [fathers, setFathers] = useState<Father[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [form, setForm] = useState<QuoteForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [filterFatherId, setFilterFatherId] = useState<string>('');
  const [filterPublished, setFilterPublished] = useState<string>('');
  
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    loadData();
    
    if (searchParams.get('action') === 'new') {
      handleAdd();
      setSearchParams({});
    }
  }, []);

  useEffect(() => {
    loadQuotes();
  }, [filterFatherId, filterPublished]);

  const loadData = async () => {
    await Promise.all([loadFathers(), loadQuotes()]);
  };

  const loadFathers = async () => {
    try {
      const { data, error } = await supabase
        .from('fathers')
        .select('id, name_ka, name_ru, avatar_url')
        .eq('deleted', false)
        .order('order');

      if (error) throw error;
      setFathers(data || []);
    } catch (error) {
      console.error('Error loading fathers:', error);
    }
  };

  const loadQuotes = async () => {
    try {
      let query = supabase
        .from('quotes')
        .select(`
          *,
          fathers:father_id (id, name_ka, name_ru, avatar_url)
        `)
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      if (filterFatherId) {
        query = query.eq('father_id', filterFatherId);
      }
      if (filterPublished !== '') {
        query = query.eq('is_published', filterPublished === 'true');
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
      showSnackbar('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAdd = () => {
    setSelectedQuote(null);
    setForm({ ...emptyForm, quote_date: getTodayDate() });
    setDialogOpen(true);
  };

  const handleEdit = (quote: Quote) => {
    setSelectedQuote(quote);
    setForm({
      father_id: quote.father_id,
      text_ka: quote.text_ka,
      text_ru: quote.text_ru || '',
      quote_date: quote.quote_date || getTodayDate(),
      is_published: quote.is_published,
    });
    setDialogOpen(true);
  };

  const handleDelete = (quote: Quote) => {
    setSelectedQuote(quote);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.father_id || !form.text_ka) {
      showSnackbar('Father and Text (KA) are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const data = {
        father_id: form.father_id,
        text_ka: form.text_ka,
        text_ru: form.text_ru || null,
        quote_date: form.quote_date || null,
        is_published: form.is_published,
      };

      if (selectedQuote) {
        const { error } = await supabase
          .from('quotes')
          .update(data)
          .eq('id', selectedQuote.id);
        if (error) throw error;
        showSnackbar('Quote updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('quotes')
          .insert(data);
        if (error) throw error;
        showSnackbar('Quote created successfully', 'success');
      }

      setDialogOpen(false);
      loadQuotes();
    } catch (error: any) {
      console.error('Error saving quote:', error);
      showSnackbar(error.message || 'Error saving quote', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuote) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ deleted: true })
        .eq('id', selectedQuote.id);

      if (error) throw error;

      showSnackbar('Quote deleted successfully', 'success');
      setDeleteDialogOpen(false);
      loadQuotes();
    } catch (error: any) {
      console.error('Error deleting quote:', error);
      showSnackbar(error.message || 'Error deleting quote', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getFatherName = (father?: Father) => {
    if (!father) return '-';
    return locale === 'ru' && father.name_ru ? father.name_ru : father.name_ka;
  };

  const getText = (quote: Quote) => {
    const text = locale === 'ru' && quote.text_ru ? quote.text_ru : quote.text_ka;
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {t('quotes')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ bgcolor: '#00897b' }}
        >
          {t('addQuote')}
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>{t('selectFather')}</InputLabel>
            <Select
              value={filterFatherId}
              label={t('selectFather')}
              onChange={(e) => setFilterFatherId(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {fathers.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {getFatherName(f)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>{t('status')}</InputLabel>
            <Select
              value={filterPublished}
              label={t('status')}
              onChange={(e) => setFilterPublished(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">{t('published')}</MenuItem>
              <MenuItem value="false">{t('draft')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('fathers')}</TableCell>
                <TableCell>{t('quoteText')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell>{t('date')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">{t('noData')}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                quotes.map((quote) => (
                  <TableRow key={quote.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={quote.fathers?.avatar_url} sx={{ width: 32, height: 32 }}>
                          {quote.fathers?.name_ka[0]}
                        </Avatar>
                        <Typography variant="body2">
                          {getFatherName(quote.fathers)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 400 }}>
                        {getText(quote)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={quote.is_published ? t('published') : t('draft')}
                        color={quote.is_published ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {quote.quote_date || new Date(quote.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(quote)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(quote)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedQuote ? t('edit') : t('add')} {t('quotes')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>{t('selectFather')}</InputLabel>
              <Select
                value={form.father_id}
                label={t('selectFather')}
                onChange={(e) => setForm({ ...form, father_id: e.target.value })}
              >
                {fathers.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={f.avatar_url} sx={{ width: 24, height: 24 }} />
                      {getFatherName(f)}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={t('textKa')}
              value={form.text_ka}
              onChange={(e) => setForm({ ...form, text_ka: e.target.value })}
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              label={t('textRu')}
              value={form.text_ru}
              onChange={(e) => setForm({ ...form, text_ru: e.target.value })}
              multiline
              rows={4}
            />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label={t('quoteDate')}
                type="date"
                value={form.quote_date}
                onChange={(e) => setForm({ ...form, quote_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 200 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    color="success"
                  />
                }
                label={t('isPublished')}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>{t('cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{ bgcolor: '#00897b' }}
          >
            {saving ? <CircularProgress size={24} /> : t('save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('confirmDelete')}</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedQuote && getText(selectedQuote)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('cancel')}</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : t('delete')}
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
