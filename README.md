# 🐎 EQUINOS

App para el criador 46 (SRA) – Caballo de Destreza Gaucha – eventos de jineteada ACCDG.

- Fichas de equinos (RP, SBA, nacimiento, pelaje, padres, propietarios, estado).
- Árbol genealógico (padres y abuelos) e hijos en el plantel.
- Carga de participaciones en eventos: fecha, evento, rueda (basto, grupa, crina, cuero tendido…), montador, resultado e importe cobrado.
- Resumen de ingresos por evento, por equino y por rueda.
- Administradores y operarios; cada operario ve solo lo que el administrador le habilita.
- Funciona sin internet: lo cargado se guarda en el dispositivo y se sube solo cuando vuelve la señal, sin pisar ni duplicar lo que cargaron otros.

## Archivos

| Archivo | Para qué |
|---|---|
| `Equinos.html` | La app completa (incluye los 83 equinos de la planilla SRA). |
| `sw.js` | Permite abrir la app sin señal. |
| `manifest.json` + `icon-*.png` | Para instalarla en el teléfono con el ícono del caballo. |
| `database.rules.json` | Reglas de la base de datos **sin fecha de vencimiento**. |

## Cómo subirla a GitHub (igual que Stock Ganadero)

1. En GitHub: **New repository** → nombre `equinos` → **Public** → *Create repository*.
2. **Add file → Upload files**: arrastrar los 7 archivos de esta carpeta → **Commit changes**.
3. **Settings → Pages → Branch: `main` / (root) → Save**.
4. En un minuto la app queda en `https://dorlychiattellino-wq.github.io/equinos/Equinos.html`.
5. En el teléfono: abrir esa dirección en Chrome → menú ⋮ → **Agregar a pantalla de inicio**.

Para actualizar la app más adelante: subir el `Equinos.html` y el `sw.js` nuevos de la misma forma. Los teléfonos avisan "Hay una versión nueva".

## Base de datos y reglas sin vencimiento

La app usa el mismo proyecto de Firebase que Stock Ganadero (`stock-ganadero-48715`), pero guarda todo aparte, en la rama `equinos/`. No se mezcla nada con el ganado.

Para que las reglas **nunca venzan**:

1. Entrar a https://console.firebase.google.com → proyecto **stock-ganadero** → **Realtime Database** → pestaña **Reglas**.
2. Si aparece algo como `"now < 1735689600000"` o una fecha, borrar todo y pegar el contenido de `database.rules.json`:
   ```json
   { "rules": { ".read": true, ".write": true } }
   ```
3. **Publicar**.

Esas reglas no tienen fecha, así que no vuelven a vencer. (La protección de acceso la hace la propia app con sus usuarios y claves.)

## Primer uso

1. Abrir la app: pide crear el **administrador principal** (nombre + clave).
2. Al crearlo se cargan solos los 83 equinos de la planilla SRA.
3. En **👥 Usuarios** agregar operarios y marcarles qué pueden ver/cargar.
