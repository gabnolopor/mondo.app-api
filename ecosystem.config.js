require("dotenv").config();

module.exports = {
    apps: [{
      name: "mondo-app",
      script: "./index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',  // Configurado según la memoria máxima de tu servicio en Render
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: process.env.PORT  // Asegúrate de que PM2 también usa la variable de entorno PORT
      }
    }]
  };
  
