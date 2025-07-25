FROM node:18

WORKDIR /usr/src/app

# Copia todos os arquivos do projeto antes da instalação
COPY . .

# Instala dependências
RUN npm install

# Gera o Prisma Client
RUN npx prisma generate

# Compila o projeto NestJS
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
