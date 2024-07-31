# Use uma imagem base oficial do Node.js
FROM node:14

# Defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Compile o projeto TypeScript
RUN npm run build

# Exponha a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para rodar a aplicação em modo de produção
CMD [ "npm", "start" ]
