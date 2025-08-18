import { useNavigationTracking } from './useNavigationTracking';

export const useSecureNavigation = () => {
  const {
    navigateWithTracking,
    navigateToVideo,
    navigateToProfile,
    navigateToUpgrade,
    navigateToSearch,
    trackNavigationEvent,
    getNavigationContextFromUrl,
  } = useNavigationTracking();

  return {
    navigateWithTracking,
    navigateToVideo,
    navigateToProfile,
    navigateToUpgrade,
    navigateToSearch,
    trackNavigationEvent,
    getNavigationContextFromUrl,
  };
};