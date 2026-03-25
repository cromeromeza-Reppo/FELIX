# Propuesta de tool actions para construir el perfil inicial de una mascota

## Enfoque recomendado

Ya no conviene una sola herramienta monolitica para guardar todo el perfil.

Como el perfil se construira por capas y sin abrumar al usuario, la mejor opcion es usar varias herramientas pequenas, cada una responsable de un bloque de informacion.

Esto permite que Felix:

- cree el perfil minimo con pocos datos
- complete la informacion progresivamente
- guarde sin perder contexto
- confirme cada accion de forma clara

## Flujo sugerido de herramientas

1. crear perfil base
2. actualizar perfil base
3. registrar condicion de salud
4. registrar medicamento
5. registrar tratamiento
6. registrar evento de salud
7. adjuntar documento de salud

## 1. Tool action `crear_mascota`

### JSON para OpenAI Responses API

```json
{
  "name": "crear_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "hogar_id": { "type": "integer", "minimum": 1 },
      "nombre": { "type": "string" },
      "especie": { "type": "string" },
      "raza": { "type": "string" },
      "sexo": { "type": "string" },
      "edad_aproximada_valor": { "type": "integer", "minimum": 0 },
      "edad_aproximada_unidad": { "type": "string" },
      "origen_tipo": { "type": "string" },
      "origen_detalle": { "type": "string" },
      "caracter_inicial": { "type": "string" }
    },
    "required": ["hogar_id", "nombre", "especie"]
  }
}
```

### Función Python sugerida

```python
import json
import logging
import mysql.connector


def crear_mascota(
    hogar_id,
    nombre,
    especie,
    raza=None,
    sexo=None,
    edad_aproximada_valor=None,
    edad_aproximada_unidad=None,
    origen_tipo=None,
    origen_detalle=None,
    caracter_inicial=None,
):
    logging.info("crear_mascota: Inicio de registro de mascota.")

    if not hogar_id or not nombre or not especie:
        res_json = json.dumps({
            "msg": "Faltan campos obligatorios para crear la mascota.",
            "required": ["hogar_id", "nombre", "especie"]
        })
        logging.info(f"crear_mascota: Resultado JSON: {res_json}")
        return res_json

    try:
        q = """
            INSERT INTO mascotas (
                hogar_id, nombre, especie, raza, sexo,
                edad_aproximada_valor, edad_aproximada_unidad,
                origen_tipo, origen_detalle, caracter_inicial
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(
            q,
            (
                hogar_id,
                nombre,
                especie,
                raza,
                sexo,
                edad_aproximada_valor,
                edad_aproximada_unidad,
                origen_tipo,
                origen_detalle,
                caracter_inicial,
            ),
        )
        mascota_id = cursor.lastrowid

        res_json = json.dumps({
            "ok": True,
            "action": "created",
            "mascota_id": mascota_id,
            "nombre": nombre,
            "msg": f"Perfil base de {nombre} creado correctamente."
        })

    except mysql.connector.Error as error:
        logging.error(f"crear_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "msg": "Error técnico al crear la mascota."
        })

    logging.info(f"crear_mascota: Resultado JSON: {res_json}")
    return res_json
```

## 2. Tool action `actualizar_mascota`

### JSON para OpenAI Responses API

```json
{
  "name": "actualizar_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "mascota_id": { "type": "integer", "minimum": 1 },
      "fecha_llegada_hogar": { "type": "string" },
      "fecha_nacimiento_aproximada": { "type": "string" },
      "paso_por_otros_hogares": { "type": "boolean" },
      "detalle_otros_hogares": { "type": "string" },
      "rasgos_fisicos": { "type": "string" },
      "color_principal": { "type": "string" },
      "tamanio_aproximado": { "type": "string" },
      "esterilizado": { "type": "boolean" },
      "fecha_esterilizacion": { "type": "string" },
      "caracter_observado": { "type": "string" },
      "observaciones_iniciales": { "type": "string" }
    },
    "required": ["mascota_id"]
  }
}
```

### Función Python sugerida

```python
import json
import logging
import mysql.connector


def actualizar_mascota(
    mascota_id,
    fecha_llegada_hogar=None,
    fecha_nacimiento_aproximada=None,
    paso_por_otros_hogares=None,
    detalle_otros_hogares=None,
    rasgos_fisicos=None,
    color_principal=None,
    tamanio_aproximado=None,
    esterilizado=None,
    fecha_esterilizacion=None,
    caracter_observado=None,
    observaciones_iniciales=None,
):
    logging.info("actualizar_mascota: Inicio de actualizacion de mascota.")

    if not mascota_id:
        res_json = json.dumps({"msg": "Falta `mascota_id` para actualizar la mascota."})
        logging.info(f"actualizar_mascota: Resultado JSON: {res_json}")
        return res_json

    campos = {
        "fecha_llegada_hogar": fecha_llegada_hogar,
        "fecha_nacimiento_aproximada": fecha_nacimiento_aproximada,
        "paso_por_otros_hogares": paso_por_otros_hogares,
        "detalle_otros_hogares": detalle_otros_hogares,
        "rasgos_fisicos": rasgos_fisicos,
        "color_principal": color_principal,
        "tamanio_aproximado": tamanio_aproximado,
        "esterilizado": esterilizado,
        "fecha_esterilizacion": fecha_esterilizacion,
        "caracter_observado": caracter_observado,
        "observaciones_iniciales": observaciones_iniciales,
    }

    updates = []
    valores = []
    for campo, valor in campos.items():
        if valor is not None:
            updates.append(f"{campo} = %s")
            valores.append(valor)

    if not updates:
        res_json = json.dumps({"msg": "No hay campos para actualizar."})
        logging.info(f"actualizar_mascota: Resultado JSON: {res_json}")
        return res_json

    valores.append(mascota_id)

    try:
        q = f"""
            UPDATE mascotas
            SET {", ".join(updates)}
            WHERE id = %s
        """
        cursor.execute(q, tuple(valores))

        res_json = json.dumps({
            "ok": True,
            "action": "updated",
            "mascota_id": mascota_id,
            "campos_actualizados": list(campos.keys()),
            "msg": "Perfil de mascota actualizado correctamente."
        })

    except mysql.connector.Error as error:
        logging.error(f"actualizar_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "msg": "Error técnico al actualizar la mascota."
        })

    logging.info(f"actualizar_mascota: Resultado JSON: {res_json}")
    return res_json
```

## 3. Tool action `registrar_condicion_salud_mascota`

### JSON para OpenAI Responses API

```json
{
  "name": "registrar_condicion_salud_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "mascota_id": { "type": "integer", "minimum": 1 },
      "tipo_condicion": { "type": "string" },
      "descripcion": { "type": "string" },
      "origen": { "type": "string" },
      "vigente": { "type": "boolean" },
      "fecha_inicio": { "type": "string" },
      "fecha_fin": { "type": "string" },
      "notas": { "type": "string" }
    },
    "required": ["mascota_id", "tipo_condicion"]
  }
}
```

### Función Python sugerida

```python
import json
import logging
import mysql.connector


def registrar_condicion_salud_mascota(
    mascota_id,
    tipo_condicion,
    descripcion=None,
    origen=None,
    vigente=True,
    fecha_inicio=None,
    fecha_fin=None,
    notas=None,
):
    logging.info("registrar_condicion_salud_mascota: Inicio de registro.")

    if not mascota_id or not tipo_condicion:
        res_json = json.dumps({
            "msg": "Faltan campos obligatorios para registrar la condicion."
        })
        logging.info(f"registrar_condicion_salud_mascota: Resultado JSON: {res_json}")
        return res_json

    try:
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
                vigente,
                fecha_inicio,
                fecha_fin,
                notas,
            ),
        )
        condicion_id = cursor.lastrowid

        res_json = json.dumps({
            "ok": True,
            "action": "created",
            "condicion_id": condicion_id,
            "mascota_id": mascota_id,
            "tipo_condicion": tipo_condicion,
            "msg": "Condicion de salud registrada correctamente."
        })

    except mysql.connector.Error as error:
        logging.error(f"registrar_condicion_salud_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "msg": "Error técnico al registrar la condicion de salud."
        })

    logging.info(f"registrar_condicion_salud_mascota: Resultado JSON: {res_json}")
    return res_json
```

## 4. Tool action `registrar_medicamento_mascota`

### JSON para OpenAI Responses API

```json
{
  "name": "registrar_medicamento_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "mascota_id": { "type": "integer", "minimum": 1 },
      "nombre_medicamento": { "type": "string" },
      "motivo": { "type": "string" },
      "dosis": { "type": "string" },
      "frecuencia": { "type": "string" },
      "via_administracion": { "type": "string" },
      "fecha_inicio": { "type": "string" },
      "fecha_fin": { "type": "string" },
      "vigente": { "type": "boolean" },
      "recetado_por": { "type": "string" },
      "notas": { "type": "string" }
    },
    "required": ["mascota_id", "nombre_medicamento"]
  }
}
```

### Función Python sugerida

```python
import json
import logging
import mysql.connector


def registrar_medicamento_mascota(
    mascota_id,
    nombre_medicamento,
    motivo=None,
    dosis=None,
    frecuencia=None,
    via_administracion=None,
    fecha_inicio=None,
    fecha_fin=None,
    vigente=True,
    recetado_por=None,
    notas=None,
):
    logging.info("registrar_medicamento_mascota: Inicio de registro.")

    if not mascota_id or not nombre_medicamento:
        res_json = json.dumps({
            "msg": "Faltan campos obligatorios para registrar el medicamento."
        })
        logging.info(f"registrar_medicamento_mascota: Resultado JSON: {res_json}")
        return res_json

    try:
        q = """
            INSERT INTO mascota_medicamentos (
                mascota_id, nombre_medicamento, motivo, dosis, frecuencia,
                via_administracion, fecha_inicio, fecha_fin, vigente,
                recetado_por, notas
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(
            q,
            (
                mascota_id,
                nombre_medicamento,
                motivo,
                dosis,
                frecuencia,
                via_administracion,
                fecha_inicio,
                fecha_fin,
                vigente,
                recetado_por,
                notas,
            ),
        )
        medicamento_id = cursor.lastrowid

        res_json = json.dumps({
            "ok": True,
            "action": "created",
            "medicamento_id": medicamento_id,
            "mascota_id": mascota_id,
            "nombre_medicamento": nombre_medicamento,
            "msg": "Medicamento registrado correctamente."
        })

    except mysql.connector.Error as error:
        logging.error(f"registrar_medicamento_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "msg": "Error técnico al registrar el medicamento."
        })

    logging.info(f"registrar_medicamento_mascota: Resultado JSON: {res_json}")
    return res_json
```

## 5. Tool action `registrar_tratamiento_mascota`

### JSON para OpenAI Responses API

```json
{
  "name": "registrar_tratamiento_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "mascota_id": { "type": "integer", "minimum": 1 },
      "tipo_tratamiento": { "type": "string" },
      "descripcion": { "type": "string" },
      "objetivo": { "type": "string" },
      "fecha_inicio": { "type": "string" },
      "fecha_fin": { "type": "string" },
      "vigente": { "type": "boolean" },
      "responsable": { "type": "string" },
      "notas": { "type": "string" }
    },
    "required": ["mascota_id", "tipo_tratamiento"]
  }
}
```

### Función Python sugerida

```python
import json
import logging
import mysql.connector


def registrar_tratamiento_mascota(
    mascota_id,
    tipo_tratamiento,
    descripcion=None,
    objetivo=None,
    fecha_inicio=None,
    fecha_fin=None,
    vigente=True,
    responsable=None,
    notas=None,
):
    logging.info("registrar_tratamiento_mascota: Inicio de registro.")

    if not mascota_id or not tipo_tratamiento:
        res_json = json.dumps({
            "msg": "Faltan campos obligatorios para registrar el tratamiento."
        })
        logging.info(f"registrar_tratamiento_mascota: Resultado JSON: {res_json}")
        return res_json

    try:
        q = """
            INSERT INTO mascota_tratamientos (
                mascota_id, tipo_tratamiento, descripcion, objetivo,
                fecha_inicio, fecha_fin, vigente, responsable, notas
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(
            q,
            (
                mascota_id,
                tipo_tratamiento,
                descripcion,
                objetivo,
                fecha_inicio,
                fecha_fin,
                vigente,
                responsable,
                notas,
            ),
        )
        tratamiento_id = cursor.lastrowid

        res_json = json.dumps({
            "ok": True,
            "action": "created",
            "tratamiento_id": tratamiento_id,
            "mascota_id": mascota_id,
            "tipo_tratamiento": tipo_tratamiento,
            "msg": "Tratamiento registrado correctamente."
        })

    except mysql.connector.Error as error:
        logging.error(f"registrar_tratamiento_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "msg": "Error técnico al registrar el tratamiento."
        })

    logging.info(f"registrar_tratamiento_mascota: Resultado JSON: {res_json}")
    return res_json
```

## 6. Tool action `registrar_evento_salud_mascota`

### JSON para OpenAI Responses API

```json
{
  "name": "registrar_evento_salud_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "mascota_id": { "type": "integer", "minimum": 1 },
      "tipo_evento": { "type": "string" },
      "fecha_evento": { "type": "string" },
      "motivo_consulta": { "type": "string" },
      "diagnostico_reportado": { "type": "string" },
      "procedimiento_realizado": { "type": "string" },
      "veterinario": { "type": "string" },
      "centro_veterinario": { "type": "string" },
      "resultado": { "type": "string" },
      "requiere_seguimiento": { "type": "boolean" },
      "notas": { "type": "string" }
    },
    "required": ["mascota_id", "tipo_evento"]
  }
}
```

### Función Python sugerida

```python
import json
import logging
import mysql.connector


def registrar_evento_salud_mascota(
    mascota_id,
    tipo_evento,
    fecha_evento=None,
    motivo_consulta=None,
    diagnostico_reportado=None,
    procedimiento_realizado=None,
    veterinario=None,
    centro_veterinario=None,
    resultado=None,
    requiere_seguimiento=False,
    notas=None,
):
    logging.info("registrar_evento_salud_mascota: Inicio de registro.")

    if not mascota_id or not tipo_evento:
        res_json = json.dumps({
            "msg": "Faltan campos obligatorios para registrar el evento de salud."
        })
        logging.info(f"registrar_evento_salud_mascota: Resultado JSON: {res_json}")
        return res_json

    try:
        q = """
            INSERT INTO mascota_eventos_salud (
                mascota_id, tipo_evento, fecha_evento, motivo_consulta,
                diagnostico_reportado, procedimiento_realizado, veterinario,
                centro_veterinario, resultado, requiere_seguimiento, notas
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(
            q,
            (
                mascota_id,
                tipo_evento,
                fecha_evento,
                motivo_consulta,
                diagnostico_reportado,
                procedimiento_realizado,
                veterinario,
                centro_veterinario,
                resultado,
                requiere_seguimiento,
                notas,
            ),
        )
        evento_salud_id = cursor.lastrowid

        res_json = json.dumps({
            "ok": True,
            "action": "created",
            "evento_salud_id": evento_salud_id,
            "mascota_id": mascota_id,
            "tipo_evento": tipo_evento,
            "msg": "Evento de salud registrado correctamente."
        })

    except mysql.connector.Error as error:
        logging.error(f"registrar_evento_salud_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "msg": "Error técnico al registrar el evento de salud."
        })

    logging.info(f"registrar_evento_salud_mascota: Resultado JSON: {res_json}")
    return res_json
```

## 7. Tool action `adjuntar_documento_salud_mascota`

### JSON para OpenAI Responses API

```json
{
  "name": "adjuntar_documento_salud_mascota",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "mascota_id": { "type": "integer", "minimum": 1 },
      "evento_salud_id": { "type": "integer", "minimum": 1 },
      "tipo_documento": { "type": "string" },
      "nombre_archivo": { "type": "string" },
      "archivo_url": { "type": "string" },
      "mime_type": { "type": "string" },
      "fecha_documento": { "type": "string" },
      "descripcion": { "type": "string" }
    },
    "required": ["mascota_id", "tipo_documento", "archivo_url"]
  }
}
```

### Función Python sugerida

```python
import json
import logging
import mysql.connector


def adjuntar_documento_salud_mascota(
    mascota_id,
    tipo_documento,
    archivo_url,
    evento_salud_id=None,
    nombre_archivo=None,
    mime_type=None,
    fecha_documento=None,
    descripcion=None,
):
    logging.info("adjuntar_documento_salud_mascota: Inicio de registro.")

    if not mascota_id or not tipo_documento or not archivo_url:
        res_json = json.dumps({
            "msg": "Faltan campos obligatorios para adjuntar el documento."
        })
        logging.info(f"adjuntar_documento_salud_mascota: Resultado JSON: {res_json}")
        return res_json

    try:
        q = """
            INSERT INTO mascota_documentos_salud (
                mascota_id, evento_salud_id, tipo_documento, nombre_archivo,
                archivo_url, mime_type, fecha_documento, descripcion
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(
            q,
            (
                mascota_id,
                evento_salud_id,
                tipo_documento,
                nombre_archivo,
                archivo_url,
                mime_type,
                fecha_documento,
                descripcion,
            ),
        )
        documento_id = cursor.lastrowid

        res_json = json.dumps({
            "ok": True,
            "action": "created",
            "documento_id": documento_id,
            "mascota_id": mascota_id,
            "tipo_documento": tipo_documento,
            "msg": "Documento de salud adjuntado correctamente."
        })

    except mysql.connector.Error as error:
        logging.error(f"adjuntar_documento_salud_mascota: Error de base de datos: {error}")
        res_json = json.dumps({
            "ok": False,
            "msg": "Error técnico al adjuntar el documento."
        })

    logging.info(f"adjuntar_documento_salud_mascota: Resultado JSON: {res_json}")
    return res_json
```

## Regla conversacional asociada

Felix debe:

- pedir primero solo los campos obligatorios
- guardar el perfil base rapidamente
- continuar con bloques cortos de informacion relacionada
- no bloquear el registro si faltan datos no criticos
- dejar pendientes para despues lo que el usuario no conozca
- confirmar despues de cada tool action:
  - que hizo
  - sobre que mascota trabajo
  - que informacion quedo guardada
  - cual es el siguiente paso sugerido
