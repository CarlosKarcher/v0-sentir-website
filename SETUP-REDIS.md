# 🔧 Configuración de Serverless Redis

## ✅ CONFIGURACIÓN COMPLETADA

El contador de visitas global está configurado y listo para usar con **Serverless Redis**.

### 📊 Estado actual:

- ✅ Cliente Redis instalado (`ioredis`)
- ✅ Archivo `.env.local` creado con la URL de Redis
- ✅ API configurada para usar Serverless Redis
- ✅ Contador inicializado en 0

### 🔄 Reiniciar el servidor

Para que los cambios surtan efecto:

1. En la terminal donde corre el servidor, presiona `Ctrl+C`
2. Ejecuta de nuevo: `pnpm dev`
3. Espera a que diga "Ready"

### ✅ Verificar funcionamiento

1. Abre la página: http://localhost:3000
2. Abre la consola del navegador (F12)
3. Deberías ver en la consola: `✅ GET contador desde Redis: 0` (o el número actual)
4. Recarga la página varias veces
5. El contador debería incrementar: 1, 2, 3, etc.
6. En la terminal del servidor verás: `✅ POST - Visita incrementada. Total: X`

### 🌐 En producción (Vercel)

Los cambios ya están en el repositorio. Cuando hagas deploy a Vercel:

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Agrega la variable: `REDIS_URL` con el valor de tu Serverless Redis
4. Haz redeploy del proyecto

### 🐛 Si ves "Error" en el contador:

- Verifica que el archivo `.env.local` exista en la raíz del proyecto
- Verifica que la variable `REDIS_URL` esté correctamente escrita
- Reinicia el servidor
- Revisa la consola del navegador y la terminal del servidor para ver logs específicos

### 📝 Configuración actual:

```env
REDIS_URL="redis://default:2UfHuxpPPSJq39ZAgLoYtkSyayR3fdaU@redis-12308.c10.us-east-1-3.ec2.cloud.redislabs.com:12308"
```

## ✨ Características del contador:

- ✅ **Global**: Todos los usuarios ven el mismo número
- ✅ **Persistente**: Se mantiene entre deploys y reinicios
- ✅ **Atómico**: Las operaciones son thread-safe
- ✅ **Rápido**: Redis es extremadamente rápido
- ✅ **Consistente**: Incrementa correctamente sin duplicados

