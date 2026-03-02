'use client';

import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true,
});
