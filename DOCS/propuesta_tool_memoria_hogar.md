# Propuesta de tool actions para construir la memoria del hogar

## Enfoque recomendado

Felix debe completar la memoria del hogar por capas.

- contexto general del hogar
- personas del grupo familiar
- espacios relevantes
- recursos para las mascotas
- interacciones observadas
- observaciones generales del contexto

Todas las funciones abren y cierran su propia conexion MySQL.

## 1. Tool action `actualizar_hogar_contexto`

```python
import json
import logging
import mysql.connector


def actualizar_hogar_contexto(hogar_id, nombre=None, tipo_vivienda=None, descripcion_general=None, direccion_referencia=None, observaciones_contexto=None):
    logging.info("actualizar_hogar_contexto: Inicio de actualizacion.")
    if not hogar_id:
        res_json = json.dumps({"msg": "Falta `hogar_id` para actualizar el hogar."})
        logging.info(f"actualizar_hogar_contexto: Resultado JSON: {res_json}")
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
    for campo, valor in campos.items():
        if valor is not None:
            updates.append(f"{campo} = %s")
            valores.append(valor)
    if not updates:
        res_json = json.dumps({"msg": "No hay campos para actualizar en el hogar."})
        logging.info(f"actualizar_hogar_contexto: Resultado JSON: {res_json}")
        return res_json
    conexion = None
    cursor = None
    valores.append(hogar_id)
    try:
        conexion = mysql.connector.connect(host="localhost", user="felix", password="Ca29Si26$", database="felix")
        cursor = conexion.cursor()
        q = f"UPDATE hogares SET {', '.join(updates)} WHERE id = %s"
        cursor.execute(q, tuple(valores))
        conexion.commit()
        res_json = json.dumps({"ok": True, "action": "updated", "hogar_id": hogar_id, "msg": "Contexto del hogar actualizado correctamente."})
    except mysql.connector.Error as error:
        logging.error(f"actualizar_hogar_contexto: Error de base de datos: {error}")
        res_json = json.dumps({"ok": False, "msg": "Error tecnico al actualizar el hogar."})
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()
    logging.info(f"actualizar_hogar_contexto: Resultado JSON: {res_json}")
    return res_json
```

## 2. Tool action `registrar_persona_hogar`

```python
import json
import logging
import mysql.connector


def registrar_persona_hogar(hogar_id, nombre, rol_hogar=None, relacion_con_mascotas=None, permanencia_tipo=None, horario_habitual=None, nivel_participacion_cuidado=None, observaciones=None):
    logging.info("registrar_persona_hogar: Inicio de registro.")
    if not hogar_id or not nombre:
        res_json = json.dumps({"msg": "Faltan campos obligatorios para registrar la persona del hogar."})
        logging.info(f"registrar_persona_hogar: Resultado JSON: {res_json}")
        return res_json
    conexion = None
    cursor = None
    try:
        conexion = mysql.connector.connect(host="localhost", user="felix", password="Ca29Si26$", database="felix")
        cursor = conexion.cursor()
        q = """
            INSERT INTO hogar_personas (
                hogar_id, nombre, rol_hogar, relacion_con_mascotas,
                permanencia_tipo, horario_habitual, nivel_participacion_cuidado, observaciones
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(q, (hogar_id, nombre, rol_hogar, relacion_con_mascotas, permanencia_tipo, horario_habitual, nivel_participacion_cuidado, observaciones))
        conexion.commit()
        persona_id = cursor.lastrowid
        res_json = json.dumps({"ok": True, "action": "created", "persona_id": persona_id, "msg": "Persona del hogar registrada correctamente."})
    except mysql.connector.Error as error:
        logging.error(f"registrar_persona_hogar: Error de base de datos: {error}")
        res_json = json.dumps({"ok": False, "msg": "Error tecnico al registrar la persona del hogar."})
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()
    logging.info(f"registrar_persona_hogar: Resultado JSON: {res_json}")
    return res_json
```

## 3. Tool action `actualizar_persona_hogar`

```python
import json
import logging
import mysql.connector


def actualizar_persona_hogar(persona_id, rol_hogar=None, relacion_con_mascotas=None, permanencia_tipo=None, horario_habitual=None, nivel_participacion_cuidado=None, observaciones=None):
    logging.info("actualizar_persona_hogar: Inicio de actualizacion.")
    if not persona_id:
        res_json = json.dumps({"msg": "Falta `persona_id` para actualizar la persona del hogar."})
        logging.info(f"actualizar_persona_hogar: Resultado JSON: {res_json}")
        return res_json
    campos = {
        "rol_hogar": rol_hogar,
        "relacion_con_mascotas": relacion_con_mascotas,
        "permanencia_tipo": permanencia_tipo,
        "horario_habitual": horario_habitual,
        "nivel_participacion_cuidado": nivel_participacion_cuidado,
        "observaciones": observaciones,
    }
    updates = []
    valores = []
    for campo, valor in campos.items():
        if valor is not None:
            updates.append(f"{campo} = %s")
            valores.append(valor)
    if not updates:
        res_json = json.dumps({"msg": "No hay campos para actualizar en la persona del hogar."})
        logging.info(f"actualizar_persona_hogar: Resultado JSON: {res_json}")
        return res_json
    conexion = None
    cursor = None
    valores.append(persona_id)
    try:
        conexion = mysql.connector.connect(host="localhost", user="felix", password="Ca29Si26$", database="felix")
        cursor = conexion.cursor()
        q = f"UPDATE hogar_personas SET {', '.join(updates)} WHERE id = %s"
        cursor.execute(q, tuple(valores))
        conexion.commit()
        res_json = json.dumps({"ok": True, "action": "updated", "persona_id": persona_id, "msg": "Persona del hogar actualizada correctamente."})
    except mysql.connector.Error as error:
        logging.error(f"actualizar_persona_hogar: Error de base de datos: {error}")
        res_json = json.dumps({"ok": False, "msg": "Error tecnico al actualizar la persona del hogar."})
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()
    logging.info(f"actualizar_persona_hogar: Resultado JSON: {res_json}")
    return res_json
```

## 4. Tool action `registrar_espacio_hogar`

```python
import json
import logging
import mysql.connector


def registrar_espacio_hogar(hogar_id, nombre_espacio, tipo_espacio=None, uso_principal=None, acceso_mascotas=None, descripcion=None, observaciones=None):
    logging.info("registrar_espacio_hogar: Inicio de registro.")
    if not hogar_id or not nombre_espacio:
        res_json = json.dumps({"msg": "Faltan campos obligatorios para registrar el espacio del hogar."})
        logging.info(f"registrar_espacio_hogar: Resultado JSON: {res_json}")
        return res_json
    conexion = None
    cursor = None
    try:
        conexion = mysql.connector.connect(host="localhost", user="felix", password="Ca29Si26$", database="felix")
        cursor = conexion.cursor()
        q = """
            INSERT INTO hogar_espacios (
                hogar_id, nombre_espacio, tipo_espacio, uso_principal,
                acceso_mascotas, descripcion, observaciones
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(q, (hogar_id, nombre_espacio, tipo_espacio, uso_principal, acceso_mascotas, descripcion, observaciones))
        conexion.commit()
        espacio_id = cursor.lastrowid
        res_json = json.dumps({"ok": True, "action": "created", "espacio_id": espacio_id, "msg": "Espacio del hogar registrado correctamente."})
    except mysql.connector.Error as error:
        logging.error(f"registrar_espacio_hogar: Error de base de datos: {error}")
        res_json = json.dumps({"ok": False, "msg": "Error tecnico al registrar el espacio del hogar."})
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()
    logging.info(f"registrar_espacio_hogar: Resultado JSON: {res_json}")
    return res_json
```

## 5. Tool action `registrar_recurso_hogar_mascotas`

```python
import json
import logging
import mysql.connector


def registrar_recurso_hogar_mascotas(hogar_id, tipo_recurso, espacio_id=None, cantidad=None, descripcion=None, uso_compartido=False, observaciones=None):
    logging.info("registrar_recurso_hogar_mascotas: Inicio de registro.")
    if not hogar_id or not tipo_recurso:
        res_json = json.dumps({"msg": "Faltan campos obligatorios para registrar el recurso del hogar."})
        logging.info(f"registrar_recurso_hogar_mascotas: Resultado JSON: {res_json}")
        return res_json
    conexion = None
    cursor = None
    try:
        conexion = mysql.connector.connect(host="localhost", user="felix", password="Ca29Si26$", database="felix")
        cursor = conexion.cursor()
        q = """
            INSERT INTO hogar_recursos_mascotas (
                hogar_id, espacio_id, tipo_recurso, cantidad, descripcion, uso_compartido, observaciones
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(q, (hogar_id, espacio_id, tipo_recurso, cantidad, descripcion, uso_compartido, observaciones))
        conexion.commit()
        recurso_id = cursor.lastrowid
        res_json = json.dumps({"ok": True, "action": "created", "recurso_id": recurso_id, "msg": "Recurso del hogar registrado correctamente."})
    except mysql.connector.Error as error:
        logging.error(f"registrar_recurso_hogar_mascotas: Error de base de datos: {error}")
        res_json = json.dumps({"ok": False, "msg": "Error tecnico al registrar el recurso del hogar."})
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()
    logging.info(f"registrar_recurso_hogar_mascotas: Resultado JSON: {res_json}")
    return res_json
```

## 6. Tool action `registrar_interaccion_hogar`

```python
import json
import logging
import mysql.connector


def registrar_interaccion_hogar(hogar_id, tipo_interaccion, descripcion, mascota_id=None, persona_id=None, espacio_id=None, frecuencia_aproximada=None, momento_habitual=None, impacto_convivencia=None, observaciones=None):
    logging.info("registrar_interaccion_hogar: Inicio de registro.")
    if not hogar_id or not tipo_interaccion or not descripcion:
        res_json = json.dumps({"msg": "Faltan campos obligatorios para registrar la interaccion del hogar."})
        logging.info(f"registrar_interaccion_hogar: Resultado JSON: {res_json}")
        return res_json
    conexion = None
    cursor = None
    try:
        conexion = mysql.connector.connect(host="localhost", user="felix", password="Ca29Si26$", database="felix")
        cursor = conexion.cursor()
        q = """
            INSERT INTO hogar_interacciones (
                hogar_id, mascota_id, persona_id, espacio_id, tipo_interaccion,
                descripcion, frecuencia_aproximada, momento_habitual, impacto_convivencia, observaciones
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(q, (hogar_id, mascota_id, persona_id, espacio_id, tipo_interaccion, descripcion, frecuencia_aproximada, momento_habitual, impacto_convivencia, observaciones))
        conexion.commit()
        interaccion_id = cursor.lastrowid
        res_json = json.dumps({"ok": True, "action": "created", "interaccion_id": interaccion_id, "msg": "Interaccion del hogar registrada correctamente."})
    except mysql.connector.Error as error:
        logging.error(f"registrar_interaccion_hogar: Error de base de datos: {error}")
        res_json = json.dumps({"ok": False, "msg": "Error tecnico al registrar la interaccion del hogar."})
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()
    logging.info(f"registrar_interaccion_hogar: Resultado JSON: {res_json}")
    return res_json
```

## 7. Tool action `registrar_observacion_contexto_hogar`

```python
import json
import logging
import mysql.connector


def registrar_observacion_contexto_hogar(hogar_id, descripcion, persona_id=None, mascota_id=None, espacio_id=None, categoria=None, prioridad=None):
    logging.info("registrar_observacion_contexto_hogar: Inicio de registro.")
    if not hogar_id or not descripcion:
        res_json = json.dumps({"msg": "Faltan campos obligatorios para registrar la observacion del contexto."})
        logging.info(f"registrar_observacion_contexto_hogar: Resultado JSON: {res_json}")
        return res_json
    conexion = None
    cursor = None
    try:
        conexion = mysql.connector.connect(host="localhost", user="felix", password="Ca29Si26$", database="felix")
        cursor = conexion.cursor()
        q = """
            INSERT INTO hogar_observaciones_contexto (
                hogar_id, persona_id, mascota_id, espacio_id, descripcion, categoria, prioridad
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(q, (hogar_id, persona_id, mascota_id, espacio_id, descripcion, categoria, prioridad))
        conexion.commit()
        observacion_id = cursor.lastrowid
        res_json = json.dumps({"ok": True, "action": "created", "observacion_id": observacion_id, "msg": "Observacion del contexto registrada correctamente."})
    except mysql.connector.Error as error:
        logging.error(f"registrar_observacion_contexto_hogar: Error de base de datos: {error}")
        res_json = json.dumps({"ok": False, "msg": "Error tecnico al registrar la observacion del contexto."})
    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()
    logging.info(f"registrar_observacion_contexto_hogar: Resultado JSON: {res_json}")
    return res_json
```
