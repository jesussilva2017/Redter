# REDTER — Plataforma de gestión territorial y relacionamiento comunitario

Documento maestro del proyecto: propuesta de producto, módulos priorizados, esquema
de base de datos, diseño y stack técnico.

> **Nota de esta revisión:** el código del repositorio ya avanzó con un stack distinto
> al planeado originalmente (Express + React/Vite + Drizzle en vez de Next.js + Prisma +
> NextAuth). Este documento se actualizó para reflejar lo que **realmente existe** en el
> repo a la fecha, y marca explícitamente lo que sigue pendiente o requiere decisión.

---

## 1. Descripción del proyecto

**REDTER** es una plataforma inteligente de gestión territorial y relacionamiento
comunitario que permite organizar personas, territorio, información, seguimientos,
reuniones y agenda en un solo lugar.

**Significado del nombre:**
- **RED** → conexión entre personas, líderes y equipos
- **TER** → territorio

Proyecto desarrollado bajo DevSoluciones (devsoluciones.com).

> ⚠️ **Pendiente de alinear:** el `package.json` del repo todavía identifica el proyecto
> como `"sige-electoral"` / "SIGE Electoral" (nombre y branding de una versión anterior).
> Falta decidir y aplicar el nombre definitivo (`REDTER`) de forma consistente en
> `package.json`, el `<title>` del cliente, el health check (`/health`) y el nombre de
> la base de datos (actualmente `sige_electoral`).

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
- Estado: subdominio resuelto en Hostinger; **primer despliegue real aún no confirmado**

---

## 3. Diseño — paleta de colores

| Color | Hex | Uso |
|---|---|---|
| Blanco / Blanco azulado | `#FFFFFF` / `#F8F9FA` | Fondo general, contenedores y tarjetas |
| Gris claro | `#E9ECEF` / `#D1D5DB` | Líneas divisoras de tabla, bordes de buscadores, fondo de botones secundarios (paginación) |
| Azul oscuro / marino | `#1D3557` / `#1E3A8A` | Elementos de interacción principal: opción seleccionada del menú lateral, botón "+ Nuevo" |

Todo el login y el dashboard deben ser **responsive**, adaptables a cualquier tipo de
pantalla (móvil, tablet, escritorio).

> ⚠️ **No implementado tal cual:** `client/tailwind.config.js` define una paleta
> distinta (`brand.*` en tonos celeste `#0284c7` y `redter.*` en fondo oscuro
> `#0f172a` con acentos `sky`/`emerald`/`amber`/`crimson`), es decir, un tema **oscuro**,
> no el tema claro (blanco/marino) descrito aquí. Falta decidir cuál paleta es la
> oficial y aplicarla de forma consistente.

---

## 4. Módulos priorizados (primera entrega)

### 4.1 Login
- Pantalla principal de autenticación
- Usuario: **cédula** del usuario
- Contraseña
- Botón "Ingresar"
- Responsive

> 🔴 **Pendiente crítico:** el login implementado (`src/modules/auth/auth.router.ts`)
> difiere del diseño en dos puntos importantes:
> 1. Autentica por **email**, no por cédula, como pide esta sección.
> 2. **No valida la contraseña.** El código acepta cualquier valor de `password`
>    (comentario en el propio archivo: *"En demo aceptamos cualquier password o
>    redter123"*), pese a que `bcryptjs` ya está instalado y cada usuario tiene
>    `passwordHash`. Esto debe corregirse antes de cualquier despliegue, incluso de
>    pruebas con datos reales.
> 3. El login consulta un `memoryStore` en memoria (`src/db/mockStore.ts`), no la base
>    de datos real — aunque la conexión Drizzle/MySQL ya está configurada en
>    `src/db/index.ts`, todavía no está conectada a los endpoints de auth/usuarios.

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

> 🟡 **Parcialmente implementado:** `client/src/pages/UsersPage.tsx` y
> `src/modules/users/users.router.ts` ya tienen listado, modal de creación y roles con
> scoping por jerarquía (ABAC). **Falta verificar/completar:** buscador, filtros,
> spinner de estado activo, botón Editar (precarga en el mismo modal) y confirmación de
> Eliminar — revisar contra el archivo actual antes de dar el módulo por cerrado.

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

> 🔴 **Hallazgos de esta revisión, pendientes de corregir:**
> - El endpoint de login (`src/modules/auth/auth.router.ts`) **no valida la
>   contraseña real** contra `passwordHash` — acepta cualquier valor. Debe usar
>   `bcrypt.compare` antes de emitir el JWT.
> - Los endpoints de auth/usuarios usan un `memoryStore` en memoria en vez de la
>   base de datos real (`src/db/index.ts` con Drizzle ya está listo pero no conectado).
> - No hay cifrado en reposo implementado todavía para cédula/teléfono de votantes.
> - El archivo `.env` está commiteado en el repositorio (aunque hoy es idéntico a
>   `.env.example`, sin secretos reales). Se recomienda quitarlo del control de
>   versiones y agregarlo a `.gitignore` para evitar que a futuro se suba un secreto
>   real por error.

---

## 8. Estado actual del proyecto
- [x] Nombre y propuesta de producto definidos (REDTER) — *pendiente aplicar el nombre en el código (ver sección 1)*
- [~] Stack definido — *definido originalmente como Next.js + Prisma + NextAuth; el código real usa Express + Vite + Drizzle + JWT (ver sección 2); falta decisión formal*
- [~] Paleta de colores definida — *definida en este documento, pero no aplicada en `tailwind.config.js` (ver sección 3)*
- [x] Subdominio `redter.devsoluciones.com` resuelto en Hostinger
- [x] Módulos de primera entrega priorizados (login, dashboard, gestión de usuarios)
- [x] Proyecto base generado — *Express API + cliente React/Vite ya existen en el repo*
- [x] Schema de base de datos para usuarios, votantes, eventos y territorio implementado en Drizzle — *no en Prisma; ver sección 6*
- [ ] Login funcional (cédula + contraseña) — *implementado con email y sin validar contraseña; pendiente corrección crítica (ver secciones 4.1 y 7)*
- [x] Dashboard con sidebar
- [~] Datatable de gestión de usuarios (CRUD completo + roles) — *listado, alta y roles con scoping ya existen; falta confirmar buscador, filtros, spinner de activo, edición y confirmación de borrado*
- [ ] Conexión a base de datos remota probada — *pool Drizzle/MySQL configurado, pero los endpoints todavía leen de un store en memoria, no de la BD*
- [ ] Primer despliegue en Hostinger

**Leyenda:** `[x]` hecho · `[~]` parcial o en conflicto con el plan · `[ ]` pendiente
