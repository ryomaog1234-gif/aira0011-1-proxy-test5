const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Renderの環境変数から取得（未設定時は空）
const TARGET_URL = process.env.TARGET_URL || 'https://example.com';
const AUTH_COOKIE = process.env.AUTH_COOKIE || '';

app.use('/', createProxyMiddleware({
    target: TARGET_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq) => {
        if (AUTH_COOKIE) {
            proxyReq.setHeader('Cookie', AUTH_COOKIE);
        }
    },
    onProxyRes: (proxyRes) => {
        delete proxyRes.headers['set-cookie'];
    }
}));

// Renderは環境変数PORTを自動割り当てするため、それに従う
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy running on port ${port}`));
