# Puntos a mejorar

## 1. Grupo familiar y convivencia humana

Incorporar dentro del modelo del agente FELIX la estructura humana del hogar, no solo las mascotas.

Esto implica contemplar:

- composicion del hogar
- roles de convivencia
- personas responsables del cuidado
- relacion de cada humano con cada mascota
- sensibilidad o restricciones de cada integrante del hogar

La convivencia no depende solo de la dinamica entre mascotas.
Tambien depende de:

- quien alimenta
- quien pasea
- quien interviene en conflictos
- quien tolera mejor ciertas conductas
- quien toma decisiones de salud
- quien observa cambios y los reporta

## 2. Posibles ampliaciones funcionales

- Registro de integrantes del hogar: nombre, rol, edad aproximada, relacion con las mascotas.
- Responsables por tarea: alimentacion, salud, paseo, higiene, compras, seguimiento.
- Preferencias y acuerdos del hogar: reglas de convivencia, espacios permitidos, horarios, rutinas.
- Historial de decisiones humanas: quien decidio un cambio de comida, una visita veterinaria o una nueva rutina.
- Observaciones por persona: distintas personas pueden interpretar distinto un mismo evento.
- Nivel de experiencia del cuidador: primerizo, intermedio, experto.
- Disponibilidad y carga: quien esta mas saturado y quien puede asumir seguimiento.
- Contexto del hogar: apartamento/casa, espacio, visitas frecuentes, ninos, adultos mayores, teletrabajo.
- Red de apoyo externa: veterinario, cuidador, paseador, etologo, familiar de apoyo.
- Permisos y privacidad: que informacion puede ver o editar cada integrante del hogar.

## 3. Impacto arquitectonico

Si se incorpora el grupo familiar, el modelo de datos deberia considerar al menos:

- hogares
- integrantes_hogar
- roles_hogar
- responsabilidades_cuidado
- relaciones_humano_mascota
- observaciones_humanas

## 4. Criterio de producto

FELIX no debe verse solo como un agente para mascotas.
Debe verse como un agente de acompanamiento para la convivencia entre:

- mascotas
- personas
- rutinas
- decisiones
- memoria del hogar

## 5. Otras ideas a evaluar

- Rutinas por franja horaria y por dia.
- Eventos detonantes del entorno: visitas, mudanzas, ruidos, obras, viajes, cambios de horario.
- Estado emocional del cuidador cuando reporta un evento.
- Calidad o confiabilidad del registro: observado directamente, inferido, contado por otro integrante.
- Versionado de instrucciones del agente y trazabilidad de cambios.
- Bitacora de recomendaciones de FELIX y evaluacion posterior de si funcionaron.
- Sistema de prioridades: urgente, observar, seguimiento, recordatorio.
- Ficha de recursos del hogar: comederos, areneros, camas, zonas seguras, medicinas, alimentos.

## 6. Pendientes detectados en instrucciones_felix.md

- Revisar y compactar posibles solapamientos entre las secciones `oficio`, `lenguaje` y `paso a paso`, sin perder claridad funcional.
- Evaluar si la expresion `cuenta activa del usuario y sus mascotas` debe evolucionar a `hogar activo` para incluir de forma mas natural a mascotas, personas del hogar, entorno y memoria compartida.
- Mover al `paso a paso` la definicion detallada sobre uso de herramientas para obtener contexto, registrar informacion y consultar memoria, cuando trabajemos esa seccion en profundidad.
- Separar con mas claridad dentro del prompt:
- que hace FELIX conversacionalmente
- que hace mediante herramientas o funciones
- que debe confirmar siempre despues de una accion
- Convertir la regla de confirmacion de acciones en un criterio mas operativo y reusable para todas las funciones futuras del agente.
- Revisar si conviene introducir una pequena seccion especifica de `criterios de respuesta despues de tool use`.

## 7. Pendientes de experiencia conversacional

- Definir un patron fijo de confirmacion despues de cada accion del agente:
- que hizo
- sobre que mascota, persona o situacion trabajo
- que hallazgo aparecio
- cual es el siguiente paso sugerido o disponible
- Definir como FELIX debe responder cuando no tiene suficiente contexto confirmado.
- Definir como FELIX debe responder cuando una entrada multimodal combine texto, audio e imagen sobre un mismo caso.
- Definir cuando FELIX debe registrar automaticamente una observacion y cuando debe pedir confirmacion antes de guardarla.

## 8. Pendientes de multimodalidad y contexto activo

- Formalizar que texto, audio e imagen alimentan una sola memoria operativa del hogar y no modulos separados.
- Definir como se representa dentro del sistema el `contexto activo`:
- hogar activo
- hilo activo
- mascota activa
- evento activo
- Establecer reglas para evitar mezcla de memoria entre hogares, mascotas o conversaciones no relacionadas.

## 9. Pendientes editoriales y documentales

- Hacer una revision editorial final de `instrucciones_felix.md` cuando terminemos de definir funciones, para ajustar redaccion, consistencia y orden.
- Corregir y normalizar codificacion de caracteres en documentos que todavia presenten problemas visuales de encoding.
- Mantener sincronizados:
- definicion metodologica del agente
- instrucciones operativas del agente
- backlog de mejoras

## 10. Pendientes para cerrar al final cuando esten todas las funciones

- Definir una funcion propia para crear o definir el hogar dentro del paso a paso, de modo que `hogar_id` deje de resolverse temporalmente con valores aleatorios en pruebas.
- Refinar todos los documentos de tool actions para que las respuestas JSON sigan un mismo contrato comun y consistente en todas las funciones del agente.
- Evaluar agregar en todas las tools un campo adicional como msg_usuario, separado del msg tecnico, para que Felix pueda responder de forma amable y clara cuando ocurra un error, por ejemplo indicando que hubo un problema y que conviene intentar de nuevo mas tarde.
- Convertir las propuestas documentales de funciones Python en codigo real dentro de una estructura tecnica del proyecto, por ejemplo `app/tools/` o una organizacion equivalente.
- Reemplazar la generacion temporal de `hogar_id` aleatorio en pruebas por un `hogar_id` asignado en la creacion de cuenta y validado durante el login, para que Felix opere siempre dentro del hogar autenticado.
- DiseÃ±ar el flujo multimodal de salud para que Felix pueda leer formulas medicas, ordenes y examenes, extraer informacion util y confirmar con el usuario antes de crear o actualizar medicamentos, tratamientos, eventos y documentos asociados.

## 11. Posibles mejoras futuras para memoria del hogar

- Mantener por ahora la presencia y permanencia de las personas del hogar dentro de la tabla `hogar_personas`, usando campos como permanencia en casa, horario aproximado, nivel de participacion y observaciones, sin llevarlo todavia a una tabla separada por franjas horarias o dias.
- Incluir relacion entre recursos del hogar y mascotas especificas, porque aunque existan recursos compartidos tambien hay preferencias, usos o apropiaciones individuales de ciertos espacios, objetos o juguetes por parte de algunas mascotas.
- Incluir desde el inicio un modelo de interacciones que permita multiples mascotas y multiples personas en una misma interaccion, especialmente para casos como conflictos, juegos, rutinas compartidas o situaciones donde intervienen varios integrantes del hogar.
- Definir en la implementacion real una logica de resolucion previa para evitar duplicados de personas del hogar antes de usar `registrar_persona_hogar`, y decidir si esa validacion vive en una tool adicional, en una busqueda previa o dentro de la propia funcion de registro.


