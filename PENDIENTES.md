# Pendientes

## Historial completo de Garmin

Estado: pendiente de la exportación completa de la cuenta.

1. Solicitar la exportación desde [Gestión de datos de Garmin](https://www.garmin.com/account/datamanagement/).
2. Descargar el archivo `.zip` que llegue por correo.
3. Añadir el archivo a esta carpeta sin descomprimirlo.
4. Integrar todas las carreras desde 2016 en `app.js` para que el sitio las muestre al abrirse.

El archivo actual solo contiene 20 actividades entre abril y agosto de 2026.

## Sincronización automática con Garmin

Estado: pendiente de decidir si se construye una segunda fase.

La web publicada en GitHub Pages es estática y no puede almacenar claves privadas. Para sincronizar Garmin automáticamente será necesario:

1. Solicitar acceso al programa para desarrolladores de Garmin Connect.
2. Crear un servicio privado que reciba las actividades autorizadas.
3. Conectar ese servicio con la web pública mediante un archivo de datos actualizado.

No guardar contraseñas ni claves de Garmin en el repositorio de GitHub.
