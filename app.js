const clave = "mi-running-actividades";
let actividades;

const campo = (fila, candidatos) => {
  const llaves = Object.keys(fila);
  const llave = llaves.find((nombre) => candidatos.some((candidato) => nombre.toLowerCase().replace(/[^a-záéíóúñ]/g, "").includes(candidato)));
  return llave ? fila[llave] : "";
};

const numero = (valor) => {
  const limpio = String(valor ?? "").trim().replace(/\s/g, "").replace(",", ".");
  const resultado = Number.parseFloat(limpio.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(resultado) ? resultado : 0;
};

const segundos = (valor) => {
  if (typeof valor === "number") return valor;
  const partes = String(valor ?? "").trim().split(":").map(Number);
  if (partes.length === 3 && partes.every(Number.isFinite)) return partes[0] * 3600 + partes[1] * 60 + partes[2];
  if (partes.length === 2 && partes.every(Number.isFinite)) return partes[0] * 60 + partes[1];
  return numero(valor) * 60;
};

const carrerasIniciales = [
  ["2026-08-30T11:12:01", 5.19, "00:30:04"], ["2026-08-28T08:19:58", 4.23, "00:30:01"],
  ["2026-08-27T10:25:04", 3.40, "00:20:00"], ["2026-08-25T16:07:35", 4.35, "00:30:01"],
  ["2026-08-21T09:33:19", 3.59, "00:26:01"], ["2026-08-15T09:15:04", 1.68, "00:10:21"],
  ["2026-08-14T07:38:46", 1.42, "00:10:02"], ["2026-08-13T07:36:00", 2.48, "00:15:01"],
  ["2026-08-05T08:15:35", 2.73, "00:20:42"], ["2026-08-01T11:11:56", 2.83, "00:22:01"],
  ["2026-07-22T10:26:39", 3.75, "00:25:03"], ["2026-07-14T16:43:11", 3.00, "00:25:38"],
  ["2026-04-21T09:19:08", 4.03, "00:35:02"], ["2026-04-01T10:11:32", 1.58, "00:10:29"]
].map(([fecha, distancia, tiempo]) => {
  const duracion = segundos(tiempo);
  return { id: `${fecha}-${distancia}-${duracion}-Carrera`, fecha: new Date(fecha).toISOString(), nombre: "Carrera", distancia, duracion, ritmo: duracion / distancia };
});

const datosGuardados = localStorage.getItem(clave);
actividades = datosGuardados ? JSON.parse(datosGuardados) : carrerasIniciales;

const formatoTiempo = (total) => {
  const horas = Math.floor(total / 3600); const minutos = Math.round((total % 3600) / 60);
  return `${horas ? `${horas} h ` : ""}${minutos} min`;
};
const formatoRitmo = (segundosPorKm) => {
  if (!Number.isFinite(segundosPorKm) || segundosPorKm <= 0) return "—";
  return `${Math.floor(segundosPorKm / 60)}:${String(Math.round(segundosPorKm % 60)).padStart(2, "0")} /km`;
};
const fecha = (valor) => {
  const resultado = new Date(valor);
  return Number.isNaN(resultado) ? null : resultado;
};

function leerCsv(texto) {
  const lineas = texto.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const separador = lineas[0]?.includes(";") ? ";" : ",";
  const dividir = (linea) => {
    const valores = []; let valor = ""; let comillas = false;
    for (const caracter of linea) {
      if (caracter === '"') comillas = !comillas;
      else if (caracter === separador && !comillas) { valores.push(valor.trim()); valor = ""; }
      else valor += caracter;
    }
    valores.push(valor.trim()); return valores.map((item) => item.replace(/^"|"$/g, ""));
  };
  const cabeceras = dividir(lineas.shift());
  return lineas.map(dividir).map((valores) => Object.fromEntries(cabeceras.map((cabecera, i) => [cabecera, valores[i] ?? ""])));
}

function normalizar(fila) {
  const distancia = numero(campo(fila, ["distance", "distancia"]));
  const duracion = segundos(campo(fila, ["duration", "duración", "tiempo", "elapsedtime", "movingtime"]));
  const fechaTexto = campo(fila, ["date", "fecha", "started"]);
  const fechaActividad = fecha(fechaTexto);
  const tipo = campo(fila, ["activitytype", "tipoactividad", "activity", "actividad"]) || "Carrera";
  return {
    id: `${fechaTexto}-${distancia}-${duracion}-${tipo}`,
    fecha: fechaActividad ? fechaActividad.toISOString() : "",
    nombre: tipo,
    esCarrera: tipo.toLocaleLowerCase("es").includes("carrera"),
    distancia, duracion,
    ritmo: distancia ? duracion / distancia : 0
  };
}

function inicioSemana(dia) {
  const fecha = new Date(dia); const diferencia = (fecha.getDay() + 6) % 7;
  fecha.setDate(fecha.getDate() - diferencia); fecha.setHours(0, 0, 0, 0); return fecha;
}

function renderizar() {
  actividades.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const km = actividades.reduce((suma, actividad) => suma + actividad.distancia, 0);
  const tiempo = actividades.reduce((suma, actividad) => suma + actividad.duracion, 0);
  document.querySelector("#kilometros").textContent = `${km.toLocaleString("es-CO", { maximumFractionDigits: 1 })} km`;
  document.querySelector("#tiempo").textContent = formatoTiempo(tiempo);
  document.querySelector("#ritmo").textContent = formatoRitmo(km ? tiempo / km : 0);
  document.querySelector("#sesiones").textContent = actividades.length;
  const cuerpo = document.querySelector("#actividades");
  cuerpo.innerHTML = actividades.length ? actividades.slice(0, 12).map((actividad) => `<tr><td>${actividad.fecha ? new Date(actividad.fecha).toLocaleDateString("es-CO") : "—"}</td><td>${actividad.nombre}</td><td>${actividad.distancia.toFixed(2)} km</td><td>${formatoTiempo(actividad.duracion)}</td><td>${formatoRitmo(actividad.ritmo)}</td></tr>`).join("") : '<tr><td colspan="5" class="vacio">Aún no hay actividades. Importa tu primer CSV.</td></tr>';
  const ahora = inicioSemana(new Date());
  const semanas = Array.from({ length: 8 }, (_, indice) => { const inicio = new Date(ahora); inicio.setDate(inicio.getDate() - (7 * (7 - indice))); return { inicio, km: 0 }; });
  actividades.forEach((actividad) => semanas.forEach((semana) => { const fin = new Date(semana.inicio); fin.setDate(fin.getDate() + 7); if (actividad.fecha && new Date(actividad.fecha) >= semana.inicio && new Date(actividad.fecha) < fin) semana.km += actividad.distancia; }));
  const maximo = Math.max(...semanas.map((semana) => semana.km), 1);
  document.querySelector("#semanas").innerHTML = semanas.map((semana) => `<div class="semana"><div class="barra-zona"><div class="barra" style="height:${(semana.km / maximo) * 100}%"></div></div><b>${semana.km.toFixed(1)}</b><span>${semana.inicio.toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}</span></div>`).join("");
}

document.querySelector("#archivo").addEventListener("change", async (evento) => {
  const archivo = evento.target.files[0]; if (!archivo) return;
  const filas = leerCsv(await archivo.text());
  const nuevas = filas.map(normalizar).filter((actividad) => actividad.esCarrera && actividad.distancia > 0 && actividad.duracion > 0);
  if (!nuevas.length) { document.querySelector("#mensaje").textContent = "No encontré filas con distancia y duración. Envíame una muestra del CSV para adaptarlo."; return; }
  const idsExistentes = new Set(actividades.map((actividad) => actividad.id));
  const sinDuplicados = nuevas.filter((actividad) => !idsExistentes.has(actividad.id));
  actividades = [...actividades, ...sinDuplicados]; localStorage.setItem(clave, JSON.stringify(actividades));
  document.querySelector("#mensaje").textContent = sinDuplicados.length ? `Se añadieron ${sinDuplicados.length} carreras.` : "Estas carreras ya estaban importadas."; renderizar(); evento.target.value = "";
});
document.querySelector("#borrar").addEventListener("click", () => { if (confirm("¿Restablecer las carreras incluidas en la web? Se eliminarán las importaciones adicionales.")) { actividades = [...carrerasIniciales]; localStorage.removeItem(clave); document.querySelector("#mensaje").textContent = "Datos restablecidos."; renderizar(); } });
renderizar();
