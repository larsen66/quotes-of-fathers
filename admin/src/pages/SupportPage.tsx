import { Box, Container, Typography, Paper, Link, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const CONTACT_EMAIL = 'davidik0313@gmail.com';
const APP_NAME = 'Quotes of Fathers';

export default function SupportPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', py: 6 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Support
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Need help with {APP_NAME}? Find answers below or contact us directly.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Contact */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 4 }}>
            <EmailIcon sx={{ color: '#18181b', mt: 0.5 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Contact Us
              </Typography>
              <Typography variant="body1" paragraph>
                For any questions, bug reports, or suggestions, reach out to us at:
              </Typography>
              <Typography variant="body1">
                <Link href={`mailto:${CONTACT_EMAIL}`} sx={{ fontWeight: 500 }}>
                  {CONTACT_EMAIL}
                </Link>
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
            Frequently Asked Questions
          </Typography>

          <FaqItem
            icon={<PhoneAndroidIcon />}
            question="How do I send feedback from the app?"
            answer={`Open the app, go to the "About" tab, and use the feedback form. You can optionally include your email or phone number so we can follow up. Your message will be sent when you have an internet connection.`}
          />

          <FaqItem
            icon={<NotificationsIcon />}
            question="How do I enable or disable notifications?"
            answer="Go to Settings in the app. You can toggle notifications on or off, set separate times for weekdays and weekends, and choose your preferred notification sound (Default, Bell, or Soft)."
          />

          <FaqItem
            icon={<CloudOffIcon />}
            question="Does the app work offline?"
            answer="Yes! After the first launch and initial content download, the app works fully offline. All quotes, images, and Father information are stored locally on your device."
          />

          <FaqItem
            icon={<HelpOutlineIcon />}
            question="How do I change the app language?"
            answer="Go to Settings and select your preferred language: Georgian or Russian. The entire app content, including quotes and biographies, will switch to the selected language."
          />

          <FaqItem
            icon={<DeleteOutlineIcon />}
            question="How do I delete my data?"
            answer="All app data is stored locally on your device. Uninstalling the app will remove all stored data including favorites, settings, and downloaded content. If you have submitted feedback and wish to have it deleted from our servers, contact us via email."
          />
        </Paper>
      </Container>
    </Box>
  );
}

function FaqItem({ icon, question, answer }: { icon: React.ReactNode; question: string; answer: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
      <Box sx={{ color: '#71717a', mt: 0.5 }}>{icon}</Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {question}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {answer}
        </Typography>
      </Box>
    </Box>
  );
}
