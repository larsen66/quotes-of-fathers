import { Box, Container, Typography, Paper, Link } from '@mui/material';

const CONTACT_EMAIL = 'davidik0313@gmail.com';
const EFFECTIVE_DATE = '2025-02-13';
const APP_NAME = 'Quotes of Fathers';

export default function PrivacyPolicyPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', py: 6 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Effective Date: {EFFECTIVE_DATE}
          </Typography>

          <Section title="1. Introduction">
            Welcome to {APP_NAME} ("the App"). This Privacy Policy explains how we collect,
            use, and protect your information when you use our mobile application. We are committed
            to safeguarding your privacy and ensuring transparency about our data practices.
          </Section>

          <Section title="2. Information We Collect">
            <Typography variant="body1" paragraph>
              <strong>Information stored locally on your device:</strong>
            </Typography>
            <BulletList items={[
              'Language preference (Georgian or Russian)',
              'Notification settings (enabled/disabled, schedule times, sound preference)',
              'Favorite quotes you have saved',
              'Downloaded content (quotes and information about Holy Fathers)',
            ]} />
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              <strong>Information transmitted to our servers (optional):</strong>
            </Typography>
            <BulletList items={[
              'Feedback messages you voluntarily submit through the app',
              'Contact information (email or phone) you optionally provide when sending feedback',
            ]} />
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              <strong>Information we do NOT collect:</strong>
            </Typography>
            <BulletList items={[
              'Personal identity information (name, date of birth, etc.)',
              'Device identifiers or advertising IDs',
              'Location data',
              'Usage analytics or telemetry',
              'Cookies or tracking data',
              'Browsing history',
            ]} />
          </Section>

          <Section title="3. How We Use Your Information">
            <BulletList items={[
              'Deliver spiritual quotes and content in your preferred language',
              'Send scheduled push notifications with daily quotes (when enabled by you)',
              'Store your favorite quotes for quick access',
              'Process feedback messages to improve the app',
            ]} />
          </Section>

          <Section title="4. Data Storage and Security">
            <Typography variant="body1" paragraph>
              All your preferences, favorites, and downloaded content are stored locally on your device
              using SQLite database. The app functions fully offline after the initial content download.
            </Typography>
            <Typography variant="body1" paragraph>
              Feedback messages are transmitted securely using HTTPS encryption to our servers hosted
              on Supabase (PostgreSQL). We implement appropriate technical and organizational measures
              to protect the data we process.
            </Typography>
          </Section>

          <Section title="5. Third-Party Services">
            <Typography variant="body1" paragraph>
              The app uses the following third-party services:
            </Typography>
            <BulletList items={[
              'Supabase (supabase.com) — for content delivery and feedback storage. Only content requests are transmitted; no personal data is shared.',
              'Expo (expo.dev) — for app building and distribution. May collect anonymized technical information as described in their privacy policy.',
            ]} />
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              We do not use any advertising services, analytics trackers, or social media SDKs.
            </Typography>
          </Section>

          <Section title="6. Push Notifications">
            <Typography variant="body1" paragraph>
              Push notifications are optional and fully controlled by you. You can enable or disable them
              at any time in the app settings. Notification times for weekdays and weekends can be customized.
              All notification scheduling happens locally on your device.
            </Typography>
          </Section>

          <Section title="7. Children's Privacy">
            <Typography variant="body1" paragraph>
              The app contains educational and spiritual content suitable for all ages. We do not knowingly
              collect personal information from children under 13. The app is not specifically targeted at
              children under the age of 4.
            </Typography>
          </Section>

          <Section title="8. Your Rights">
            <Typography variant="body1" paragraph>
              You have the right to:
            </Typography>
            <BulletList items={[
              'Delete all locally stored data by uninstalling the app',
              'Disable push notifications at any time',
              'Choose not to provide contact information when submitting feedback',
              'Request deletion of any feedback you have submitted by contacting us',
            ]} />
          </Section>

          <Section title="9. Changes to This Policy">
            <Typography variant="body1" paragraph>
              We may update this Privacy Policy from time to time. Any changes will be reflected
              by updating the "Effective Date" at the top of this page. We encourage you to review
              this policy periodically.
            </Typography>
          </Section>

          <Section title="10. Contact Us">
            <Typography variant="body1" paragraph>
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </Typography>
            <Typography variant="body1">
              Email: <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>
            </Typography>
          </Section>
        </Paper>
      </Container>
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      {typeof children === 'string' ? (
        <Typography variant="body1" paragraph>{children}</Typography>
      ) : children}
    </Box>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ pl: 3, m: 0 }}>
      {items.map((item, i) => (
        <Typography key={i} component="li" variant="body1" sx={{ mb: 0.5 }}>
          {item}
        </Typography>
      ))}
    </Box>
  );
}
