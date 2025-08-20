import { constants } from "@constants/environment";
import { loggingDebug } from "@lib/utils/logger";
import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axiosRetry from "axios-retry";

/**
 * Logs response details for debugging purposes.
 * @param response Axios response object
 * @returns The original response
 */
const responseInterceptor = (response: AxiosResponse) => {
  loggingDebug(
    JSON.stringify({
      baseUrl: response.config.baseURL,
      url: response.config.url,
    }),
  );
  return response;
};

/**
 * AbstractApiService provides a base class for API services,
 * handling axios instance creation, authorization, retries, and logging.
 */
export default class AbstractApiService {
  private base: string;
  private authorization?: string;
  private apiTimeout?: number;
  private useInternalAuthHeaderEndpoints?: string[];
  private headers?: AxiosRequestHeaders;
  public api: AxiosInstance;

  /**
   * Initializes the API service with configuration.
   * @param params Configuration parameters
   */
  constructor({
    base,
    apiTimeout,
    authorization,
    useInternalAuthHeaderEndpoints,
    headers,
  }: {
    base: string;
    apiTimeout?: number;
    authorization?: string;
    useInternalAuthHeaderEndpoints?: string[];
    headers?: AxiosRequestHeaders;
  }) {
    this.base = base;
    this.apiTimeout = apiTimeout;
    this.authorization = authorization;
    this.useInternalAuthHeaderEndpoints = useInternalAuthHeaderEndpoints;
    this.headers = headers;

    this.api = this.init();
  }

  /**
   * Initializes the Axios instance with interceptors and retry logic.
   * @returns Configured AxiosInstance
   */
  private init = (): AxiosInstance => {
    const api = axios.create({
      baseURL: this.base,
      headers: this.headers ?? { "Content-Type": "application/json" },
      timeout: this.apiTimeout ?? constants.API_TIMEOUT,
    });

    // Attach request and response interceptors
    api.interceptors.request.use(this.authInterceptor);
    api.interceptors.response.use(responseInterceptor);

    // Configure axios-retry with exponential backoff
    axiosRetry(api, {
      retries: 5,
      retryDelay: (retryCount) => {
        const delay = Math.pow(2, retryCount) * 1000;
        loggingDebug(`Retry attempt ${retryCount}, delaying for ${delay}ms`);
        return delay;
      },
      retryCondition: (error) =>
        axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error),
    });

    return api;
  };

  /**
   * Axios request interceptor to add Authorization header conditionally.
   * @param request Axios request config
   * @returns Modified request config
   */
  private authInterceptor = async (
    request: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const url = request.url;

    // Add Authorization header if configured and endpoint matches
    if (
      this.authorization &&
      (!this.useInternalAuthHeaderEndpoints ||
        this.useInternalAuthHeaderEndpoints.some(
          (endpoint) => url === endpoint,
        ))
    ) {
      request.headers.Authorization = this.authorization;
    }

    return request;
  };
}
