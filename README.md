# Pablonio babilonio

Aplicación local para consultar actividades exportadas desde Garmin Connect.

Las 14 carreras del archivo disponible están integradas en la aplicación y se muestran al abrirla. No hace falta importar nada para ver ese resumen.

Los próximos pasos están anotados en [PENDIENTES.md](PENDIENTES.md).

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `pablonio-babilonio`.
2. Sube el contenido de esta carpeta al repositorio. `index.html` debe quedar en la raíz.
3. En GitHub abre **Settings** → **Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**, la rama `main` y la carpeta `/(root)`.
5. Guarda los cambios. GitHub mostrará la dirección pública del sitio en esa pantalla.

El archivo `.gitignore` evita que `datos/Activities.csv` se suba mediante Git. No lo selecciones si subes archivos manualmente desde la web de GitHub: contiene tus datos personales. Aunque no se publica el CSV, las actividades integradas en el panel se podrán consultar en el código público del sitio.

## Abrir la aplicación

Haz doble clic en `index.html`. Se abrirá en tu navegador.

## Importar datos de Garmin

1. Exporta tus actividades en formato CSV desde Garmin Connect.
2. Pulsa **Elegir CSV** en la aplicación y selecciona el archivo.
3. La aplicación importa solamente las actividades cuyo tipo sea **Carrera** y calcula kilómetros, tiempo, ritmo y volumen semanal.

Los datos quedan guardados solamente en el almacenamiento local del navegador. El botón **Borrar datos** elimina ese almacenamiento.

## Siguiente mejora

Comparte una muestra del CSV de Garmin, sin datos que no quieras mostrar, para comprobar los nombres exactos de sus columnas. Con ello podemos añadir métricas como desnivel, frecuencia cardíaca, cadencia, objetivos y gráficos de evolución.
