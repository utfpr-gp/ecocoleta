# EcoColeta - Incentivando a reciclagem e melhorando a vida dos catadores

## ✨ Sobre o projeto

## Em resumo, trata-se de um sistema concebido para simplificar a rotina dos catadores de recicláveis. Os usuários têm a facilidade de solicitar uma coleta automática ou agendar um horário conveniente para a retirada dos materiais recicláveis de suas residências. Para os catadores, o sistema gera uma rota eficiente com até 10 coletas, otimizando o trajeto para maximizar a eficiência. Além disso, o aplicativo incorpora elementos de gamificação, oferecendo aos usuários a possibilidade de trocar pontos por produtos. A proposta é estabelecer parcerias estratégicas com empresas e prefeituras visando arrecadar produtos e fortalecer a iniciativa.

## 🔧 Tecnologias utilizadas

### Backend

- **[Java 17](https://www.oracle.com/java)**
- **[Spring Boot 3](https://spring.io/projects/spring-boot)**
- **[Spring Security](https://spring.io/projects/spring-security)**
- **[PostgreSQL](https://www.postgresql.org)** com **[PostGIS](https://postgis.net)** para georreferenciamento
- **[Hibernate](https://hibernate.org)**
- **[Flyway](https://flywaydb.org)** para migração de banco de dados
- **[Swagger](https://swagger.io)** para documentação da API
- **Docker Compose**
- **Google Maps API** para traçar rotas otimizadas de coleta

### Frontend

- **[Angular](https://angular.io)**
- **PrimeNG**
- **TypeScript**

### Infraestrutura e DevOps

- **Docker** para conteinerização
- **Cloudinary** para armazenamento de arquivos

---

## 🛠️ Configuração e execução do projeto

### 1. Configuração dos arquivos `.env`

Configurar os seguintes arquivos `.env` com as variáveis de ambiente necessárias:

- **Na raiz do projeto:** `.env`
- **No backend:** `backend/.env`
- **No frontend:** `frontend/src/environments/environment.ts` (para desenvolvimento, use o arquivo `environment.dev.ts`)

### Exemplo de configuração das variáveis de ambiente (arquivo `.env`):

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=senha
GOOGLE_MAPS_API_KEY=sua_chave_api_google_maps
```

> **Observação:** Certifique-se de comentar ou descomentar a linha correta no arquivo `application.properties` no backend para configurar o SSL ao rodar localmente ou via Docker.

---

### 2. Como rodar a aplicação localmente

#### Via IDE (localmente)

1. **Clonar o repositório:**

```
git clone https://github.com/seu-usuario/ecocoleta.git
cd ecocoleta
```

2. **Configurar os arquivos \*\***\*\***\*\***`.env`\***\*\*\*\*\*\*\*** conforme descrito acima.\*\*

3. **Iniciar o Backend:**

   - Abra o pacote backend no IntelliJ IDEA.
   - Verifique o arquivo `application.properties`.
   - Execute a aplicação utilizando a classe principal.

4. **Iniciar o Frontend:**

   - Acesse a pasta `frontend` e execute:

   ```bash
   nvm install 20.9.0
   nvm use 20.9.0
   npm install
   ng serve
   ```

   - O frontend estará disponível em [https://localhost:4200](https://localhost:4200)

#### Via Docker Compose

1. **Configurar os arquivos \*\***\*\***\*\***`.env`\***\*\*\*\*\*\*\*** conforme descrito acima.\*\*
2. **Abrir o terminal na raiz do projeto e rodar os comandos:**

```bash
docker compose build
docker compose up -d
```

3. **Verifique os containers:**
   - Banco de Dados, Backend e Frontend estarão ativos.
   - Acesse a aplicação nos seguintes endereços:
     - **API:** [https://localhost:8080](https://localhost:8080)
     - **Frontend:** [https://localhost:4200](https://localhost:4200)

---

## 🔗 Endpoints de documentação da API

- **Swagger UI:** [https://localhost:8080/swagger-ui.html](https://localhost:8080/swagger-ui.html)
- **Documentação JSON:** [https://localhost:8080/v3/api-docs](https://localhost:8080/v3/api-docs)

---

## 🌄 Layout

Os protótipos da aplicação estão disponíveis no [Figma](https://www.figma.com/file/zUN6WoN3BdO9aAqyzo9mKJ/EcoColeta?type=design&node-id=2-3&mode=design).

---

## 📒 Monografia

A monografia da aplicação pode ser acessada neste link: [Overleaf](https://www.overleaf.com/read/szdqjbyjrnnn#024b44)

---

## 📃 Licença

Projeto desenvolvido pelo aluno: [Alvaro Pires](https://github.com/alguipires)\
Orientador: [Dr. Roni Fabio Banaszewski](https://ronifabio.github.io/)

---

## 🔧 Ferramentas recomendadas

- **IDE:** IntelliJ IDEA para backend e VSCode para frontend
- **Gerenciador de banco de dados:** DBeaver ou outro de preferência
- **Cliente de API:** Postman (ou Insomnia, se preferir)

---

## 🚀 Importar configurações de API

Para testar a API, utilize o Postman e importe as configurações usando o botão abaixo:

---

## 🔧 Observações adicionais

- O sistema está preparado para ser executado tanto localmente quanto em ambientes conteinerizados usando Docker.
- A utilização de PostGIS permite um traçado eficiente das rotas de coleta com base na localização geográfica.
- Para ambientes de produção, revise as configurações SSL corretamente para garantir a segurança.
