import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  FormatQuote as QuoteIcon,
  Feedback as FeedbackIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Translate as TranslateIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, signOut } = useAuth();
  const { locale, setLocale } = useLocale();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: t('dashboard'), icon: <DashboardIcon />, path: '/' },
    { text: t('fathers'), icon: <PeopleIcon />, path: '/fathers' },
    { text: t('quotes'), icon: <QuoteIcon />, path: '/quotes' },
    { text: t('feedback'), icon: <FeedbackIcon />, path: '/feedback' },
    { text: t('settings'), icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#18181b', letterSpacing: '-0.01em' }}>
          TAMARI
        </Typography>
        <Typography variant="caption" sx={{ color: '#71717a', fontSize: '0.75rem' }}>
          Admin Panel
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1, px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 1.5,
                py: 1,
                px: 1.5,
                '&.Mui-selected': {
                  backgroundColor: '#fafafa',
                  '&:hover': {
                    backgroundColor: '#f4f4f5',
                  },
                },
                '&:hover': {
                  backgroundColor: '#fafafa',
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 36, 
                color: location.pathname === item.path ? '#18181b' : '#71717a',
                '& .MuiSvgIcon-root': { fontSize: 20 }
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 500 : 400,
                  fontSize: '0.875rem',
                  color: location.pathname === item.path ? '#18181b' : '#52525b'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: '#f4f4f5' }} />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
          <TranslateIcon sx={{ color: '#71717a', fontSize: 18 }} />
          <ToggleButtonGroup
            value={locale}
            exclusive
            onChange={(_, newLocale) => newLocale && setLocale(newLocale)}
            size="small"
            sx={{ 
              flexGrow: 1,
              '& .MuiToggleButton-root': {
                border: '1px solid #e4e4e7',
                fontSize: '0.75rem',
                py: 0.5,
                '&.Mui-selected': {
                  backgroundColor: '#18181b',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#27272a',
                  },
                },
              },
            }}
          >
            <ToggleButton value="ka" sx={{ flex: 1 }}>
              KA
            </ToggleButton>
            <ToggleButton value="ru" sx={{ flex: 1 }}>
              RU
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <ListItemButton
          onClick={handleLogout}
          sx={{ 
            borderRadius: 1.5, 
            py: 1,
            px: 1.5,
            color: '#71717a',
            '&:hover': {
              backgroundColor: '#fef2f2',
              color: '#ef4444',
            },
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: 36, 
            color: 'inherit',
            '& .MuiSvgIcon-root': { fontSize: 20 }
          }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary={t('logout')} 
            primaryTypographyProps={{
              fontSize: '0.875rem',
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#ffffff',
          color: '#18181b',
          borderBottom: '1px solid #f4f4f5',
        }}
      >
        <Toolbar sx={{ minHeight: '56px !important' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleMenuClick} sx={{ p: 0.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#18181b', fontSize: '0.875rem' }}>
              {user?.email?.[0].toUpperCase() || 'A'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: '#71717a' }}>
                {user?.email}
              </Typography>
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleLogout} sx={{ fontSize: '0.875rem' }}>
              <LogoutIcon sx={{ mr: 1.5, fontSize: 18, color: '#71717a' }} />
              {t('logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '56px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
