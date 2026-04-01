# Propuesta de tool actions para construir el perfil inicial de una mascota

## Enfoque recomendado

Felix debe usar una sola tool para guardar el perfil general de mascota.

- `guardar_mascota` crea o actualiza segun venga o no `mascota_id`
- todos los campos deben viajar siempre en la llamada
- los campos no informados deben enviarse como `null`, salvo booleanos con valor por defecto operativo
- las herramientas de salud distinguen entre condicion, evento, medicamento, tratamiento y documento
- cada funcion abre y cierra su propia conexion MySQL

## 1. Tool action `guardar_mascota`

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "mascota_id": { "type": ["integer", "null"], "minimum": 1 },
      "hogar_id": { "type": "integer", "minimum": 1 },
      "nombre": { "type": ["string", "null"] },
      "especie": { "type": ["string", "null"] },
      "sexo": { "type": ["string", "null"] },
      "raza": { "type": ["string", "null"] },
      "fecha_llegada_hogar": { "type": ["string", "null"] },
      "fecha_nacimiento_aproximada": { "type": ["string", "null"] },
      "edad_aproximada_valor": { "type": ["integer", "null"], "minimum": 0 },
      "edad_aproximada_unidad": { "type": ["string", "null"] },
      "origen_tipo": { "type": ["string", "null"] },
      "origen_detalle": { "type": ["string", "null"] },
      "paso_por_otros_hogares": { "type": ["boolean", "null"] },
      "detalle_otros_hogares": { "type": ["string", "null"] },
      "rasgos_fisicos": { "type": ["string", "null"] },
      "color_principal": { "type": ["string", "null"] },
      "tamanio_aproximado": { "type": ["string", "null"] },
      "esterilizado": { "type": ["boolean", "null"] },
      "fecha_esterilizacion": { "type": ["string", "null"] },
      "caracter_inicial": { "type": ["string", "null"] },
      "caracter_observado": { "type": ["string", "null"] },
      "observaciones_iniciales": { "type": ["string", "null"] }
    },
    "required": [
      "mascota_id",
      "hogar_id",
      "nombre",
      "especie",
      "sexo",
      "raza",
      "fecha_llegada_hogar",
      "fecha_nacimiento_aproximada",
      "edad_aproximada_valor",
      "edad_aproximada_unidad",
      "origen_tipo",
      "origen_detalle",
      "paso_por_otros_hogares",
      "detalle_otros_hogares",
      "rasgos_fisicos",
      "color_principal",
      "tamanio_aproximado",
      "esterilizado",
      "fecha_esterilizacion",
      "caracter_inicial",
      "caracter_observado",
      "observaciones_iniciales"
    ]
  }
}
```

### Funcion Python sugerida

```python
import json
import logging
import mysql.connector


def guardar_mascota(
    mascota_id,
    hogar_id,
    nombre,
    especie,
    sexo=None,
    raza=None,
    fecha_llegada_hogar=None,
    fecha_nacimiento_aproximada=None,
    edad_aproximada_valor=None,
    edad_aproximada_unidad=None,
    origen_tipo=None,
    origen_detalle=None,
    paso_por_otros_hogares=None,
    detalle_otros_hogares=None,
    rasgos_fisicos=None,
    color_principal=None,
    tamanio_aproximado=None,
    esterilizado=None,
    fecha_esterilizacion=None,
    caracter_inicial=None,
    caracter_observado=None,
    observaciones_iniciales=None,
):
    logging.info("guardar_mascota: Inicio de guardado de mascota.")

    conexion = None
    cursor = None

    if paso_por_otros_hogares is None:
        paso_por_otros_hogares = False

    campos = {
        "hogar_id": hogar_id,
        "nombre": nombre,
        "especie": especie,
        "sexo": sexo,
        "raza": raza,
        "fecha_llegada_hogar": fecha_llegada_hogar,
        "fecha_nacimiento_aproximada": fecha_nacimiento_aproximada,
        "edad_aproximada_valor": edad_aproximada_valor,
        "edad_aproximada_unidad": edad_aproximada_unidad,
        "origen_tipo": origen_tipo,
        "origen_detalle": origen_detalle,
        "paso_por_otros_hogares": paso_por_otros_hogares,
        "detalle_otros_hogares": detalle_otros_hogares,
        "rasgos_fisicos": rasgos_fisicos,
        "color_principal": color_principal,
        "tamanio_aproximado": tamanio_aproximado,
        "esterilizado": esterilizado,
        "fecha_esterilizacion": fecha_esterilizacion,
        "caracter_inicial": caracter_inicial,
        "caracter_observado": caracter_observado,
        "observaciones_iniciales": observaciones_iniciales,
    }

    try:
        conexion = mysql.connector.connect(
            host="localhost",
            user="felix",
            password="Ca29Si26$",
            database="felix"
        )
        cursor = conexion.cursor()

        if mascota_id is None:
            if not hogar_id or not nombre or not especie:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "mascota_id": mascota_id,
                    "campos_actualizados": [],
                    "msg": "Para crear una mascota se requieren `hogar_id`, `nombre` y `especie`."
                })
                logging.info(f"guardar_mascota: Resultado JSON: {res_json}")
                return res_json

            q = """
                INSERT INTO mascotas (
                    hogar_id, nombre, especie, sexo, raza, fecha_llegada_hogar,
                    fecha_nacimiento_aproximada, edad_aproximada_valor, edad_aproximada_unidad,
                    origen_tipo, origen_detalle, paso_por_otros_hogares, detalle_otros_hogares,
                    rasgos_fisicos, color_principal, tamanio_aproximado, esterilizado,
                    fecha_esterilizacion, caracter_inicial, caracter_observado, observaciones_iniciales
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(
                q,
                (
                    hogar_id,
                    nombre,
                    especie,
                    sexo,
                    raza,
                    fecha_llegada_hogar,
                    fecha_nacimiento_aproximada,
                    edad_aproximada_valor,
                    edad_aproximada_unidad,
                    origen_tipo,
                    origen_detalle,
                    paso_por_otros_hogares,
                    detalle_otros_hogares,
                    rasgos_fisicos,
                    color_principal,
                    tamanio_aproximado,
                    esterilizado,
                    fecha_esterilizacion,
                    caracter_inicial,
                    caracter_observado,
                    observaciones_iniciales,
                ),
            )
            conexion.commit()
            mascota_id = cursor.lastrowid
            campos_actualizados = [campo for campo, valor in campos.items() if valor is not None]
            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "mascota_id": mascota_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Perfil general de mascota creado correctamente."
            })
        else:
            cursor.execute("SELECT id FROM mascotas WHERE id = %s", (mascota_id,))
            fila = cursor.fetchone()

            if not fila:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "mascota_id": mascota_id,
                    "campos_actualizados": [],
                    "msg": "La mascota indicada no existe."
                })
                logging.info(f"guardar_mascota: Resultado JSON: {res_json}")
                return res_json

            updates = []
            valores = []
            campos_actualizados = []

            for campo, valor in campos.items():
                if valor is not None:
                    updates.append(f"{campo} = %s")
                    valores.append(valor)
                    campos_actualizados.append(campo)

            if not updates:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "mascota_id": mascota_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en la mascota."
                })
                logging.info(f"guardar_mascota: Resultado JSON: {res_json}")
                return res_json

            valores.append(mascota_id)
            q = f"UPDATE mascotas SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()
            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "mascota_id": mascota_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Perfil general de mascota actualizado correctamente."
            })
    except mysql.connector.Error as error:
        logging.error(f"guardar_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "mascota_id": mascota_id,
            "campos_actualizados": [],
            "msg": "Error tecnico al guardar la mascota."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_mascota: Resultado JSON: {res_json}")
    return res_json
```

## 2. Tool action `guardar_condicion_salud_mascota`

**Propósito**
Registrar o actualizar una condición de salud persistente o relevante en el tiempo, como alergias, enfermedades crónicas, limitaciones o condiciones que conviene seguir observando.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_condicion_salud_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "condicion_id": { "type": ["integer", "null"], "minimum": 1 },
      "mascota_id": { "type": ["integer", "null"], "minimum": 1 },
      "tipo_condicion": { "type": ["string", "null"] },
      "descripcion": { "type": ["string", "null"] },
      "origen": { "type": ["string", "null"] },
      "vigente": { "type": ["boolean", "null"] },
      "fecha_inicio": { "type": ["string", "null"] },
      "fecha_fin": { "type": ["string", "null"] },
      "notas": { "type": ["string", "null"] }
    },
    "required": [
      "condicion_id",
      "mascota_id",
      "tipo_condicion",
      "descripcion",
      "origen",
      "vigente",
      "fecha_inicio",
      "fecha_fin",
      "notas"
    ]
  }
}
```

```python
import json
import logging
import mysql.connector


def guardar_condicion_salud_mascota(
    condicion_id,
    mascota_id,
    tipo_condicion,
    descripcion=None,
    origen=None,
    vigente=None,
    fecha_inicio=None,
    fecha_fin=None,
    notas=None,
):
    logging.info("guardar_condicion_salud_mascota: Inicio de guardado.")

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

        if condicion_id is None:
            if not mascota_id or not tipo_condicion:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "condicion_id": condicion_id,
                    "campos_actualizados": [],
                    "msg": "Para crear una condición se requieren `mascota_id` y `tipo_condicion`."
                })
                logging.info(f"guardar_condicion_salud_mascota: Resultado JSON: {res_json}")
                return res_json

            cursor.execute("SELECT id FROM mascotas WHERE id = %s", (mascota_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "condicion_id": condicion_id,
                    "campos_actualizados": [],
                    "msg": "La mascota indicada no existe."
                })
                logging.info(f"guardar_condicion_salud_mascota: Resultado JSON: {res_json}")
                return res_json

            vigente_insert = True if vigente is None else vigente

            q = """
                INSERT INTO mascota_condiciones_salud (
                    mascota_id, tipo_condicion, descripcion, origen,
                    vigente, fecha_inicio, fecha_fin, notas
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(
                q,
                (
                    mascota_id,
                    tipo_condicion,
                    descripcion,
                    origen,
                    vigente_insert,
                    fecha_inicio,
                    fecha_fin,
                    notas,
                ),
            )
            conexion.commit()
            condicion_id = cursor.lastrowid

            campos_actualizados = ["mascota_id", "tipo_condicion"]
            if descripcion is not None:
                campos_actualizados.append("descripcion")
            if origen is not None:
                campos_actualizados.append("origen")
            if vigente is not None:
                campos_actualizados.append("vigente")
            if fecha_inicio is not None:
                campos_actualizados.append("fecha_inicio")
            if fecha_fin is not None:
                campos_actualizados.append("fecha_fin")
            if notas is not None:
                campos_actualizados.append("notas")

            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "condicion_id": condicion_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Condición de salud guardada correctamente."
            })
        else:
            cursor.execute("SELECT id FROM mascota_condiciones_salud WHERE id = %s", (condicion_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "condicion_id": condicion_id,
                    "campos_actualizados": [],
                    "msg": "La condición indicada no existe."
                })
                logging.info(f"guardar_condicion_salud_mascota: Resultado JSON: {res_json}")
                return res_json

            updates = []
            valores = []
            campos_actualizados = []

            if mascota_id is not None:
                cursor.execute("SELECT id FROM mascotas WHERE id = %s", (mascota_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "condicion_id": condicion_id,
                        "campos_actualizados": [],
                        "msg": "La mascota indicada no existe."
                    })
                    logging.info(f"guardar_condicion_salud_mascota: Resultado JSON: {res_json}")
                    return res_json
                updates.append("mascota_id = %s")
                valores.append(mascota_id)
                campos_actualizados.append("mascota_id")

            campos = {
                "tipo_condicion": tipo_condicion,
                "descripcion": descripcion,
                "origen": origen,
                "vigente": vigente,
                "fecha_inicio": fecha_inicio,
                "fecha_fin": fecha_fin,
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
                    "condicion_id": condicion_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en la condición."
                })
                logging.info(f"guardar_condicion_salud_mascota: Resultado JSON: {res_json}")
                return res_json

            valores.append(condicion_id)
            q = f"UPDATE mascota_condiciones_salud SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()

            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "condicion_id": condicion_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Condición de salud actualizada correctamente."
            })

    except mysql.connector.Error as error:
        logging.error(f"guardar_condicion_salud_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "condicion_id": condicion_id,
            "campos_actualizados": [],
            "msg": "Error técnico al guardar la condición de salud."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_condicion_salud_mascota: Resultado JSON: {res_json}")
    return res_json
```

## 3. Tool action `guardar_evento_salud_mascota`

**Propósito**
Registrar o actualizar un evento puntual de salud, como una consulta, una urgencia, un accidente, una cirugía o un control.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_evento_salud_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "evento_salud_id": { "type": ["integer", "null"], "minimum": 1 },
      "mascota_id": { "type": ["integer", "null"], "minimum": 1 },
      "condicion_id": { "type": ["integer", "null"], "minimum": 1 },
      "tipo_evento": { "type": ["string", "null"] },
      "fecha_evento": { "type": ["string", "null"] },
      "motivo_consulta": { "type": ["string", "null"] },
      "diagnostico_reportado": { "type": ["string", "null"] },
      "procedimiento_realizado": { "type": ["string", "null"] },
      "veterinario": { "type": ["string", "null"] },
      "centro_veterinario": { "type": ["string", "null"] },
      "resultado": { "type": ["string", "null"] },
      "requiere_seguimiento": { "type": ["boolean", "null"] },
      "notas": { "type": ["string", "null"] }
    },
    "required": [
      "evento_salud_id",
      "mascota_id",
      "condicion_id",
      "tipo_evento",
      "fecha_evento",
      "motivo_consulta",
      "diagnostico_reportado",
      "procedimiento_realizado",
      "veterinario",
      "centro_veterinario",
      "resultado",
      "requiere_seguimiento",
      "notas"
    ]
  }
}
```

```python
import json
import logging
import mysql.connector


def guardar_evento_salud_mascota(
    evento_salud_id,
    mascota_id,
    condicion_id=None,
    tipo_evento=None,
    fecha_evento=None,
    motivo_consulta=None,
    diagnostico_reportado=None,
    procedimiento_realizado=None,
    veterinario=None,
    centro_veterinario=None,
    resultado=None,
    requiere_seguimiento=None,
    notas=None,
):
    logging.info("guardar_evento_salud_mascota: Inicio de guardado.")

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

        if evento_salud_id is None:
            if not mascota_id or not tipo_evento:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "evento_salud_id": evento_salud_id,
                    "campos_actualizados": [],
                    "msg": "Para crear un evento de salud se requieren `mascota_id` y `tipo_evento`."
                })
                logging.info(f"guardar_evento_salud_mascota: Resultado JSON: {res_json}")
                return res_json

            cursor.execute("SELECT id FROM mascotas WHERE id = %s", (mascota_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "evento_salud_id": evento_salud_id,
                    "campos_actualizados": [],
                    "msg": "La mascota indicada no existe."
                })
                logging.info(f"guardar_evento_salud_mascota: Resultado JSON: {res_json}")
                return res_json

            if condicion_id is not None:
                cursor.execute("SELECT id FROM mascota_condiciones_salud WHERE id = %s", (condicion_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "evento_salud_id": evento_salud_id,
                        "campos_actualizados": [],
                        "msg": "La condición de salud indicada no existe."
                    })
                    logging.info(f"guardar_evento_salud_mascota: Resultado JSON: {res_json}")
                    return res_json

            seguimiento_insert = False if requiere_seguimiento is None else requiere_seguimiento

            q = """
                INSERT INTO mascota_eventos_salud (
                    mascota_id, condicion_id, tipo_evento, fecha_evento, motivo_consulta,
                    diagnostico_reportado, procedimiento_realizado, veterinario,
                    centro_veterinario, resultado, requiere_seguimiento, notas
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(
                q,
                (
                    mascota_id,
                    condicion_id,
                    tipo_evento,
                    fecha_evento,
                    motivo_consulta,
                    diagnostico_reportado,
                    procedimiento_realizado,
                    veterinario,
                    centro_veterinario,
                    resultado,
                    seguimiento_insert,
                    notas,
                ),
            )
            conexion.commit()
            evento_salud_id = cursor.lastrowid

            campos_actualizados = ["mascota_id", "tipo_evento"]
            if condicion_id is not None:
                campos_actualizados.append("condicion_id")
            if fecha_evento is not None:
                campos_actualizados.append("fecha_evento")
            if motivo_consulta is not None:
                campos_actualizados.append("motivo_consulta")
            if diagnostico_reportado is not None:
                campos_actualizados.append("diagnostico_reportado")
            if procedimiento_realizado is not None:
                campos_actualizados.append("procedimiento_realizado")
            if veterinario is not None:
                campos_actualizados.append("veterinario")
            if centro_veterinario is not None:
                campos_actualizados.append("centro_veterinario")
            if resultado is not None:
                campos_actualizados.append("resultado")
            if requiere_seguimiento is not None:
                campos_actualizados.append("requiere_seguimiento")
            if notas is not None:
                campos_actualizados.append("notas")

            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "evento_salud_id": evento_salud_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Evento de salud guardado correctamente."
            })
        else:
            cursor.execute("SELECT id FROM mascota_eventos_salud WHERE id = %s", (evento_salud_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "evento_salud_id": evento_salud_id,
                    "campos_actualizados": [],
                    "msg": "El evento de salud indicado no existe."
                })
                logging.info(f"guardar_evento_salud_mascota: Resultado JSON: {res_json}")
                return res_json

            updates = []
            valores = []
            campos_actualizados = []

            if mascota_id is not None:
                cursor.execute("SELECT id FROM mascotas WHERE id = %s", (mascota_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "evento_salud_id": evento_salud_id,
                        "campos_actualizados": [],
                        "msg": "La mascota indicada no existe."
                    })
                    logging.info(f"guardar_evento_salud_mascota: Resultado JSON: {res_json}")
                    return res_json
                updates.append("mascota_id = %s")
                valores.append(mascota_id)
                campos_actualizados.append("mascota_id")

            if condicion_id is not None:
                cursor.execute("SELECT id FROM mascota_condiciones_salud WHERE id = %s", (condicion_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "evento_salud_id": evento_salud_id,
                        "campos_actualizados": [],
                        "msg": "La condición de salud indicada no existe."
                    })
                    logging.info(f"guardar_evento_salud_mascota: Resultado JSON: {res_json}")
                    return res_json
                updates.append("condicion_id = %s")
                valores.append(condicion_id)
                campos_actualizados.append("condicion_id")

            campos = {
                "tipo_evento": tipo_evento,
                "fecha_evento": fecha_evento,
                "motivo_consulta": motivo_consulta,
                "diagnostico_reportado": diagnostico_reportado,
                "procedimiento_realizado": procedimiento_realizado,
                "veterinario": veterinario,
                "centro_veterinario": centro_veterinario,
                "resultado": resultado,
                "requiere_seguimiento": requiere_seguimiento,
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
                    "evento_salud_id": evento_salud_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en el evento de salud."
                })
                logging.info(f"guardar_evento_salud_mascota: Resultado JSON: {res_json}")
                return res_json

            valores.append(evento_salud_id)
            q = f"UPDATE mascota_eventos_salud SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()

            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "evento_salud_id": evento_salud_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Evento de salud actualizado correctamente."
            })

    except mysql.connector.Error as error:
        logging.error(f"guardar_evento_salud_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "evento_salud_id": evento_salud_id,
            "campos_actualizados": [],
            "msg": "Error técnico al guardar el evento de salud."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_evento_salud_mascota: Resultado JSON: {res_json}")
    return res_json
```

## 4. Tool action `guardar_medicamento_mascota`

**Propósito**
Registrar o actualizar un medicamento asociado a una mascota, con o sin vínculo a una condición o a un evento de salud.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_medicamento_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "medicamento_id": { "type": ["integer", "null"], "minimum": 1 },
      "mascota_id": { "type": ["integer", "null"], "minimum": 1 },
      "condicion_id": { "type": ["integer", "null"], "minimum": 1 },
      "evento_salud_id": { "type": ["integer", "null"], "minimum": 1 },
      "nombre_medicamento": { "type": ["string", "null"] },
      "motivo": { "type": ["string", "null"] },
      "dosis": { "type": ["string", "null"] },
      "frecuencia": { "type": ["string", "null"] },
      "via_administracion": { "type": ["string", "null"] },
      "fecha_inicio": { "type": ["string", "null"] },
      "fecha_fin": { "type": ["string", "null"] },
      "vigente": { "type": ["boolean", "null"] },
      "recetado_por": { "type": ["string", "null"] },
      "notas": { "type": ["string", "null"] }
    },
    "required": [
      "medicamento_id",
      "mascota_id",
      "condicion_id",
      "evento_salud_id",
      "nombre_medicamento",
      "motivo",
      "dosis",
      "frecuencia",
      "via_administracion",
      "fecha_inicio",
      "fecha_fin",
      "vigente",
      "recetado_por",
      "notas"
    ]
  }
}
```

```python
import json
import logging
import mysql.connector


def guardar_medicamento_mascota(
    medicamento_id,
    mascota_id,
    condicion_id=None,
    evento_salud_id=None,
    nombre_medicamento=None,
    motivo=None,
    dosis=None,
    frecuencia=None,
    via_administracion=None,
    fecha_inicio=None,
    fecha_fin=None,
    vigente=None,
    recetado_por=None,
    notas=None,
):
    logging.info("guardar_medicamento_mascota: Inicio de guardado.")

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

        if medicamento_id is None:
            if not mascota_id or not nombre_medicamento:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "medicamento_id": medicamento_id,
                    "campos_actualizados": [],
                    "msg": "Para crear un medicamento se requieren `mascota_id` y `nombre_medicamento`."
                })
                logging.info(f"guardar_medicamento_mascota: Resultado JSON: {res_json}")
                return res_json

            cursor.execute("SELECT id FROM mascotas WHERE id = %s", (mascota_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "medicamento_id": medicamento_id,
                    "campos_actualizados": [],
                    "msg": "La mascota indicada no existe."
                })
                logging.info(f"guardar_medicamento_mascota: Resultado JSON: {res_json}")
                return res_json

            if condicion_id is not None:
                cursor.execute("SELECT id FROM mascota_condiciones_salud WHERE id = %s", (condicion_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "medicamento_id": medicamento_id,
                        "campos_actualizados": [],
                        "msg": "La condición de salud indicada no existe."
                    })
                    logging.info(f"guardar_medicamento_mascota: Resultado JSON: {res_json}")
                    return res_json

            if evento_salud_id is not None:
                cursor.execute("SELECT id FROM mascota_eventos_salud WHERE id = %s", (evento_salud_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "medicamento_id": medicamento_id,
                        "campos_actualizados": [],
                        "msg": "El evento de salud indicado no existe."
                    })
                    logging.info(f"guardar_medicamento_mascota: Resultado JSON: {res_json}")
                    return res_json

            vigente_insert = True if vigente is None else vigente

            q = """
                INSERT INTO mascota_medicamentos (
                    mascota_id, condicion_id, evento_salud_id, nombre_medicamento,
                    motivo, dosis, frecuencia, via_administracion, fecha_inicio,
                    fecha_fin, vigente, recetado_por, notas
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(
                q,
                (
                    mascota_id,
                    condicion_id,
                    evento_salud_id,
                    nombre_medicamento,
                    motivo,
                    dosis,
                    frecuencia,
                    via_administracion,
                    fecha_inicio,
                    fecha_fin,
                    vigente_insert,
                    recetado_por,
                    notas,
                ),
            )
            conexion.commit()
            medicamento_id = cursor.lastrowid

            campos_actualizados = ["mascota_id", "nombre_medicamento"]
            if condicion_id is not None:
                campos_actualizados.append("condicion_id")
            if evento_salud_id is not None:
                campos_actualizados.append("evento_salud_id")
            if motivo is not None:
                campos_actualizados.append("motivo")
            if dosis is not None:
                campos_actualizados.append("dosis")
            if frecuencia is not None:
                campos_actualizados.append("frecuencia")
            if via_administracion is not None:
                campos_actualizados.append("via_administracion")
            if fecha_inicio is not None:
                campos_actualizados.append("fecha_inicio")
            if fecha_fin is not None:
                campos_actualizados.append("fecha_fin")
            if vigente is not None:
                campos_actualizados.append("vigente")
            if recetado_por is not None:
                campos_actualizados.append("recetado_por")
            if notas is not None:
                campos_actualizados.append("notas")

            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "medicamento_id": medicamento_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Medicamento guardado correctamente."
            })
        else:
            cursor.execute("SELECT id FROM mascota_medicamentos WHERE id = %s", (medicamento_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "medicamento_id": medicamento_id,
                    "campos_actualizados": [],
                    "msg": "El medicamento indicado no existe."
                })
                logging.info(f"guardar_medicamento_mascota: Resultado JSON: {res_json}")
                return res_json

            updates = []
            valores = []
            campos_actualizados = []

            if mascota_id is not None:
                cursor.execute("SELECT id FROM mascotas WHERE id = %s", (mascota_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "medicamento_id": medicamento_id,
                        "campos_actualizados": [],
                        "msg": "La mascota indicada no existe."
                    })
                    logging.info(f"guardar_medicamento_mascota: Resultado JSON: {res_json}")
                    return res_json
                updates.append("mascota_id = %s")
                valores.append(mascota_id)
                campos_actualizados.append("mascota_id")

            if condicion_id is not None:
                cursor.execute("SELECT id FROM mascota_condiciones_salud WHERE id = %s", (condicion_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "medicamento_id": medicamento_id,
                        "campos_actualizados": [],
                        "msg": "La condición de salud indicada no existe."
                    })
                    logging.info(f"guardar_medicamento_mascota: Resultado JSON: {res_json}")
                    return res_json
                updates.append("condicion_id = %s")
                valores.append(condicion_id)
                campos_actualizados.append("condicion_id")

            if evento_salud_id is not None:
                cursor.execute("SELECT id FROM mascota_eventos_salud WHERE id = %s", (evento_salud_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "medicamento_id": medicamento_id,
                        "campos_actualizados": [],
                        "msg": "El evento de salud indicado no existe."
                    })
                    logging.info(f"guardar_medicamento_mascota: Resultado JSON: {res_json}")
                    return res_json
                updates.append("evento_salud_id = %s")
                valores.append(evento_salud_id)
                campos_actualizados.append("evento_salud_id")

            campos = {
                "nombre_medicamento": nombre_medicamento,
                "motivo": motivo,
                "dosis": dosis,
                "frecuencia": frecuencia,
                "via_administracion": via_administracion,
                "fecha_inicio": fecha_inicio,
                "fecha_fin": fecha_fin,
                "vigente": vigente,
                "recetado_por": recetado_por,
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
                    "medicamento_id": medicamento_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en el medicamento."
                })
                logging.info(f"guardar_medicamento_mascota: Resultado JSON: {res_json}")
                return res_json

            valores.append(medicamento_id)
            q = f"UPDATE mascota_medicamentos SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()

            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "medicamento_id": medicamento_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Medicamento actualizado correctamente."
            })

    except mysql.connector.Error as error:
        logging.error(f"guardar_medicamento_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "medicamento_id": medicamento_id,
            "campos_actualizados": [],
            "msg": "Error técnico al guardar el medicamento."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_medicamento_mascota: Resultado JSON: {res_json}")
    return res_json
```

## 5. Tool action `guardar_tratamiento_mascota`

**Propósito**
Registrar o actualizar un tratamiento asociado a una mascota, con o sin vínculo a una condición o a un evento de salud.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_tratamiento_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "tratamiento_id": { "type": ["integer", "null"], "minimum": 1 },
      "mascota_id": { "type": ["integer", "null"], "minimum": 1 },
      "condicion_id": { "type": ["integer", "null"], "minimum": 1 },
      "evento_salud_id": { "type": ["integer", "null"], "minimum": 1 },
      "tipo_tratamiento": { "type": ["string", "null"] },
      "descripcion": { "type": ["string", "null"] },
      "objetivo": { "type": ["string", "null"] },
      "fecha_inicio": { "type": ["string", "null"] },
      "fecha_fin": { "type": ["string", "null"] },
      "vigente": { "type": ["boolean", "null"] },
      "responsable": { "type": ["string", "null"] },
      "notas": { "type": ["string", "null"] }
    },
    "required": [
      "tratamiento_id",
      "mascota_id",
      "condicion_id",
      "evento_salud_id",
      "tipo_tratamiento",
      "descripcion",
      "objetivo",
      "fecha_inicio",
      "fecha_fin",
      "vigente",
      "responsable",
      "notas"
    ]
  }
}
```

```python
import json
import logging
import mysql.connector


def guardar_tratamiento_mascota(
    tratamiento_id,
    mascota_id,
    condicion_id=None,
    evento_salud_id=None,
    tipo_tratamiento=None,
    descripcion=None,
    objetivo=None,
    fecha_inicio=None,
    fecha_fin=None,
    vigente=None,
    responsable=None,
    notas=None,
):
    logging.info("guardar_tratamiento_mascota: Inicio de guardado.")

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

        if tratamiento_id is None:
            if not mascota_id or not tipo_tratamiento:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "tratamiento_id": tratamiento_id,
                    "campos_actualizados": [],
                    "msg": "Para crear un tratamiento se requieren `mascota_id` y `tipo_tratamiento`."
                })
                logging.info(f"guardar_tratamiento_mascota: Resultado JSON: {res_json}")
                return res_json

            cursor.execute("SELECT id FROM mascotas WHERE id = %s", (mascota_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "tratamiento_id": tratamiento_id,
                    "campos_actualizados": [],
                    "msg": "La mascota indicada no existe."
                })
                logging.info(f"guardar_tratamiento_mascota: Resultado JSON: {res_json}")
                return res_json

            if condicion_id is not None:
                cursor.execute("SELECT id FROM mascota_condiciones_salud WHERE id = %s", (condicion_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "tratamiento_id": tratamiento_id,
                        "campos_actualizados": [],
                        "msg": "La condición de salud indicada no existe."
                    })
                    logging.info(f"guardar_tratamiento_mascota: Resultado JSON: {res_json}")
                    return res_json

            if evento_salud_id is not None:
                cursor.execute("SELECT id FROM mascota_eventos_salud WHERE id = %s", (evento_salud_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "tratamiento_id": tratamiento_id,
                        "campos_actualizados": [],
                        "msg": "El evento de salud indicado no existe."
                    })
                    logging.info(f"guardar_tratamiento_mascota: Resultado JSON: {res_json}")
                    return res_json

            vigente_insert = True if vigente is None else vigente

            q = """
                INSERT INTO mascota_tratamientos (
                    mascota_id, condicion_id, evento_salud_id, tipo_tratamiento,
                    descripcion, objetivo, fecha_inicio, fecha_fin, vigente,
                    responsable, notas
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(
                q,
                (
                    mascota_id,
                    condicion_id,
                    evento_salud_id,
                    tipo_tratamiento,
                    descripcion,
                    objetivo,
                    fecha_inicio,
                    fecha_fin,
                    vigente_insert,
                    responsable,
                    notas,
                ),
            )
            conexion.commit()
            tratamiento_id = cursor.lastrowid

            campos_actualizados = ["mascota_id", "tipo_tratamiento"]
            if condicion_id is not None:
                campos_actualizados.append("condicion_id")
            if evento_salud_id is not None:
                campos_actualizados.append("evento_salud_id")
            if descripcion is not None:
                campos_actualizados.append("descripcion")
            if objetivo is not None:
                campos_actualizados.append("objetivo")
            if fecha_inicio is not None:
                campos_actualizados.append("fecha_inicio")
            if fecha_fin is not None:
                campos_actualizados.append("fecha_fin")
            if vigente is not None:
                campos_actualizados.append("vigente")
            if responsable is not None:
                campos_actualizados.append("responsable")
            if notas is not None:
                campos_actualizados.append("notas")

            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "tratamiento_id": tratamiento_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Tratamiento guardado correctamente."
            })
        else:
            cursor.execute("SELECT id FROM mascota_tratamientos WHERE id = %s", (tratamiento_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "tratamiento_id": tratamiento_id,
                    "campos_actualizados": [],
                    "msg": "El tratamiento indicado no existe."
                })
                logging.info(f"guardar_tratamiento_mascota: Resultado JSON: {res_json}")
                return res_json

            updates = []
            valores = []
            campos_actualizados = []

            if mascota_id is not None:
                cursor.execute("SELECT id FROM mascotas WHERE id = %s", (mascota_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "tratamiento_id": tratamiento_id,
                        "campos_actualizados": [],
                        "msg": "La mascota indicada no existe."
                    })
                    logging.info(f"guardar_tratamiento_mascota: Resultado JSON: {res_json}")
                    return res_json
                updates.append("mascota_id = %s")
                valores.append(mascota_id)
                campos_actualizados.append("mascota_id")

            if condicion_id is not None:
                cursor.execute("SELECT id FROM mascota_condiciones_salud WHERE id = %s", (condicion_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "tratamiento_id": tratamiento_id,
                        "campos_actualizados": [],
                        "msg": "La condición de salud indicada no existe."
                    })
                    logging.info(f"guardar_tratamiento_mascota: Resultado JSON: {res_json}")
                    return res_json
                updates.append("condicion_id = %s")
                valores.append(condicion_id)
                campos_actualizados.append("condicion_id")

            if evento_salud_id is not None:
                cursor.execute("SELECT id FROM mascota_eventos_salud WHERE id = %s", (evento_salud_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "tratamiento_id": tratamiento_id,
                        "campos_actualizados": [],
                        "msg": "El evento de salud indicado no existe."
                    })
                    logging.info(f"guardar_tratamiento_mascota: Resultado JSON: {res_json}")
                    return res_json
                updates.append("evento_salud_id = %s")
                valores.append(evento_salud_id)
                campos_actualizados.append("evento_salud_id")

            campos = {
                "tipo_tratamiento": tipo_tratamiento,
                "descripcion": descripcion,
                "objetivo": objetivo,
                "fecha_inicio": fecha_inicio,
                "fecha_fin": fecha_fin,
                "vigente": vigente,
                "responsable": responsable,
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
                    "tratamiento_id": tratamiento_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en el tratamiento."
                })
                logging.info(f"guardar_tratamiento_mascota: Resultado JSON: {res_json}")
                return res_json

            valores.append(tratamiento_id)
            q = f"UPDATE mascota_tratamientos SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()

            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "tratamiento_id": tratamiento_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Tratamiento actualizado correctamente."
            })

    except mysql.connector.Error as error:
        logging.error(f"guardar_tratamiento_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "tratamiento_id": tratamiento_id,
            "campos_actualizados": [],
            "msg": "Error técnico al guardar el tratamiento."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_tratamiento_mascota: Resultado JSON: {res_json}")
    return res_json
```

## 6. Tool action `guardar_documento_salud_mascota`

**Propósito**
Registrar o actualizar un documento clínico asociado a una mascota, como fórmula médica, orden, receta, examen o soporte veterinario.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_documento_salud_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "documento_id": { "type": ["integer", "null"], "minimum": 1 },
      "mascota_id": { "type": ["integer", "null"], "minimum": 1 },
      "condicion_id": { "type": ["integer", "null"], "minimum": 1 },
      "evento_salud_id": { "type": ["integer", "null"], "minimum": 1 },
      "tipo_documento": { "type": ["string", "null"] },
      "archivo_url": { "type": ["string", "null"] },
      "nombre_archivo": { "type": ["string", "null"] },
      "mime_type": { "type": ["string", "null"] },
      "fecha_documento": { "type": ["string", "null"] },
      "descripcion": { "type": ["string", "null"] }
    },
    "required": [
      "documento_id",
      "mascota_id",
      "condicion_id",
      "evento_salud_id",
      "tipo_documento",
      "archivo_url",
      "nombre_archivo",
      "mime_type",
      "fecha_documento",
      "descripcion"
    ]
  }
}
```

```python
import json
import logging
import mysql.connector


def guardar_documento_salud_mascota(
    documento_id,
    mascota_id,
    condicion_id=None,
    evento_salud_id=None,
    tipo_documento=None,
    archivo_url=None,
    nombre_archivo=None,
    mime_type=None,
    fecha_documento=None,
    descripcion=None,
):
    logging.info("guardar_documento_salud_mascota: Inicio de guardado.")

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

        if documento_id is None:
            if not mascota_id or not tipo_documento or not archivo_url:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "documento_id": documento_id,
                    "campos_actualizados": [],
                    "msg": "Para crear un documento se requieren `mascota_id`, `tipo_documento` y `archivo_url`."
                })
                logging.info(f"guardar_documento_salud_mascota: Resultado JSON: {res_json}")
                return res_json

            cursor.execute("SELECT id FROM mascotas WHERE id = %s", (mascota_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "documento_id": documento_id,
                    "campos_actualizados": [],
                    "msg": "La mascota indicada no existe."
                })
                logging.info(f"guardar_documento_salud_mascota: Resultado JSON: {res_json}")
                return res_json

            if condicion_id is not None:
                cursor.execute("SELECT id FROM mascota_condiciones_salud WHERE id = %s", (condicion_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "documento_id": documento_id,
                        "campos_actualizados": [],
                        "msg": "La condición de salud indicada no existe."
                    })
                    logging.info(f"guardar_documento_salud_mascota: Resultado JSON: {res_json}")
                    return res_json

            if evento_salud_id is not None:
                cursor.execute("SELECT id FROM mascota_eventos_salud WHERE id = %s", (evento_salud_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "documento_id": documento_id,
                        "campos_actualizados": [],
                        "msg": "El evento de salud indicado no existe."
                    })
                    logging.info(f"guardar_documento_salud_mascota: Resultado JSON: {res_json}")
                    return res_json

            q = """
                INSERT INTO mascota_documentos_salud (
                    mascota_id, condicion_id, evento_salud_id, tipo_documento,
                    nombre_archivo, archivo_url, mime_type, fecha_documento, descripcion
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(
                q,
                (
                    mascota_id,
                    condicion_id,
                    evento_salud_id,
                    tipo_documento,
                    nombre_archivo,
                    archivo_url,
                    mime_type,
                    fecha_documento,
                    descripcion,
                ),
            )
            conexion.commit()
            documento_id = cursor.lastrowid

            campos_actualizados = ["mascota_id", "tipo_documento", "archivo_url"]
            if condicion_id is not None:
                campos_actualizados.append("condicion_id")
            if evento_salud_id is not None:
                campos_actualizados.append("evento_salud_id")
            if nombre_archivo is not None:
                campos_actualizados.append("nombre_archivo")
            if mime_type is not None:
                campos_actualizados.append("mime_type")
            if fecha_documento is not None:
                campos_actualizados.append("fecha_documento")
            if descripcion is not None:
                campos_actualizados.append("descripcion")

            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "documento_id": documento_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Documento de salud guardado correctamente."
            })
        else:
            cursor.execute("SELECT id FROM mascota_documentos_salud WHERE id = %s", (documento_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "documento_id": documento_id,
                    "campos_actualizados": [],
                    "msg": "El documento indicado no existe."
                })
                logging.info(f"guardar_documento_salud_mascota: Resultado JSON: {res_json}")
                return res_json

            updates = []
            valores = []
            campos_actualizados = []

            if mascota_id is not None:
                cursor.execute("SELECT id FROM mascotas WHERE id = %s", (mascota_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "documento_id": documento_id,
                        "campos_actualizados": [],
                        "msg": "La mascota indicada no existe."
                    })
                    logging.info(f"guardar_documento_salud_mascota: Resultado JSON: {res_json}")
                    return res_json
                updates.append("mascota_id = %s")
                valores.append(mascota_id)
                campos_actualizados.append("mascota_id")

            if condicion_id is not None:
                cursor.execute("SELECT id FROM mascota_condiciones_salud WHERE id = %s", (condicion_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "documento_id": documento_id,
                        "campos_actualizados": [],
                        "msg": "La condición de salud indicada no existe."
                    })
                    logging.info(f"guardar_documento_salud_mascota: Resultado JSON: {res_json}")
                    return res_json
                updates.append("condicion_id = %s")
                valores.append(condicion_id)
                campos_actualizados.append("condicion_id")

            if evento_salud_id is not None:
                cursor.execute("SELECT id FROM mascota_eventos_salud WHERE id = %s", (evento_salud_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "documento_id": documento_id,
                        "campos_actualizados": [],
                        "msg": "El evento de salud indicado no existe."
                    })
                    logging.info(f"guardar_documento_salud_mascota: Resultado JSON: {res_json}")
                    return res_json
                updates.append("evento_salud_id = %s")
                valores.append(evento_salud_id)
                campos_actualizados.append("evento_salud_id")

            campos = {
                "tipo_documento": tipo_documento,
                "archivo_url": archivo_url,
                "nombre_archivo": nombre_archivo,
                "mime_type": mime_type,
                "fecha_documento": fecha_documento,
                "descripcion": descripcion,
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
                    "documento_id": documento_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en el documento."
                })
                logging.info(f"guardar_documento_salud_mascota: Resultado JSON: {res_json}")
                return res_json

            valores.append(documento_id)
            q = f"UPDATE mascota_documentos_salud SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()

            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "documento_id": documento_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Documento de salud actualizado correctamente."
            })

    except mysql.connector.Error as error:
        logging.error(f"guardar_documento_salud_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "documento_id": documento_id,
            "campos_actualizados": [],
            "msg": "Error técnico al guardar el documento de salud."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_documento_salud_mascota: Resultado JSON: {res_json}")
    return res_json
```


## Regla conversacional asociada

Felix debe registrar por capas, sin interrogar ni abrumar al usuario, enviar siempre todos los campos del perfil general usando `null` en los no informados y confirmar brevemente lo que quedo guardado despues de cada tool action.





