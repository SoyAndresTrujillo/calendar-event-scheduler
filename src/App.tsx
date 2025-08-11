import { GithubOutlined, GoogleOutlined, WindowsOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Flex, Layout, Row, Segmented, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';

import type { CalendarPlatform, EventFormValues } from './components/EventForm';
import EventForm from './components/EventForm';
import styles from './styles/App.module.scss';

const { Header, Content, Footer } = Layout;

export default function App() {
  const [platform, setPlatform] = useState<CalendarPlatform>('google');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const platformOptions = useMemo(
    () => [
      { label: 'Google Calendar', value: 'google', icon: <GoogleOutlined /> },
      { label: 'Outlook Calendar', value: 'outlook', icon: <WindowsOutlined /> },
    ],
    [],
  );

  const handleGenerate = (values: EventFormValues) => {
    setGeneratedUrl(values.generatedUrl ?? null);
  };

  return (
    <Layout className={styles.layoutRoot}>
      <Header className={styles.header}>
        <Row align="middle" justify="space-between">
          <Col>
            <Typography.Title level={3} className={styles.brand}>
              Calendar Event Scheduler
            </Typography.Title>
            <Typography.Text className={styles.subtitle}>
              Create events for Google Calendar or Outlook Calendar with ease
            </Typography.Text>
          </Col>
          <Col>
            <a href="https://github.com/" target="_blank" rel="noreferrer">
              <Button icon={<GithubOutlined />} type="text">
                Star on GitHub
              </Button>
            </a>
          </Col>
        </Row>
      </Header>

      <Content className={styles.content}>
        <Row gutter={[24, 24]} justify="center">
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

                {generatedUrl && (
                  <Alert
                    type="success"
                    message={
                      <Flex align="center" gap={12} wrap>
                        <Typography.Text strong>Generated URL:</Typography.Text>
                        <a href={generatedUrl} target="_blank" rel="noreferrer">
                          {generatedUrl}
                        </a>
                      </Flex>
                    }
                  />
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>

      <Footer className={styles.footer}>
        <Typography.Text type="secondary">
          How to use:
          <ol>
            <li>Select your preferred calendar platform (Google or Outlook)</li>
            <li>Fill in the event details (fields marked with * are required)</li>
            <li>Click &quot;Generate URL&quot; to preview the calendar link</li>
            <li>Click &quot;Open in Calendar&quot; to create the event in your chosen calendar</li>
          </ol>
        </Typography.Text>
      </Footer>
    </Layout>
  );
}
