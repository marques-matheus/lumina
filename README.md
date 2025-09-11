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



## 📈 **Status do Projeto**

![GitHub last commit](https://img.shields.io/github/last-commit/marques-matheus/lumina)
![GitHub issues](https://img.shields.io/github/issues/marques-matheus/lumina)
![GitHub pull requests](https://img.shields.io/github/issues-pr/marques-matheus/lumina)
![GitHub stars](https://img.shields.io/github/stars/marques-matheus/lumina)

## 👥 **Equipe de Desenvolvimento**


## 📄 **Licença**

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
