<p align="center">
  <img src="https://nodejs.org/static/images/logo.svg" width="120" alt="Node.js Logo" />
</p>

# 🚀 API Node.js + TypeScript + Prisma

Este é um projeto de backend construído com [Express](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/) e [Prisma ORM](https://www.prisma.io/), seguindo boas práticas de organização e desenvolvimento. O banco de dados utilizado é o **PostgreSQL**.

---

## 🛠️ Tecnologias

- ✅ [Node.js](https://nodejs.org/)
- ✅ [Express](https://expressjs.com/)
- ✅ [Prisma ORM](https://www.prisma.io/)
- ✅ [TypeScript](https://www.typescriptlang.org/)
- ✅ [PostgreSQL](https://www.postgresql.org/)

---

## 📦 Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (v20 ou superior recomendado)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

---

## ▶️ Como rodar o projeto?

Passo a passo:

```bash
# 1. Instale as dependências
npm install

# 2. Gere o cliente do Prisma
npx prisma generate

# 3. Execute as migrations (irá criar o banco de dados)
npx prisma migrate dev

# 4. Rode o servidor em modo desenvolvimento
npm run dev

```

## ⚙️ Variáveis de ambiente

Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes variáveis:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO?schema=public"
JWT_SECRET="sua_chave_jwt_segura"
