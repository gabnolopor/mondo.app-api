# 📅 Integración con Google Calendar - MONDO

## 🎯 **OBJETIVO:**
- ✅ **Reservar automáticamente** 2 horas cuando se paga una cita
- ✅ **Detectar conflictos** de horarios
- ✅ **Sincronizar** con tu calendario personal
- ✅ **Mostrar disponibilidad** en tiempo real

## 🔧 **CONFIGURACIÓN DE GOOGLE CALENDAR API:**

### **1. Crear Proyecto en Google Cloud:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **Crear nuevo proyecto** o seleccionar existente
3. **Habilitar Google Calendar API**

### **2. Crear Credenciales:**
1. **APIs & Services** → **Credentials**
2. **Create Credentials** → **Service Account**
3. **Descargar JSON** con las credenciales

### **3. Configurar Variables de Entorno:**
```env
# Google Calendar
GOOGLE_CALENDAR_ID=tu-email@gmail.com
GOOGLE_SERVICE_ACCOUNT_FILE=path/to/credentials.json
```

## 📋 **FUNCIONALIDADES A IMPLEMENTAR:**

### **✅ Verificar Disponibilidad:**
```javascript
// Antes de permitir pago
const isAvailable = await checkCalendarAvailability(date, time, duration);
if (!isAvailable) {
    return res.status(400).json({ error: 'Horario no disponible' });
}
```

### **✅ Reservar Automáticamente:**
```javascript
// Después del pago exitoso
await createCalendarEvent({
    title: `${serviceName} - ${customerName}`,
    start: appointmentDateTime,
    end: appointmentDateTime + 2 hours,
    description: `QR: ${qrCode}`
});
```

### **✅ Mostrar Horarios Disponibles:**
```javascript
// En el frontend
const availableSlots = await getAvailableTimeSlots(date);
```

## 🚀 **IMPLEMENTACIÓN:**

### **1. Instalar Dependencias:**
```bash
npm install googleapis
```

### **2. Crear Controlador de Calendario:**
```javascript
// server/controller/calendar-controller.js
const { google } = require('googleapis');

const calendarController = {
    async checkAvailability(date, time, duration) {
        // Verificar si el horario está libre
    },
    
    async createAppointment(bookingData) {
        // Crear evento en Google Calendar
    },
    
    async getAvailableSlots(date) {
        // Obtener horarios disponibles
    }
};
```

### **3. Integrar con Pagos:**
```javascript
// En payments-controller.js
if (event.type === 'checkout.session.completed') {
    // ... guardar en DB ...
    
    // Crear evento en Google Calendar
    await calendarController.createAppointment(bookingData);
}
```

## 🎨 **INTERFAZ DE USUARIO:**

### **Selector de Horarios:**
- Mostrar solo horarios disponibles
- Bloquear horarios ocupados
- Selección de duración (1h, 2h, etc.)

### **Confirmación Visual:**
- Calendario interactivo
- Indicadores de disponibilidad
- Confirmación de reserva

## 🔄 **ALTERNATIVA INTERNA:**

Si prefieres no usar Google Calendar, podemos crear un sistema interno:

### **Ventajas:**
- ✅ **Sin dependencias externas**
- ✅ **Control total**
- ✅ **Más rápido**
- ✅ **Sin límites de API**

### **Implementación:**
```sql
-- Tabla de horarios
CREATE TABLE appointment_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    booking_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 **RECOMENDACIÓN:**

**Para tu caso, recomiendo Google Calendar porque:**
- ✅ **Sincronización automática** con tu agenda
- ✅ **Notificaciones** automáticas
- ✅ **Acceso móvil** desde cualquier lugar
- ✅ **Backup** en la nube
- ✅ **Integración** con otros servicios

**¿Quieres que implementemos Google Calendar o prefieres el sistema interno?** 