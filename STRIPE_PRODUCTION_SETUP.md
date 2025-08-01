# Configuración de Stripe para Producción

## Paso 1: Crear Cuenta en Stripe

1. **Ve a https://stripe.com**
2. **Crea una cuenta gratuita**
3. **Completa la verificación de identidad**
4. **Accede al Dashboard**

## Paso 2: Obtener las Claves de API

### En el Dashboard de Stripe:

1. **Ve a "Developers" > "API keys"**
2. **Copia la "Publishable key" (pk_live_...)**
3. **Copia la "Secret key" (sk_live_...)**
4. **Guarda estas claves de forma segura**

## Paso 3: Configurar Webhook

### En el Dashboard de Stripe:

1. **Ve a "Developers" > "Webhooks"**
2. **Crea un nuevo webhook**
3. **URL del webhook: `https://tu-dominio.com/payments/webhook`**
4. **Eventos a escuchar: `checkout.session.completed`**
5. **Copia el "Signing secret" (whsec_...)**

## Paso 4: Configurar Variables de Entorno

### En tu archivo `.env` del servidor:

```env
# Stripe Configuration (PRODUCCIÓN)
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_aqui
STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_publica_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
CLIENT_URL=https://tu-dominio.com

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=mondo

# Server Configuration
PORT=3000
```

## Paso 5: Configurar Frontend

### En tu archivo `.env` del cliente:

```env
# API Endpoints
VITE_API_MASAJES=https://tu-dominio.com/masajes
VITE_API_RITUALES=https://tu-dominio.com/rituales
VITE_API_FACIALES=https://tu-dominio.com/faciales
VITE_API_CITAS=https://tu-dominio.com/citas
VITE_API_CITASM=https://tu-dominio.com/citasm
VITE_API_CITASF=https://tu-dominio.com/citasf
VITE_API_CLIENTS=https://tu-dominio.com/clients
VITE_API_SERVICES=https://tu-dominio.com/services
VITE_API_PROFILE=https://tu-dominio.com/profile
VITE_API_ADMIN=https://tu-dominio.com/admin
VITE_API_QR=https://tu-dominio.com/qr
VITE_API_PAYMENTS=https://tu-dominio.com/payments

# Stripe Configuration (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_publica_aqui
```

## Paso 6: Verificar Configuración

### Comandos de Verificación:

```bash
# Verificar que las claves estén configuradas
echo "STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY:0:20}..."
echo "CLIENT_URL: $CLIENT_URL"

# Reiniciar servidor
npm start
```

## Paso 7: Probar el Sistema

### Flujo de Prueba:

1. **Ve a un formulario de reserva**
2. **Haz clic en "Reservar con Pago"**
3. **Completa el formulario**
4. **Serás redirigido a Stripe Checkout**
5. **Completa el pago con tarjeta de prueba**
6. **Verifica en el panel de control**

## Tarjetas de Prueba de Stripe

### Para Probar Pagos:

- **Visa:** 4242424242424242
- **Mastercard:** 5555555555554444
- **Cualquier fecha futura**
- **Cualquier CVC de 3 dígitos**

## Notas Importantes

### Seguridad:
- ✅ **Nunca compartas** las claves secretas
- ✅ **Usa HTTPS** en producción
- ✅ **Configura CORS** correctamente
- ✅ **Valida webhooks** siempre

### Monitoreo:
- 📊 **Revisa el Dashboard** de Stripe regularmente
- 📊 **Monitorea los webhooks** en el log
- 📊 **Verifica las transacciones** en tiempo real

### Soporte:
- 🆘 **Documentación:** https://stripe.com/docs
- 🆘 **Soporte:** https://support.stripe.com
- 🆘 **Comunidad:** https://community.stripe.com

## Comandos Útiles

```bash
# Verificar estado del servidor
curl http://localhost:3000/health

# Verificar webhook (reemplaza con tu URL)
curl -X POST https://tu-dominio.com/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Ver logs del servidor
tail -f logs/server.log
``` 