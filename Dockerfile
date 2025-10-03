FROM node:18

WORKDIR /usr/src/app

# Copia package.json primeiro para melhor cache
COPY package*.json ./

# Copia o schema do Prisma antes da instalação
COPY prisma ./prisma/

# Instala dependências (isso vai executar prisma generate via postinstall)
RUN npm install

# Copia o resto dos arquivos
COPY . .

# Compila o projeto NestJS
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
