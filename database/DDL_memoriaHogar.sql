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

CREATE TABLE IF NOT EXISTS hogar_personas (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hogar_id BIGINT UNSIGNED NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    rol_hogar VARCHAR(80) NULL,
    relacion_con_mascotas TEXT NULL,
    permanencia_tipo VARCHAR(50) NULL,
    horario_habitual TEXT NULL,
    nivel_participacion_cuidado VARCHAR(50) NULL,
    observaciones TEXT NULL,
    estado_registro VARCHAR(30) NOT NULL DEFAULT 'activo',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_hogar_personas_hogar_id (hogar_id),
    CONSTRAINT fk_hogar_personas_hogar
        FOREIGN KEY (hogar_id) REFERENCES hogares(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hogar_espacios (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hogar_id BIGINT UNSIGNED NOT NULL,
    nombre_espacio VARCHAR(120) NOT NULL,
    tipo_espacio VARCHAR(80) NULL,
    uso_principal TEXT NULL,
    acceso_mascotas VARCHAR(80) NULL,
    descripcion TEXT NULL,
    observaciones TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_hogar_espacios_hogar_id (hogar_id),
    CONSTRAINT fk_hogar_espacios_hogar
        FOREIGN KEY (hogar_id) REFERENCES hogares(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hogar_recursos_mascotas (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hogar_id BIGINT UNSIGNED NOT NULL,
    espacio_id BIGINT UNSIGNED NULL,
    tipo_recurso VARCHAR(100) NOT NULL,
    cantidad SMALLINT UNSIGNED NULL,
    descripcion TEXT NULL,
    uso_compartido BOOLEAN NOT NULL DEFAULT FALSE,
    observaciones TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_hogar_recursos_hogar_id (hogar_id),
    INDEX idx_hogar_recursos_espacio_id (espacio_id),
    CONSTRAINT fk_hogar_recursos_hogar
        FOREIGN KEY (hogar_id) REFERENCES hogares(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_hogar_recursos_espacio
        FOREIGN KEY (espacio_id) REFERENCES hogar_espacios(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS hogar_interacciones (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hogar_id BIGINT UNSIGNED NOT NULL,
    mascota_id BIGINT UNSIGNED NULL,
    persona_id BIGINT UNSIGNED NULL,
    espacio_id BIGINT UNSIGNED NULL,
    tipo_interaccion VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    frecuencia_aproximada VARCHAR(80) NULL,
    momento_habitual VARCHAR(120) NULL,
    impacto_convivencia VARCHAR(50) NULL,
    observaciones TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_hogar_interacciones_hogar_id (hogar_id),
    INDEX idx_hogar_interacciones_mascota_id (mascota_id),
    INDEX idx_hogar_interacciones_persona_id (persona_id),
    INDEX idx_hogar_interacciones_espacio_id (espacio_id),
    CONSTRAINT fk_hogar_interacciones_hogar
        FOREIGN KEY (hogar_id) REFERENCES hogares(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_hogar_interacciones_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_hogar_interacciones_persona
        FOREIGN KEY (persona_id) REFERENCES hogar_personas(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_hogar_interacciones_espacio
        FOREIGN KEY (espacio_id) REFERENCES hogar_espacios(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS hogar_observaciones_contexto (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hogar_id BIGINT UNSIGNED NOT NULL,
    persona_id BIGINT UNSIGNED NULL,
    mascota_id BIGINT UNSIGNED NULL,
    espacio_id BIGINT UNSIGNED NULL,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(100) NULL,
    prioridad VARCHAR(30) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_hogar_obs_contexto_hogar_id (hogar_id),
    INDEX idx_hogar_obs_contexto_persona_id (persona_id),
    INDEX idx_hogar_obs_contexto_mascota_id (mascota_id),
    INDEX idx_hogar_obs_contexto_espacio_id (espacio_id),
    CONSTRAINT fk_hogar_obs_contexto_hogar
        FOREIGN KEY (hogar_id) REFERENCES hogares(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_hogar_obs_contexto_persona
        FOREIGN KEY (persona_id) REFERENCES hogar_personas(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_hogar_obs_contexto_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_hogar_obs_contexto_espacio
        FOREIGN KEY (espacio_id) REFERENCES hogar_espacios(id)
        ON DELETE SET NULL
);
