#!/usr/bin/env node

const stripe = require('stripe');
require('dotenv').config();

console.log('🔧 Verificando configuración de Stripe...\n');

// Verificar variables de entorno
console.log('📋 Variables de Entorno:');
console.log(`STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 20) + '...' : 'NO CONFIGURADA'}`);
console.log(`STRIPE_PUBLISHABLE_KEY: ${process.env.STRIPE_PUBLISHABLE_KEY ? process.env.STRIPE_PUBLISHABLE_KEY.substring(0, 20) + '...' : 'NO CONFIGURADA'}`);
console.log(`STRIPE_WEBHOOK_SECRET: ${process.env.STRIPE_WEBHOOK_SECRET ? process.env.STRIPE_WEBHOOK_SECRET.substring(0, 20) + '...' : 'NO CONFIGURADA'}`);
console.log(`CLIENT_URL: ${process.env.CLIENT_URL || 'NO CONFIGURADA'}\n`);

// Verificar si Stripe está configurado
if (!process.env.STRIPE_SECRET_KEY) {
    console.log('❌ STRIPE_SECRET_KEY no está configurada');
    console.log('💡 Agrega tu clave secreta de Stripe al archivo .env');
    process.exit(1);
}

try {
    // Inicializar Stripe
    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
    
    console.log('🔧 Probando conexión con Stripe...');
    
    // Hacer una llamada de prueba
    stripeInstance.customers.list({ limit: 1 }).then(() => {
        console.log('✅ Conexión con Stripe exitosa');
        console.log('✅ Clave de API válida');
        
        // Verificar si es modo prueba o producción
        const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');
        console.log(`📊 Modo: ${isTestMode ? 'PRUEBA' : 'PRODUCCIÓN'}`);
        
        if (isTestMode) {
            console.log('⚠️  Estás usando claves de PRUEBA');
            console.log('💡 Para producción, usa claves que empiecen con sk_live_');
        } else {
            console.log('✅ Estás usando claves de PRODUCCIÓN');
        }
        
        console.log('\n🎉 Configuración de Stripe correcta!');
        console.log('🚀 Puedes iniciar el servidor con: npm start');
        
    }).catch((error) => {
        console.log('❌ Error de conexión con Stripe:');
        console.log(`   ${error.message}`);
        console.log('\n💡 Verifica que tu clave de API sea correcta');
        process.exit(1);
    });
    
} catch (error) {
    console.log('❌ Error inicializando Stripe:');
    console.log(`   ${error.message}`);
    process.exit(1);
}

// Verificar configuración adicional
console.log('\n📋 Verificación Adicional:');

if (!process.env.CLIENT_URL) {
    console.log('⚠️  CLIENT_URL no está configurada');
    console.log('💡 Agrega CLIENT_URL=https://tu-dominio.com al .env');
} else {
    console.log('✅ CLIENT_URL configurada');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('⚠️  STRIPE_WEBHOOK_SECRET no está configurada');
    console.log('💡 Configura el webhook en el dashboard de Stripe');
} else {
    console.log('✅ STRIPE_WEBHOOK_SECRET configurada');
}

console.log('\n📚 Recursos útiles:');
console.log('   📖 Documentación: https://stripe.com/docs');
console.log('   🆘 Soporte: https://support.stripe.com');
console.log('   🧪 Tarjetas de prueba: https://stripe.com/docs/testing'); 