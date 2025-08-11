import type { Dayjs } from 'dayjs';

interface BuildUrlArgs {
  title: string;
  description?: string;
  location?: string;
  start: Dayjs;
  end: Dayjs;
}

export function buildGoogleCalendarUrl({ title, description, location, start, end }: BuildUrlArgs) {
  const startUtc = start.utc().format('YYYYMMDDTHHmmss[Z]');
  const endUtc = end.utc().format('YYYYMMDDTHHmmss[Z]');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startUtc}/${endUtc}`,
  });
  if (description) params.set('details', description);
  if (location) params.set('location', location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildOutlookCalendarUrl({
  title,
  description,
  location,
  start,
  end,
}: BuildUrlArgs) {
  const startIso = start.utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
  const endIso = end.utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: startIso,
    enddt: endIso,
    subject: title,
  });
  if (description) params.set('body', description);
  if (location) params.set('location', location);
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
