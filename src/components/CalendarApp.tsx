import { GithubOutlined, GoogleOutlined, WindowsOutlined } from '@ant-design/icons';
import { Button, Card, Col, Layout, message, Row, Segmented, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';

import styles from '../styles/App.module.scss';
import type { CalendarPlatform, EventFormValues } from './EventForm';
import EventForm from './EventForm';

const { Header, Content, Footer } = Layout;

export default function CalendarApp() {
  const [platform, setPlatform] = useState<CalendarPlatform>('google');

  const platformOptions = useMemo(
    () => [
      { label: 'Google Calendar', value: 'google', icon: <GoogleOutlined /> },
      { label: 'Outlook Calendar', value: 'outlook', icon: <WindowsOutlined /> },
    ],
    [],
  );

  const handleGenerate = async (values: EventFormValues): Promise<boolean> => {
    const url = values.generatedUrl;
    if (!url) {
      message.warning('No URL to copy yet.');
      return false;
    }

    try {
      await navigator.clipboard.writeText(url);
      message.success('URL copied to clipboard');
      return true;
    } catch {
      // Fallback for insecure contexts or denied permissions
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) {
        message.success('URL copied to clipboard');
        return true;
      }
      message.error('Failed to copy URL. Please copy it manually.');
      return false;
    } catch {
      message.error('Failed to copy URL. Please copy it manually.');
      return false;
    }
  };

  return (
    <Layout className={styles.layoutRoot}>
      <Header className={styles.header}>
        <Row align="middle" justify="space-between">
          <Col style={{ lineHeight: '2.5' }}>
            <Typography.Title level={3} className={styles.brand}>
              Calendar Event Scheduler
            </Typography.Title>
            <Typography.Text className={styles.subtitle}>
              Create events for Google Calendar or Outlook Calendar with ease
            </Typography.Text>
          </Col>
          <Col>
            <a href="https://github.com/SoyAndresTrujillo/calendar-event-scheduler" target="_blank" rel="noreferrer">
              <Button icon={<GithubOutlined />} type="text" className={styles.subtitle}>
                Star on GitHub
              </Button>
            </a>
          </Col>
        </Row>
      </Header>

      <Content className={styles.content}>
        <Row justify="center" style={{ margin: '36px -12px' }}>
          <Col xs={24} md={20} lg={14} xl={12}>
            <Card className={styles.card}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Typography.Text strong>Select Calendar Platform</Typography.Text>
                <Segmented
                  size="large"
                  options={platformOptions}
                  value={platform}
                  onChange={(val) => setPlatform(val as CalendarPlatform)}
                  block
                />

                <EventForm platform={platform} onGenerate={handleGenerate} />
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>

      <Footer className={styles.footer}>
        <Typography.Text>
          How to use:
          <ol>
            <li>Select your preferred calendar platform (Google or Outlook)</li>
            <li>Fill in the event details (fields marked with * are required)</li>
            <li>Click &quot;Copy URL to clipboard&quot; to copy the calendar link to your clipboard</li>
            <li>Click &quot;Open in Calendar&quot; to create the event in your chosen calendar</li>
          </ol>
        </Typography.Text>
      </Footer>
    </Layout>
  );
}
