import { CalendarOutlined, CheckCircleTwoTone, ClockCircleOutlined, LinkOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  TimePicker,
  Typography,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { useEffect, useRef, useState } from 'react';

import { buildGoogleCalendarUrl, buildOutlookCalendarUrl } from '../utils/urlBuilders';
import styles from './EventForm.module.scss';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export type CalendarPlatform = 'google' | 'outlook';

export interface EventFormValues {
  title: string;
  endDate: Dayjs;
  endTime: Dayjs;
  startDate: Dayjs;
  startTime: Dayjs;
  location?: string;
  description?: string;
  generatedUrl?: string;
}

const initialValues: Partial<EventFormValues> = {};

interface Props {
  platform: CalendarPlatform;
  onGenerate: (values: EventFormValues) => Promise<boolean>;
}

export default function EventForm({ platform, onGenerate }: Props) {
  console.log({ platform });
  const [form] = Form.useForm<EventFormValues>();
  const [copied, setCopied] = useState(false);
  const resetIconTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear previous generated URL when platform changes
    form.setFieldValue('generatedUrl', undefined);
    setCopied(false);
  }, [platform, form]);

  useEffect(() => {
    return () => {
      if (resetIconTimerRef.current) {
        window.clearTimeout(resetIconTimerRef.current);
      }
    };
  }, []);

  const requiredRule = (label: string) => ({ required: true, message: `${label} is required` });

  const validateEndAfterStart = async () => {
    const startDate = form.getFieldValue('startDate');
    const startTime = form.getFieldValue('startTime');
    const endDate = form.getFieldValue('endDate');
    const endTime = form.getFieldValue('endTime');
    if (!startDate || !startTime || !endDate || !endTime) return Promise.resolve();

    const start = startDate.hour(startTime.hour()).minute(startTime.minute()).second(0);
    const end = endDate.hour(endTime.hour()).minute(endTime.minute()).second(0);
    if (end.isAfter(start)) return Promise.resolve();
    return Promise.reject(new Error('End must be after Start'));
  };

  const buildUrl = (values: EventFormValues): string => {
    const start = values.startDate
      .hour(values.startTime.hour())
      .minute(values.startTime.minute())
      .second(0);
    const end = values.endDate
      .hour(values.endTime.hour())
      .minute(values.endTime.minute())
      .second(0);

    if (platform === 'google') {
      return buildGoogleCalendarUrl({
        title: values.title,
        description: values.description,
        location: values.location,
        start,
        end,
      });
    }
    return buildOutlookCalendarUrl({
      title: values.title,
      description: values.description,
      location: values.location,
      start,
      end,
    });
  };

  const onGenerateClick = async () => {
    try {
      const values = await form.validateFields();
      const url = buildUrl(values);
      form.setFieldValue('generatedUrl', url);
      const success = await onGenerate({ ...values, generatedUrl: url });
      if (success) {
        setCopied(true);
        if (resetIconTimerRef.current) {
          window.clearTimeout(resetIconTimerRef.current);
        }
        resetIconTimerRef.current = window.setTimeout(() => setCopied(false), 3000);
      }
    } catch {
      // Validation failed; do nothing
    }
  };

  const onSubmit = async () => {
    await onGenerateClick();
    const url = form.getFieldValue('generatedUrl');
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Form<EventFormValues>
      form={form}
      layout="vertical"
      initialValues={initialValues}
      className={styles.form}
      requiredMark
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="title" label="Event Title" rules={[requiredRule('Title')]}> 
            <Input placeholder="Enter event title (e.g., Team Meeting, Birthday Party)" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[requiredRule('Start Date')]}
            tooltip={{ icon: <CalendarOutlined />, title: 'Select start date' }}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[requiredRule('Start Time')]}
            tooltip={{ icon: <ClockCircleOutlined />, title: 'Select start time' }}
          >
            <TimePicker style={{ width: '100%' }} format="HH:mm" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[requiredRule('End Date'), { validator: validateEndAfterStart }]}
            tooltip={{ icon: <CalendarOutlined />, title: 'Select end date' }}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[requiredRule('End Time'), { validator: validateEndAfterStart }]}
            tooltip={{ icon: <ClockCircleOutlined />, title: 'Select end time' }}
          >
            <TimePicker style={{ width: '100%' }} format="HH:mm" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="location" label="Location (Optional)">
            <Input placeholder="Enter event location or meeting link" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="description" label="Description (Optional)">
            <Input.TextArea
              rows={1}
              maxLength={500}
              showCount
              placeholder="Add event details, agenda, or notes..."
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col>
          <Button
            icon={copied ? <CheckCircleTwoTone twoToneColor="#22C55E" /> : <LinkOutlined />}
            onClick={onGenerateClick}
          >
            Copy URL to clipboard
          </Button>
        </Col>
        <Col>
          <Button type="primary" onClick={onSubmit}>
            Open in {platform === 'google' ? 'Google Calendar' : 'Outlook Calendar'}
          </Button>
          {platform === 'outlook' && (
            <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
              Only works with Microsoft personal accounts
            </Typography.Text>
          )}
        </Col>
      </Row>
    </Form>
  );
}
