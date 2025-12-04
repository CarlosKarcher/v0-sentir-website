# 🔧 Configuración de Vercel KV

## ⚠️ IMPORTANTE: Debes completar esta configuración para que el contador funcione

### 📋 Paso 1: Obtener las credenciales de Vercel

1. Ve a https://vercel.com/
2. Selecciona tu proyecto: **v0-sentir-website**
3. Click en la pestaña **"Storage"**
4. Selecciona tu base de datos KV
5. Click en la pestaña **".env.local"**
6. Verás 3 variables:
   ```
   KV_REST_API_URL=https://xxxxx.kv.vercel-storage.com
   KV_REST_API_TOKEN=AxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxA
   KV_REST_API_READ_ONLY_TOKEN=Axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 📝 Paso 2: Crear el archivo .env.local

1. En la raíz del proyecto (donde está package.json)
2. Crea un nuevo archivo llamado: `.env.local`
3. Pega las 3 variables que copiaste de Vercel
4. Guarda el archivo

### 🔄 Paso 3: Reiniciar el servidor

1. En la terminal donde corre el servidor, presiona `Ctrl+C`
2. Ejecuta de nuevo: `pnpm dev`
3. Espera a que diga "Ready"

### ✅ Paso 4: Verificar

1. Abre la página: http://localhost:3000
2. Abre la consola del navegador (F12)
3. Deberías ver: `✅ Contador desde KV: 0` (o el número actual)
4. Recarga la página varias veces
5. El contador debería incrementar: 1, 2, 3, etc.

## 🐛 Si ves "Error" en el contador:

- Verifica que el archivo `.env.local` exista
- Verifica que las 3 variables estén correctamente copiadas
- Reinicia el servidor
- Revisa la consola del navegador para ver el error específico

## ❓ Ayuda

Si algo no funciona, revisa la terminal del servidor y la consola del navegador para ver los logs.

