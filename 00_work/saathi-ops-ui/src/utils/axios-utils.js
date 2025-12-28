import axios from 'axios';
import { BASE_URL } from '../constants';

const client = axios.create({
  baseURL: BASE_URL,
});

export const request = ({ ...options }) => {
  client.defaults.headers.common['x-app-name'] = `saathi`;
  client.defaults.headers.common['app-version'] = `1`;
  const onSuccess = (response) => response;
  const onError = (error) => error;

  return client(options).then(onSuccess).catch(onError);
};
