interface UpgradeContext {
    upgradeId: string;
    source?: string;
    videoId?: string;
    videoTitle?: string;
    seriesId?: string;
    episode?: string;
  }
export const trackUpgradeEvent = (event: string, context: UpgradeContext & { plan?: string }) => {
  // Replace with your analytics service
  console.log('📊 Analytics:', event, context);
  
  // Example with Google Analytics
  if (window.gtag) {
    window.gtag('event', event, {
      upgrade_id: context.upgradeId,
      source: context.source,
      video_id: context.videoId,
      plan: context.plan,  // Add this line
      custom_parameter_1: context.seriesId,
    });
  }
};
  export const getUpgradeContextFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname;
    const upgradeId = pathname.split('/upgrade/')[1]?.split('?')[0];
    
    return {
      upgradeId,
      source: urlParams.get('source'),
      videoId: urlParams.get('video_id'),
      videoTitle: urlParams.get('video_title'),
      seriesId: urlParams.get('series_id'),
      episode: urlParams.get('episode'),
    };
  };