# Definir a imagem base que será usada
FROM node:8.9.4-alpine AS builder

# Definir o diretório de trabalho para a aplicação
WORKDIR /app

# Copiar o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante dos arquivos para o diretório de trabalho
COPY . .

# Buildar a aplicação
RUN npm run build

# Definir a imagem base para a aplicação
FROM nginx:1.21-alpine AS production

VOLUME /var/cache/nginx

# Copiar os arquivos de configuração do nginx para a imagem
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
#COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta do nginx
EXPOSE 80

# Iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]
