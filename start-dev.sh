#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}==> Iniciando Ambiente de Desenvolvimento (PostgreSQL) <==${NC}"

# Verifica se o container já está rodando
if [ "$(docker ps -q -f name=mini_portainer_db)" ]; then
    echo "O Banco de Dados já está rodando!"
else
    echo "Subindo container do PostgreSQL..."
    docker-compose -f docker-compose.dev.yml up -d
    echo -e "${GREEN}==> Banco de Dados pronto na porta 5432! <==${NC}"
fi

# Dica: Aqui no futuro colocaremos o comando para iniciar o Java também