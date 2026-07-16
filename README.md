<p align="center">
  <img src="https://img.icons8.com/fluency/96/000000/restaurant.png" alt="Logo" width="80">
</p>

<h1 align="center">🍽️ Cadê Meu Rango?</h1>

<p align="center">
  <strong>Sistema Web Inteligente de Acompanhamento do Auxílio Alimentação Estudantil</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/versão-1.0.0-blue?style=for-the-badge" alt="Versão">
  <img src="https://img.shields.io/badge/licença-MIT-green?style=for-the-badge" alt="Licença">
</p>

---

## 📖 Sobre o Projeto

**Cadê Meu Rango?** é um sistema web desenvolvido para auxiliar estudantes no controle do auxílio alimentação recebido durante o período acadêmico.

A proposta surgiu a partir de uma necessidade prática: muitos estudantes recebem um valor destinado à alimentação, porém não possuem uma ferramenta específica para acompanhar o consumo, calcular quanto ainda podem gastar por dia e prever se o recurso financeiro será suficiente até o final dos dias acadêmicos.

O sistema transforma um controle financeiro manual em uma experiência **digital, visual e inteligente**.

---

## 🎯 Objetivo

Desenvolver um sistema web inteligente capaz de acompanhar o uso do auxílio alimentação estudantil, permitindo que o aluno controle seus gastos e receba alertas preventivos sobre sua situação financeira.

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| 🔐 **Autenticação** | Login, cadastro e recuperação de senha com Supabase Auth |
| 💰 **Cadastro de Auxílio** | Registro do valor recebido, período e dias de alimentação |
| 📊 **Dashboard** | Visão geral com saldo, dias restantes e status colorido |
| 🟢 **Status Inteligente** | Verde (≥ R$10/dia), Amarelo (≥ R$5/dia) ou Vermelho (< R$5/dia) |
| 📝 **Registro de Gastos** | Adicione gastos com data, local, tipo de dia e observação |
| 🗑️ **Exclusão com Justificativa** | Exclua gastos informando o motivo (registrado em histórico) |
| 📅 **Controle por Dias Únicos** | Dias restantes contam apenas dias com gastos |
| 📋 **Meus Auxílios** | Lista todos os auxílios cadastrados com opções de editar/excluir |
| 📆 **Meses Colapsáveis** | Organização por meses com expansão para ver gastos detalhados |

---

## 🚀 Tecnologias Utilizadas

### Front-end
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Back-end & Banco de Dados
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### Hospedagem
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
 ## 📁 Estrutura do Projeto
cade-meu-rango/
│
├── index.html # Página inicial
├── login.html # Tela de login
├── cadastro.html # Tela de cadastro
├── recuperar.html # Recuperação de senha
├── dashboard.html # Dashboard principal
├── meus-auxilios.html # Gerenciamento de auxílios
├── cadastro-auxilio.html # Cadastro de auxílio
│
├── css/
│ ├── style.css # Estilos principais
│ └── dark-mode.css # Modo escuro
│
├── js/
│ ├── config.js # Configuração do Supabase
│ ├── auth.js # Autenticação
│ ├── dashboard.js # Lógica do dashboard
│ ├── gastos.js # Gerenciamento de gastos
│ └── graficos.js # Gráficos com Chart.js
│
├── assets/
│ ├── images/ # Imagens do projeto
│ └── icons/ # Ícones
│
├── .gitignore
└── README.md
---

## 📁 Estrutura do Projeto
