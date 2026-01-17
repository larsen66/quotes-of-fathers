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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabase';
import { useLocale } from '../contexts/LocaleContext';

interface Father {
  id: string;
  name_ka: string;
  name_ru: string | null;
  bio_ka: string | null;
  bio_ru: string | null;
  avatar_url: string;
  profile_image_url: string | null;
  order: number | null;
  created_at: string;
  updated_at: string;
  quotes_count?: number;
}

interface FatherForm {
  name_ka: string;
  name_ru: string;
  bio_ka: string;
  bio_ru: string;
  avatar_url: string;
  profile_image_url: string;
  order: string;
}

const emptyForm: FatherForm = {
  name_ka: '',
  name_ru: '',
  bio_ka: '',
  bio_ru: '',
  avatar_url: '',
  profile_image_url: '',
  order: '',
};

export default function FathersPage() {
  const [fathers, setFathers] = useState<Father[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFather, setSelectedFather] = useState<Father | null>(null);
  const [form, setForm] = useState<FatherForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [uploading, setUploading] = useState(false);
  
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    loadFathers();
    
    if (searchParams.get('action') === 'new') {
      handleAdd();
      setSearchParams({});
    }
  }, []);

  const loadFathers = async () => {
    try {
      // Get fathers with quotes count
      const { data: fathersData, error } = await supabase
        .from('fathers')
        .select('*')
        .eq('deleted', false)
        .order('order', { ascending: true, nullsFirst: false });

      if (error) throw error;

      // Get quotes count for each father
      const fathersWithCounts = await Promise.all(
        (fathersData || []).map(async (father) => {
          const { count } = await supabase
            .from('quotes')
            .select('*', { count: 'exact', head: true })
            .eq('father_id', father.id)
            .eq('deleted', false);
          return { ...father, quotes_count: count || 0 };
        })
      );

      setFathers(fathersWithCounts);
    } catch (error) {
      console.error('Error loading fathers:', error);
      showSnackbar(t('Error loading data'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAdd = () => {
    setSelectedFather(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (father: Father) => {
    setSelectedFather(father);
    setForm({
      name_ka: father.name_ka,
      name_ru: father.name_ru || '',
      bio_ka: father.bio_ka || '',
      bio_ru: father.bio_ru || '',
      avatar_url: father.avatar_url,
      profile_image_url: father.profile_image_url || '',
      order: father.order?.toString() || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = (father: Father) => {
    setSelectedFather(father);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name_ka || !form.avatar_url) {
      showSnackbar('Name (KA) and Avatar URL are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const data = {
        name_ka: form.name_ka,
        name_ru: form.name_ru || null,
        bio_ka: form.bio_ka || null,
        bio_ru: form.bio_ru || null,
        avatar_url: form.avatar_url,
        profile_image_url: form.profile_image_url || null,
        order: form.order ? parseInt(form.order) : null,
      };

      if (selectedFather) {
        // Update
        const { error } = await supabase
          .from('fathers')
          .update(data)
          .eq('id', selectedFather.id);
        if (error) throw error;
        showSnackbar('Father updated successfully', 'success');
      } else {
        // Create
        const { error } = await supabase
          .from('fathers')
          .insert(data);
        if (error) throw error;
        showSnackbar('Father created successfully', 'success');
      }

      setDialogOpen(false);
      loadFathers();
    } catch (error: any) {
      console.error('Error saving father:', error);
      showSnackbar(error.message || 'Error saving father', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedFather) return;

    setSaving(true);
    try {
      // Soft delete
      const { error } = await supabase
        .from('fathers')
        .update({ deleted: true })
        .eq('id', selectedFather.id);

      if (error) throw error;

      showSnackbar('Father deleted successfully', 'success');
      setDeleteDialogOpen(false);
      loadFathers();
    } catch (error: any) {
      console.error('Error deleting father:', error);
      showSnackbar(error.message || 'Error deleting father', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_url' | 'profile_image_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${field === 'avatar_url' ? 'avatars' : 'profiles'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('fathers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('fathers')
        .getPublicUrl(filePath);

      setForm({ ...form, [field]: publicUrl });
      showSnackbar('Image uploaded successfully', 'success');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      showSnackbar(error.message || 'Error uploading image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const getName = (father: Father) => {
    return locale === 'ru' && father.name_ru ? father.name_ru : father.name_ka;
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
          {t('fathers')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ bgcolor: '#3f51b5' }}
        >
          {t('addFather')}
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('avatar')}</TableCell>
                <TableCell>{t('fatherName')}</TableCell>
                <TableCell>{t('quotesCount')}</TableCell>
                <TableCell>{t('order')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fathers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">{t('noData')}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                fathers.map((father) => (
                  <TableRow key={father.id} hover>
                    <TableCell>
                      <Avatar src={father.avatar_url} sx={{ width: 50, height: 50 }}>
                        {father.name_ka[0]}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{getName(father)}</Typography>
                      {locale === 'ru' && father.name_ru && (
                        <Typography variant="caption" color="text.secondary">
                          {father.name_ka}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={father.quotes_count} size="small" />
                    </TableCell>
                    <TableCell>{father.order || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(father)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(father)} color="error">
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
          {selectedFather ? t('edit') : t('add')} {t('fathers')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label={t('fatherNameKa')}
                value={form.name_ka}
                onChange={(e) => setForm({ ...form, name_ka: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label={t('fatherNameRu')}
                value={form.name_ru}
                onChange={(e) => setForm({ ...form, name_ru: e.target.value })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label={t('bioKa')}
                value={form.bio_ka}
                onChange={(e) => setForm({ ...form, bio_ka: e.target.value })}
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label={t('bioRu')}
                value={form.bio_ru}
                onChange={(e) => setForm({ ...form, bio_ru: e.target.value })}
                multiline
                rows={3}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label={t('avatar') + ' URL'}
                  value={form.avatar_url}
                  onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                  required
                />
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{ mt: 1 }}
                  disabled={uploading}
                >
                  {uploading ? <CircularProgress size={20} /> : 'Upload Avatar'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'avatar_url')}
                  />
                </Button>
              </Box>
              {form.avatar_url && (
                <Avatar src={form.avatar_url} sx={{ width: 80, height: 80 }} />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label={t('profileImage') + ' URL'}
                  value={form.profile_image_url}
                  onChange={(e) => setForm({ ...form, profile_image_url: e.target.value })}
                />
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{ mt: 1 }}
                  disabled={uploading}
                >
                  {uploading ? <CircularProgress size={20} /> : 'Upload Profile'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'profile_image_url')}
                  />
                </Button>
              </Box>
              {form.profile_image_url && (
                <Avatar src={form.profile_image_url} sx={{ width: 80, height: 80 }} variant="rounded" />
              )}
            </Box>
            <TextField
              label={t('order')}
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              sx={{ width: 150 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>{t('cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
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
            {selectedFather && getName(selectedFather)}
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
