# 🔗 Configuración de Webhooks de Stripe - MONDO

## 🔧 Problema Identificado

El pago se procesa correctamente, pero **no llegan los webhooks** de Stripe, por lo que:
- ❌ No se guarda la reserva en la base de datos
- ❌ No se envía el email de confirmación
- ❌ No se genera el código QR

## 🚀 Solución: Configurar Webhook en Stripe

### **1. Acceder al Dashboard de Stripe**
1. Ve a [dashboard.stripe.com](https://dashboard.stripe.com)
2. Inicia sesión con tu cuenta
3. Ve a **Developers** → **Webhooks**

### **2. Crear Nuevo Webhook**
1. Haz clic en **"Add endpoint"**
2. **Endpoint URL:** `https://tu-dominio.com/payments/webhook`
   - Para desarrollo local: `http://localhost:3000/payments/webhook`
   - Para producción: `https://mondo.com.es/payments/webhook`
3. **Events to send:** Selecciona `checkout.session.completed`
4. Haz clic en **"Add endpoint"**

### **3. Obtener Webhook Secret**
1. En la lista de webhooks, haz clic en el que acabas de crear
2. Ve a **"Signing secret"**
3. Haz clic en **"Reveal"**
4. Copia el secret (empieza con `whsec_`)

### **4. Configurar Variables de Entorno**
```env
# En server/.env
STRIPE_WEBHOOK_SECRET=whsec...
```

## 🔍 Verificar Configuración

### **1. Probar Webhook Localmente**
```bash
# Instalar Stripe CLI
stripe listen --forward-to localhost:3000/payments/webhook
```

### **2. Verificar Logs**
Después de un pago exitoso, deberías ver:
```bash
🔧 Webhook recibido
🔧 Stripe signature: Presente
✅ Webhook verificado: checkout.session.completed
✅ Pago completado: cs_test_...
✅ Reserva pagada guardada exitosamente en DB
📧 Enviando email con datos: {...}
✅ Email de confirmación enviado exitosamente
```

## 🛠️ Troubleshooting

### **Si no llegan webhooks:**
1. ✅ Verifica que la URL del webhook sea correcta
2. ✅ Asegúrate de que el servidor esté accesible desde internet
3. ✅ Verifica que el webhook secret esté configurado
4. ✅ Revisa los logs del servidor para errores

### **Si hay errores de firma:**
1. ✅ Verifica que el `STRIPE_WEBHOOK_SECRET` sea correcto
2. ✅ Asegúrate de que no haya espacios extra
3. ✅ Reinicia el servidor después de cambiar la variable

### **Para desarrollo local:**
```bash
# Usar ngrok para exponer localhost
ngrok http 3000

# Luego usar la URL de ngrok en Stripe
# https://abc123.ngrok.io/payments/webhook
```

## 📧 Configuración de Email

También asegúrate de tener configurado el email:
```env
EMAIL_USER=vpp.mondo@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación
```

## 🎯 Resultado Esperado

Una vez configurado correctamente:
1. **Cliente paga** → Stripe procesa el pago
2. **Webhook llega** → Se guarda la reserva en DB
3. **Email se envía** → Con QR y detalles
4. **QR se genera** → Para canjear en el local

**¿Necesitas ayuda configurando el webhook en Stripe?** 
