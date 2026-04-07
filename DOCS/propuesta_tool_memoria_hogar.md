# Propuesta de tool actions para construir la memoria del hogar

## Enfoque recomendado

Félix debe construir la memoria del hogar por capas, de forma conversacional y sin volver el proceso un formulario técnico.

- contexto general del hogar
- personas del grupo familiar
- espacios relevantes
- recursos para las mascotas
- interacciones observadas
- observaciones generales del contexto

La lógica general es consistente con el punto 1:
- `guardar_hogar_contexto(...)` puede crear hogar cuando `hogar_id` viene en `null`, o completar y actualizar un hogar existente cuando `hogar_id` viene con valor
- en `persona`, `espacio`, `recurso`, `interacción` y `observación`, si el ID principal viene en `null`, la función crea
- si el ID principal viene con valor, la misma función actualiza
- en una actualización, solo se cambian los campos cuyo valor no sea `None`
- `null` significa “no informado ahora” o “no cambiar ahora”, no borrar

Nota operativa para evitar duplicados conversacionales:
- antes de crear una nueva persona, espacio o recurso, el sistema debería intentar resolver si ya existe uno equivalente dentro del hogar activo
- esta propuesta no implementa buscadores complejos, pero deja esa validación como criterio recomendado de operación

Todas las funciones abren y cierran su propia conexión MySQL, usan `mysql.connector`, placeholders `%s`, `json`, `logging` y devuelven siempre JSON string controlado.

## 1. Tool action `guardar_hogar_contexto`

**Propósito**
Crear un hogar cuando `hogar_id` viene en `null`, o completar y actualizar un hogar existente cuando `hogar_id` viene con valor. Esta es la única función de hogar y no debe sentirse como un trámite técnico: sirve para resolver el hogar al inicio y también para enriquecerlo después con más contexto.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_hogar_contexto",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "hogar_id": { "type": ["integer", "null"], "minimum": 1 },
      "nombre": { "type": ["string", "null"] },
      "tipo_vivienda": { "type": ["string", "null"] },
      "descripcion_general": { "type": ["string", "null"] },
      "direccion_referencia": { "type": ["string", "null"] },
      "observaciones_contexto": { "type": ["string", "null"] }
    },
    "required": [
      "hogar_id",
      "nombre",
      "tipo_vivienda",
      "descripcion_general",
      "direccion_referencia",
      "observaciones_contexto"
    ]
  }
}
```

### Función Python

```python
import json
import logging
import mysql.connector


def guardar_hogar_contexto(
    hogar_id,
    nombre=None,
    tipo_vivienda=None,
    descripcion_general=None,
    direccion_referencia=None,
    observaciones_contexto=None,
):
    logging.info("guardar_hogar_contexto: Inicio de guardado.")

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

        if hogar_id is None:
            nombre_creacion = "Hogar principal" if nombre is None else nombre

            q = """
                INSERT INTO hogares (
                    nombre,
                    tipo_vivienda,
                    descripcion_general,
                    direccion_referencia,
                    observaciones_contexto
                ) VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(q, (
                nombre_creacion,
                tipo_vivienda,
                descripcion_general,
                direccion_referencia,
                observaciones_contexto,
            ))
            conexion.commit()
            hogar_id = cursor.lastrowid

            campos_actualizados = ["nombre"]
            for campo, valor in {
                "tipo_vivienda": tipo_vivienda,
                "descripcion_general": descripcion_general,
                "direccion_referencia": direccion_referencia,
                "observaciones_contexto": observaciones_contexto,
            }.items():
                if valor is not None:
                    campos_actualizados.append(campo)

            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "hogar_id": hogar_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Hogar creado correctamente."
            })
        else:
            cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "hogar_id": hogar_id,
                    "campos_actualizados": [],
                    "msg": "El hogar indicado no existe."
                })
                logging.info(f"guardar_hogar_contexto: Resultado JSON: {res_json}")
                return res_json

            campos = {
                "nombre": nombre,
                "tipo_vivienda": tipo_vivienda,
                "descripcion_general": descripcion_general,
                "direccion_referencia": direccion_referencia,
                "observaciones_contexto": observaciones_contexto,
            }
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
                    "hogar_id": hogar_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en el hogar."
                })
                logging.info(f"guardar_hogar_contexto: Resultado JSON: {res_json}")
                return res_json

            valores.append(hogar_id)
            q = f"UPDATE hogares SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()

            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "hogar_id": hogar_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Contexto del hogar guardado correctamente."
            })
    except mysql.connector.Error as error:
        logging.error(f"guardar_hogar_contexto: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "hogar_id": hogar_id,
            "campos_actualizados": [],
            "msg": "Error técnico al guardar el contexto del hogar."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_hogar_contexto: Resultado JSON: {res_json}")
    return res_json
```


## 2. Tool action `guardar_persona_hogar`

**Propósito**
Crear o actualizar el registro de una persona relevante dentro del hogar.

Nota operativa: antes de crear una nueva persona, el sistema debería intentar resolver si ya existe una equivalente dentro del hogar activo para evitar duplicados conversacionales.
Regla de integridad: una persona no debe reutilizarse ni moverse entre hogares distintos desde esta función. Si se intenta usar un `hogar_id` diferente al hogar actual de esa persona, la función debe devolver error controlado.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_persona_hogar",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "persona_id": { "type": ["integer", "null"], "minimum": 1 },
      "hogar_id": { "type": ["integer", "null"], "minimum": 1 },
      "nombre": { "type": ["string", "null"] },
      "rol_hogar": { "type": ["string", "null"] },
      "relacion_con_mascotas": { "type": ["string", "null"] },
      "permanencia_tipo": { "type": ["string", "null"] },
      "horario_habitual": { "type": ["string", "null"] },
      "nivel_participacion_cuidado": { "type": ["string", "null"] },
      "observaciones": { "type": ["string", "null"] }
    },
    "required": [
      "persona_id",
      "hogar_id",
      "nombre",
      "rol_hogar",
      "relacion_con_mascotas",
      "permanencia_tipo",
      "horario_habitual",
      "nivel_participacion_cuidado",
      "observaciones"
    ]
  }
}
```

### Función Python

```python
import json
import logging
import mysql.connector


def guardar_persona_hogar(
    persona_id,
    hogar_id,
    nombre=None,
    rol_hogar=None,
    relacion_con_mascotas=None,
    permanencia_tipo=None,
    horario_habitual=None,
    nivel_participacion_cuidado=None,
    observaciones=None,
):
    logging.info("guardar_persona_hogar: Inicio de guardado.")

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

        if persona_id is None:
            if not hogar_id or not nombre:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "persona_id": persona_id,
                    "campos_actualizados": [],
                    "msg": "Para crear una persona se requieren `hogar_id` y `nombre`."
                })
                logging.info(f"guardar_persona_hogar: Resultado JSON: {res_json}")
                return res_json

            cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "persona_id": persona_id,
                    "campos_actualizados": [],
                    "msg": "El hogar indicado no existe."
                })
                logging.info(f"guardar_persona_hogar: Resultado JSON: {res_json}")
                return res_json

            q = """
                INSERT INTO hogar_personas (
                    hogar_id, nombre, rol_hogar, relacion_con_mascotas,
                    permanencia_tipo, horario_habitual, nivel_participacion_cuidado, observaciones
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(q, (
                hogar_id, nombre, rol_hogar, relacion_con_mascotas,
                permanencia_tipo, horario_habitual, nivel_participacion_cuidado, observaciones
            ))
            conexion.commit()
            persona_id = cursor.lastrowid

            campos_actualizados = ["hogar_id", "nombre"]
            for campo, valor in {
                "rol_hogar": rol_hogar,
                "relacion_con_mascotas": relacion_con_mascotas,
                "permanencia_tipo": permanencia_tipo,
                "horario_habitual": horario_habitual,
                "nivel_participacion_cuidado": nivel_participacion_cuidado,
                "observaciones": observaciones,
            }.items():
                if valor is not None:
                    campos_actualizados.append(campo)

            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "persona_id": persona_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Persona del hogar guardada correctamente."
            })
        else:
            cursor.execute("SELECT hogar_id FROM hogar_personas WHERE id = %s", (persona_id,))
            fila_persona = cursor.fetchone()
            if not fila_persona:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "persona_id": persona_id,
                    "campos_actualizados": [],
                    "msg": "La persona indicada no existe."
                })
                logging.info(f"guardar_persona_hogar: Resultado JSON: {res_json}")
                return res_json

            hogar_base_id = fila_persona[0]
            updates = []
            valores = []
            campos_actualizados = []

            if hogar_id is not None:
                cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "persona_id": persona_id,
                        "campos_actualizados": [],
                        "msg": "El hogar indicado no existe."
                    })
                    logging.info(f"guardar_persona_hogar: Resultado JSON: {res_json}")
                    return res_json
                if hogar_id != hogar_base_id:
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "persona_id": persona_id,
                        "campos_actualizados": [],
                        "msg": "La persona indicada pertenece a otro hogar y no puede moverse desde esta función."
                    })
                    logging.info(f"guardar_persona_hogar: Resultado JSON: {res_json}")
                    return res_json

            campos = {
                "nombre": nombre,
                "rol_hogar": rol_hogar,
                "relacion_con_mascotas": relacion_con_mascotas,
                "permanencia_tipo": permanencia_tipo,
                "horario_habitual": horario_habitual,
                "nivel_participacion_cuidado": nivel_participacion_cuidado,
                "observaciones": observaciones,
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
                    "persona_id": persona_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en la persona del hogar."
                })
                logging.info(f"guardar_persona_hogar: Resultado JSON: {res_json}")
                return res_json

            valores.append(persona_id)
            q = f"UPDATE hogar_personas SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()

            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "persona_id": persona_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Persona del hogar actualizada correctamente."
            })
    except mysql.connector.Error as error:
        logging.error(f"guardar_persona_hogar: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "persona_id": persona_id,
            "campos_actualizados": [],
            "msg": "Error técnico al guardar la persona del hogar."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_persona_hogar: Resultado JSON: {res_json}")
    return res_json
```

## 3. Tool action `guardar_espacio_hogar`

**Propósito**
Crear o actualizar un espacio relevante dentro del hogar.

Nota operativa: antes de crear un nuevo espacio, el sistema debería intentar resolver si ya existe uno equivalente dentro del hogar activo para evitar duplicados conversacionales.
Regla de integridad: un espacio no debe reutilizarse ni moverse entre hogares distintos desde esta función. Si se intenta usar un `hogar_id` diferente al hogar actual de ese espacio, la función debe devolver error controlado.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_espacio_hogar",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "espacio_id": { "type": ["integer", "null"], "minimum": 1 },
      "hogar_id": { "type": ["integer", "null"], "minimum": 1 },
      "nombre_espacio": { "type": ["string", "null"] },
      "tipo_espacio": { "type": ["string", "null"] },
      "uso_principal": { "type": ["string", "null"] },
      "acceso_mascotas": { "type": ["string", "null"] },
      "descripcion": { "type": ["string", "null"] },
      "observaciones": { "type": ["string", "null"] }
    },
    "required": [
      "espacio_id",
      "hogar_id",
      "nombre_espacio",
      "tipo_espacio",
      "uso_principal",
      "acceso_mascotas",
      "descripcion",
      "observaciones"
    ]
  }
}
```

### Función Python

```python
import json
import logging
import mysql.connector


def guardar_espacio_hogar(
    espacio_id,
    hogar_id,
    nombre_espacio=None,
    tipo_espacio=None,
    uso_principal=None,
    acceso_mascotas=None,
    descripcion=None,
    observaciones=None,
):
    logging.info("guardar_espacio_hogar: Inicio de guardado.")

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

        if espacio_id is None:
            if not hogar_id or not nombre_espacio:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "espacio_id": espacio_id,
                    "campos_actualizados": [],
                    "msg": "Para crear un espacio se requieren `hogar_id` y `nombre_espacio`."
                })
                logging.info(f"guardar_espacio_hogar: Resultado JSON: {res_json}")
                return res_json

            cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "espacio_id": espacio_id,
                    "campos_actualizados": [],
                    "msg": "El hogar indicado no existe."
                })
                logging.info(f"guardar_espacio_hogar: Resultado JSON: {res_json}")
                return res_json

            q = """
                INSERT INTO hogar_espacios (
                    hogar_id, nombre_espacio, tipo_espacio, uso_principal,
                    acceso_mascotas, descripcion, observaciones
                ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(q, (
                hogar_id, nombre_espacio, tipo_espacio, uso_principal,
                acceso_mascotas, descripcion, observaciones
            ))
            conexion.commit()
            espacio_id = cursor.lastrowid

            campos_actualizados = ["hogar_id", "nombre_espacio"]
            for campo, valor in {
                "tipo_espacio": tipo_espacio,
                "uso_principal": uso_principal,
                "acceso_mascotas": acceso_mascotas,
                "descripcion": descripcion,
                "observaciones": observaciones,
            }.items():
                if valor is not None:
                    campos_actualizados.append(campo)

            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "espacio_id": espacio_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Espacio del hogar guardado correctamente."
            })
        else:
            cursor.execute("SELECT hogar_id FROM hogar_espacios WHERE id = %s", (espacio_id,))
            fila_espacio = cursor.fetchone()
            if not fila_espacio:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "espacio_id": espacio_id,
                    "campos_actualizados": [],
                    "msg": "El espacio indicado no existe."
                })
                logging.info(f"guardar_espacio_hogar: Resultado JSON: {res_json}")
                return res_json

            hogar_base_id = fila_espacio[0]
            updates = []
            valores = []
            campos_actualizados = []

            if hogar_id is not None:
                cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "espacio_id": espacio_id,
                        "campos_actualizados": [],
                        "msg": "El hogar indicado no existe."
                    })
                    logging.info(f"guardar_espacio_hogar: Resultado JSON: {res_json}")
                    return res_json
                if hogar_id != hogar_base_id:
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "espacio_id": espacio_id,
                        "campos_actualizados": [],
                        "msg": "El espacio indicado pertenece a otro hogar y no puede moverse desde esta función."
                    })
                    logging.info(f"guardar_espacio_hogar: Resultado JSON: {res_json}")
                    return res_json

            campos = {
                "nombre_espacio": nombre_espacio,
                "tipo_espacio": tipo_espacio,
                "uso_principal": uso_principal,
                "acceso_mascotas": acceso_mascotas,
                "descripcion": descripcion,
                "observaciones": observaciones,
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
                    "espacio_id": espacio_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en el espacio del hogar."
                })
                logging.info(f"guardar_espacio_hogar: Resultado JSON: {res_json}")
                return res_json

            valores.append(espacio_id)
            q = f"UPDATE hogar_espacios SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()

            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "espacio_id": espacio_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Espacio del hogar actualizado correctamente."
            })
    except mysql.connector.Error as error:
        logging.error(f"guardar_espacio_hogar: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "espacio_id": espacio_id,
            "campos_actualizados": [],
            "msg": "Error técnico al guardar el espacio del hogar."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_espacio_hogar: Resultado JSON: {res_json}")
    return res_json
```

## 4. Tool action `guardar_recurso_hogar_mascotas`

**Propósito**
Crear o actualizar un recurso del hogar relevante para la convivencia de las mascotas.

Nota operativa: antes de crear un nuevo recurso, el sistema debería intentar resolver si ya existe uno equivalente dentro del hogar activo para evitar duplicados conversacionales.
Regla de integridad: no debe mezclarse un recurso con espacios de hogares distintos ni reutilizarse un recurso fuera del hogar al que pertenece.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_recurso_hogar_mascotas",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "recurso_id": { "type": ["integer", "null"], "minimum": 1 },
      "hogar_id": { "type": ["integer", "null"], "minimum": 1 },
      "espacio_id": { "type": ["integer", "null"], "minimum": 1 },
      "tipo_recurso": { "type": ["string", "null"] },
      "cantidad": { "type": ["integer", "null"], "minimum": 0 },
      "descripcion": { "type": ["string", "null"] },
      "uso_compartido": { "type": ["boolean", "null"] },
      "observaciones": { "type": ["string", "null"] }
    },
    "required": [
      "recurso_id",
      "hogar_id",
      "espacio_id",
      "tipo_recurso",
      "cantidad",
      "descripcion",
      "uso_compartido",
      "observaciones"
    ]
  }
}
```

### Función Python

```python
import json
import logging
import mysql.connector


def guardar_recurso_hogar_mascotas(
    recurso_id,
    hogar_id,
    espacio_id=None,
    tipo_recurso=None,
    cantidad=None,
    descripcion=None,
    uso_compartido=None,
    observaciones=None,
):
    logging.info("guardar_recurso_hogar_mascotas: Inicio de guardado.")

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

        if recurso_id is None:
            if not hogar_id or not tipo_recurso:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "recurso_id": recurso_id,
                    "campos_actualizados": [],
                    "msg": "Para crear un recurso se requieren `hogar_id` y `tipo_recurso`."
                })
                logging.info(f"guardar_recurso_hogar_mascotas: Resultado JSON: {res_json}")
                return res_json

            cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "recurso_id": recurso_id,
                    "campos_actualizados": [],
                    "msg": "El hogar indicado no existe."
                })
                logging.info(f"guardar_recurso_hogar_mascotas: Resultado JSON: {res_json}")
                return res_json

            if espacio_id is not None:
                cursor.execute("SELECT id FROM hogar_espacios WHERE id = %s AND hogar_id = %s", (espacio_id, hogar_id))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "recurso_id": recurso_id,
                        "campos_actualizados": [],
                        "msg": "El espacio indicado no existe o no pertenece al mismo hogar del recurso."
                    })
                    logging.info(f"guardar_recurso_hogar_mascotas: Resultado JSON: {res_json}")
                    return res_json

            uso_compartido_insert = False if uso_compartido is None else uso_compartido

            q = """
                INSERT INTO hogar_recursos_mascotas (
                    hogar_id, espacio_id, tipo_recurso, cantidad, descripcion, uso_compartido, observaciones
                ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(q, (
                hogar_id, espacio_id, tipo_recurso, cantidad, descripcion, uso_compartido_insert, observaciones
            ))
            conexion.commit()
            recurso_id = cursor.lastrowid

            campos_actualizados = ["hogar_id", "tipo_recurso"]
            for campo, valor in {
                "espacio_id": espacio_id,
                "cantidad": cantidad,
                "descripcion": descripcion,
                "uso_compartido": uso_compartido,
                "observaciones": observaciones,
            }.items():
                if valor is not None:
                    campos_actualizados.append(campo)

            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "recurso_id": recurso_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Recurso del hogar guardado correctamente."
            })
        else:
            cursor.execute("SELECT hogar_id FROM hogar_recursos_mascotas WHERE id = %s", (recurso_id,))
            fila_recurso = cursor.fetchone()
            if not fila_recurso:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "recurso_id": recurso_id,
                    "campos_actualizados": [],
                    "msg": "El recurso indicado no existe."
                })
                logging.info(f"guardar_recurso_hogar_mascotas: Resultado JSON: {res_json}")
                return res_json

            hogar_base_id = fila_recurso[0]
            updates = []
            valores = []
            campos_actualizados = []

            if hogar_id is not None:
                cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "recurso_id": recurso_id,
                        "campos_actualizados": [],
                        "msg": "El hogar indicado no existe."
                    })
                    logging.info(f"guardar_recurso_hogar_mascotas: Resultado JSON: {res_json}")
                    return res_json
                if hogar_id != hogar_base_id:
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "recurso_id": recurso_id,
                        "campos_actualizados": [],
                        "msg": "El recurso indicado pertenece a otro hogar y no puede moverse desde esta función."
                    })
                    logging.info(f"guardar_recurso_hogar_mascotas: Resultado JSON: {res_json}")
                    return res_json


            if espacio_id is not None:
                cursor.execute("SELECT id FROM hogar_espacios WHERE id = %s AND hogar_id = %s", (espacio_id, hogar_base_id))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "recurso_id": recurso_id,
                        "campos_actualizados": [],
                        "msg": "El espacio indicado no existe o no pertenece al mismo hogar del recurso."
                    })
                    logging.info(f"guardar_recurso_hogar_mascotas: Resultado JSON: {res_json}")
                    return res_json
                updates.append("espacio_id = %s")
                valores.append(espacio_id)
                campos_actualizados.append("espacio_id")

            campos = {
                "tipo_recurso": tipo_recurso,
                "cantidad": cantidad,
                "descripcion": descripcion,
                "uso_compartido": uso_compartido,
                "observaciones": observaciones,
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
                    "recurso_id": recurso_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en el recurso del hogar."
                })
                logging.info(f"guardar_recurso_hogar_mascotas: Resultado JSON: {res_json}")
                return res_json

            valores.append(recurso_id)
            q = f"UPDATE hogar_recursos_mascotas SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()

            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "recurso_id": recurso_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Recurso del hogar actualizado correctamente."
            })
    except mysql.connector.Error as error:
        logging.error(f"guardar_recurso_hogar_mascotas: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "recurso_id": recurso_id,
            "campos_actualizados": [],
            "msg": "Error técnico al guardar el recurso del hogar."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_recurso_hogar_mascotas: Resultado JSON: {res_json}")
    return res_json
```

## 5. Tool action `guardar_interaccion_hogar`

**Propósito**
Crear o actualizar una interacción relevante para la convivencia dentro del hogar.

Si viene `mascota_id`, la función valida que exista y que pertenezca al mismo `hogar_id` cuando la tabla `mascotas` dispone de ese vínculo.
Regla de integridad: no debe mezclarse una interacción con personas, espacios o mascotas de hogares distintos ni reutilizarse fuera del hogar al que pertenece.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_interaccion_hogar",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "interaccion_id": { "type": ["integer", "null"], "minimum": 1 },
      "hogar_id": { "type": ["integer", "null"], "minimum": 1 },
      "tipo_interaccion": { "type": ["string", "null"] },
      "descripcion": { "type": ["string", "null"] },
      "mascota_id": { "type": ["integer", "null"], "minimum": 1 },
      "persona_id": { "type": ["integer", "null"], "minimum": 1 },
      "espacio_id": { "type": ["integer", "null"], "minimum": 1 },
      "frecuencia_aproximada": { "type": ["string", "null"] },
      "momento_habitual": { "type": ["string", "null"] },
      "impacto_convivencia": { "type": ["string", "null"] },
      "observaciones": { "type": ["string", "null"] }
    },
    "required": [
      "interaccion_id",
      "hogar_id",
      "tipo_interaccion",
      "descripcion",
      "mascota_id",
      "persona_id",
      "espacio_id",
      "frecuencia_aproximada",
      "momento_habitual",
      "impacto_convivencia",
      "observaciones"
    ]
  }
}
```

### Función Python

```python
import json
import logging
import mysql.connector


def guardar_interaccion_hogar(
    interaccion_id,
    hogar_id,
    tipo_interaccion=None,
    descripcion=None,
    mascota_id=None,
    persona_id=None,
    espacio_id=None,
    frecuencia_aproximada=None,
    momento_habitual=None,
    impacto_convivencia=None,
    observaciones=None,
):
    logging.info("guardar_interaccion_hogar: Inicio de guardado.")

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

        if interaccion_id is None:
            if not hogar_id or not tipo_interaccion or not descripcion:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "interaccion_id": interaccion_id,
                    "campos_actualizados": [],
                    "msg": "Para crear una interacción se requieren `hogar_id`, `tipo_interaccion` y `descripcion`."
                })
                logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
                return res_json

            cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "interaccion_id": interaccion_id,
                    "campos_actualizados": [],
                    "msg": "El hogar indicado no existe."
                })
                logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
                return res_json

            if mascota_id is not None:
                cursor.execute("SELECT id FROM mascotas WHERE id = %s AND hogar_id = %s", (mascota_id, hogar_id))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "interaccion_id": interaccion_id,
                        "campos_actualizados": [],
                        "msg": "La mascota indicada no existe o no pertenece al mismo hogar de la interacción."
                    })
                    logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
                    return res_json

            if persona_id is not None:
                cursor.execute("SELECT id FROM hogar_personas WHERE id = %s AND hogar_id = %s", (persona_id, hogar_id))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "interaccion_id": interaccion_id,
                        "campos_actualizados": [],
                        "msg": "La persona indicada no existe o no pertenece al mismo hogar de la interacción."
                    })
                    logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
                    return res_json

            if espacio_id is not None:
                cursor.execute("SELECT id FROM hogar_espacios WHERE id = %s AND hogar_id = %s", (espacio_id, hogar_id))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "interaccion_id": interaccion_id,
                        "campos_actualizados": [],
                        "msg": "El espacio indicado no existe o no pertenece al mismo hogar de la interacción."
                    })
                    logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
                    return res_json

            q = """
                INSERT INTO hogar_interacciones (
                    hogar_id, mascota_id, persona_id, espacio_id, tipo_interaccion,
                    descripcion, frecuencia_aproximada, momento_habitual, impacto_convivencia, observaciones
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(q, (
                hogar_id, mascota_id, persona_id, espacio_id, tipo_interaccion,
                descripcion, frecuencia_aproximada, momento_habitual, impacto_convivencia, observaciones
            ))
            conexion.commit()
            interaccion_id = cursor.lastrowid

            campos_actualizados = ["hogar_id", "tipo_interaccion", "descripcion"]
            for campo, valor in {
                "mascota_id": mascota_id,
                "persona_id": persona_id,
                "espacio_id": espacio_id,
                "frecuencia_aproximada": frecuencia_aproximada,
                "momento_habitual": momento_habitual,
                "impacto_convivencia": impacto_convivencia,
                "observaciones": observaciones,
            }.items():
                if valor is not None:
                    campos_actualizados.append(campo)

            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "interaccion_id": interaccion_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Interacción del hogar guardada correctamente."
            })
        else:
            cursor.execute("SELECT hogar_id FROM hogar_interacciones WHERE id = %s", (interaccion_id,))
            fila_interaccion = cursor.fetchone()
            if not fila_interaccion:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "interaccion_id": interaccion_id,
                    "campos_actualizados": [],
                    "msg": "La interacción indicada no existe."
                })
                logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
                return res_json

            hogar_base_id = fila_interaccion[0]
            updates = []
            valores = []
            campos_actualizados = []
            if hogar_id is not None:
                cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "interaccion_id": interaccion_id,
                        "campos_actualizados": [],
                        "msg": "El hogar indicado no existe."
                    })
                    logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
                    return res_json
                if hogar_id != hogar_base_id:
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "interaccion_id": interaccion_id,
                        "campos_actualizados": [],
                        "msg": "La interacción indicada pertenece a otro hogar y no puede moverse desde esta función."
                    })
                    logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
                    return res_json


            if mascota_id is not None:
                cursor.execute("SELECT id FROM mascotas WHERE id = %s AND hogar_id = %s", (mascota_id, hogar_base_id))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "interaccion_id": interaccion_id,
                        "campos_actualizados": [],
                        "msg": "La mascota indicada no existe o no pertenece al mismo hogar de la interacción."
                    })
                    logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
                    return res_json
                updates.append("mascota_id = %s")
                valores.append(mascota_id)
                campos_actualizados.append("mascota_id")

            if persona_id is not None:
                cursor.execute("SELECT id FROM hogar_personas WHERE id = %s AND hogar_id = %s", (persona_id, hogar_base_id))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "interaccion_id": interaccion_id,
                        "campos_actualizados": [],
                        "msg": "La persona indicada no existe o no pertenece al mismo hogar de la interacción."
                    })
                    logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
                    return res_json
                updates.append("persona_id = %s")
                valores.append(persona_id)
                campos_actualizados.append("persona_id")

            if espacio_id is not None:
                cursor.execute("SELECT id FROM hogar_espacios WHERE id = %s AND hogar_id = %s", (espacio_id, hogar_base_id))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "interaccion_id": interaccion_id,
                        "campos_actualizados": [],
                        "msg": "El espacio indicado no existe o no pertenece al mismo hogar de la interacción."
                    })
                    logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
                    return res_json
                updates.append("espacio_id = %s")
                valores.append(espacio_id)
                campos_actualizados.append("espacio_id")

            campos = {
                "tipo_interaccion": tipo_interaccion,
                "descripcion": descripcion,
                "frecuencia_aproximada": frecuencia_aproximada,
                "momento_habitual": momento_habitual,
                "impacto_convivencia": impacto_convivencia,
                "observaciones": observaciones,
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
                    "interaccion_id": interaccion_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en la interacción del hogar."
                })
                logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
                return res_json

            valores.append(interaccion_id)
            q = f"UPDATE hogar_interacciones SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()

            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "interaccion_id": interaccion_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Interacción del hogar actualizada correctamente."
            })
    except mysql.connector.Error as error:
        logging.error(f"guardar_interaccion_hogar: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "interaccion_id": interaccion_id,
            "campos_actualizados": [],
            "msg": "Error técnico al guardar la interacción del hogar."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_interaccion_hogar: Resultado JSON: {res_json}")
    return res_json
```

## 6. Tool action `guardar_observacion_contexto_hogar`

**Propósito**
Crear o actualizar una observación contextual relevante sobre el hogar.

Si viene `mascota_id`, la función valida que exista y que pertenezca al mismo `hogar_id` cuando la tabla `mascotas` dispone de ese vínculo.
Regla de integridad: no debe mezclarse una observación con personas, espacios o mascotas de hogares distintos ni reutilizarse fuera del hogar al que pertenece.

### JSON para OpenAI Responses API

```json
{
  "name": "guardar_observacion_contexto_hogar",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "observacion_id": { "type": ["integer", "null"], "minimum": 1 },
      "hogar_id": { "type": ["integer", "null"], "minimum": 1 },
      "descripcion": { "type": ["string", "null"] },
      "persona_id": { "type": ["integer", "null"], "minimum": 1 },
      "mascota_id": { "type": ["integer", "null"], "minimum": 1 },
      "espacio_id": { "type": ["integer", "null"], "minimum": 1 },
      "categoria": { "type": ["string", "null"] },
      "prioridad": { "type": ["string", "null"] }
    },
    "required": [
      "observacion_id",
      "hogar_id",
      "descripcion",
      "persona_id",
      "mascota_id",
      "espacio_id",
      "categoria",
      "prioridad"
    ]
  }
}
```

### Función Python

```python
import json
import logging
import mysql.connector


def guardar_observacion_contexto_hogar(
    observacion_id,
    hogar_id,
    descripcion=None,
    persona_id=None,
    mascota_id=None,
    espacio_id=None,
    categoria=None,
    prioridad=None,
):
    logging.info("guardar_observacion_contexto_hogar: Inicio de guardado.")

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

        if observacion_id is None:
            if not hogar_id or not descripcion:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "observacion_id": observacion_id,
                    "campos_actualizados": [],
                    "msg": "Para crear una observación se requieren `hogar_id` y `descripcion`."
                })
                logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
                return res_json

            cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
            if not cursor.fetchone():
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "observacion_id": observacion_id,
                    "campos_actualizados": [],
                    "msg": "El hogar indicado no existe."
                })
                logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
                return res_json

            if persona_id is not None:
                cursor.execute(
                    "SELECT id FROM hogar_personas WHERE id = %s AND hogar_id = %s",
                    (persona_id, hogar_id)
                )
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "observacion_id": observacion_id,
                        "campos_actualizados": [],
                        "msg": "La persona indicada no existe o no pertenece al mismo hogar de la observación."
                    })
                    logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
                    return res_json

            if mascota_id is not None:
                cursor.execute(
                    "SELECT id FROM mascotas WHERE id = %s AND hogar_id = %s",
                    (mascota_id, hogar_id)
                )
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "observacion_id": observacion_id,
                        "campos_actualizados": [],
                        "msg": "La mascota indicada no existe o no pertenece al mismo hogar de la observación."
                    })
                    logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
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
                        "observacion_id": observacion_id,
                        "campos_actualizados": [],
                        "msg": "El espacio indicado no existe o no pertenece al mismo hogar de la observación."
                    })
                    logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
                    return res_json

            q = """
                INSERT INTO hogar_observaciones_contexto (
                    hogar_id, persona_id, mascota_id, espacio_id, descripcion, categoria, prioridad
                ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(q, (
                hogar_id, persona_id, mascota_id, espacio_id, descripcion, categoria, prioridad
            ))
            conexion.commit()
            observacion_id = cursor.lastrowid

            campos_actualizados = ["hogar_id", "descripcion"]
            for campo, valor in {
                "persona_id": persona_id,
                "mascota_id": mascota_id,
                "espacio_id": espacio_id,
                "categoria": categoria,
                "prioridad": prioridad,
            }.items():
                if valor is not None:
                    campos_actualizados.append(campo)

            res_json = json.dumps({
                "ok": True,
                "action": "created",
                "observacion_id": observacion_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Observación del contexto guardada correctamente."
            })
        else:
            cursor.execute(
                "SELECT hogar_id FROM hogar_observaciones_contexto WHERE id = %s",
                (observacion_id,)
            )
            fila_observacion = cursor.fetchone()
            if not fila_observacion:
                res_json = json.dumps({
                    "ok": False,
                    "action": "error",
                    "observacion_id": observacion_id,
                    "campos_actualizados": [],
                    "msg": "La observación indicada no existe."
                })
                logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
                return res_json

            hogar_base_id = fila_observacion[0]
            updates = []
            valores = []
            campos_actualizados = []

            if hogar_id is not None:
                cursor.execute("SELECT id FROM hogares WHERE id = %s", (hogar_id,))
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "observacion_id": observacion_id,
                        "campos_actualizados": [],
                        "msg": "El hogar indicado no existe."
                    })
                    logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
                    return res_json
                if hogar_id != hogar_base_id:
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "observacion_id": observacion_id,
                        "campos_actualizados": [],
                        "msg": "La observación indicada pertenece a otro hogar y no puede moverse desde esta función."
                    })
                    logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
                    return res_json

            if persona_id is not None:
                cursor.execute(
                    "SELECT id FROM hogar_personas WHERE id = %s AND hogar_id = %s",
                    (persona_id, hogar_base_id)
                )
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "observacion_id": observacion_id,
                        "campos_actualizados": [],
                        "msg": "La persona indicada no existe o no pertenece al mismo hogar de la observación."
                    })
                    logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
                    return res_json
                updates.append("persona_id = %s")
                valores.append(persona_id)
                campos_actualizados.append("persona_id")

            if mascota_id is not None:
                cursor.execute(
                    "SELECT id FROM mascotas WHERE id = %s AND hogar_id = %s",
                    (mascota_id, hogar_base_id)
                )
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "observacion_id": observacion_id,
                        "campos_actualizados": [],
                        "msg": "La mascota indicada no existe o no pertenece al mismo hogar de la observación."
                    })
                    logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
                    return res_json
                updates.append("mascota_id = %s")
                valores.append(mascota_id)
                campos_actualizados.append("mascota_id")

            if espacio_id is not None:
                cursor.execute(
                    "SELECT id FROM hogar_espacios WHERE id = %s AND hogar_id = %s",
                    (espacio_id, hogar_base_id)
                )
                if not cursor.fetchone():
                    res_json = json.dumps({
                        "ok": False,
                        "action": "error",
                        "observacion_id": observacion_id,
                        "campos_actualizados": [],
                        "msg": "El espacio indicado no existe o no pertenece al mismo hogar de la observación."
                    })
                    logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
                    return res_json
                updates.append("espacio_id = %s")
                valores.append(espacio_id)
                campos_actualizados.append("espacio_id")

            campos = {
                "descripcion": descripcion,
                "categoria": categoria,
                "prioridad": prioridad,
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
                    "observacion_id": observacion_id,
                    "campos_actualizados": [],
                    "msg": "No hay campos para actualizar en la observación del contexto."
                })
                logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
                return res_json

            valores.append(observacion_id)
            q = f"UPDATE hogar_observaciones_contexto SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(q, tuple(valores))
            conexion.commit()

            res_json = json.dumps({
                "ok": True,
                "action": "updated",
                "observacion_id": observacion_id,
                "campos_actualizados": campos_actualizados,
                "msg": "Observación del contexto actualizada correctamente."
            })
    except mysql.connector.Error as error:
        logging.error(f"guardar_observacion_contexto_hogar: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "action": "error",
            "observacion_id": observacion_id,
            "campos_actualizados": [],
            "msg": "Error técnico al guardar la observación del contexto."
        })
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()

    logging.info(f"guardar_observacion_contexto_hogar: Resultado JSON: {res_json}")
    return res_json
```







