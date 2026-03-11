import { useCallback } from 'react';
import { useApp } from '../store/AppContext';

export function useTrails() {
  const { state, fetchTrails, createTrail, getTrailById } = useApp();

  const refresh = useCallback(() => fetchTrails(), [fetchTrails]);

  return {
    trails: state.trails,
    loading: state.loading,
    refresh,
    createTrail,
    getTrailById,
  };
}
