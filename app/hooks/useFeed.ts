import { useCallback } from 'react';
import { useApp } from '../store/AppContext';

export function useFeed() {
  const { state, fetchFeed, reactToCrumb } = useApp();

  const refresh = useCallback(() => fetchFeed(), [fetchFeed]);

  return {
    feed: state.feed,
    loading: state.loading,
    refresh,
    reactToCrumb,
  };
}
