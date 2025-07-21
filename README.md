# 🃏 Cards Marketplace

> Marketplace moderno para troca de cartas colecionáveis

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 🎯 **O que faz**

Sistema web que conecta colecionadores de cartas para trocas seguras:

- 🔐 **Autenticação** - Login/registro com validação
- 🃏 **Coleção** - Gerencie suas cartas pessoais  
- 🔄 **Trocas** - Crie ofertas e encontre cartas desejadas
- 🏪 **Marketplace** - Explore ofertas da comunidade

## 🛠️ **Tecnologias**

- **Vue 3** + **TypeScript** - Framework e tipagem
- **Tailwind CSS** + **ShadCN Vue** - UI moderna
- **Pinia** - Gerenciamento de estado
- **Zod** + **VeeValidate** - Validação de formulários
- **Vite** - Build e desenvolvimento

## 🚀 **Como executar**

### Pré-requisitos
- Node.js 18+
- npm

### Instalação
```bash
# Clone e instale
git clone https://github.com/seu-usuario/cards-marketplace.git
cd cards-marketplace
npm install

# Configure ambiente
cp .env.example .env.local
# Edite .env.local com: VITE_API_BASE_URL=https://cards-marketplace-api-2fjj.onrender.com

# Execute
npm run dev
```

### Scripts principais
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção  
npm run test:unit    # Testes unitários
npm run lint         # Verificar código
```

## 📁 **Estrutura**

```
src/
├── components/      # Componentes reutilizáveis
├── views/          # Páginas da aplicação  
├── stores/         # Estado global (Pinia)
├── services/       # Comunicação API
├── composables/    # Lógica reutilizável
├── types/          # Definições TypeScript
└── schemas/        # Validações Zod
```

## 🏗️ **Arquitetura**

Seguimos padrão de camadas limpo:
```
Components → Composables → Stores → Services → API
```

**Princípios aplicados:**
- Clean Code e SOLID
- TypeScript rigoroso (zero `any`)
- Reutilização de código
- Cache inteligente

## 🧪 **Testes**

Focar nos pontos críticos:
- ✅ Utilitários de autenticação  
- ✅ Validações Zod
- ✅ Composables principais
- ✅ Stores de negócio

```bash
npm run test:unit    # Executar testes
npm run coverage     # Relatório cobertura
```

## 🚀 **Deploy**

### Vercel (recomendado)
```bash
vercel --prod
```

### Netlify  
```bash
npm run build
# Upload pasta dist/
```

## 🤝 **Contribuindo**

1. Fork o projeto
2. Crie branch (`git checkout -b feature/minha-feature`)
3. Commit com padrão conventional (`git commit -m 'feat: minha feature'`)
4. Push (`git push origin feature/minha-feature`)
5. Abra Pull Request

## 📄 **Licença**

MIT License. Veja [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido como teste técnico INMETA**

[Vue.js](https://vuejs.org) • [ShadCN](https://ui.shadcn.com) • [Tailwind CSS](https://tailwindcss.com)