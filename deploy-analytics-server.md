# 🚀 Deploy do Servidor de Analytics - SOS Dente

## 📋 Pré-requisitos
- Conta no Vercel (gratuito)
- MongoDB Atlas configurado

## 🔧 Passos para Deploy

### 1. Preparar o Servidor
```bash
# Criar pasta para o servidor
mkdir sos-dente-analytics-server
cd sos-dente-analytics-server

# Copiar arquivos
cp -r ../sos-dente-analytics-server/* .
```

### 2. Configurar Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login no Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Configurar Variáveis de Ambiente no Vercel
- `MONGODB_URI`: mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/?retryWrites=true&w=majority (definir no painel da Vercel, nunca no código)

### 4. Configurar Domínio (Opcional)
- Adicionar domínio personalizado: `api.sos-dente.com`

## 🌐 URLs de Produção
- **API**: https://sos-dente-analytics.vercel.app/api/analytics/events
- **Health Check**: https://sos-dente-analytics.vercel.app/health

## 📱 Configuração do App
O app já está configurado para usar:
- **Dev**: http://localhost:3001
- **Prod**: https://api.sos-dente.com (ou URL do Vercel)

## ✅ Teste de Produção
1. Deploy do servidor
2. Deploy do app
3. Testar com 2 dispositivos diferentes
4. Verificar se dados aparecem no dashboard

## 🔍 Monitoramento
- Logs no Vercel Dashboard
- MongoDB Atlas para dados
- Health check: `/health`
