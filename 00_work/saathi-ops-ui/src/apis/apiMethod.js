import axios from 'axios';
import { errorHandler } from '../utils/errorHandler';
import { parseCookies } from 'nookies';

const apiMethod = async (
  method,
  endpoint,
  data = null,
  additionalHeaders = {},
  config = {},
  signal = null,
) => {
  const cookies = parseCookies();
  const headers = {
    'x-app-name': 'saathi',
    'source-type': 'OPS',
    'App-Version': '1',
    Authorization: cookies?.accessToken ? `Bearer ${cookies.accessToken}` : '',
    ...additionalHeaders,
  };

  try {
    const response = await axios({
      method,
      url: `${import.meta.env.VITE_BASE_URL}${endpoint}`,
      data,
      headers,
      ...config,
      signal,
    });
    return response?.data?.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message);
    } else {
      errorHandler(error);
      throw error;
    }
  }
};

export default apiMethod;
