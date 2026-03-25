CREATE TABLE IF NOT EXISTS mascotas (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hogar_id BIGINT UNSIGNED NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(120) NULL,
    sexo VARCHAR(30) NULL,
    fecha_llegada_hogar DATE NULL,
    fecha_nacimiento_aproximada DATE NULL,
    edad_aproximada_valor SMALLINT UNSIGNED NULL,
    edad_aproximada_unidad VARCHAR(20) NULL,
    origen_tipo VARCHAR(50) NULL,
    origen_detalle TEXT NULL,
    paso_por_otros_hogares BOOLEAN NOT NULL DEFAULT FALSE,
    detalle_otros_hogares TEXT NULL,
    rasgos_fisicos TEXT NULL,
    color_principal VARCHAR(120) NULL,
    tamanio_aproximado VARCHAR(30) NULL,
    esterilizado BOOLEAN NULL,
    fecha_esterilizacion DATE NULL,
    caracter_inicial TEXT NULL,
    caracter_observado TEXT NULL,
    observaciones_iniciales TEXT NULL,
    estado_registro VARCHAR(30) NOT NULL DEFAULT 'activo',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_mascotas_hogar_id (hogar_id),
    INDEX idx_mascotas_nombre (nombre),
    INDEX idx_mascotas_especie (especie)
);

CREATE TABLE IF NOT EXISTS mascota_condiciones_salud (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    mascota_id BIGINT UNSIGNED NOT NULL,
    tipo_condicion VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    origen VARCHAR(120) NULL,
    vigente BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_inicio DATE NULL,
    fecha_fin DATE NULL,
    notas TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_condiciones_mascota_id (mascota_id),
    CONSTRAINT fk_condiciones_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mascota_medicamentos (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    mascota_id BIGINT UNSIGNED NOT NULL,
    nombre_medicamento VARCHAR(150) NOT NULL,
    motivo TEXT NULL,
    dosis VARCHAR(120) NULL,
    frecuencia VARCHAR(120) NULL,
    via_administracion VARCHAR(80) NULL,
    fecha_inicio DATE NULL,
    fecha_fin DATE NULL,
    vigente BOOLEAN NOT NULL DEFAULT TRUE,
    recetado_por VARCHAR(150) NULL,
    notas TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_medicamentos_mascota_id (mascota_id),
    INDEX idx_medicamentos_vigente (vigente),
    CONSTRAINT fk_medicamentos_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mascota_tratamientos (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    mascota_id BIGINT UNSIGNED NOT NULL,
    tipo_tratamiento VARCHAR(120) NOT NULL,
    descripcion TEXT NULL,
    objetivo TEXT NULL,
    fecha_inicio DATE NULL,
    fecha_fin DATE NULL,
    vigente BOOLEAN NOT NULL DEFAULT TRUE,
    responsable VARCHAR(150) NULL,
    notas TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_tratamientos_mascota_id (mascota_id),
    INDEX idx_tratamientos_vigente (vigente),
    CONSTRAINT fk_tratamientos_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mascota_eventos_salud (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    mascota_id BIGINT UNSIGNED NOT NULL,
    tipo_evento VARCHAR(100) NOT NULL,
    fecha_evento DATE NULL,
    motivo_consulta TEXT NULL,
    diagnostico_reportado TEXT NULL,
    procedimiento_realizado TEXT NULL,
    veterinario VARCHAR(150) NULL,
    centro_veterinario VARCHAR(150) NULL,
    resultado TEXT NULL,
    requiere_seguimiento BOOLEAN NOT NULL DEFAULT FALSE,
    notas TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_eventos_salud_mascota_id (mascota_id),
    INDEX idx_eventos_salud_fecha (fecha_evento),
    CONSTRAINT fk_eventos_salud_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mascota_documentos_salud (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    mascota_id BIGINT UNSIGNED NOT NULL,
    evento_salud_id BIGINT UNSIGNED NULL,
    tipo_documento VARCHAR(100) NOT NULL,
    nombre_archivo VARCHAR(255) NULL,
    archivo_url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(120) NULL,
    fecha_documento DATE NULL,
    descripcion TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_documentos_salud_mascota_id (mascota_id),
    INDEX idx_documentos_salud_evento_id (evento_salud_id),
    CONSTRAINT fk_documentos_salud_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_documentos_salud_evento
        FOREIGN KEY (evento_salud_id) REFERENCES mascota_eventos_salud(id)
        ON DELETE SET NULL
);
