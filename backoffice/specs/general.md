# Dashboard Tramuntana Talks

Este documento define las especificaciones funcionales del backoffice de **Tramuntana Talks**. El objetivo es disponer de una herramienta interna para administrar charlas, ponentes, inscripciones y usuarios de mantenimiento del sitio.

## Alcance general

El backoffice debe permitir al usuario administrador:

- Acceder de forma segura mediante login.
- Consultar una visión general del estado de las charlas e inscripciones.
- Gestionar el ciclo completo de charlas.
- Gestionar ponentes asociados a cada charla.
- Gestionar inscritos por charla.
- Crear nuevos usuarios con acceso al backoffice.

## Login

**Estado:** completado.

El sistema ya dispone de una pantalla de login para usuarios del backoffice.

### Requisitos cubiertos

- Acceso mediante correo electrónico y contraseña.
- Validación de credenciales contra la API.
- Gestión de sesión autenticada.
- Diseño alineado con la identidad visual definida para Tramuntana Talks.

## Pantalla inicial del dashboard

La pantalla inicial debe ofrecer una visión rápida del estado actual e histórico de Tramuntana Talks.

### Métricas principales

El dashboard debe mostrar, como mínimo:

| Métrica | Descripción |
|---|---|
| Charlas actuales | Listado o contador de charlas activas/próximas. |
| Inscritos por charla | Número de personas inscritas en cada charla. |
| Total de charlas realizadas | Número total de charlas históricas, incluyendo ediciones anteriores. |
| Inscritos históricos | Número total de inscripciones acumuladas en todo el histórico de charlas. |

### Listado inicial de charlas

La pantalla inicial debe incluir una vista resumida de las charlas actuales con:

- Título de la charla.
- Fecha.
- Hora.
- Ubicación.
- Ponente o ponentes asociados.
- Número de inscritos.

## Mantenimiento de charlas

El backoffice debe incluir un CRUD completo de charlas.

### Modelo de referencia

El mantenimiento de charlas debe basarse en el modelo `Talk.js` del backend.

| Campo | Tipo / referencia | Requisito |
|---|---|---|
| `title` | String | Obligatorio. Título de la charla. |
| `description` | String | Obligatorio. Descripción completa de la charla. |
| `date` | Date | Obligatorio. Fecha de celebración. |
| `time` | String | Obligatorio. Formato `HH:mm`. |
| `location` | Enum | Obligatorio. Valores: `auditorium`, `pressRoom`, `emprenbitSpace`. |
| `speakerIds` | Array de referencias a `Speaker` | Ponente o ponentes asociados a la charla. |
| `attendeeIds` | Array de referencias a `Attendee` | Inscritos asociados a la charla. |

### Funcionalidades requeridas

El administrador debe poder:

- Crear una nueva charla.
- Consultar el detalle de una charla.
- Editar los datos de una charla existente.
- Eliminar una charla.
- Asociar uno o varios ponentes a una charla.
- Consultar el número de inscritos de cada charla.

### Alta de ponente desde charla

Durante el alta o edición de una charla, el usuario debe poder dar de alta al ponente que impartirá la charla sin abandonar el flujo de creación o edición.

El formulario de charla debe permitir:

- Seleccionar un ponente existente.
- Crear un nuevo ponente desde el propio formulario.
- Asociar automáticamente el nuevo ponente a la charla actual.

## Mantenimiento de ponentes

La gestión de ponentes debe tomar como referencia el modelo `Speaker.js`.

| Campo | Tipo | Requisito |
|---|---|---|
| `fullName` | String | Obligatorio. Nombre completo del ponente. |
| `position` | String | Obligatorio. Cargo, rol o empresa del ponente. |
| `bio` | String | Obligatorio. Biografía o descripción profesional. |

### Funcionalidades requeridas

El administrador debe poder:

- Crear ponentes.
- Consultar ponentes existentes.
- Editar información de ponentes.
- Eliminar ponentes cuando no comprometa la integridad de las charlas asociadas.
- Asociar ponentes a una o varias charlas.

## Mantenimiento de inscripciones

El usuario administrador debe poder gestionar los inscritos de cada charla mediante un mantenimiento completo.

### Modelo de referencia

La gestión de inscripciones debe basarse en el modelo `Attendee.js`.

| Campo | Tipo / referencia | Requisito |
|---|---|---|
| `fullName` | String | Obligatorio. Nombre completo del inscrito. |
| `email` | String | Obligatorio. Correo electrónico del inscrito. |
| `location` | Enum | Obligatorio. Valores: `mallorca`, `menorca`, `ibiza`, `other`. |
| `company` | String | Opcional. Empresa u organización. |
| `discoverySource` | Enum | Obligatorio. Valores: `socialMedia`, `mailing`, `wordOfMouth`, `noneOfTheAbove`. |
| `talkIds` | Array de referencias a `Talk` | Charlas a las que está inscrita la persona. |

### Funcionalidades requeridas

El administrador debe poder:

- Consultar inscritos por charla.
- Crear una nueva inscripción.
- Editar los datos de una inscripción existente.
- Eliminar una inscripción.
- Asociar una persona inscrita a una o varias charlas.
- Desasociar una inscripción de una charla concreta.
- Consultar el total de inscritos por charla.
- Consultar el total histórico de inscritos.

### Reglas funcionales

- Una persona puede estar inscrita en más de una charla.
- El correo electrónico debe tratarse en minúsculas y sin espacios laterales.
- La relación entre charlas e inscritos debe mantenerse sincronizada entre `Talk.attendeeIds` y `Attendee.talkIds`.

## Alta de usuarios del backoffice

El usuario administrador debe poder dar de alta nuevos usuarios con acceso al mantenimiento del sitio.

### Modelo de referencia

La gestión de usuarios debe basarse en el modelo `User.js`.

| Campo | Tipo | Requisito |
|---|---|---|
| `fullName` | String | Obligatorio. Nombre completo del usuario. |
| `email` | String | Obligatorio y único. Correo de acceso. |
| `password` | String | Obligatorio. Mínimo 6 caracteres. |

### Funcionalidades requeridas

El administrador debe poder:

- Crear nuevos usuarios del backoffice.
- Consultar usuarios existentes.
- Editar nombre y correo de usuarios existentes.
- Restablecer o actualizar contraseñas cuando sea necesario.
- Eliminar usuarios que ya no deban tener acceso.

### Consideraciones de seguridad

- Las contraseñas no deben mostrarse nunca en listados ni respuestas de la API.
- Las contraseñas deben almacenarse cifradas mediante hash.
- Las rutas de mantenimiento de usuarios deben requerir autenticación.

## Criterios de aceptación generales

- Todas las pantallas del backoffice deben seguir el diseño visual definido para Tramuntana Talks.
- Todas las operaciones CRUD deben mostrar estados claros de carga, éxito y error.
- Los formularios deben validar los campos obligatorios antes de enviar datos a la API.
- Los listados deben permitir identificar rápidamente cada registro y acceder a sus acciones principales.
- Las relaciones entre charlas, ponentes e inscritos deben mantenerse consistentes.
- Las acciones destructivas, como eliminar charlas, ponentes, inscritos o usuarios, deben solicitar confirmación previa.

## Próxima fase recomendada

La siguiente fase debería ser definir la arquitectura de pantallas y componentes del dashboard antes de implementar el CRUD, para evitar construir formularios aislados sin una experiencia consistente.
