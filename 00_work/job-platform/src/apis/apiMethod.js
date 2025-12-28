import { APP_NAME, APP_VERSION, SOURCE_TYPE } from "@/constants";
import { errorHandler } from "@/utils/errorHandler";
import axios from "axios";
import { parseCookies } from "nookies";

const apiMethod = async (
  method,
  endpoint,
  data = null,
  additionalHeaders = {},
  config = {},
  signal = null
) => {
  const cookies = parseCookies();
  const headers = {
    "x-app-name": APP_NAME,
    "source-type": SOURCE_TYPE,
    "App-Version": APP_VERSION,
    Authorization: cookies?.accessToken ? `Bearer ${cookies.accessToken}` : "",
    ...additionalHeaders,
  };

  try {
    const response = await axios({
      method,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
      data,
      headers,
      ...config,
      signal,
    });
    return response?.data?.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    } else {
      errorHandler(error);
      throw error;
    }
  }
};

export default apiMethod;
