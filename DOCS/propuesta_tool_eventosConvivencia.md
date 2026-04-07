# Propuesta de tool actions para registrar eventos relevantes de convivencia

## Enfoque recomendado

Félix debe usar esta capa cuando el usuario relate un episodio concreto, situado en el tiempo, que haya alterado la convivencia y que merezca quedar registrado para atención, análisis o seguimiento posterior.

Esto no reemplaza la memoria estable del hogar del punto 2. La diferencia esperada es esta:
- si algo describe una dinámica repetida, frecuente o estructural del hogar, corresponde al punto 2
- si algo describe un episodio concreto que ocurrió, con tensión, cambio, incidente, reacción o impacto puntual, corresponde a esta capa de eventos de convivencia

La arquitectura se mantiene deliberadamente simple:
- una tabla principal para el evento
- una tabla para mascotas o personas involucradas
- una tabla para recomendación, plan, acción aplicada o seguimiento

La lógica general es consistente con los puntos anteriores:
- si el ID principal viene en `null`, la función crea
- si el ID principal viene con valor, la misma función actualiza
- en una actualización solo se cambian los campos cuyo valor no sea `None`
- `null` significa “no informado ahora” o “no cambiar ahora”; no significa borrar
- no se deben mezclar entidades de hogares distintos
- no se permite mover registros entre hogares en la rama de actualización

Regla operativa importante:
- el evento principal debe guardar siempre `mascota_iniciadora_id`
- las demás mascotas relacionadas y las personas involucradas se guardan en la tabla de involucrados
- si el caso lo permite, Félix puede dejar una recomendación breve y prudente; esa recomendación debe quedar guardada para poder actualizar luego si se aplicó, qué pasó después y si fue útil o necesita ajuste

Todas las funciones usan `mysql.connector`, `json`, `logging`, placeholders `%s`, cierre en `finally` y devuelven JSON string con:
- `ok`
- `action`
- ID principal correspondiente
- `campos_actualizados`
- `msg`

## 1. Tool action `guardar_evento_convivencia`

**Propósito**
Crear o actualizar un episodio puntual de convivencia dentro del hogar.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_evento_convivencia",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "evento_convivencia_id": { "type": ["integer", "null"], "minimum": 1 },
      "hogar_id": { "type": ["integer", "null"], "minimum": 1 },
      "mascota_iniciadora_id": { "type": ["integer", "null"], "minimum": 1 },
      "espacio_id": { "type": ["integer", "null"], "minimum": 1 },
      "recurso_id": { "type": ["integer", "null"], "minimum": 1 },
      "tipo_evento": { "type": ["string", "null"] },
      "subtipo_evento": { "type": ["string", "null"] },
      "fecha_evento": { "type": ["string", "null"], "format": "date" },
      "momento_relativo": { "type": ["string", "null"] },
      "descripcion": { "type": ["string", "null"] },
      "desencadenante_reportado": { "type": ["string", "null"] },
      "nivel_intensidad": { "type": ["string", "null"] },
      "requiere_atencion": { "type": ["boolean", "null"] },
      "requiere_seguimiento": { "type": ["boolean", "null"] },
      "estado_evento": { "type": ["string", "null"] },
      "impacto_convivencia": { "type": ["string", "null"] },
      "resultado_inmediato": { "type": ["string", "null"] },
      "notas": { "type": ["string", "null"] }
    },
    "required": [
      "evento_convivencia_id",
      "hogar_id",
      "mascota_iniciadora_id",
      "espacio_id",
      "recurso_id",
      "tipo_evento",
      "subtipo_evento",
      "fecha_evento",
      "momento_relativo",
      "descripcion",
      "desencadenante_reportado",
      "nivel_intensidad",
      "requiere_atencion",
      "requiere_seguimiento",
      "estado_evento",
      "impacto_convivencia",
      "resultado_inmediato",
      "notas"
    ]
  }
}
```

### Función Python

```python
import json
import logging
import mysql.connector


def guardar_evento_convivencia(
    evento_convivencia_id,
    hogar_id,
    mascota_iniciadora_id,
    espacio_id=None,
    recurso_id=None,
    tipo_evento=None,
    subtipo_evento=None,
    fecha_evento=None,
    momento_relativo=None,
    descripcion=None,
    desencadenante_reportado=None,
    nivel_intensidad=None,
    requiere_atencion=None,
    requiere_seguimiento=None,
    estado_evento=None,
    impacto_convivencia=None,
    resultado_inmediato=None,
    notas=None,
):
    logging.info("guardar_evento_convivencia: Inicio de guardado.")

    conexion = None
    cursor = None

    try:
        conexion = mysql.connector.connect(
            host="localhost",
            user="felix",
            password="Ca29Si26$",
            database="felix",
        )
        cursor = conexion.cursor()

        if evento_convivencia_id is None:
            if not hogar_id or not mascota_iniciadora_id or not tipo_evento:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "evento_convivencia_id": evento_convivencia_id,
                    "campos_actualizados": [],
                    "msg": "Para crear un evento de convivencia se requieren `hogar_id`, `mascota_iniciadora_id` y `tipo_evento`."
                })
                logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
                return res_json

            cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "evento_convivencia_id": evento_convivencia_id,
                    "campos_actualizados": [],
                    "msg": "El hogar indicado no existe."
                })
                logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
                return res_json

            cursor.execute(
                "SELECT id FROM mascotas WHERE id = %s AND hogar_id = %s",
                (mascota_iniciadora_id, hogar_id)
            )
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "evento_convivencia_id": evento_convivencia_id,
                    "campos_actualizados": [],
                    "msg": "La mascota iniciadora no existe o no pertenece al mismo hogar del evento."
                })
                logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
                return res_json

            if espacio_id is not None:
                cursor.execute(
                    "SELECT id FROM hogar_espacios WHERE id = %s AND hogar_id = %s",
                    (espacio_id, hogar_id)
                )
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "evento_convivencia_id": evento_convivencia_id,
                        "campos_actualizados": [],
                        "msg": "El espacio indicado no existe o no pertenece al mismo hogar del evento."
                    })
                    logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json

            if recurso_id is not None:
                cursor.execute(
                    "SELECT id FROM hogar_recursos_mascotas WHERE id = %s AND hogar_id = %s",
                    (recurso_id, hogar_id)
                )
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "evento_convivencia_id": evento_convivencia_id,
                        "campos_actualizados": [],
                        "msg": "El recurso indicado no existe o no pertenece al mismo hogar del evento."
                    })
                    logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json

            requiere_atencion_insert = False if requiere_atencion is None else requiere_atencion
            requiere_seguimiento_insert = True if requiere_seguimiento is None else requiere_seguimiento
            estado_evento_insert = "abierto" if estado_evento is None else estado_evento

            q = """
                INSERT INTO eventos_convivencia (
                    hogar_id, mascota_iniciadora_id, espacio_id, recurso_id, tipo_evento,
                    subtipo_evento, fecha_evento, momento_relativo, descripcion,
                    desencadenante_reportado, nivel_intensidad, requiere_atencion,
                    requiere_seguimiento, estado_evento, impacto_convivencia,
                    resultado_inmediato, notas
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(q, (
                hogar_id, mascota_iniciadora_id, espacio_id, recurso_id, tipo_evento,
                subtipo_evento, fecha_evento, momento_relativo, descripcion,
                desencadenante_reportado, nivel_intensidad, requiere_atencion_insert,
                requiere_seguimiento_insert, estado_evento_insert, impacto_convivencia,
                resultado_inmediato, notas
            ))
            conexion.commit()
            evento_convivencia_id = cursor.lastrowid

            campos_actualizados = ["hogar_id", "mascota_iniciadora_id", "tipo_evento"]
            for campo, valor in {
                "espacio_id": espacio_id,
                "recurso_id": recurso_id,
                "subtipo_evento": subtipo_evento,
                "fecha_evento": fecha_evento,
                "momento_relativo": momento_relativo,
                "descripcion": descripcion,
                "desencadenante_reportado": desencadenante_reportado,
                "nivel_intensidad": nivel_intensidad,
                "requiere_atencion": requiere_atencion,
                "requiere_seguimiento": requiere_seguimiento,
                "estado_evento": estado_evento,
                "impacto_convivencia": impacto_convivencia,
                "resultado_inmediato": resultado_inmediato,
                "notas": notas,
            }.items():
                if valor is not None:
                    campos_actualizados.append(campo)

            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "evento_convivencia_id": evento_convivencia_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Evento de convivencia guardado correctamente."
            })
        else:
            cursor.execute(
                "SELECT hogar_id FROM eventos_convivencia WHERE id = %s",
                (evento_convivencia_id,)
            )
            fila_evento = cursor.fetchone()
            if not fila_evento:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "evento_convivencia_id": evento_convivencia_id,
                    "campos_actualizados": [],
                    "msg": "El evento de convivencia indicado no existe."
                })
                logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
                return res_json

            hogar_base_id = fila_evento[0]
            updates = []
            valores = []
            campos_actualizados = []

            if hogar_id is not None:
                cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "evento_convivencia_id": evento_convivencia_id,
                        "campos_actualizados": [],
                        "msg": "El hogar indicado no existe."
                    })
                    logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json
                if hogar_id != hogar_base_id:
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "evento_convivencia_id": evento_convivencia_id,
                        "campos_actualizados": [],
                        "msg": "El evento indicado pertenece a otro hogar y no puede moverse desde esta función."
                    })
                    logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json

            if mascota_iniciadora_id is not None:
                cursor.execute(
                    "SELECT id FROM mascotas WHERE id = %s AND hogar_id = %s",
                    (mascota_iniciadora_id, hogar_base_id)
                )
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "evento_convivencia_id": evento_convivencia_id,
                        "campos_actualizados": [],
                        "msg": "La mascota iniciadora no existe o no pertenece al mismo hogar del evento."
                    })
                    logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json
                updates.append("mascota_iniciadora_id = %s")
                valores.append(mascota_iniciadora_id)
                campos_actualizados.append("mascota_iniciadora_id")

            if espacio_id is not None:
                cursor.execute(
                    "SELECT id FROM hogar_espacios WHERE id = %s AND hogar_id = %s",
                    (espacio_id, hogar_base_id)
                )
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "evento_convivencia_id": evento_convivencia_id,
                        "campos_actualizados": [],
                        "msg": "El espacio indicado no existe o no pertenece al mismo hogar del evento."
                    })
                    logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json
                updates.append("espacio_id = %s")
                valores.append(espacio_id)
                campos_actualizados.append("espacio_id")

            if recurso_id is not None:
                cursor.execute(
                    "SELECT id FROM hogar_recursos_mascotas WHERE id = %s AND hogar_id = %s",
                    (recurso_id, hogar_base_id)
                )
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "evento_convivencia_id": evento_convivencia_id,
                        "campos_actualizados": [],
                        "msg": "El recurso indicado no existe o no pertenece al mismo hogar del evento."
                    })
                    logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json
                updates.append("recurso_id = %s")
                valores.append(recurso_id)
                campos_actualizados.append("recurso_id")

            campos = {
                "tipo_evento": tipo_evento,
                "subtipo_evento": subtipo_evento,
                "fecha_evento": fecha_evento,
                "momento_relativo": momento_relativo,
                "descripcion": descripcion,
                "desencadenante_reportado": desencadenante_reportado,
                "nivel_intensidad": nivel_intensidad,
                "requiere_atencion": requiere_atencion,
                "requiere_seguimiento": requiere_seguimiento,
                "estado_evento": estado_evento,
                "impacto_convivencia": impacto_convivencia,
                "resultado_inmediato": resultado_inmediato,
                "notas": notas,
            }
            for campo, valor in campos.items():
                if valor is not None:
                    updates.append(f"{campo} = %s")
                    valores.append(valor)
                    campos_actualizados.append(campo)

            if not updates:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "evento_convivencia_id": evento_convivencia_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en el evento de convivencia."
                })
                logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
                return res_json

            valores.append(evento_convivencia_id)
            q = f"UPDATE eventos_convivencia SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()

            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "evento_convivencia_id": evento_convivencia_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Evento de convivencia actualizado correctamente."
            })
    except mysql.connector.Error as error:
        logging.error(f"guardar_evento_convivencia: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "evento_convivencia_id": evento_convivencia_id,
            "campos_actualizados": [],
            "msg": "Error técnico al guardar el evento de convivencia."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_evento_convivencia: Resultado JSON: {res_json}")
    return res_json
```

## 2. Tool action `guardar_involucrado_evento_convivencia`

**Propósito**
Crear o actualizar una mascota relacionada o persona involucrada en un evento de convivencia.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_involucrado_evento_convivencia",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "involucrado_evento_id": { "type": ["integer", "null"], "minimum": 1 },
      "evento_convivencia_id": { "type": ["integer", "null"], "minimum": 1 },
      "hogar_id": { "type": ["integer", "null"], "minimum": 1 },
      "mascota_id": { "type": ["integer", "null"], "minimum": 1 },
      "persona_id": { "type": ["integer", "null"], "minimum": 1 },
      "rol_en_evento": { "type": ["string", "null"] },
      "afectacion_observada": { "type": ["string", "null"] },
      "notas": { "type": ["string", "null"] }
    },
    "required": [
      "involucrado_evento_id",
      "evento_convivencia_id",
      "hogar_id",
      "mascota_id",
      "persona_id",
      "rol_en_evento",
      "afectacion_observada",
      "notas"
    ]
  }
}
```

### Función Python

```python
import json
import logging
import mysql.connector


def guardar_involucrado_evento_convivencia(
    involucrado_evento_id,
    evento_convivencia_id,
    hogar_id,
    mascota_id=None,
    persona_id=None,
    rol_en_evento=None,
    afectacion_observada=None,
    notas=None,
):
    logging.info("guardar_involucrado_evento_convivencia: Inicio de guardado.")

    conexion = None
    cursor = None

    try:
        conexion = mysql.connector.connect(
            host="localhost",
            user="felix",
            password="Ca29Si26$",
            database="felix",
        )
        cursor = conexion.cursor()

        if involucrado_evento_id is None:
            if mascota_id is None and persona_id is None:
                res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "Debes informar al menos `mascota_id` o `persona_id`."})
                logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                return res_json

            if not evento_convivencia_id or not hogar_id:
                res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "Para crear un involucrado se requieren `evento_convivencia_id` y `hogar_id`."})
                logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                return res_json

            cursor.execute("SELECT hogar_id FROM eventos_convivencia WHERE id = %s", (evento_convivencia_id,))
            fila_evento = cursor.fetchone()
            if not fila_evento:
                res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "El evento de convivencia indicado no existe."})
                logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                return res_json
            if hogar_id != fila_evento[0]:
                res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "El hogar indicado no coincide con el hogar del evento."})
                logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                return res_json
            if mascota_id is not None:
                cursor.execute("SELECT id FROM mascotas WHERE id = %s AND hogar_id = %s", (mascota_id, hogar_id))
                if not cursor.fetchone():
                    res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "La mascota indicada no existe o no pertenece al mismo hogar del evento."})
                    logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json
            if persona_id is not None:
                cursor.execute("SELECT id FROM hogar_personas WHERE id = %s AND hogar_id = %s", (persona_id, hogar_id))
                if not cursor.fetchone():
                    res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "La persona indicada no existe o no pertenece al mismo hogar del evento."})
                    logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json

            q = """
                INSERT INTO involucrados_evento_convivencia (
                    evento_convivencia_id, hogar_id, mascota_id, persona_id,
                    rol_en_evento, afectacion_observada, notas
                ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(q, (evento_convivencia_id, hogar_id, mascota_id, persona_id, rol_en_evento, afectacion_observada, notas))
            conexion.commit()
            involucrado_evento_id = cursor.lastrowid
            campos_actualizados = ["evento_convivencia_id", "hogar_id"]
            if mascota_id is not None: campos_actualizados.append("mascota_id")
            if persona_id is not None: campos_actualizados.append("persona_id")
            for campo, valor in {"rol_en_evento": rol_en_evento, "afectacion_observada": afectacion_observada, "notas": notas}.items():
                if valor is not None: campos_actualizados.append(campo)
            res_json = json.dumps({"ok": True, "action": "created", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": campos_actualizados, "msg": "Involucrado del evento guardado correctamente."})
        else:
            cursor.execute("SELECT evento_convivencia_id, hogar_id FROM involucrados_evento_convivencia WHERE id = %s", (involucrado_evento_id,))
            fila_involucrado = cursor.fetchone()
            if not fila_involucrado:
                res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "El involucrado indicado no existe."})
                logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                return res_json
            evento_base_id = fila_involucrado[0]
            hogar_base_id = fila_involucrado[1]
            updates = []
            valores = []
            campos_actualizados = []
            if evento_convivencia_id is not None:
                cursor.execute("SELECT hogar_id FROM eventos_convivencia WHERE id = %s", (evento_convivencia_id,))
                fila_evento = cursor.fetchone()
                if not fila_evento:
                    res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "El evento de convivencia indicado no existe."})
                    logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json
                if evento_convivencia_id != evento_base_id or fila_evento[0] != hogar_base_id:
                    res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "El involucrado indicado pertenece a otro evento u otro hogar y no puede moverse desde esta función."})
                    logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json
            if hogar_id is not None and hogar_id != hogar_base_id:
                res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "El involucrado indicado pertenece a otro hogar y no puede moverse desde esta función."})
                logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                return res_json
            if mascota_id is not None:
                cursor.execute("SELECT id FROM mascotas WHERE id = %s AND hogar_id = %s", (mascota_id, hogar_base_id))
                if not cursor.fetchone():
                    res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "La mascota indicada no existe o no pertenece al mismo hogar del evento."})
                    logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json
                updates.append("mascota_id = %s"); valores.append(mascota_id); campos_actualizados.append("mascota_id")
            if persona_id is not None:
                cursor.execute("SELECT id FROM hogar_personas WHERE id = %s AND hogar_id = %s", (persona_id, hogar_base_id))
                if not cursor.fetchone():
                    res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "La persona indicada no existe o no pertenece al mismo hogar del evento."})
                    logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json
                updates.append("persona_id = %s"); valores.append(persona_id); campos_actualizados.append("persona_id")
            for campo, valor in {"rol_en_evento": rol_en_evento, "afectacion_observada": afectacion_observada, "notas": notas}.items():
                if valor is not None: updates.append(f"{campo} = %s"); valores.append(valor); campos_actualizados.append(campo)
            if not updates:
                res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "No hay campos para actualizar en el involucrado del evento."})
                logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
                return res_json
            valores.append(involucrado_evento_id)
            q = f"UPDATE involucrados_evento_convivencia SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()
            res_json = json.dumps({"ok": True, "action": "updated", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": campos_actualizados, "msg": "Involucrado del evento actualizado correctamente."})
    except mysql.connector.Error as error:
        logging.error(f"guardar_involucrado_evento_convivencia: Error de base de datos: {error}")
        res_json = json.dumps({"ok": False, "action": "error", "involucrado_evento_id": involucrado_evento_id, "campos_actualizados": [], "msg": "Error técnico al guardar el involucrado del evento."})
    finally:
        if cursor is not None: cursor.close()
        if conexion is not None and conexion.is_connected(): conexion.close()
    logging.info(f"guardar_involucrado_evento_convivencia: Resultado JSON: {res_json}")
    return res_json
```

## 3. Tool action `guardar_plan_evento_convivencia`

**Propósito**
Crear o actualizar una recomendación, acción aplicada o seguimiento asociado a un evento de convivencia.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_plan_evento_convivencia",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "plan_evento_id": { "type": ["integer", "null"], "minimum": 1 },
      "evento_convivencia_id": { "type": ["integer", "null"], "minimum": 1 },
      "hogar_id": { "type": ["integer", "null"], "minimum": 1 },
      "tipo_recomendacion": { "type": ["string", "null"] },
      "descripcion_recomendacion": { "type": ["string", "null"] },
      "objetivo": { "type": ["string", "null"] },
      "prioridad": { "type": ["string", "null"] },
      "plazo_seguimiento_dias": { "type": ["integer", "null"], "minimum": 0 },
      "fecha_seguimiento_sugerida": { "type": ["string", "null"], "format": "date" },
      "estado_plan": { "type": ["string", "null"] },
      "fue_aplicado": { "type": ["boolean", "null"] },
      "fecha_aplicacion": { "type": ["string", "null"], "format": "date" },
      "resultado_reportado": { "type": ["string", "null"] },
      "efectividad_percibida": { "type": ["string", "null"] },
      "requiere_ajuste": { "type": ["boolean", "null"] },
      "notas": { "type": ["string", "null"] }
    },
    "required": [
      "plan_evento_id","evento_convivencia_id","hogar_id","tipo_recomendacion","descripcion_recomendacion","objetivo","prioridad","plazo_seguimiento_dias","fecha_seguimiento_sugerida","estado_plan","fue_aplicado","fecha_aplicacion","resultado_reportado","efectividad_percibida","requiere_ajuste","notas"
    ]
  }
}
```

### Función Python

```python
import json
import logging
import mysql.connector


def guardar_plan_evento_convivencia(
    plan_evento_id, evento_convivencia_id, hogar_id, tipo_recomendacion=None, descripcion_recomendacion=None,
    objetivo=None, prioridad=None, plazo_seguimiento_dias=None, fecha_seguimiento_sugerida=None,
    estado_plan=None, fue_aplicado=None, fecha_aplicacion=None, resultado_reportado=None,
    efectividad_percibida=None, requiere_ajuste=None, notas=None,
):
    logging.info("guardar_plan_evento_convivencia: Inicio de guardado.")
    conexion = None
    cursor = None
    try:
        conexion = mysql.connector.connect(host="localhost", user="felix", password="Ca29Si26$", database="felix")
        cursor = conexion.cursor()
        if plan_evento_id is None:
            if not evento_convivencia_id or not hogar_id:
                res_json = json.dumps({"ok": False, "action": "error", "plan_evento_id": plan_evento_id, "campos_actualizados": [], "msg": "Para crear un plan se requieren `evento_convivencia_id` y `hogar_id`."})
                logging.info(f"guardar_plan_evento_convivencia: Resultado JSON: {res_json}")
                return res_json
            cursor.execute("SELECT hogar_id FROM eventos_convivencia WHERE id = %s", (evento_convivencia_id,))
            fila_evento = cursor.fetchone()
            if not fila_evento:
                res_json = json.dumps({"ok": False, "action": "error", "plan_evento_id": plan_evento_id, "campos_actualizados": [], "msg": "El evento de convivencia indicado no existe."})
                logging.info(f"guardar_plan_evento_convivencia: Resultado JSON: {res_json}")
                return res_json
            if hogar_id != fila_evento[0]:
                res_json = json.dumps({"ok": False, "action": "error", "plan_evento_id": plan_evento_id, "campos_actualizados": [], "msg": "El hogar indicado no coincide con el hogar del evento."})
                logging.info(f"guardar_plan_evento_convivencia: Resultado JSON: {res_json}")
                return res_json
            estado_plan_insert = "sugerido" if estado_plan is None else estado_plan
            fue_aplicado_insert = False if fue_aplicado is None else fue_aplicado
            requiere_ajuste_insert = False if requiere_ajuste is None else requiere_ajuste
            q = """INSERT INTO planes_evento_convivencia (evento_convivencia_id, hogar_id, tipo_recomendacion, descripcion_recomendacion, objetivo, prioridad, plazo_seguimiento_dias, fecha_seguimiento_sugerida, estado_plan, fue_aplicado, fecha_aplicacion, resultado_reportado, efectividad_percibida, requiere_ajuste, notas) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(q, (evento_convivencia_id, hogar_id, tipo_recomendacion, descripcion_recomendacion, objetivo, prioridad, plazo_seguimiento_dias, fecha_seguimiento_sugerida, estado_plan_insert, fue_aplicado_insert, fecha_aplicacion, resultado_reportado, efectividad_percibida, requiere_ajuste_insert, notas))
            conexion.commit()
            plan_evento_id = cursor.lastrowid
            campos_actualizados = ["evento_convivencia_id", "hogar_id"]
            for campo, valor in {"tipo_recomendacion": tipo_recomendacion, "descripcion_recomendacion": descripcion_recomendacion, "objetivo": objetivo, "prioridad": prioridad, "plazo_seguimiento_dias": plazo_seguimiento_dias, "fecha_seguimiento_sugerida": fecha_seguimiento_sugerida, "estado_plan": estado_plan, "fue_aplicado": fue_aplicado, "fecha_aplicacion": fecha_aplicacion, "resultado_reportado": resultado_reportado, "efectividad_percibida": efectividad_percibida, "requiere_ajuste": requiere_ajuste, "notas": notas}.items():
                if valor is not None: campos_actualizados.append(campo)
            res_json = json.dumps({"ok": True, "action": "created", "plan_evento_id": plan_evento_id, "campos_actualizados": campos_actualizados, "msg": "Plan del evento de convivencia guardado correctamente."})

        else:
            cursor.execute("SELECT evento_convivencia_id, hogar_id FROM planes_evento_convivencia WHERE id = %s", (plan_evento_id,))
            fila_plan = cursor.fetchone()
            if not fila_plan:
                res_json = json.dumps({"ok": False, "action": "error", "plan_evento_id": plan_evento_id, "campos_actualizados": [], "msg": "El plan indicado no existe."})
                logging.info(f"guardar_plan_evento_convivencia: Resultado JSON: {res_json}")
                return res_json
            evento_base_id = fila_plan[0]
            hogar_base_id = fila_plan[1]
            updates = []
            valores = []
            campos_actualizados = []
            if evento_convivencia_id is not None:
                cursor.execute("SELECT hogar_id FROM eventos_convivencia WHERE id = %s", (evento_convivencia_id,))
                fila_evento = cursor.fetchone()
                if not fila_evento:
                    res_json = json.dumps({"ok": False, "action": "error", "plan_evento_id": plan_evento_id, "campos_actualizados": [], "msg": "El evento de convivencia indicado no existe."})
                    logging.info(f"guardar_plan_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json
                if evento_convivencia_id != evento_base_id or fila_evento[0] != hogar_base_id:
                    res_json = json.dumps({"ok": False, "action": "error", "plan_evento_id": plan_evento_id, "campos_actualizados": [], "msg": "El plan indicado pertenece a otro evento u otro hogar y no puede moverse desde esta función."})
                    logging.info(f"guardar_plan_evento_convivencia: Resultado JSON: {res_json}")
                    return res_json
            if hogar_id is not None and hogar_id != hogar_base_id:
                res_json = json.dumps({"ok": False, "action": "error", "plan_evento_id": plan_evento_id, "campos_actualizados": [], "msg": "El plan indicado pertenece a otro hogar y no puede moverse desde esta función."})
                logging.info(f"guardar_plan_evento_convivencia: Resultado JSON: {res_json}")
                return res_json
            for campo, valor in {"tipo_recomendacion": tipo_recomendacion, "descripcion_recomendacion": descripcion_recomendacion, "objetivo": objetivo, "prioridad": prioridad, "plazo_seguimiento_dias": plazo_seguimiento_dias, "fecha_seguimiento_sugerida": fecha_seguimiento_sugerida, "estado_plan": estado_plan, "fue_aplicado": fue_aplicado, "fecha_aplicacion": fecha_aplicacion, "resultado_reportado": resultado_reportado, "efectividad_percibida": efectividad_percibida, "requiere_ajuste": requiere_ajuste, "notas": notas}.items():
                if valor is not None: updates.append(f"{campo} = %s"); valores.append(valor); campos_actualizados.append(campo)
            if not updates:
                res_json = json.dumps({"ok": False, "action": "error", "plan_evento_id": plan_evento_id, "campos_actualizados": [], "msg": "No hay campos para actualizar en el plan del evento."})
                logging.info(f"guardar_plan_evento_convivencia: Resultado JSON: {res_json}")
                return res_json
            valores.append(plan_evento_id)
            q = f"UPDATE planes_evento_convivencia SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()
            res_json = json.dumps({"ok": True, "action": "updated", "plan_evento_id": plan_evento_id, "campos_actualizados": campos_actualizados, "msg": "Plan del evento de convivencia actualizado correctamente."})
    except mysql.connector.Error as error:
        logging.error(f"guardar_plan_evento_convivencia: Error de base de datos: {error}")
        res_json = json.dumps({"ok": False, "action": "error", "plan_evento_id": plan_evento_id, "campos_actualizados": [], "msg": "Error técnico al guardar el plan del evento de convivencia."})
    finally:
        if cursor is not None: cursor.close()
        if conexion is not None and conexion.is_connected(): conexion.close()
    logging.info(f"guardar_plan_evento_convivencia: Resultado JSON: {res_json}")
    return res_json
```

