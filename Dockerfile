# Imagen base de Node.js
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Crear directorio para imágenes si no existe
RUN mkdir -p public/img

# Puerto de la aplicación
EXPOSE 8080

# Comando para iniciar
CMD ["npm", "start"]