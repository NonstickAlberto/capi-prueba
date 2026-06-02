import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL } from '../constants/api.constants';

const TEST_BEARER_TOKEN = '2|x96kvfIGsgkl6jGCoVeBAm0HZz3FS6eRHbUzGTlT7052ad91';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^https?:\/\//i.test(req.url)) {
    const requestWithToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${TEST_BEARER_TOKEN}`
      }
    });
    return next(requestWithToken);
  }

  const normalizedBase = API_BASE_URL.replace(/\/+$/, '');
  const normalizedPath = req.url.replace(/^\/+/, '');
  const requestWithBaseUrlAndToken = req.clone({
    url: `${normalizedBase}/${normalizedPath}`,
    setHeaders: {
      Authorization: `Bearer ${TEST_BEARER_TOKEN}`
    }
  });
  return next(requestWithBaseUrlAndToken);
};
