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
