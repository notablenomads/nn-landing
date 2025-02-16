export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

export const pageview = (url: string): void => {
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: document.title,
  });
};

export const event = ({ action, category, label, value }: GTagEvent): void => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};
