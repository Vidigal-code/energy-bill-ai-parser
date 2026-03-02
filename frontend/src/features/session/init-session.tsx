'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { meRequest } from '@/entities/auth/api/auth.client';
import {
  clearAuthUser,
  setAuthUser,
} from '@/entities/auth/model/auth.slice';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';

export function SessionInitializer() {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.auth.initialized);

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: meRequest,
    retry: false,
    enabled: !initialized,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setAuthUser(query.data));
      return;
    }

    if (query.error) {
      dispatch(clearAuthUser());
    }
  }, [dispatch, query.data, query.error]);

  return null;
}
