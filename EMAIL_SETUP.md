# 📧 Configuración de Email - MONDO

## 🔧 Configuración de Gmail para Nodemailer

### **1. Habilitar Autenticación de 2 Factores**
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos → ACTIVAR
3. Configura tu método de verificación (SMS, app, etc.)

### **2. Generar Contraseña de Aplicación**
1. Ve a tu cuenta de Google
2. Seguridad → Contraseñas de aplicación
3. Selecciona "Correo" y "Windows Computer"
4. Copia la contraseña generada (16 caracteres)

### **3. Variables de Entorno**
Agrega estas variables a tu archivo `.env`:

```env
# Email Configuration
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación
```

### **4. Ejemplo de Configuración**
```env
EMAIL_USER=vpp.mondo@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

## 📋 Funcionalidades Implementadas

### **✅ Email de Confirmación**
- Se envía automáticamente cuando se completa un pago
- Incluye todos los detalles de la reserva
- Contiene el código QR único
- Diseño profesional y responsive

### **✅ Email de Recordatorio** (Opcional)
- Se puede enviar 24h antes de la cita
- Recordatorio amigable con detalles

## 🎨 Características del Email

### **📧 Contenido:**
- ✅ Logo y branding de MONDO
- ✅ Detalles completos de la reserva
- ✅ Código QR único y seguro
- ✅ Instrucciones claras
- ✅ Información de contacto
- ✅ Diseño responsive

### **🔒 Seguridad:**
- ✅ Código QR único por reserva
- ✅ Solo se puede usar una vez
- ✅ Validación automática en el local

## 🚀 Probar el Sistema

### **1. Configurar Variables:**
```bash
# En server/.env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación
```

### **2. Reiniciar Servidor:**
```bash
npm start
```

### **3. Hacer una Reserva de Prueba:**
- Usa el formulario de reserva
- Completa el pago
- Verifica que llegue el email

## 📞 Soporte

Si tienes problemas con la configuración:
1. Verifica que la verificación en 2 pasos esté activada
2. Asegúrate de usar la contraseña de aplicación (no la normal)
3. Revisa los logs del servidor para errores

## 🔍 Logs Útiles

```bash
# Email enviado exitosamente
✅ Email de confirmación enviado: <message-id>

# Error en envío
❌ Error enviando email: <error-details>
``` 