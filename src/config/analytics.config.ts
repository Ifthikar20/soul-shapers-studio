export const GA_CONFIG = {
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
    options: {
      send_page_view: true,
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    },
    enabled: import.meta.env.VITE_GA_ENABLED === 'true' || import.meta.env.PROD,
  };
  
  export const GA_DEBUG = import.meta.env.DEV;