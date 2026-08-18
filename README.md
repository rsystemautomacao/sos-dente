# SOS Dente - PWA

Simulador de primeiros socorros para trauma dentário em React + TypeScript.

## 🚀 Funcionalidades

- **Wizard de Avaliação**: Guia passo a passo para diferentes tipos de trauma
- **FAQ Interativo**: Busca por palavra-chave e respostas rápidas
- **E-book Online**: Visualizador PDF integrado
- **Geolocalização**: Encontra dentistas próximos
- **Armazenamento Local**: Salva ocorrências no IndexedDB
- **PWA Completo**: Funciona offline, instalável

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **React Router** (navegação)
- **Zustand** (gerenciamento de estado)
- **IndexedDB** (armazenamento local)
- **Tabler Icons** (ícones)
- **React Hot Toast** (notificações)
- **PWA Plugin** (service worker, manifest)

## 📦 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd sos-dente-pwa

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🎯 Como Usar

### Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000`

### Produção
```bash
npm run build
npm run preview
```

## 📱 PWA

O aplicativo é um PWA completo com:

- **Service Worker**: Cache de assets e páginas
- **Manifest**: Configuração para instalação
- **Offline**: Funciona sem internet
- **Instalável**: Pode ser adicionado à tela inicial

### Configuração PWA

Para personalizar o PWA, edite `vite.config.ts`:

```typescript
VitePWA({
  manifest: {
    name: 'SOS Dente - Primeiros Socorros Odontológicos',
    short_name: 'SOS Dente',
    // ... outras configurações
  }
})
```

## 📄 E-book

Para trocar o PDF do e-book:

1. Coloque o arquivo PDF em `/public/ebook-amanda-vidal.pdf`
2. O arquivo será automaticamente servido e cacheado

### Estrutura de Arquivos

```
/public/
  ├── ebook-amanda-vidal.pdf    # E-book principal
  ├── favicon.ico              # Favicon
  ├── pwa-192x192.png         # Ícone PWA 192x192
  └── pwa-512x512.png         # Ícone PWA 512x512
```

## 🎨 Design System

### Paleta de Cores
- **Primária**: `#3b82f6` (azul)
- **Secundária**: `#f8fafc` (bege claro)
- **Acento**: `#f59e0b` (laranja)
- **Sucesso**: `#10b981` (verde)
- **Erro**: `#ef4444` (vermelho)

### Tipografia
- **Família**: Inter
- **Tamanhos**: 12px a 36px
- **Peso**: 400, 500, 600, 700

### Espaçamento
- **Sistema 8-pt**: 8px, 16px, 24px, 32px, etc.

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Header.tsx
│   ├── SOSButton.tsx
│   └── Stepper.tsx
├── pages/               # Páginas principais
│   ├── Home.tsx
│   ├── Wizard.tsx
│   ├── FAQ.tsx
│   ├── Ebook.tsx
│   └── wizard/          # Etapas do wizard
│       ├── AgeStep.tsx
│       ├── GenderStep.tsx
│       ├── ToothTypeStep.tsx
│       ├── TraumaTypeStep.tsx
│       ├── TraumaQuestionsStep.tsx
│       ├── ResultStep.tsx
│       ├── DataCollectionStep.tsx
│       └── MapsStep.tsx
├── services/            # Serviços externos
│   ├── maps.ts          # Geolocalização
│   └── db.ts            # IndexedDB
├── store/               # Gerenciamento de estado
│   └── useWizardStore.ts
├── data/                # Dados estáticos
│   └── faq.pt-BR.json
├── App.tsx              # Componente principal
├── main.tsx             # Entry point
└── index.css            # Estilos globais
```

## 🔧 Configurações

### TypeScript
- Configurado com `strict: true`
- Linting automático
- Tipos para todas as APIs

### Vite
- Build otimizado
- HMR (Hot Module Replacement)
- PWA plugin integrado

### ESLint
- Regras para React + TypeScript
- Prevenção de bugs comuns

## 📊 Performance

### Lighthouse Score
- **Performance**: ≥90
- **Accessibility**: ≥90
- **Best Practices**: ≥90
- **SEO**: ≥90

### Otimizações
- Code splitting automático
- Lazy loading de componentes
- Cache de assets
- Service worker para offline

## 🌐 Acessibilidade

- **ARIA labels** em todos os elementos interativos
- **Navegação por teclado** completa
- **Contraste AA** em todas as cores
- **prefers-reduced-motion** respeitado
- **Screen readers** compatível

## 📱 Responsividade

- **Mobile-first** design
- **Breakpoints**: 640px, 768px, 1024px
- **Touch-friendly** botões (48px mínimo)
- **Viewport** otimizado

## 🔒 Segurança

- **HTTPS** obrigatório para PWA
- **CSP** (Content Security Policy)
- **Sanitização** de inputs
- **Validação** de dados

## 🚨 Funcionalidades de Emergência

### Botão SOS
- **Posição**: Canto inferior direito
- **Ação**: Liga para SAMU (192)
- **Animação**: Pulsante para chamar atenção

### Geolocalização
- **Permissão**: Solicita automaticamente
- **Fallback**: Google Maps genérico
- **Timeout**: 10 segundos

## 💾 Armazenamento

### IndexedDB
- **Tabela**: `occurrences`
- **Campos**: data/hora, idade, sexo, tipo trauma, local, observações
- **CRUD**: Completo (Create, Read, Update, Delete)

### Cache
- **Assets**: CSS, JS, imagens
- **Páginas**: HTML estático
- **PDF**: E-book quando acessado

## 🎯 Fluxo do Wizard

1. **Idade**: Criança (0-11) / Adolescente (12-17)
2. **Sexo**: Feminino / Masculino / Prefiro não informar
3. **Tipo Trauma**: Fratura / Avulsão / Luxação
4. **Instruções**: Contextuais por tipo
5. **Armazenamento**: Leite / Soro / Saliva
6. **Encaminhamento**: Formulário + ações

## 📚 FAQ

### Busca
- **Palavras-chave** em perguntas e respostas
- **Filtro em tempo real**
- **Tags** para categorização

### Conteúdo
- 8 perguntas principais
- Respostas detalhadas
- Links para e-book

## 📖 E-book

### Visualizador
- **PDF.js** integrado
- **Fallback** para download
- **Loading states**

### Download
- **Arquivo estático** em `/public`
- **Nome personalizado**
- **Cache automático**

## 🐛 Troubleshooting

### Problemas Comuns

**PWA não instala**
- Verifique HTTPS
- Confirme manifest válido
- Teste service worker

**Geolocalização não funciona**
- Permissão negada
- HTTPS obrigatório
- Timeout configurado

**PDF não carrega**
- Arquivo existe em `/public`
- Nome correto: `ebook-amanda-vidal.pdf`
- CORS configurado

### Logs
```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 👥 Autores

- **Amanda Vidal** - Conteúdo odontológico
- **Desenvolvedor** - Implementação técnica

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação
- Verifique o FAQ integrado

---

**SOS Dente** - Primeiros Socorros Odontológicos 🦷
