const http = require('http');
const httpProxy = require('http-proxy');
const axios = require('axios');
const express = require('express');

const app = express();
const proxy = httpProxy.createProxyServer({});
const THINGSBOARD_URL = 'http://ip:8080'; // 替换为您的ThingsBoard URL
const USERNAME = 'tenant@thingsboard.org';
const PASSWORD = '';

let jwtToken = null;
let refreshToken = null;

// 获取 JWT Token
async function getJwtToken() {
  try {
    const response = await axios.post(`${THINGSBOARD_URL}/api/auth/login`, {
      username: USERNAME,
      password: PASSWORD
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    jwtToken = response.data.token;
    refreshToken = response.data.refreshToken;
    console.log('Obtained new JWT token.');
  } catch (error) {
    console.error('Failed to get JWT token:', error);
  }
}

// 刷新 JWT Token
async function refreshJwtToken() {
  try {
    const response = await axios.post(`${THINGSBOARD_URL}/api/auth/token`, {
      refreshToken: refreshToken
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    jwtToken = response.data.token;
    console.log('Refreshed JWT token.');
  } catch (error) {
    console.error('Failed to refresh JWT token:', error);
    await getJwtToken(); // 如果刷新失败，重新获取
  }
}

// 初始化获取 JWT Token
getJwtToken();

// 定时刷新 JWT Token（假设每小时刷新一次）
setInterval(refreshJwtToken, 60 * 60 * 1000);

// 代理请求处理
app.use(async (req, res) => {
  if (!jwtToken) {
    await getJwtToken();
  }

  // 设置 Authorization 头部
  req.headers['X-Authorization'] = `Bearer ${jwtToken}`;

  proxy.web(req, res, {
    target: THINGSBOARD_URL,
    changeOrigin: true
  });
});

// 错误处理
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (!res.headersSent) {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Something went wrong.');
  }
});

const server = http.createServer(app);

server.listen(3000, () => {
  console.log('Proxy server is running on port 3000');
});