import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express } from 'express';

const endpoints: Record<string, string | undefined> = {
  '/api/login': process.env.REACT_APP_API_LOGIN,
  '/api/balance': process.env.REACT_APP_API_BALANCE,
  '/api/transfer': process.env.REACT_APP_API_TRANSFER,
  '/api/transferList': process.env.REACT_APP_API_TRANSFER_LIST,
};

export default function setupProxy(app: Express): void {
  Object.entries(endpoints).forEach(([proxyPath, fullUrl]) => {
    if (!fullUrl) return;
    const { origin, pathname } = new URL(fullUrl);
    app.use(
      proxyPath,
      createProxyMiddleware({
        target: origin,
        changeOrigin: true,
        pathRewrite: { [`^${proxyPath}`]: pathname },
      })
    );
  });
}
