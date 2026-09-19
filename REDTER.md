# REDTER — Plataforma de gestión territorial y relacionamiento comunitario

Documento maestro del proyecto: propuesta de producto, módulos priorizados, esquema
de base de datos, diseño y stack técnico.

> **Nota de esta revisión:** el código del repositorio ya avanzó con un stack distinto
> al planeado originalmente (Express + React/Vite + Drizzle en vez de Next.js + Prisma +
> NextAuth). Este documento se actualizó para reflejar lo que **realmente existe** en el
> repo a la fecha, y marca explícitamente lo que sigue pendiente o requiere decisión.
>
> **Actualización posterior:** se implementaron los tres módulos priorizados de la
> sección 4 sobre el stack real (login por cédula con validación de contraseña, CRUD
> completo de usuarios, y la paleta de colores de la sección 3 aplicada en login/
> dashboard/usuarios). El detalle de qué quedó hecho y qué sigue pendiente está marcado
> en cada sección.

---

## 1. Descripción del proyecto

**REDTER** es una plataforma inteligente de gestión territorial y relacionamiento
comunitario que permite organizar personas, territorio, información, seguimientos,
reuniones y agenda en un solo lugar.

**Significado del nombre:**
- **RED** → conexión entre personas, líderes y equipos
- **TER** → territorio

Proyecto desarrollado bajo DevSoluciones (devsoluciones.com).

> ✅ **Resuelto:** `package.json` (raíz y `client/`), el `<title>` del cliente y el
> health check (`/health`) ya usan el nombre `REDTER` de forma consistente.
>
> ⚠️ **Pendiente menor:** el nombre de la base de datos por defecto sigue siendo
> `sige_electoral` (`.env.example`, `drizzle.config.ts`) — se dejó así para no romper
> una configuración ya existente en Hostinger; renombrarlo es una decisión de infraestructura,
> no de código.

---

## 2. Stack técnico

### 2.1 Stack planeado originalmente (referencia histórica)

| Capa | Tecnología |
|---|---|
| Framework | Next.js (App Router) |
| ORM | Prisma |
| Autenticación | NextAuth |
| Tiempo real | Socket.io |

### 2.2 Stack real implementado en el repo (estado actual)

| Capa | Tecnología | Notas |
|---|---|---|
| Backend | Node.js + Express | API REST bajo `/api/v1/*`, TypeScript (`src/server.ts`) |
| Frontend | React + Vite (SPA) | proyecto separado en `client/`, **no** es Next.js |
| ORM | Drizzle ORM | `src/db/schema.ts`, `drizzle.config.ts` — dialecto `mysql` |
| Base de datos | MySQL / MariaDB 10.5 | vía `mysql2`, pool configurado en `src/db/index.ts` |
| Autenticación | JWT (`jsonwebtoken`) + `bcryptjs` | no es NextAuth |
| Tiempo real | ❌ No implementado | Socket.io no está en las dependencias ni en el código |
| UI | React + Tailwind CSS | responsive; paleta de colores **no coincide** con la sección 3 (ver nota) |
| Mapas | ❌ No implementado | Leaflet/OSM no están integrados aún |
| Mensajería | ❌ No implementado | sin integración de WhatsApp/SMS/email todavía |

> ⚠️ **Decisión pendiente:** confirmar si el cambio de Next.js/Prisma/NextAuth a
> Express/Vite/Drizzle/JWT fue una decisión deliberada (y por tanto la sección 2.1 debe
> eliminarse) o si el desarrollo se desvió del plan y debe corregirse.
>
> La restricción de "un solo proceso Node.js persistente" (sin Redis externo, sin
> serverless) sigue siendo válida y compatible con el stack actual: Express corre
> persistente y puede montar Socket.io en el mismo proceso cuando se implemente.

### Hosting y despliegue
- Hostinger, plan Ilimitado — soporta Node.js como app persistente (no serverless)
- Dominio: `redter.devsoluciones.com` (subdominio de devsoluciones.com, mismo hPanel)
- Despliegue vía GitHub: hPanel conecta el repo, build con `npm run build`
- Restricción clave: todo debe correr en **un solo proceso Node.js persistente** —
  nada de Redis externo ni funciones serverless de corta duración
- Estado: ✅ **desplegado y en producción** en `https://redter.devsoluciones.com` — Node.js
  vía el importador de GitHub de hPanel (rama `main`, Node 22.x, `dist/server.js` como
  archivo de entrada), con MySQL real conectado (`u395420986_redter`). Ver notas de
  despliegue abajo para los ajustes específicos de Hostinger que hicieron falta.

> 📋 **Notas del despliegue real (para la próxima vez o para otro entorno):**
> - Hostinger no ofrece un campo de "comando de build" personalizado en su importador;
>   ejecuta el script `build:server` del `package.json` directamente (no `build`), así
>   que `build:server` debe compilar **todo** (servidor y cliente), no solo el backend.
> - `npm install` en Hostinger corre con `NODE_ENV=production`, y npm omite
>   `devDependencies` en ese modo — por eso `typescript`, `vite` y el resto de
>   herramientas de compilación viven en `dependencies`, no en `devDependencies`.
> - El proyecto tiene dos `package.json` (raíz y `client/`); un `postinstall` en la raíz
>   corre `npm install --prefix client` para que un solo `npm install` deje todo listo.
> - Las tablas y los datos de demostración se crearon manualmente vía SQL en phpMyAdmin
>   (no había terminal/SSH disponible) — ver `drizzle/0000_serious_madame_masque.sql`
>   para el DDL exacto generado por Drizzle.
> - El dominio final solo respondía correctamente por **HTTPS**; por HTTP mostraba un
>   error de enrutamiento heredado de la configuración previa del subdominio.

---

## 3. Diseño — paleta de colores

| Color | Hex | Uso |
|---|---|---|
| Blanco / Blanco azulado | `#FFFFFF` / `#F8F9FA` | Fondo general, contenedores y tarjetas |
| Gris claro | `#E9ECEF` / `#D1D5DB` | Líneas divisoras de tabla, bordes de buscadores, fondo de botones secundarios (paginación) |
| Azul oscuro / marino | `#1D3557` / `#1E3A8A` | Elementos de interacción principal: opción seleccionada del menú lateral, botón "+ Nuevo" |

Todo el login y el dashboard deben ser **responsive**, adaptables a cualquier tipo de
pantalla (móvil, tablet, escritorio).

> ✅ **Implementado:** `client/tailwind.config.js` define los tokens `navy`,
> `surface` y `line` con estos valores hex. Todas las pantallas principales: Login,
> Dashboard, Usuarios y Roles, Votantes y CRM, y Agenda y Eventos ya usan de forma consistente
> el tema claro blanco/marino con botones principales en azul marino (`bg-navy`), bordes suaves (`border-line`)
> y fondos limpios (`bg-white` / `bg-surface-subtle`).

---

## 4. Módulos priorizados (primera entrega)

### 4.1 Login
- Pantalla principal de autenticación
- Usuario: **cédula** del usuario
- Contraseña
- Botón "Ingresar"
- Responsive

> ✅ **Corregido:** `src/modules/auth/auth.router.ts` ahora autentica por **cédula**
> (`POST /api/v1/auth/login` recibe `{ cedula, password }`) y valida la contraseña real
> con `bcrypt.compare` contra `passwordHash` — ya no acepta cualquier valor. `GET
> /auth/me` también deja de filtrar el `passwordHash` en la respuesta. Verificado con
> pruebas manuales: login rechaza contraseña incorrecta, acepta la correcta, y el nuevo
> usuario creado vía el CRUD puede iniciar sesión con su propia contraseña.
>
> ✅ **Conectado a la BD real:** el login ya consulta la tabla `users` vía Drizzle/MySQL
> (`src/db/index.ts`), no el `memoryStore`. Probado end-to-end contra un MariaDB real
> (local, mismo motor y schema que Hostinger): login, `/auth/me`, y el usuario creado
> desde el CRUD puede iniciar sesión de inmediato leyendo de la base de datos.

### 4.2 Dashboard (panel administrativo)
- Layout con **sidebar** de navegación
- Punto de entrada tras el login exitoso
- Responsive

> ✅ Implementado: `client/src/pages/DashboardPage.tsx` + `client/src/components/Sidebar.tsx`.

### 4.3 Gestión de usuarios
- Botón **"Nuevo"** → abre ventana emergente (modal) para registrar un nuevo usuario
- **Datatable** con:
  - Buscador
  - Filtros
  - Información registrada visible en columnas
  - Spinner/indicador de estado activo por registro
  - Módulo de **roles** habilitado (asignación de rol por usuario)
  - Botón **Editar** → carga la información del registro en la misma ventana emergente
  - Botón **Eliminar** → muestra alerta de confirmación antes de eliminar el registro

> ✅ **Completado:** `client/src/pages/UsersPage.tsx` y `src/modules/users/users.router.ts`
> ya incluyen buscador (`?q=`, filtra nombre/email/cédula), filtro por rol (`?role=`),
> botón Editar que recarga el registro en el mismo modal (`PUT /:id`), botón Eliminar
> con confirmación (`window.confirm` + `DELETE /:id`, bloqueado para no eliminar el
> propio usuario), y el indicador de estado activo es ahora un toggle clicable
> (`PATCH /:id/activo`) con spinner mientras se actualiza. La creación de usuario ahora
> exige cédula y contraseña (se hashean con bcrypt) para que el usuario creado pueda
> iniciar sesión de inmediato. Probado end-to-end con curl: búsqueda, filtro, alta,
> login del usuario recién creado, edición, toggle y borrado.

---

## 5. Módulos completos (alcance total del proyecto, para después de la primera entrega)

1. Usuarios y roles *(priorizado — ver sección 4.3)*
2. Votantes y segmentación
3. Agenda
4. CRM territorial y mapas
5. Gestión y fidelización de líderes
6. Testigos electorales
7. Actas E-14 y resultados en vivo
8. Comunicación multicanal
9. Encuestas y opinión ciudadana
10. Dashboard y reportes

> Nota: en el código ya existen tablas/rutas iniciales para votantes (`voters`),
> segmentos (`segments`), eventos/agenda (`events`, `eventAttendees`) y tareas de
> campaña (`campaignTasks`), con más detalle de negocio (fidelización, día D, checkin)
> del que cubre este documento — ver `src/db/schema.ts` como fuente de verdad más
> actualizada para el modelo de datos.

---

## 6. Esquema de base de datos (tablas y atributos)

> Punto de partida para el `schema.prisma`. Ajustar tipos y relaciones exactas al
> implementar cada módulo.
>
> ⚠️ El esquema real ya no está en Prisma sino en Drizzle (`src/db/schema.ts`), con
> nombres de tabla y columnas en varios casos distintos a los de esta sección (p. ej.
> `puestos_votacion`, `voters`, `segments`, `events`, `event_attendees`,
> `campaign_tasks`, con campos adicionales como `nivelFidelizacion`,
> `votoConfirmadoDiaD`, `requiereTransporte`). Antes de usar esta sección como
> referencia de diseño, compararla con el schema real y decidir cuál es la fuente de
> verdad.

### 6.1 Usuarios y roles *(prioridad de desarrollo)*
**users**
- id (PK)
- nombre
- cedula (único — usada como usuario de login)
- password_hash
- rol (admin | coordinador | lider | testigo | voluntario)
- territorio_id (FK → territorios, nullable)
- activo (boolean)
- created_at, updated_at

**roles**
- id (PK)
- nombre
- permisos (por módulo)

### 6.2 Votantes y segmentación
**votantes**
- id (PK)
- nombre_completo
- cedula (único, cifrado en reposo)
- telefono (cifrado en reposo)
- direccion
- territorio_id (FK → territorios)
- lider_id (FK → users, nullable)
- created_at, updated_at

**segmentos**
- id (PK)
- nombre
- criterio (descripción/reglas del segmento)

**votante_segmento** (tabla pivote)
- votante_id (FK → votantes)
- segmento_id (FK → segmentos)

### 6.3 Agenda
**eventos**
- id (PK)
- titulo
- descripcion
- fecha_inicio, fecha_fin
- territorio_id (FK → territorios, nullable)
- creado_por (FK → users)

**asistencias**
- id (PK)
- evento_id (FK → eventos)
- votante_id (FK → votantes, nullable)
- user_id (FK → users, nullable)
- confirmado (boolean)

### 6.4 CRM territorial y mapas
**territorios**
- id (PK)
- nombre
- tipo (barrio | vereda | puesto_votacion)
- territorio_padre_id (FK → territorios, nullable, para jerarquía)
- latitud, longitud

### 6.5 Fidelización de líderes
**metas_lider**
- id (PK)
- lider_id (FK → users)
- descripcion
- meta_numerica
- avance_actual
- fecha_limite

**compromisos**
- id (PK)
- lider_id (FK → users)
- votante_id (FK → votantes, nullable)
- descripcion
- estado (pendiente | cumplido | incumplido)

### 6.6 Testigos electorales
**puestos_votacion**
- id (PK)
- nombre
- territorio_id (FK → territorios)
- direccion

**mesas**
- id (PK)
- puesto_id (FK → puestos_votacion)
- numero_mesa

**testigos**
- id (PK)
- user_id (FK → users)
- mesa_id (FK → mesas)
- estado (asignado | confirmado | presente | ausente)

### 6.7 Actas E-14
**actas**
- id (PK)
- mesa_id (FK → mesas)
- foto_url
- subido_por (FK → users)
- estado (pendiente | validada | rechazada)
- created_at

**resultados_mesa**
- id (PK)
- mesa_id (FK → mesas)
- acta_id (FK → actas)
- candidato
- votos
- created_at

### 6.8 Comunicación multicanal
**plantillas**
- id (PK)
- nombre
- canal (whatsapp | sms | email)
- contenido

**mensajes**
- id (PK)
- plantilla_id (FK → plantillas, nullable)
- canal
- destinatario_id (FK → votantes, nullable)
- estado (enviado | fallido | pendiente)
- enviado_at

### 6.9 Encuestas
**encuestas**
- id (PK)
- titulo
- descripcion
- activa (boolean)

**preguntas**
- id (PK)
- encuesta_id (FK → encuestas)
- texto
- tipo (opcion_multiple | abierta | escala)

**respuestas**
- id (PK)
- pregunta_id (FK → preguntas)
- votante_id (FK → votantes, nullable)
- valor

### 6.10 Dashboard y reportes
Sin tablas propias — vistas/queries agregadas sobre las tablas anteriores.

---

## 7. Seguridad
- Cifrado en reposo de cédula y teléfono en `votantes`
- Control de acceso por rol a nivel de API (middleware) y de UI
- Interfaz y mensajes de validación en español (Colombia)

> ✅ **Corregido:** el login ahora valida la contraseña real con `bcrypt.compare`
> antes de emitir el JWT (ver sección 4.1). `.env` se sacó del control de versiones
> (`git rm --cached .env`) y ahora está en `.gitignore` junto con `dist/` y
> `client/dist/` (carpetas de build que no deberían versionarse, ya que el propio
> flujo de despliegue las regenera con `npm run build`).
>
> ✅ **Auth y usuarios ya usan la base de datos real:** `auth.router.ts`,
> `users.router.ts` y `territory.router.ts` consultan las tablas `users` y
> `puestos_votacion` vía Drizzle (`src/db/index.ts`), ya no el `memoryStore`. Se agregó
> `src/db/seed.ts` (`npm run db:seed`) para poblar los usuarios y puestos de
> demostración con contraseñas reales hasheadas. Probado contra un MariaDB real
> (mismo motor que Hostinger) corriendo en un entorno local de pruebas.
>
> ⚠️ **Pendientes:**
> - Votantes, agenda y tareas (sección 5, fuera de esta primera entrega) siguen en el
>   `memoryStore` en memoria — se migrarán cuando esos módulos entren en desarrollo.
> - No hay cifrado en reposo implementado todavía para cédula/teléfono de votantes.
> - Falta correr `npm run db:seed` contra la base de datos real de Hostinger al
>   desplegar (las credenciales de producción no se usaron ni se guardaron en el
>   repo — solo se probó localmente con una base de datos de prueba).

---

## 8. Estado actual del proyecto
- [x] Nombre y propuesta de producto definidos (REDTER) — *aplicado en `package.json`, `<title>` y health check*
- [~] Stack definido — *definido originalmente como Next.js + Prisma + NextAuth; el código real usa Express + Vite + Drizzle + JWT (ver sección 2); sigue pendiente la decisión formal de cuál es el stack oficial*
- [x] Paleta de colores definida y aplicada — *tokens `navy`/`surface`/`line` en `tailwind.config.js`, aplicados en login, dashboard y gestión de usuarios*
- [x] Subdominio `redter.devsoluciones.com` resuelto en Hostinger
- [x] Módulos de primera entrega priorizados (login, dashboard, gestión de usuarios)
- [x] Proyecto base generado — *Express API + cliente React/Vite ya existen en el repo*
- [x] Schema de base de datos para usuarios, votantes, eventos y territorio implementado en Drizzle — *no en Prisma; ver sección 6*
- [x] Login funcional (cédula + contraseña) — *corregido: autentica por cédula y valida la contraseña real con bcrypt (ver sección 4.1)*
- [x] Dashboard con sidebar — *retematizado con la paleta clara*
- [x] Datatable de gestión de usuarios (CRUD completo + roles) — *buscador, filtro por rol, editar, eliminar con confirmación y toggle de activo con spinner, todo probado end-to-end*
- [x] Conexión a base de datos real probada — *auth/usuarios/territorio en Drizzle/MySQL, corriendo en producción contra `u395420986_redter`*
- [x] Primer despliegue en Hostinger — *en producción en `https://redter.devsoluciones.com`, login y CRUD de usuarios verificados en vivo*

**Leyenda:** `[x]` hecho · `[~]` parcial o en conflicto con el plan · `[ ]` pendiente
