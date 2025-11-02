# Guía de Despliegue en Netlify

## Opción 1: Deploy Manual (Más Rápido)

### Paso 1: Hacer build del proyecto
```bash
npm run build
```

Esto creará una carpeta `dist` con los archivos estáticos.

### Paso 2: Subir a Netlify
1. Ve a [app.netlify.com](https://app.netlify.com)
2. Inicia sesión o crea una cuenta
3. Arrastra y suelta la carpeta `dist` en la zona de deploy de Netlify

### Paso 3: Configurar dominio (Opcional)
Netlify te dará una URL automática tipo: `random-name-123.netlify.app`
- Puedes cambiar el nombre en: Site settings > Change site name
- Puedes agregar un dominio personalizado si lo tienes

## Opción 2: Deploy desde Git (Recomendado - Auto-deploy)

### Paso 1: Subir código a Git
```bash
git add .
git commit -m "Preparado para deploy en Netlify"
git push origin main
```

### Paso 2: Conectar con Netlify
1. Ve a [app.netlify.com](https://app.netlify.com)
2. Click en "Add new site" > "Import an existing project"
3. Conecta con GitHub/GitLab/Bitbucket
4. Selecciona tu repositorio

### Paso 3: Configurar Build Settings
Netlify detectará automáticamente Vite, pero verifica:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18 (o superior)

### Paso 4: Variables de Entorno (Si las necesitas)
Si usas variables de entorno:
1. Ve a Site settings > Environment variables
2. Agrega:
   - `VITE_API_BASE_URL` (si es necesario)
   - `VITE_DISABLE_AUTH` (si es necesario)

## Opción 3: Netlify CLI (Desde terminal)

### Paso 1: Instalar Netlify CLI
```bash
npm install -g netlify-cli
```

### Paso 2: Login
```bash
netlify login
```

### Paso 3: Inicializar sitio
```bash
netlify init
```

### Paso 4: Deploy
```bash
npm run build
netlify deploy --prod
```

## Verificar que funciona

Después del deploy:
1. ✅ La landing page (`/`) debe cargar
2. ✅ La política de privacidad (`/privacy-policy`) debe funcionar
3. ✅ El login (`/login`) debe funcionar
4. ✅ Las rutas deben funcionar sin errores 404

## Notas importantes

- El archivo `netlify.toml` ya está configurado para manejar el routing de React Router
- El archivo `public/_redirects` también está configurado como respaldo
- Las imágenes deben estar en la carpeta `public/` (ej: `public/gym-image.jpg`)
- Si tienes problemas, revisa los logs en Netlify Dashboard > Deploys

## URL de la Política de Privacidad

Una vez desplegado, tu URL de política de privacidad será:
```
https://tu-sitio.netlify.app/privacy-policy
```

O si tienes dominio personalizado:
```
https://tudominio.com/privacy-policy
```

Esta es la URL que debes usar en el App Dashboard de Meta.

