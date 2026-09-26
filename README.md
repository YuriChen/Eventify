# 🎵 Eventify

Plataforma para descoberta e divulgação de eventos musicais — festivais, shows, 
festas e eventos em clubes. O Eventify conecta fãs a produtores, permitindo 
explorar eventos por cidade, data e gênero musical.

## 🚀 Sobre o projeto

O Eventify é uma aplicação web full-stack em desenvolvimento, criada para centralizar 
a busca por eventos musicais e facilitar a divulgação por parte de produtores 
independentes. O foco inicial são eventos de música: festivais, shows, festas, apresentações ao vivo e eventos em clubes.

O projeto está sendo construído como um estudo prático de arquitetura full-stack 
moderna, com separação clara entre frontend e backend, e boas práticas de 
desenvolvimento.

## ✨ Funcionalidades

### Já implementadas
- [x] Estrutura inicial do frontend com Angular 22
- [x] Header responsivo com dois estados (visitante / usuário logado)
- [x] Sistema de rotas com lazy loading (`/explorar`)
- [x] Tema escuro customizado com ZardUI
- [x] API REST em .NET com endpoint de gêneros musicais (`GET /api/genres`)
- [x] Banco de dados SQL Server integrado via Entity Framework Core
- [x] Entidade `Genre` modelada e populada com gêneros musicais reais
- [x] Filtro de gêneros na página Explorar, consumindo dados do banco
- [x] Filtro de data (date picker) na página Explorar
- [x] Proxy de desenvolvimento configurado (Angular → API)

### Em desenvolvimento
- [ ] Grid de eventos com cards (capa, título, produtor, local, data, preço)
- [ ] Filtro por cidade
- [ ] Página de detalhes do evento (`/eventos/:id`)
- [ ] Cadastro e autenticação de usuários
- [ ] Sistema de ingressos

### Planejadas
- [ ] Salvamento de eventos favoritos
- [ ] Notificações de novos eventos
- [ ] Painel do produtor de eventos
- [ ] Integração com meios de pagamento
- [ ] App mobile

## 🛠️ Tecnologias

### Frontend
- **Angular 22** — framework SPA com standalone components e signals
- **TypeScript** — tipagem estática
- **Tailwind CSS** — estilização utilitária
- **ZardUI** — biblioteca de componentes baseada em Tailwind (filosofia shadcn/ui)
- **Vite** — servidor de desenvolvimento com hot reload
- **RxJS** — programação reativa (Observables para HTTP)

### Backend
- **ASP.NET Core** — API REST
- **Entity Framework Core** — ORM para acesso a dados
- **SQL Server** — banco de dados relacional
- **C# 13** — linguagem com async/await e LINQ
- **OpenAPI** — documentação da API

### Ferramentas
- **Git / GitHub** — versionamento
- **Visual Studio / VS Code** — desenvolvimento
- **SSMS** — gerenciamento do banco de dados
