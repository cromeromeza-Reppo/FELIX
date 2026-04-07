# Propuesta de tool action para resolver el hogar activo

## Enfoque recomendado

Antes de registrar cualquier mascota, salud, memoria del hogar o evento de convivencia, Félix debe asegurarse de que el hogar activo ya esté resuelto.

La idea no es convertir esto en un trámite técnico ni en un formulario. Félix debe resolver el hogar con la menor fricción posible:
- si el sistema ya tiene un `hogar_id` activo, lo reutiliza
- si todavía no existe, crea el hogar primero
- después continúa con el punto 1, 2 o 3 según corresponda

Para mantener la arquitectura simple y consistente con el proyecto:
- no se crea una tabla nueva
- no se crea una función nueva
- se reutiliza la tabla `hogares`
- se reutiliza la función `guardar_hogar_contexto(...)`

La lógica general es la misma del resto del sistema:
- si `hogar_id` viene en `null`, la función crea
- si `hogar_id` viene con valor, la misma función actualiza
- en una actualización, solo cambian los campos cuyo valor no sea `None`
- `null` significa “no informado ahora” o “no cambiar ahora”; no significa borrar

Regla operativa importante:
- Félix no debe pedir nunca `hogar_id` al usuario
- si no hay nombre explícito y hace falta crear hogar, puede usar por defecto `Hogar principal`
- más adelante puede completar o cambiar ese nombre con la misma función

Todas las funciones usan `mysql.connector`, `json`, `logging`, placeholders `%s`, cierre en `finally` y devuelven JSON string con:
- `ok`
- `action`
- `hogar_id`
- `campos_actualizados`
- `msg`

## Tool action `guardar_hogar_contexto`

**Propósito**
Crear un hogar cuando `hogar_id` viene en `null`, o completar y actualizar un hogar existente cuando `hogar_id` viene con valor.

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
