## Ecocoleta uma aplicação para incentivar a reciclagem e melhorar as condições de vida de catadores.

Em resumo, trata-se de um sistema concebido para simplificar a rotina dos catadores de recicláveis. Os usuários têm a facilidade de solicitar uma coleta automática ou agendar um horário conveniente para a retirada dos materiais recicláveis de suas residências. Para os catadores, o sistema gera uma rota eficiente com até 10 coletas, otimizando o trajeto para maximizar a eficiência. Além disso, o aplicativo incorpora elementos de gamificação, oferecendo aos usuários a possibilidade de trocar pontos por produtos. A proposta é estabelecer parcerias estratégicas com empresas e prefeituras visando arrecadar produtos e fortalecer a iniciativa.

No desenvolvimento deste projeto, estou utilizando tecnologias como Spring Boot, Spring Security, Angular, Postgres, Docker, Flyway, H2, Selenium e Figma. Essa abordagem tecnológica proporciona uma base sólida e eficiente para a implementação do sistema, garantindo segurança, escalabilidade e uma experiência de usuário aprimorada.

## 🎨 Layout

Os protótipos da aplicação mobile está disponível neste link: <a href="https://www.figma.com/file/zUN6WoN3BdO9aAqyzo9mKJ/EcoColeta?type=design&node-id=2-3&mode=design">Figma</a>

---

<!-- ## 📄 Documentação

A documentação das funcionalidades da aplicação pode ser acessada neste link: <a href="https://trello.com/b/O0lGCsKb/api-voll-med">Trello</a>

--- -->

## 📄 Monografia

A monografia da aplicação pode ser acessada neste link: <a href="https://www.overleaf.com/read/wxcpphrptgfw#2d441f">Overleaf</a>

---

## 📝 Licença

Projeto desenvolvido pelo aluno: [Alvaro Pires](https://github.com/alguipires)

Orientador: [Dr. Roni Fabio Banaszewski](https://ronifabio.github.io/)

---

<!-- ## 🛠 Tecnologias

As seguintes tecnologias foram utilizadas no desenvolvimento da API Rest do projeto:

- **[Java 17](https://www.oracle.com/java)**
- **[Spring Boot 3](https://spring.io/projects/spring-boot)**
- **[Maven](https://maven.apache.org)**
- **[MySQL](https://www.mysql.com)**
- **[Hibernate](https://hibernate.org)**
- **[Flyway](https://flywaydb.org)**
- **[Lombok](https://projectlombok.org)**

--- -->

# 🛠 Requisitos para iniciar a aplicação em desenvolvimento

## Ferramentas

- **IDE Java IntelliJ IDEA**
- **VsCode**
- **Dbeaver para visualizar o DB ou outro de preferencia**
- **Docker compose**

---

## Passos para iniciar a aplicação

### FrontEnd

Abra o terminal no pacote frontend

- **Instalar [nvm -gerenciador de versões do node](https://github.com/nvm-sh/nvm)**
- **Instalar o node via nvm `nvm install node 20.9.0`**
- **Rode o comando nvm use (versão especifica node) `nvm use 20.9.0`**
- **Instalar angular cli na pasta raiz do frontend `npm install -g @angular/cli`**

#### Para rodar o projeto angular frontend, no folder rode os comandos

- `npm install`
- `ng serve`

### Configurações das Environments (.env)

- **Na raiz do projeto renomeie o arquivo .env.example para .env e configura com as variaveis necessarias**
- **No pacote backend do projeto renomeie o arquivo .env.example para .env e configura com as variaveis necessarias**

### Containers e Banco de dados

\*obs. a aplicação está configurada em 3 conteineres para rodar em produção mas no desenvolvimento está sendo utilizado somente o container db(banco de dados).

Na raiz do projeto com o terminal aberto rodo os comandos para iniciar o container db

- `docker compose build`
- `docker compose up db` ou `docker compose up db -d` para iniciar somente o container db

### BackEnd

Abra o pacote backend no IntelliJ IDEA

- **Verificar aplications.properties se está tudo correto**
- **Faça um reload no pacotes maven**
- **Agora está pronto para iniciar o backend do projeto**

### Importar configuração do insomnia

Para importar todas as rotas configuradas no insomnia para testar a API clique no botão abaixo para importar (necessário ter insomnia instalado).

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=EcoColeta&uri=https%3A%2F%2Fraw.githubusercontent.com%2Futfpr-gp%2Fecocoleta%2F%2540alguipires%2Finitial-readme%2FInsomnia_export_API_test.json)
