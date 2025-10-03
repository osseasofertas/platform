FROM node:18

WORKDIR /usr/src/app

# Copia package.json primeiro para melhor cache
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o resto dos arquivos
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Compila o projeto NestJS
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
