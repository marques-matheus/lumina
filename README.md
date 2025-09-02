<div align="center">
  <h1>✨ Lúmina</h1>
  <p><strong>Sistema de Gestão Empresarial Moderno</strong></p>
  <p>Solução completa para gestão de clientes, produtos, vendas e ordens de serviço</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
  ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
</div>

---

## 🏢 **Sobre o Projeto**

O **Lúmina** é um sistema de gestão empresarial desenvolvido com as mais modernas tecnologias web, oferecendo uma solução robusta e intuitiva para pequenas e médias empresas que precisam de:

- 👥 **Gestão de Clientes** - CRM completo
- 📦 **Controle de Produtos** - Estoque e catálogo
- 💰 **Sistema de Vendas** - Processo de vendas completo
- 🛒 **Gestão de Compras** - Controle de fornecedores
- 🔧 **Ordens de Serviço** - Workflow de atendimento
- 📊 **Dashboard Analítico** - Métricas e relatórios

## 🚀 **Stack Tecnológica**

<table>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>Next.js 15, TypeScript, Tailwind CSS, shadcn/ui</td>
  </tr>
  <tr>
    <td><strong>Backend</strong></td>
    <td>Next.js Server Actions, Supabase Client</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>Supabase (PostgreSQL)</td>
  </tr>
  <tr>
    <td><strong>Auth</strong></td>
    <td>NextAuth.js, bcryptjs</td>
  </tr>
  <tr>
    <td><strong>UI/UX</strong></td>
    <td>Radix UI, Lucide Icons, Recharts</td>
  </tr>
  <tr>
    <td><strong>Notifications</strong></td>
    <td>Sonner Toast</td>
  </tr>
</table>

## 📁 **Estrutura do Projeto**

```
lumina/
├── src/
│   ├── app/
│   │   ├── (app)/              # Rotas protegidas da aplicação
│   │   │   ├── page.tsx        # Dashboard principal
│   │   │   ├── clientes/       # Gestão de clientes
│   │   │   ├── produtos/       # Gestão de produtos
│   │   │   ├── vendas/         # Sistema de vendas
│   │   │   ├── compras/        # Gestão de compras
│   │   │   ├── ordens-servico/ # Ordens de serviço
│   │   │   ├── configuracoes/  # Configurações do sistema
│   │   │   └── layout.tsx      # Layout principal da app
│   │   ├── (auth)/             # Rotas de autenticação
│   │   │   └── auth/
│   │   │       ├── login/      # Página de login
│   │   │       ├── cadastro/   # Página de registro
│   │   │       └── layout.tsx  # Layout de auth
│   │   ├── api/                # API Routes do Next.js
│   │   │   └── auth/           # Endpoints de autenticação
│   │   ├── features/           # Módulos organizados por funcionalidade
│   │   │   ├── auth/           # Autenticação e autorização
│   │   │   ├── clients/        # Gestão de clientes
│   │   │   ├── products/       # Gestão de produtos
│   │   │   ├── sales/          # Sistema de vendas
│   │   │   ├── purchases/      # Gestão de compras
│   │   │   ├── service-orders/ # Ordens de serviço
│   │   │   └── settings/       # Configurações
│   │   ├── globals.css         # Estilos globais
│   │   └── layout.tsx          # Layout raiz
│   ├── components/
│   │   ├── shared/             # Componentes compartilhados
│   │   │   ├── sidebar.tsx     # Navegação lateral
│   │   │   ├── header.tsx      # Cabeçalho da aplicação
│   │   │   ├── footer.tsx      # Rodapé
│   │   │   └── data-table.tsx  # Tabela de dados reutilizável
│   │   └── ui/                 # Componentes de interface (shadcn/ui)
│   ├── lib/                    # Utilitários e configurações
│   │   ├── supabase.ts         # Cliente Supabase
│   │   └── utils.ts            # Funções auxiliares
│   └── types/                  # Definições de tipos TypeScript
├── public/                     # Arquivos estáticos
└── docs/                       # Documentação adicional
```

## 🛠️ **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- npm/yarn/pnpm

### **1. Clone o repositório**
```bash
git clone https://github.com/marques-matheus/lumina.git
cd lumina
```

### **2. Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### **3. Configure o Supabase**
1. Crie um novo projeto no [Supabase](https://supabase.com)
2. Vá para **Settings > API**
3. Copie a **URL** e a **anon key**
4. Vá para **Settings > Database** 
5. Copie a **Connection String**

### **4. Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-anon-key"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"

# NextAuth.js
NEXTAUTH_SECRET="seu-secret-super-seguro"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="development"
```

### **5. Configure o banco de dados**
1. Acesse o **SQL Editor** no Supabase
2. Execute os scripts SQL para criar as tabelas necessárias
3. Configure as **Row Level Security (RLS)** policies

### **6. Execute o projeto**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📊 **Funcionalidades Implementadas**

### ✅ **Sistema de Autenticação**
- [x] Login e cadastro de usuários
- [x] Proteção de rotas com middleware
- [x] Sessões seguras com NextAuth.js
- [x] Hash de senhas com bcryptjs

### ✅ **Dashboard Analytics**
- [x] Métricas principais do negócio
- [x] Gráficos de vendas mensais
- [x] Indicadores de performance
- [x] Atividades recentes

### ✅ **Gestão de Clientes**
- [x] CRUD completo de clientes
- [x] Busca e filtros avançados
- [x] Dados de contato e endereço
- [x] Histórico de relacionamento

### ✅ **Controle de Produtos**
- [x] CRUD completo de produtos
- [x] Controle de estoque
- [x] Categorização
- [x] Precificação dinâmica

### ✅ **Sistema de Vendas**
- [x] Processo de vendas completo
- [x] Carrinho de compras
- [x] Múltiplas formas de pagamento
- [x] Vinculação com clientes

### ✅ **Gestão de Compras**
- [x] Registro de compras
- [x] Controle de fornecedores
- [x] Entrada automática no estoque
- [x] Controle de custos

### ✅ **Ordens de Serviço**
- [x] Workflow completo (Pendente → Concluído)
- [x] Sistema de prioridades
- [x] Controle de prazos
- [x] Vinculação com clientes

### ✅ **Interface e UX**
- [x] Design responsivo (mobile-first)
- [x] Tema claro/escuro
- [x] Componentes reutilizáveis
- [x] Notificações toast
- [x] Navegação intuitiva

## 🎯 **Como Usar**

### **1. Primeiro Acesso**
1. Acesse `/auth/cadastro` para criar sua conta
2. Faça login em `/auth/login`
3. Configure seu perfil em `/configuracoes`

### **2. Configuração Inicial**
1. **Produtos**: Cadastre seus produtos em `/produtos`
2. **Clientes**: Adicione seus clientes em `/clientes`
3. **Fornecedores**: Configure fornecedores via `/compras`

### **3. Operações Diárias**
1. **Vendas**: Registre vendas em `/vendas`
2. **Compras**: Controle compras em `/compras`
3. **Serviços**: Gerencie ordens em `/ordens-servico`
4. **Relatórios**: Acompanhe métricas no Dashboard

## 🏗️ **Arquitetura e Padrões**

### **Arquitetura Feature-Based**
Cada funcionalidade é organizada como um módulo independente:

```typescript
features/
├── clients/
│   ├── actions/          # Server Actions
│   ├── components/       # Componentes específicos
│   └── types/           # Tipos TypeScript
```

### **Server Actions Pattern**
```typescript
// app/features/clients/actions/create-client.ts
'use server'

export async function createClient(formData: FormData) {
  // Validação e processamento
  // Interação com Supabase
  // Retorno de resultado
}
```

### **Component Composition**
```typescript
// Componentes compostos e reutilizáveis
<DataTable
  data={clients}
  columns={clientColumns}
  filterPlaceholder="Buscar clientes..."
  addButton={<AddClientDialog />}
/>
```

### **Fluxo de Dados**
```
UI Component → Server Action → Supabase Client → Supabase Database
     ↑                                                    ↓
Revalidation ← Response ← Business Logic ← Query Results
```

## 🎨 **Design System**

### **Componentes Base (shadcn/ui)**
- **Button**: Botões com variantes
- **Input**: Campos de entrada
- **Dialog**: Modais e diálogos
- **Table**: Tabelas de dados
- **Badge**: Indicadores de status
- **Card**: Containers de conteúdo

### **Tema e Cores**
- **Sistema de cores**: Baseado em CSS Variables
- **Dark/Light mode**: Suporte nativo
- **Responsividade**: Mobile-first approach
- **Tipografia**: Inter font family

## 📱 **Responsividade**

### **Breakpoints Tailwind**
- **sm**: 640px+ (Mobile large)
- **md**: 768px+ (Tablet)
- **lg**: 1024px+ (Laptop)
- **xl**: 1280px+ (Desktop)

### **Layout Adaptativo**
- **Sidebar**: Collapsa automaticamente em mobile
- **Tables**: Scroll horizontal em telas pequenas
- **Forms**: Layout vertical em dispositivos móveis
- **Dashboard**: Grid responsivo para cards

## 🔒 **Segurança**

### **Autenticação**
- **NextAuth.js**: Gerenciamento de sessões
- **bcryptjs**: Hash seguro de senhas
- **Middleware**: Proteção automática de rotas
- **CSRF**: Proteção contra ataques CSRF

### **Supabase Security**
- **Row Level Security**: Controle granular de acesso
- **API Keys**: Separação entre anon e service role
- **SSL/TLS**: Conexões criptografadas
- **Policies**: Regras de acesso por usuário

## 📦 **Build e Deploy**

### **Desenvolvimento**
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Gera build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linting
```

### **Deploy na Vercel (Recomendado)**
1. Conecte seu repositório GitHub na Vercel
2. Configure as variáveis de ambiente:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-key
   NEXTAUTH_SECRET=seu-secret
   NEXTAUTH_URL=https://seu-dominio.vercel.app
   ```
3. Deploy automático a cada push na main

### **Outras Plataformas**
- **Netlify**: Suporte completo para Next.js
- **Railway**: Deploy direto do GitHub
- **AWS Amplify**: Integração com AWS

## 🔄 **Roadmap de Desenvolvimento**

### **v1.1 - Analytics Avançado** (Q1 2025)
- [ ] Relatórios customizáveis
- [ ] Exportação para PDF/Excel
- [ ] Gráficos interativos avançados
- [ ] Comparativos mensais/anuais

### **v1.2 - Integrações** (Q2 2025)
- [ ] API REST pública
- [ ] Webhooks para integrações
- [ ] Importação/Exportação de dados
- [ ] Integração com contabilidade

### **v1.3 - Recursos Avançados** (Q3 2025)
- [ ] Sistema de notificações por email
- [ ] App mobile (React Native)
- [ ] Automações de workflow
- [ ] Multi-empresa (SaaS)

### **v1.4 - IA e Automação** (Q4 2025)
- [ ] Previsão de vendas com IA
- [ ] Recomendações automáticas
- [ ] Chatbot de atendimento
- [ ] Análise preditiva de estoque

## 🤝 **Contribuição**

### **Como Contribuir**
1. **Fork** o repositório
2. Crie uma **branch** feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

### **Padrões de Código**
- **TypeScript**: Tipagem obrigatória
- **ESLint**: Configuração rigorosa
- **Conventional Commits**: Padrão de commits
- **Component naming**: PascalCase para componentes
- **File naming**: kebab-case para arquivos

### **Estrutura de Commits**
```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: formatação de código
refactor: refatoração sem mudança de funcionalidade
perf: melhoria de performance
test: adição de testes
chore: tarefas de manutenção
```

## 📞 **Suporte e Comunidade**

### **Reportar Issues**
- **🐛 Bugs**: [GitHub Issues](https://github.com/marques-matheus/lumina/issues)
- **💡 Features**: [Feature Requests](https://github.com/marques-matheus/lumina/issues/new?template=feature_request.md)
- **❓ Dúvidas**: [Discussions](https://github.com/marques-matheus/lumina/discussions)

### **Documentação**
- **📖 Docs**: Pasta `/docs` do repositório
- **🎥 Vídeos**: Tutoriais no YouTube (em breve)
- **📝 Blog**: Artigos técnicos (em breve)

## 📈 **Status do Projeto**

![GitHub last commit](https://img.shields.io/github/last-commit/marques-matheus/lumina)
![GitHub issues](https://img.shields.io/github/issues/marques-matheus/lumina)
![GitHub pull requests](https://img.shields.io/github/issues-pr/marques-matheus/lumina)
![GitHub stars](https://img.shields.io/github/stars/marques-matheus/lumina)

## 👥 **Equipe de Desenvolvimento**

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/marques-matheus.png" width="100px;" alt=""/>
      <br />
      <sub><b>Seu Nome</b></sub>
      <br />
      <sub>Full Stack Developer</sub>
    </td>
  </tr>
</table>

## 📄 **Licença**

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 **Agradecimentos**

Agradecimentos especiais às tecnologias e comunidades que tornaram este projeto possível:

- **[Next.js](https://nextjs.org/)** - O melhor framework React
- **[Supabase](https://supabase.com/)** - Backend as a Service incrível
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI elegantes
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Vercel](https://vercel.com/)** - Plataforma de deploy otimizada
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript com tipos

---

<div align="center">
  <p><strong>Desenvolvido com ❤️ para revolucionar a gestão empresarial</strong></p>
  <p>✨ <strong>Transformando ideias em soluções digitais</strong> ✨</p>
  
  <br>
  
  <sub>Powered by</sub><br>
  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
    <img src="https://supabase.com/brand-assets/supabase-logo-wordmark--light.svg" alt="Supabase" width="120" style="margin: 10px;">
  </a>
  <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
    <img src="https://nextjs.org/static/favicon/favicon.ico" alt="Next.js" width="32" style="margin: 10px;">
  </a>
  
  <br><br>
  
  <p>
    <a href="#-sobre-o-projeto">🔝 Voltar ao topo</a>
  </p>
</div>

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!**