const config = {
  production: {
    API_URL: "https://chat-k7m6.onrender.com",
  },
  development: {
    API_URL: "http://localhost:3000",
  },
};

const ENV = "production" || "development"; // Defaults to 'development'
export const API_URL = config[ENV].API_URL;
// NODE_ENV=production npm run build
