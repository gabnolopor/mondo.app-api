# Configuración de Stripe para Ecommerce

## Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env` en el servidor:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:5173
```

## Configuración de Stripe

### 1. Crear cuenta en Stripe
- Ve a https://stripe.com
- Crea una cuenta gratuita
- Accede al Dashboard

### 2. Obtener las claves de API
- En el Dashboard, ve a "Developers" > "API keys"
- Copia la "Publishable key" (pk_test_...)
- Copia la "Secret key" (sk_test_...)

### 3. Configurar Webhook
- Ve a "Developers" > "Webhooks"
- Crea un nuevo webhook
- URL: `https://tu-dominio.com/payments/webhook`
- Eventos: `checkout.session.completed`
- Copia el "Signing secret" (whsec_...)

### 4. Configurar variables en .env
```env
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
CLIENT_URL=http://localhost:5173
```

## Para Desarrollo Local

Si estás desarrollando localmente, puedes usar las claves de prueba de Stripe:

```env
STRIPE_SECRET_KEY=sk_test_51ABC123...
STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...
STRIPE_WEBHOOK_SECRET=whsec_1234567890...
CLIENT_URL=http://localhost:5173
```

## Nota Importante

- Las claves que empiezan con `sk_test_` son para pruebas
- Las claves que empiezan con `sk_live_` son para producción
- Nunca compartas las claves secretas
- Usa siempre HTTPS en producción 