FROM node:18

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia apenas arquivos de dependências para aproveitar cache
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Gera o Prisma Client com base no schema.prisma
RUN npx prisma generate

# Compila o projeto NestJS
RUN npm run build

# Expõe a porta padrão do NestJS
EXPOSE 3000

# Comando de inicialização em produção
CMD ["npm", "run", "start:prod"]
