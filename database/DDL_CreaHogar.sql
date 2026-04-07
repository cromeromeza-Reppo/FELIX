CREATE TABLE IF NOT EXISTS hogares (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    tipo_vivienda VARCHAR(50) NULL,
    descripcion_general TEXT NULL,
    direccion_referencia VARCHAR(255) NULL,
    observaciones_contexto TEXT NULL,
    estado_registro VARCHAR(30) NOT NULL DEFAULT 'activo',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
