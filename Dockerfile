# Use a imagem oficial do Node.js como base
FROM node:14

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
  build-essential

# Crie o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todo o código do projeto para o diretório de trabalho
COPY . .

# Compilar o TypeScript
RUN npm run build

# Exponha a porta em que a aplicação vai rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]