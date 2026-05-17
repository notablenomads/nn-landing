interface Window {
  gtag: (
    command: "config" | "event",
    targetId: string,
    config?: {
      page_path?: string;
      page_title?: string;
      event_category?: string;
      event_label?: string;
      value?: number;
      [key: string]: unknown;
    }
  ) => void;
}
