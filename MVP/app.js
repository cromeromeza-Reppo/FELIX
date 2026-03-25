const STORAGE_KEY = "felix-demo-state-v3";

const countries = [
  { code: "CO", dial: "+57", flag: "CO", label: "Colombia" },
  { code: "MX", dial: "+52", flag: "MX", label: "Mexico" },
  { code: "AR", dial: "+54", flag: "AR", label: "Argentina" },
  { code: "CL", dial: "+56", flag: "CL", label: "Chile" },
  { code: "ES", dial: "+34", flag: "ES", label: "Espana" },
  { code: "US", dial: "+1", flag: "US", label: "USA" }
];

const sections = [
  { id: "dashboard", label: "Inicio" },
  { id: "pets", label: "Mascotas" },
  { id: "behavior", label: "Convivencia" },
  { id: "feeding", label: "Comida" },
  { id: "health", label: "Salud" },
  { id: "reports", label: "Analisis guiado" },
  { id: "settings", label: "Configuracion" }
];

const reportOptions = [
  {
    title: "Analisis de conflictos",
    category: "Conducta",
    prompt: "Veo que quieres un reporte de analisis de conflictos. Dime, lo quieres para todas las mascotas o para una relacion en especial?"
  },
  {
    title: "Dinamica de mascotas",
    category: "Conducta",
    prompt: "Listo. Para dinamica entre mascotas, dime que mascotas quieres comparar o si lo quieres para todo el hogar."
  },
  {
    title: "Eventos de conducta",
    category: "Conducta",
    prompt: "Perfecto. Dime si quieres eventos de conducta de todo el mes o de una mascota puntual."
  },
  {
    title: "Historial de salud",
    category: "Salud",
    prompt: "Veo que quieres un reporte de historial de salud. Dime, lo quieres para todos o para una mascota en especial?"
  },
  {
    title: "Tendencias de peso",
    category: "Peso",
    prompt: "De acuerdo. Dime si quieres ver tendencia de peso de una mascota o del hogar completo."
  }
];

function uid() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildInitialState() {
  return {
    theme: "dark",
    auth: {
      loggedIn: false,
      loginStep: 1,
      loading: false,
      country: "CO",
      phone: "",
      otp: ["", "", "", "", "", ""]
    },
    ui: {
      activeSection: "dashboard",
      chatExpanded: false,
      modal: null,
      reportFilter: "Todos",
      selectedReport: "Analisis de conflictos",
      selectedHealthPetId: "pet-pepe",
      selectedFoodId: "food-1",
      pendingFlow: null
    },
    user: {
      name: "Lina Marcela",
      role: "Administradora",
      email: "lina@email.com",
      phone: "+57 300 000 0000",
      home: "Casa de Lina",
      plan: "Felix Pro",
      photo: "",
      notifications: true,
      themePreference: "Auto"
    },
    pets: [
      {
        id: "pet-pepe",
        name: "Pepe",
        species: "Perro",
        age: "5 anos",
        sex: "Macho",
        anxiety: "Media",
        traits: ["protector", "reactivo en pasillos"],
        sensitivities: ["ruidos fuertes", "cambios de rutina"],
        status: "Atento",
        avatar: "P",
        color: "#63d8ff",
        lastUpdateNote: "Observado con mayor activacion cerca del comedor.",
        doctor: "Dra. Luisa Perez",
        clinic: "Clinica Vet Norte",
        medicines: ["Omega 3", "Suplemento digestivo leve"],
        documents: {
          prescription: "formula-pepe-marzo.jpg",
          vaccineCard: "carnet-pepe-2026.png"
        }
      },
      {
        id: "pet-ronaldo",
        name: "Ronaldo",
        species: "Gato",
        age: "4 anos",
        sex: "Macho",
        anxiety: "Alta",
        traits: ["territorial", "curioso"],
        sensitivities: ["visitas", "espacios cerrados"],
        status: "Tension leve",
        avatar: "R",
        color: "#8ecb75",
        lastUpdateNote: "Tolera mejor las noches tranquilas y espacios altos.",
        doctor: "Dr. Mauricio Rey",
        clinic: "Centro Felino Andino",
        medicines: ["Sin medicacion activa"],
        documents: {
          prescription: "",
          vaccineCard: "carnet-ronaldo-2026.png"
        }
      },
      {
        id: "pet-amara",
        name: "Amara",
        species: "Perra",
        age: "7 anos",
        sex: "Hembra",
        anxiety: "Baja",
        traits: ["estable", "sociable"],
        sensitivities: ["espera prolongada"],
        status: "Estable",
        avatar: "A",
        color: "#f5b85c",
        lastUpdateNote: "Sirve como referencia de calma en transiciones.",
        doctor: "Dra. Valentina Correa",
        clinic: "Vet House Sur",
        medicines: ["Condroprotector"],
        documents: {
          prescription: "formula-amara-febrero.png",
          vaccineCard: "carnet-amara-2026.png"
        }
      },
      {
        id: "pet-frida",
        name: "Frida",
        species: "Gata",
        age: "3 anos",
        sex: "Hembra",
        anxiety: "Media",
        traits: ["observadora", "comedora lenta"],
        sensitivities: ["sabores nuevos"],
        status: "Observacion digestiva",
        avatar: "F",
        color: "#d39bff",
        lastUpdateNote: "Se mantiene en seguimiento por episodio digestivo aislado.",
        doctor: "Dra. Marcela Gaitan",
        clinic: "Clinica Felina Prisma",
        medicines: ["Probios", "Gastro calm"],
        documents: {
          prescription: "formula-frida-marzo.jpg",
          vaccineCard: "carnet-frida-2026.png"
        }
      },
      {
        id: "pet-milo",
        name: "Milo",
        species: "Perro",
        age: "2 anos",
        sex: "Macho",
        anxiety: "Media",
        traits: ["jugueton", "sensible a visitas"],
        sensitivities: ["timbre", "movimiento brusco"],
        status: "Adaptacion positiva",
        avatar: "M",
        color: "#7fb8d6",
        lastUpdateNote: "Se esta adaptando bien a rutinas nuevas, pero necesita transiciones suaves cuando llegan visitas.",
        doctor: "Dr. Felipe Pardo",
        clinic: "Vet Studio Central",
        medicines: ["Suplemento calmante ocasional"],
        documents: {
          prescription: "formula-milo-marzo.jpg",
          vaccineCard: "carnet-milo-2026.png"
        }
      }
    ],
    behaviorEvents: [
      {
        id: uid(),
        date: "2026-03-17",
        mainPet: "Pepe",
        relatedPets: ["Ronaldo", "Amara"],
        intensity: "Alta",
        note: "Cruce tenso cerca del comedor al servir la cena.",
        recommendation: "Separar estaciones y bajar la congestion del espacio.",
        followUpInDays: 3
      },
      {
        id: uid(),
        date: "2026-03-15",
        mainPet: "Ronaldo",
        relatedPets: ["Pepe"],
        intensity: "Media",
        note: "Bufido en corredor estrecho despues de visita.",
        recommendation: "Abrir ruta alternativa y reforzar descanso vertical.",
        followUpInDays: 5
      },
      {
        id: uid(),
        date: "2026-03-12",
        mainPet: "Pepe",
        relatedPets: ["Ronaldo"],
        intensity: "Alta",
        note: "Escalada breve al regresar del paseo.",
        recommendation: "Descompresion de 10 minutos antes de liberar zonas comunes.",
        followUpInDays: 2
      },
      {
        id: uid(),
        date: "2026-03-10",
        mainPet: "Frida",
        relatedPets: ["Amara"],
        intensity: "Baja",
        note: "Evitacion suave al cambiar alimentacion.",
        recommendation: "Introduccion progresiva y observacion digestiva.",
        followUpInDays: 4
      },
      {
        id: uid(),
        date: "2026-03-06",
        mainPet: "Pepe",
        relatedPets: ["Ronaldo"],
        intensity: "Media",
        note: "Mirada fija y tension durante limpieza del hogar.",
        recommendation: "Separar por zonas durante cambios de rutina.",
        followUpInDays: 4
      }
    ],
    healthEvents: [
      {
        id: uid(),
        date: "2026-03-17",
        pet: "Frida",
        type: "Observacion",
        symptom: "Vomito aislado",
        status: "Seguimiento activo",
        nextDate: "2026-03-19"
      },
      {
        id: uid(),
        date: "2026-03-11",
        pet: "Amara",
        type: "Control",
        symptom: "Chequeo general",
        status: "Sin alertas",
        nextDate: "2026-06-11"
      },
      {
        id: uid(),
        date: "2026-03-05",
        pet: "Pepe",
        type: "Vacuna",
        symptom: "Refuerzo anual",
        status: "Completo",
        nextDate: "2027-03-05"
      },
      {
        id: uid(),
        date: "2026-02-26",
        pet: "Ronaldo",
        type: "Control",
        symptom: "Revision por estres territorial",
        status: "Plan de observacion",
        nextDate: "2026-04-02"
      },
      {
        id: uid(),
        date: "2026-03-08",
        pet: "Milo",
        type: "Control",
        symptom: "Chequeo de adaptacion y energia",
        status: "Buena respuesta",
        nextDate: "2026-05-08"
      }
    ],
    feedingEntries: [
      {
        id: "food-1",
        pet: "Amara",
        brand: "Natura Balance Adult",
        quantityKg: 10,
        purchaseDate: "2026-02-28",
        openDate: "2026-03-01",
        durationDays: 24,
        acceptance: "Alta",
        price: 189000,
        effect: "Mas calma en tardes y digestivo estable",
        productImage: "natura-balance-front.jpg",
        nutritionImage: "natura-balance-tabla.jpg"
      },
      {
        id: "food-2",
        pet: "Frida",
        brand: "Sensitive Ocean",
        quantityKg: 3,
        purchaseDate: "2026-03-02",
        openDate: "2026-03-03",
        durationDays: 12,
        acceptance: "Media",
        price: 82000,
        effect: "Pelo suave, pero popo algo blanda al inicio",
        productImage: "sensitive-ocean.jpg",
        nutritionImage: "sensitive-ocean-tabla.jpg"
      },
      {
        id: "food-3",
        pet: "Pepe",
        brand: "Protein Field",
        quantityKg: 8,
        purchaseDate: "2026-02-18",
        openDate: "2026-02-20",
        durationDays: 18,
        acceptance: "Alta",
        price: 154000,
        effect: "Buen foco despues de comer y pelaje brillante",
        productImage: "protein-field-front.png",
        nutritionImage: "protein-field-nutrition.png"
      }
    ],
    weightEntries: [
      { id: uid(), pet: "Pepe", date: "2026-02-18", value: 6.5 },
      { id: uid(), pet: "Pepe", date: "2026-03-18", value: 6.8 },
      { id: uid(), pet: "Amara", date: "2026-02-18", value: 14.1 },
      { id: uid(), pet: "Amara", date: "2026-03-18", value: 14.3 },
      { id: uid(), pet: "Ronaldo", date: "2026-03-10", value: 4.4 },
      { id: uid(), pet: "Frida", date: "2026-03-09", value: 3.6 },
      { id: uid(), pet: "Milo", date: "2026-03-16", value: 11.2 }
    ],
    reminders: [
      { id: uid(), date: "2026-03-19", label: "Revisar evolucion digestiva de Frida" },
      { id: uid(), date: "2026-03-21", label: "Controlar interaccion Pepe - Ronaldo en comedor" },
      { id: uid(), date: "2026-03-24", label: "Validar duracion del alimento nuevo de Amara" },
      { id: uid(), date: "2026-03-26", label: "Registrar adaptacion de Milo a visitas nocturnas" }
    ],
    followUps: [
      { id: uid(), title: "Registrar contexto de comedor", due: "En 3 dias", owner: "Pepe / Ronaldo" },
      { id: uid(), title: "Observar repeticion digestiva", due: "En 2 dias", owner: "Frida" },
      { id: uid(), title: "Actualizar lectura de tensiones en pasillo", due: "Esta semana", owner: "Ronaldo" },
      { id: uid(), title: "Confirmar rutina de recepcion calmada", due: "En 5 dias", owner: "Milo" }
    ],
    chatMessages: [
      {
        id: uid(),
        role: "assistant",
        author: "FELIX",
        text: "Ya deje organizado el estado general del hogar. Hoy veo tension leve entre Pepe y Ronaldo, y un seguimiento digestivo activo para Frida.",
        time: "08:20"
      },
      {
        id: uid(),
        role: "assistant",
        author: "FELIX",
        text: "Si quieres, puedo ayudarte a actualizar una mascota, registrar una comida nueva o preparar un reporte desde el chat.",
        time: "08:21"
      }
    ]
  };
}

let state = loadState();
let toastQueue = [];

const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");
const toastRoot = document.getElementById("toast-root");

document.addEventListener("DOMContentLoaded", render);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildInitialState();
    return mergeState(buildInitialState(), JSON.parse(raw));
  } catch (error) {
    console.warn("No se pudo cargar el estado guardado.", error);
    return buildInitialState();
  }
}

function mergeState(base, incoming) {
  return {
    ...base,
    ...incoming,
    auth: { ...base.auth, ...(incoming.auth || {}) },
    ui: { ...base.ui, ...(incoming.ui || {}) },
    user: { ...base.user, ...(incoming.user || {}) },
    pets: Array.isArray(incoming.pets) ? incoming.pets : base.pets,
    behaviorEvents: Array.isArray(incoming.behaviorEvents) ? incoming.behaviorEvents : base.behaviorEvents,
    healthEvents: Array.isArray(incoming.healthEvents) ? incoming.healthEvents : base.healthEvents,
    feedingEntries: Array.isArray(incoming.feedingEntries) ? incoming.feedingEntries : base.feedingEntries,
    weightEntries: Array.isArray(incoming.weightEntries) ? incoming.weightEntries : base.weightEntries,
    reminders: Array.isArray(incoming.reminders) ? incoming.reminders : base.reminders,
    followUps: Array.isArray(incoming.followUps) ? incoming.followUps : base.followUps,
    chatMessages: Array.isArray(incoming.chatMessages) ? incoming.chatMessages : base.chatMessages
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setState(updater, options = {}) {
  state = typeof updater === "function" ? updater(state) : updater;
  saveState();
  render(options);
}

function render(options = {}) {
  document.body.className = state.theme === "light" ? "theme-light" : "theme-dark";
  app.innerHTML = state.auth.loggedIn ? renderShell() : renderAuth();
  renderModal();
  renderToasts();
  bindBaseEvents();
  if (state.auth.loggedIn) {
    bindShellEvents();
  } else {
    bindAuthEvents();
  }
  scrollChatToBottom(options.forceScroll);
}

function scrollChatToBottom(forceScroll = false) {
  const messages = document.getElementById("chat-messages");
  if (!messages) return;
  window.requestAnimationFrame(() => {
    if (forceScroll || messages.scrollHeight > messages.clientHeight) {
      messages.scrollTop = messages.scrollHeight;
    }
  });
}

function renderAuth() {
  const currentCountry = countries.find((country) => country.code === state.auth.country) || countries[0];
  const stepTwo = state.auth.loginStep === 2;
  return `
    <button class="theme-toggle" data-action="toggle-theme" aria-label="Cambiar tema">
      ${renderThemeIcon()}
    </button>
    <main class="auth-shell">
      <section class="auth-card">
        <div class="auth-hero">
          <div class="hero-copy">
            <span class="brand-tag">FELIX · hogar y memoria</span>
            <h1>Guardianes que cuidan tu acceso sin invadir tu privacidad.</h1>
            <p>Este demo abre con tu celular y un codigo simulado. En el segundo paso, los guardianes giran para darte privacidad.</p>
          </div>
          <div class="guardian-stage" aria-hidden="true">
            ${renderGuardian("Nori", "cyan", "cat", stepTwo)}
            ${renderGuardian("Bongo", "mint", "dog", stepTwo)}
            ${renderGuardian("Luma", "violet", "cat", stepTwo)}
            ${renderGuardian("Timo", "amber", "dog", stepTwo)}
          </div>
          <div class="privacy-banner">
            ${
              stepTwo
                ? "<strong>Privacidad activada.</strong> Los guardianes miran hacia otro lado mientras escribes el codigo."
                : "<strong>Gatitos y perritos observan tu acceso.</strong> Estan atentos para acompanar la entrada al hogar."
            }
          </div>
        </div>
        <div class="auth-panel">
          <span class="section-badge">Demo MVP navegable</span>
          ${state.auth.loginStep === 1 ? renderLoginStepOne(currentCountry) : renderLoginStepTwo(currentCountry)}
        </div>
      </section>
    </main>
  `;
}

function renderLoginStepOne(currentCountry) {
  return `
    <h2>Accede a FELIX</h2>
    <p>Solo necesitamos tu celular para simular el acceso. El codigo se emula dentro del demo.</p>
    <form class="auth-form" id="login-form">
      <div class="form-grid">
        <label class="form-row">
          <span class="field-label">Pais</span>
          <select class="panel-select" id="country-select" aria-label="Selecciona un pais">
            ${countries.map((country) => `
              <option value="${country.code}" ${country.code === currentCountry.code ? "selected" : ""}>
                ${country.flag} ${country.label} ${country.dial}
              </option>
            `).join("")}
          </select>
        </label>
        <label class="form-row">
          <span class="field-label">Numero telefonico</span>
          <input
            class="field"
            id="phone-input"
            type="tel"
            value="${escapeHtml(state.auth.phone)}"
            inputmode="tel"
            placeholder="300 000 0000"
            aria-label="Numero telefonico"
            required
          >
        </label>
      </div>
      <button class="button" type="submit">${state.auth.loading ? "Enviando..." : "Enviar codigo"}</button>
      <div class="demo-note">Demo: cualquier codigo de 6 digitos permite entrar.</div>
    </form>
  `;
}

function renderLoginStepTwo(currentCountry) {
  return `
    <h2>Introduce el codigo</h2>
    <p>Enviamos un codigo demo al ${currentCountry.flag} ${currentCountry.dial} ${escapeHtml(state.auth.phone || "300 000 0000")}.</p>
    <form class="auth-form" id="otp-form">
      <div class="form-row">
        <span class="field-label">Codigo de 6 digitos</span>
        <div class="otp-row">
          ${state.auth.otp.map((digit, index) => `
            <input
              class="otp-cell"
              data-otp-index="${index}"
              maxlength="1"
              inputmode="numeric"
              pattern="[0-9]*"
              value="${escapeHtml(digit)}"
              aria-label="Digito ${index + 1}"
            >
          `).join("")}
        </div>
      </div>
      <button class="button" type="submit">Ingresar a FELIX</button>
      <div class="button-row">
        <button type="button" class="ghost-button" data-action="back-to-phone">Volver</button>
        <button type="button" class="secondary-button" data-action="resend-otp">Reenviar codigo demo</button>
      </div>
      <div class="demo-note">Consejo: 123456 funciona, pero cualquier combinacion de 6 digitos tambien.</div>
    </form>
  `;
}

function renderGuardian(name, tone, type, turned) {
  return `
    <div class="guardian ${turned ? "turned" : ""}" data-tone="${tone}">
      <div class="guardian-face">
        <div class="guardian-body">
          <div class="guardian-head">
            <div class="guardian-ears">
              <span class="ear ${type === "dog" ? "round" : ""}"></span>
              <span class="ear ${type === "dog" ? "round" : ""}"></span>
            </div>
            <div class="guardian-eyes">
              <span class="guardian-eye"></span>
              <span class="guardian-eye"></span>
            </div>
            <div class="guardian-snout"></div>
          </div>
          <div class="guardian-torso"></div>
        </div>
        <div class="guardian-label"><strong>${name}</strong><br><span class="caption">mirando al frente</span></div>
      </div>
      <div class="guardian-back">
        <div class="guardian-body">
          <div class="guardian-head">
            <div class="guardian-ears">
              <span class="ear ${type === "dog" ? "round" : ""}"></span>
              <span class="ear ${type === "dog" ? "round" : ""}"></span>
            </div>
            <div class="guardian-eyes">
              <span class="guardian-eye"></span>
              <span class="guardian-eye"></span>
            </div>
          </div>
          <div class="guardian-torso"></div>
        </div>
        <div class="guardian-label"><strong>${name}</strong><br><span class="caption">privacidad activa</span></div>
      </div>
    </div>
  `;
}

function renderShell() {
  const active = sections.find((section) => section.id === state.ui.activeSection) || sections[0];
  const compactHeader = active.id === "dashboard" || active.id === "pets";
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="brand-tag">FELIX</span>
          <h1>FELIX</h1>
          <p>Compa&ntilde;ero cognitivo</p>
        </div>
        <nav class="nav-list" aria-label="Secciones principales">
          ${sections.map((section) => `
            <button
              class="nav-item ${section.id === state.ui.activeSection ? "active" : ""}"
              data-section="${section.id}"
              ${section.id === state.ui.activeSection ? 'aria-current="page"' : ""}
            >
              <span class="nav-meta">
                <span class="nav-icon ${section.id === "settings" ? "is-gear" : ""}">${renderNavIcon(section.id)}</span>
                <span class="nav-copy">
                  <span class="nav-title">${section.label}</span>
                  <span class="nav-hint">${escapeHtml(sectionMenuHint(section.id))}</span>
                </span>
                <span class="nav-badge">${escapeHtml(sectionMenuBadge(section.id))}</span>
              </span>
            </button>
          `).join("")}
        </nav>
        <div class="sidebar-user">
          <div class="sidebar-user-top">
            <div class="avatar-circle">${getInitials(state.user.name)}</div>
            <div class="sidebar-user-copy">
              <strong>${escapeHtml(state.user.name)}</strong>
              <div class="caption">${state.pets.length} mascotas</div>
              <div class="caption">${escapeHtml(state.user.home)}</div>
            </div>
          </div>
          <button class="sidebar-logout-row" data-action="logout">
            <span class="sidebar-logout-copy">
              <span class="sidebar-logout-icon">${renderLogoutIcon()}</span>
              <span>Salida segura</span>
            </span>
            <span class="sidebar-logout-arrow">${renderChevronRightIcon()}</span>
          </button>
        </div>
      </aside>
      <main class="page-wrap">
        ${compactHeader ? "" : `
          <div class="page-topbar">
          <div class="page-header">
            <span class="section-badge">${escapeHtml(active.label)}</span>
            <h2>${sectionHeadline(active.id)}</h2>
            <p class="muted">${sectionDescription(active.id)}</p>
          </div>
          </div>
        `}
        ${renderSection(active.id)}
      </main>
    </div>
    ${renderChat()}
  `;
}

function renderChat() {
  const hasFlow = Boolean(state.ui.pendingFlow);
  const flowLabel = hasFlow ? renderFlowLabel(state.ui.pendingFlow) : "Escribe, dicta o adjunta una imagen. FELIX lo integra al mismo registro, confirma lo que hizo y luego te ayuda con el siguiente paso.";
  return `
    <section class="chat-shell ${state.ui.chatExpanded ? "expanded" : ""}">
      <div class="chat-header">
        <div>
          <h3>FELIX Compa&ntilde;ero cognitivo</h3>
          <p>${escapeHtml(flowLabel)}</p>
        </div>
        <div class="button-row">
          <button class="icon-button" data-action="toggle-chat" aria-label="${state.ui.chatExpanded ? "Contraer chat" : "Expandir chat"}">
            ${renderExpandIcon(state.ui.chatExpanded)}
          </button>
        </div>
      </div>
      <div class="chat-actions">
        <div class="quick-actions">
          ${["Anadir mascota", "Actualizar mascota", "Registrar evento", "Evento de salud", "Registrar comida", "Comparar comida"].map((label) => `<button class="chip-button" data-chat-action="${label}">${label}</button>`).join("")}
        </div>
      </div>
      <div class="chat-messages" id="chat-messages">
        ${state.chatMessages.map(renderMessage).join("")}
      </div>
      <form class="chat-input" id="chat-form">
        <div class="chat-left-tools">
          <button type="button" class="icon-button" title="Sumar imagen al mismo registro" data-action="simulate-attachment">${renderImageIcon()}</button>
          <button type="button" class="icon-button" title="Sumar nota de voz al mismo registro" data-action="simulate-audio">${renderMicIcon()}</button>
        </div>
        <label class="sr-only" for="chat-text">Escribe un mensaje</label>
        <textarea
          class="text-area"
          id="chat-text"
          placeholder="Ejemplo: Pepe se peleo con Ronaldo, registra esto y luego ayudame a entender si ya habia pasado..."
        ></textarea>
        <div class="chat-send-wrap">
          <button type="submit" class="send-button" aria-label="Enviar mensaje">${renderSendIcon()}</button>
        </div>
      </form>
    </section>
  `;
}

function renderSection(sectionId) {
  switch (sectionId) {
    case "dashboard":
      return renderDashboard();
    case "pets":
      return renderPets();
    case "behavior":
      return renderBehavior();
    case "feeding":
      return renderFeeding();
    case "health":
      return renderHealth();
    case "reports":
      return renderReports();
    case "settings":
      return renderSettings();
    default:
      return renderDashboard();
  }
}

function renderDashboard() {
  const stress = calculateHomeStress();
  const status = deriveHomeStatus(stress);
  const conflictMap = buildConflictMap();
  const recentEvents = getRecentBehaviorEvents();
  const intenseEvents = countHighIntensityEvents();
  return `
    <section class="dashboard-grid dashboard-page section-shell" data-view="dashboard">
      <div class="dashboard-intro dashboard-page-heading">
        <h3>FELIX te ayuda a pensar con calma</h3>
        <p>${escapeHtml(state.user.home)} · ${state.pets.length} mascotas</p>
      </div>

      <article class="grid-card dashboard-panel dashboard-guidance-card">
        <div class="section-title dashboard-panel-title">
          <h3>Que puede hacer FELIX ahora</h3>
          <span class="mini-pill">Acompanamiento cognitivo</span>
        </div>
        <div class="dashboard-guidance-copy">
          <p>Primero registro lo importante. Luego, si hace falta, te ayudo a ordenar antecedentes, detectar patrones y decidir el siguiente paso mas util.</p>
        </div>
        <div class="quick-actions">
          ${["Registrar evento", "Evento de salud", "Registrar comida", "Anadir mascota"].map((label) => `<button class="chip-button" data-chat-action="${label}">${label}</button>`).join("")}
        </div>
        <div class="dashboard-guidance-foot">
          <span class="mini-pill">Confirmo siempre lo que hice</span>
          <span class="mini-pill">Trabajo solo con tus mascotas e historial</span>
        </div>
      </article>

      <div class="metrics-grid metrics-grid-dashboard">
        <article class="metric-card dashboard-panel gauge-card">
          <span class="dashboard-label">Lectura general del hogar</span>
          ${renderStressGauge(stress)}
        </article>
        <article class="metric-card dashboard-panel conflict-card">
          <span class="dashboard-label">Eventos que conviene revisar</span>
          <div class="metric-value metric-value-alert">${intenseEvents.count}</div>
          <div class="metric-footer">registros recientes con intensidad igual o mayor a ${intenseEvents.threshold}</div>
        </article>
        <article class="metric-card dashboard-panel status-card">
          <span class="dashboard-label align-center">Como se ve el hogar hoy</span>
          <div class="status-orb ${status.className}">
            <span class="status-orb-core"></span>
          </div>
          <div class="status-title">${status.badge}</div>
        </article>
      </div>

      <div class="content-grid-two">
        <article class="grid-card dashboard-panel">
          <div class="section-title dashboard-panel-title">
            <h3>Relaciones que merecen contexto</h3>
          </div>
          ${renderRelationshipMap(conflictMap, "home-network")}
        </article>
        <article class="grid-card dashboard-panel">
          <div class="section-title dashboard-panel-title">
            <h3>Momentos en que cambia la convivencia</h3>
          </div>
          ${renderBehaviorHeatmap()}
        </article>
      </div>

      <article class="grid-card dashboard-panel">
        <div class="section-title dashboard-panel-title">
          <h3>Ultimos registros con contexto</h3>
        </div>
        <div class="dashboard-events">
          <div class="dashboard-events-list">
            ${recentEvents.map((event) => `
              <article class="dashboard-event-row">
                <div class="dashboard-event-main">
                  <span class="dashboard-event-dot ${event.toneClass}"></span>
                  <span class="dashboard-event-emoji">${getPetEmoji(event.mainPet)}</span>
                  <div class="dashboard-event-copy">
                    <strong><span class="dashboard-event-pet">${escapeHtml(event.mainPet)}</span> ${escapeHtml(event.shortLabel)}</strong>
                    <span class="dashboard-event-intensity">INT:${event.intensityScore}</span>
                  </div>
                </div>
                <span class="dashboard-event-date">${event.date}</span>
              </article>
            `).join("")}
          </div>
        </div>
      </article>

      <div class="content-grid-two dashboard-bottom-grid">
        <article class="grid-card dashboard-panel dashboard-summary-panel">
          <div class="section-title dashboard-panel-title">
          <h3>Seguimientos sugeridos</h3>
          </div>
          <div class="dashboard-big-number">${state.followUps.length}</div>
          <div class="dashboard-summary-list">
            ${state.followUps.map((item) => `
              <div class="dashboard-summary-row">
                <span>${getPetEmojiFromOwner(item.owner)}</span>
                <span>${escapeHtml(item.owner)} · ${escapeHtml(item.title)} · ${normalizeShortDue(item.due)}</span>
              </div>
            `).join("")}
          </div>
        </article>

        <article class="grid-card dashboard-panel dashboard-summary-panel">
          <div class="section-title dashboard-panel-title">
            <h3>Recordatorios de salud cercanos</h3>
          </div>
          <div class="dashboard-big-number dashboard-big-number-accent">${state.reminders.slice(0, 2).length}</div>
          <div class="dashboard-summary-list">
            ${state.reminders.slice(0, 2).map((reminder) => `
              <div class="dashboard-summary-row">
                <span>${getPetEmojiFromReminder(reminder.label)}</span>
                <span>${escapeHtml(reminder.label)} · ${reminder.date}</span>
              </div>
            `).join("")}
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderPets() {
  return `
    <section class="dashboard-grid pets-page section-shell" data-view="pets">
      <div class="section-title section-title-pets">
        <div class="page-title-block">
          <h3>Mascotas</h3>
          <p class="section-meta-line">${state.pets.length} registradas</p>
        </div>
        <div class="button-row">
          <button class="ghost-button pets-add-button" data-action="open-pet-modal">+ Anadir mascota</button>
        </div>
      </div>
      <div class="pet-grid">
        ${state.pets.map((pet) => `
          <article class="grid-card pet-card pet-card-refined">
            <div class="pet-card-top">
              <div class="pet-header pet-header-refined">
                <div class="pet-avatar pet-avatar-emoji">${getPetEmoji(pet.name)}</div>
                <div class="pet-header-copy">
                  <strong>${escapeHtml(pet.name)}</strong>
                  <div class="pet-meta-line">${formatPetMeta(pet)}</div>
                </div>
              </div>
              <span class="pet-status-badge ${petStatusToneClass(pet.status, pet.anxiety)}">${petStatusBadgeLabel(pet.status, pet.anxiety)}</span>
            </div>
            <div class="pet-stats pet-stats-refined">
              <div class="pet-stat pet-stat-plain">
                <strong>Especie</strong>
                <span>${escapeHtml(pet.species)}</span>
              </div>
              <div class="pet-stat pet-stat-plain">
                <strong>Ansiedad base</strong>
                <span class="${petStatusToneClass(pet.status, pet.anxiety)}">${petAnxietyDisplay(pet.anxiety)}</span>
              </div>
              <div class="pet-stat pet-stat-plain">
                <strong>Edad</strong>
                <span>${escapeHtml(pet.age)}</span>
              </div>
            </div>
            <div class="pet-sensitivities-block">
              <strong class="pet-inline-label">Sensibilidades</strong>
              <div class="pet-sensitivities-list">
                ${pet.sensitivities.map((item) => `<span class="pet-sensitivity-chip">${escapeHtml(item)}</span>`).join("")}
              </div>
            </div>
            <p class="pet-note">${escapeHtml(pet.lastUpdateNote || "Sin actualizacion reciente.")}</p>
            <div class="pet-actions-inline">
              <button class="pet-inline-action is-secondary" data-action="view-pet-health" data-pet-id="${pet.id}">Ver detalle</button>
              <button class="pet-inline-action" data-action="start-update-pet" data-pet-id="${pet.id}">Actualizar →</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderBehavior() {
  const conflictMap = buildConflictMap();
  return `
    <section class="dashboard-grid section-shell" data-view="behavior">
      <div class="content-grid-two">
        <article class="grid-card">
          <div class="section-title">
            <h3>Relaciones entre mascotas</h3>
            <span class="mini-pill">Colores por intensidad</span>
          </div>
          ${renderRelationshipMap(conflictMap, "behavior-network")}
        </article>
        <article class="grid-card">
          <div class="section-title">
            <h3>Frecuencia y contexto</h3>
            <span class="mini-pill">Serie reciente</span>
          </div>
          ${renderFrequencyBars()}
        </article>
      </div>
      <div class="content-grid-two">
        <article class="grid-card">
          <div class="section-title">
            <h3>Registros de convivencia</h3>
            <button class="ghost-button" data-chat-action="Registrar evento">Registrar evento</button>
          </div>
          <div class="timeline">
            ${state.behaviorEvents.map((event) => `
              <div class="timeline-item">
                <strong>${escapeHtml(event.mainPet)} con ${escapeHtml(event.relatedPets.join(" y "))}</strong>
                <div class="caption">${formatDate(event.date)} · Intensidad ${escapeHtml(event.intensity)}</div>
                <p>${escapeHtml(event.note)}</p>
                <div class="inline-meta">
                  <span class="mini-pill">${event.followUpInDays > 0 ? `Seguimiento ${event.followUpInDays} dias` : "Sin seguimiento activo"}</span>
                  <span class="mini-pill">${escapeHtml(event.recommendation)}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </article>
        <article class="grid-card">
          <div class="section-title">
            <h3>Lectura con memoria</h3>
            <span class="mini-pill">FELIX</span>
          </div>
          <div class="stack-list">
            ${conflictMap.map((row) => `
              <div class="stack-item">
                <strong>${escapeHtml(row.pair)}</strong>
                <p>${row.count} eventos en los ultimos 30 dias. ${escapeHtml(row.reading)}</p>
              </div>
            `).join("")}
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderFeeding() {
  const selectedFood = state.feedingEntries.find((entry) => entry.id === state.ui.selectedFoodId) || state.feedingEntries[0];
  const comparison = compareFoods(selectedFood, state.feedingEntries.find((entry) => entry.id !== selectedFood.id));
  return `
    <section class="dashboard-grid section-shell" data-view="feeding">
      <div class="section-title">
        <h3>Comida y cambios observables</h3>
        <div class="button-row">
          <button class="ghost-button" data-action="start-food-flow">Anadir comida nueva</button>
          <button class="secondary-button" data-action="list-foods">Listar comidas registradas</button>
          <button class="secondary-button" data-action="start-compare-food">Comparar comida</button>
        </div>
      </div>

      <div class="content-grid-two">
        <article class="grid-card">
          <div class="section-title">
            <h3>Comidas registradas</h3>
            <span class="mini-pill">${state.feedingEntries.length} items</span>
          </div>
          <div class="timeline">
            ${state.feedingEntries.map((entry) => `
              <button class="food-row ${entry.id === state.ui.selectedFoodId ? "active" : ""}" data-food-id="${entry.id}">
                <strong>${escapeHtml(entry.brand)}</strong>
                <span>${escapeHtml(entry.pet)} · ${entry.quantityKg} kg · ${escapeHtml(entry.acceptance)}</span>
              </button>
            `).join("")}
          </div>
        </article>
        <article class="grid-card">
          <div class="section-title">
            <h3>Detalle de comida</h3>
            <span class="mini-pill">${escapeHtml(selectedFood.pet)}</span>
          </div>
          <div class="summary-card">
            <strong>${escapeHtml(selectedFood.brand)}</strong>
            <p>${selectedFood.quantityKg} kg · Compra ${formatDate(selectedFood.purchaseDate)} · Apertura ${formatDate(selectedFood.openDate)}</p>
          </div>
          <div class="content-grid-three food-detail-grid">
            <div class="summary-card"><strong>Duracion</strong><p>${selectedFood.durationDays} dias</p></div>
            <div class="summary-card"><strong>Aceptacion</strong><p>${escapeHtml(selectedFood.acceptance)}</p></div>
            <div class="summary-card"><strong>Precio</strong><p>${formatCurrency(selectedFood.price)}</p></div>
          </div>
          <div class="summary-card">
            <strong>Efecto visible</strong>
            <p>${escapeHtml(selectedFood.effect)}</p>
          </div>
          <div class="content-grid-three food-doc-grid">
            <div class="summary-card"><strong>Imagen del producto</strong><p>${escapeHtml(selectedFood.productImage || "Pendiente")}</p></div>
            <div class="summary-card"><strong>Tabla nutricional</strong><p>${escapeHtml(selectedFood.nutritionImage || "Pendiente")}</p></div>
            <div class="summary-card"><strong>Mascota</strong><p>${escapeHtml(selectedFood.pet)}</p></div>
          </div>
        </article>
      </div>

      <article class="grid-card">
        <div class="section-title">
          <h3>Lectura comparativa</h3>
          <span class="mini-pill">FELIX</span>
        </div>
        <div class="summary-card comparison-card">
          <strong>${escapeHtml(comparison.title)}</strong>
          <p>${escapeHtml(comparison.message)}</p>
        </div>
      </article>
    </section>
  `;
}

function renderHealth() {
  const selectedPet = state.pets.find((pet) => pet.id === state.ui.selectedHealthPetId) || state.pets[0];
  const petEvents = state.healthEvents.filter((event) => event.pet === selectedPet.name);
  return `
    <section class="dashboard-grid section-shell" data-view="health">
      <div class="section-title">
        <h3>Salud organizada por mascota</h3>
        <div class="button-row">
          <button class="ghost-button" data-chat-action="Evento de salud">Registrar observacion</button>
          <button class="secondary-button" data-action="upload-prescription" data-pet-id="${selectedPet.id}">Cargar formula</button>
          <button class="secondary-button" data-action="upload-vaccine" data-pet-id="${selectedPet.id}">Cargar carnet</button>
        </div>
      </div>
      <article class="grid-card trust-note-card">
        <div class="section-title">
          <h3>Como te acompano aqui</h3>
          <span class="mini-pill">Sin alarmas innecesarias</span>
        </div>
        <div class="stack-list">
          <div class="stack-item">
            <strong>Organizo y recuerdo</strong>
            <p>Registro sintomas, documentos y antecedentes para que no tengas que sostener todo en la cabeza.</p>
          </div>
          <div class="stack-item">
            <strong>No sustituyo criterio veterinario</strong>
            <p>Te ayudo a observar mejor y a decidir el siguiente paso, sin dar diagnosticos ni imponer conclusiones.</p>
          </div>
        </div>
      </article>
      <div class="pet-selector-row">
        ${state.pets.map((pet) => `
          <button class="health-pet-chip ${pet.id === selectedPet.id ? "active" : ""}" data-health-pet="${pet.id}">
            <span class="chip-dot" style="background:${escapeHtml(pet.color)};"></span>
            ${escapeHtml(pet.name)}
          </button>
        `).join("")}
      </div>
      <div class="content-grid-two">
        <article class="grid-card">
          <div class="section-title">
            <h3>Detalle clinico de ${escapeHtml(selectedPet.name)}</h3>
            <span class="mini-pill">${escapeHtml(selectedPet.status)}</span>
          </div>
          <div class="stack-list">
            <div class="stack-item">
              <strong>Doctor tratante</strong>
              <p>${escapeHtml(selectedPet.doctor)}</p>
            </div>
            <div class="stack-item">
              <strong>Clinica</strong>
              <p>${escapeHtml(selectedPet.clinic)}</p>
            </div>
            <div class="stack-item">
              <strong>Medicinas</strong>
              <p>${escapeHtml(selectedPet.medicines.join(", "))}</p>
            </div>
            <div class="stack-item">
              <strong>Formula medica</strong>
              <p>${escapeHtml(selectedPet.documents.prescription || "No cargada aun")}</p>
            </div>
            <div class="stack-item">
              <strong>Carnet de vacunas</strong>
              <p>${escapeHtml(selectedPet.documents.vaccineCard || "No cargado aun")}</p>
            </div>
          </div>
        </article>
        <article class="grid-card">
          <div class="section-title">
            <h3>Antecedentes por mascota</h3>
            <span class="mini-pill">${petEvents.length} registros</span>
          </div>
          <div class="timeline">
            ${petEvents.map((entry) => `
              <div class="timeline-item">
                <strong>${escapeHtml(entry.type)}</strong>
                <div class="caption">${formatDate(entry.date)} · ${escapeHtml(entry.status)}</div>
                <p>${escapeHtml(entry.symptom)}</p>
                <span class="mini-pill">${entry.nextDate ? `Proxima fecha ${formatDate(entry.nextDate)}` : "Sin proxima fecha definida"}</span>
              </div>
            `).join("")}
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderReports() {
  const reports = state.ui.reportFilter === "Todos"
    ? reportOptions
    : reportOptions.filter((report) => report.category === state.ui.reportFilter);
  return `
    <section class="dashboard-grid section-shell" data-view="reports">
      <article class="grid-card report-hero">
        <span class="section-badge">Analisis solo cuando lo necesites</span>
        <h3>FELIX analiza despues de registrar, no antes.</h3>
        <p>Usa esta vista cuando quieras profundizar un caso con contexto, historial y una pregunta clara. Por ejemplo: "FELIX, analiza las interacciones entre Pepe y Ronaldo este mes".</p>
      </article>
      <div class="filter-row">
        ${["Todos", "Conducta", "Salud", "Peso"].map((filter) => `
          <button class="chip-button ${filter === state.ui.reportFilter ? "active" : ""}" data-report-filter="${filter}">${filter}</button>
        `).join("")}
      </div>
      <div class="report-grid">
        ${reports.map((report) => `
          <article class="grid-card report-option-card">
            <div class="section-title">
              <h3>${escapeHtml(report.title)}</h3>
              <span class="mini-pill">${escapeHtml(report.category)}</span>
            </div>
            <p>Selecciona esta opcion y el chat te pedira solo el contexto necesario para construir un analisis util y acotado.</p>
            <button class="button" data-start-report="${escapeHtml(report.title)}">Pedir analisis</button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderSettings() {
  const isLight = state.theme === "light";
  return `
    <section class="dashboard-grid section-shell" data-view="settings">
      <div class="settings-grid">
        <article class="grid-card">
          <div class="section-title">
            <h3>Perfil y hogar</h3>
            <span class="mini-pill">Edicion directa</span>
          </div>
          <form class="settings-editor" id="settings-user-form">
            <div class="modal-grid">
              <label class="form-row">
                <span class="field-label">Nombre</span>
                <input class="field" name="name" value="${escapeHtml(state.user.name)}" required>
              </label>
              <label class="form-row">
                <span class="field-label">Email</span>
                <input class="field" name="email" type="email" value="${escapeHtml(state.user.email)}" required>
              </label>
            </div>
            <div class="modal-grid">
              <label class="form-row">
                <span class="field-label">Telefono</span>
                <input class="field" name="phone" value="${escapeHtml(state.user.phone)}">
              </label>
              <label class="form-row">
                <span class="field-label">Hogar</span>
                <input class="field" name="home" value="${escapeHtml(state.user.home)}">
              </label>
            </div>
            <div class="modal-grid">
              <label class="form-row">
                <span class="field-label">Plan</span>
                <input class="field" name="plan" value="${escapeHtml(state.user.plan)}">
              </label>
              <label class="form-row">
                <span class="field-label">Foto</span>
                <input class="field" name="photo" value="${escapeHtml(state.user.photo)}" placeholder="avatar-lina.png">
              </label>
            </div>
            <div class="button-row settings-actions">
              <button class="button" type="submit">Guardar cambios</button>
              <span class="caption">Los cambios quedan disponibles al instante en todo FELIX.</span>
            </div>
          </form>
          <div class="stack-list">
            <div class="stack-item">
              <strong>${escapeHtml(state.user.name)}</strong>
              <p>${escapeHtml(state.user.role)} · ${escapeHtml(state.user.plan)}</p>
            </div>
            <div class="stack-item">
              <strong>Contacto</strong>
              <p>${escapeHtml(state.user.email)} · ${escapeHtml(state.user.phone)}</p>
            </div>
            <div class="stack-item">
              <strong>Hogar</strong>
              <p>${escapeHtml(state.user.home)}</p>
            </div>
          </div>
        </article>
        <article class="grid-card">
          <div class="section-title">
            <h3>Preferencias</h3>
            <span class="mini-pill">Personaliza FELIX</span>
          </div>
          <div class="stack-list">
            <div class="stack-item">
              <strong>Tema</strong>
              <div class="button-row">
                <button class="ghost-button ${!isLight ? "is-selected" : ""}" type="button" data-action="set-theme" data-theme="dark">Oscuro editorial</button>
                <button class="ghost-button ${isLight ? "is-selected" : ""}" type="button" data-action="set-theme" data-theme="light">Claro calido</button>
              </div>
              <p>${isLight ? "Claro" : "Oscuro"} &middot; Cambialo desde aqui, sin iconos flotantes.</p>
            </div>
            <div class="stack-item">
              <strong>Notificaciones</strong>
              <p>${state.user.notifications ? "Activadas" : "Pausadas"}</p>
            </div>
            <div class="stack-item">
              <strong>Foto de perfil</strong>
              <p>${escapeHtml(state.user.photo || "Aun no cargada")}</p>
            </div>
          </div>
        </article>
      </div>
      <article class="grid-card">
        <div class="section-title">
          <h3>Control del hogar</h3>
          <span class="mini-pill">Configuracion</span>
        </div>
        <div class="content-grid-three">
          <div class="summary-card">
            <strong>Mascotas activas</strong>
            <p>${state.pets.length}</p>
          </div>
          <div class="summary-card">
            <strong>Seguimientos</strong>
            <p>${state.followUps.length}</p>
          </div>
          <div class="summary-card">
            <strong>Recordatorios de salud</strong>
            <p>${state.reminders.length}</p>
          </div>
        </div>
      </article>
    </section>
  `;
}

function renderMessage(message) {
  return `
    <article class="message ${message.role}">
      <div class="message-meta">
        <span>${escapeHtml(message.author)}</span>
        <span>${escapeHtml(message.time)}</span>
      </div>
      <div>${escapeHtml(message.text)}</div>
    </article>
  `;
}

function renderModal() {
  if (!state.ui.modal) {
    modalRoot.innerHTML = "";
    return;
  }

  if (state.ui.modal.type === "pet-form") {
    modalRoot.innerHTML = `
      <div class="modal-layer" data-action="close-modal">
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="pet-modal-title" data-stop-close="true">
          <div class="modal-header">
            <div>
              <h3 id="pet-modal-title">Anadir mascota</h3>
              <p class="muted">Crea una ficha nueva con los datos principales.</p>
            </div>
            <button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button>
          </div>
          <form class="modal-form" id="pet-modal-form">
            <div class="modal-grid">
              <label class="form-row">
                <span class="field-label">Nombre</span>
                <input class="field" name="name" required>
              </label>
              <label class="form-row">
                <span class="field-label">Especie</span>
                <input class="field" name="species" required>
              </label>
            </div>
            <div class="modal-grid">
              <label class="form-row">
                <span class="field-label">Edad</span>
                <input class="field" name="age" placeholder="4 anos">
              </label>
              <label class="form-row">
                <span class="field-label">Sexo</span>
                <input class="field" name="sex" placeholder="Hembra">
              </label>
            </div>
            <div class="modal-grid">
              <label class="form-row">
                <span class="field-label">Ansiedad base</span>
                <input class="field" name="anxiety" value="Media">
              </label>
              <label class="form-row">
                <span class="field-label">Estado actual</span>
                <input class="field" name="status" value="Nuevo registro">
              </label>
            </div>
            <label class="form-row">
              <span class="field-label">Rasgos</span>
              <input class="field" name="traits" placeholder="curiosa, observadora">
            </label>
            <label class="form-row">
              <span class="field-label">Sensibilidades</span>
              <input class="field" name="sensitivities" placeholder="ruidos, visitas">
            </label>
            <div class="button-row">
              <button class="button" type="submit">Crear mascota</button>
              <button class="ghost-button" type="button" data-action="close-modal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  if (state.ui.modal.type === "user-form") {
    modalRoot.innerHTML = `
      <div class="modal-layer" data-action="close-modal">
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="user-modal-title" data-stop-close="true">
          <div class="modal-header">
            <div>
              <h3 id="user-modal-title">Editar usuario y hogar</h3>
              <p class="muted">Ajusta la informacion principal de la cuenta demo.</p>
            </div>
            <button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button>
          </div>
          <form class="modal-form" id="user-modal-form">
            <div class="modal-grid">
              <label class="form-row">
                <span class="field-label">Nombre</span>
                <input class="field" name="name" value="${escapeHtml(state.user.name)}" required>
              </label>
              <label class="form-row">
                <span class="field-label">Email</span>
                <input class="field" name="email" type="email" value="${escapeHtml(state.user.email)}" required>
              </label>
            </div>
            <div class="modal-grid">
              <label class="form-row">
                <span class="field-label">Telefono</span>
                <input class="field" name="phone" value="${escapeHtml(state.user.phone)}">
              </label>
              <label class="form-row">
                <span class="field-label">Hogar</span>
                <input class="field" name="home" value="${escapeHtml(state.user.home)}">
              </label>
            </div>
            <div class="modal-grid">
              <label class="form-row">
                <span class="field-label">Plan</span>
                <input class="field" name="plan" value="${escapeHtml(state.user.plan)}">
              </label>
              <label class="form-row">
                <span class="field-label">Foto</span>
                <input class="field" name="photo" value="${escapeHtml(state.user.photo)}" placeholder="avatar-lina.png">
              </label>
            </div>
            <div class="button-row">
              <button class="button" type="submit">Guardar cambios</button>
              <button class="ghost-button" type="button" data-action="close-modal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }
}

function renderToasts() {
  if (!toastQueue.length) {
    toastRoot.innerHTML = "";
    return;
  }
  toastRoot.innerHTML = `
    <div class="toast-stack">
      ${toastQueue.map((toast) => `
        <div class="toast">
          <strong>${escapeHtml(toast.title)}</strong>
          <div class="caption">${escapeHtml(toast.body)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function pushToast(title, body) {
  const id = uid();
  toastQueue = [...toastQueue, { id, title, body }];
  renderToasts();
  window.setTimeout(() => {
    toastQueue = toastQueue.filter((toast) => toast.id !== id);
    renderToasts();
  }, 2800);
}

function bindBaseEvents() {
  document.querySelectorAll("[data-action='toggle-theme']").forEach((button) => {
    button.addEventListener("click", () => {
      setState((current) => ({ ...current, theme: current.theme === "dark" ? "light" : "dark" }));
    });
  });

  modalRoot.querySelectorAll("[data-action='close-modal']").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (event.target.closest("[data-stop-close='true']") && !event.target.dataset.action) return;
      closeModal();
    });
  });

  const petForm = document.getElementById("pet-modal-form");
  if (petForm) petForm.addEventListener("submit", handlePetFormSubmit);

  const userForm = document.getElementById("user-modal-form");
  if (userForm) userForm.addEventListener("submit", handleUserFormSubmit);

  const settingsUserForm = document.getElementById("settings-user-form");
  if (settingsUserForm) settingsUserForm.addEventListener("submit", handleUserFormSubmit);
}

function bindAuthEvents() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.addEventListener("submit", handlePhoneSubmit);

  const countrySelect = document.getElementById("country-select");
  if (countrySelect) {
    countrySelect.addEventListener("change", (event) => {
      state.auth.country = event.target.value;
      saveState();
    });
  }

  const phoneInput = document.getElementById("phone-input");
  if (phoneInput) {
    phoneInput.addEventListener("input", (event) => {
      state.auth.phone = event.target.value;
      saveState();
    });
  }

  const otpForm = document.getElementById("otp-form");
  if (otpForm) otpForm.addEventListener("submit", handleOtpSubmit);

  document.querySelectorAll("[data-otp-index]").forEach((input) => {
    input.addEventListener("input", handleOtpInput);
    input.addEventListener("keydown", handleOtpKeyDown);
  });

  document.querySelectorAll("[data-action='back-to-phone']").forEach((button) => {
    button.addEventListener("click", () => {
      setState((current) => ({
        ...current,
        auth: { ...current.auth, loginStep: 1, otp: ["", "", "", "", "", ""] }
      }));
    });
  });

  document.querySelectorAll("[data-action='resend-otp']").forEach((button) => {
    button.addEventListener("click", () => {
      pushToast("Codigo reenviado", "Simulamos un nuevo codigo para continuar.");
    });
  });
}

function bindShellEvents() {
  document.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", () => {
      setState((current) => ({
        ...current,
        ui: { ...current.ui, activeSection: button.dataset.section }
      }));
    });
  });

  document.querySelectorAll("[data-action='toggle-chat']").forEach((button) => {
    button.addEventListener("click", () => {
      setState((current) => ({
        ...current,
        ui: { ...current.ui, chatExpanded: !current.ui.chatExpanded }
      }), { forceScroll: true });
    });
  });

  document.querySelectorAll("[data-chat-action]").forEach((button) => {
    button.addEventListener("click", () => runConceptAction(button.dataset.chatAction));
  });

  document.querySelectorAll("[data-action='open-pet-modal']").forEach((button) => {
    button.addEventListener("click", openPetModal);
  });

  document.querySelectorAll("[data-action='start-update-pet']").forEach((button) => {
    button.addEventListener("click", () => startUpdatePetFlow(button.dataset.petId));
  });

  document.querySelectorAll("[data-action='view-pet-health']").forEach((button) => {
    button.addEventListener("click", () => {
      setState((current) => ({
        ...current,
        ui: { ...current.ui, selectedHealthPetId: button.dataset.petId, activeSection: "health" }
      }));
    });
  });

  document.querySelectorAll("[data-chat-say]").forEach((button) => {
    button.addEventListener("click", () => handleChatInput(button.dataset.chatSay));
  });

  document.querySelectorAll("[data-health-pet]").forEach((button) => {
    button.addEventListener("click", () => {
      setState((current) => ({
        ...current,
        ui: { ...current.ui, selectedHealthPetId: button.dataset.healthPet, activeSection: "health" }
      }));
    });
  });

  document.querySelectorAll("[data-food-id]").forEach((button) => {
    button.addEventListener("click", () => {
      setState((current) => ({
        ...current,
        ui: { ...current.ui, selectedFoodId: button.dataset.foodId, activeSection: "feeding" }
      }));
    });
  });

  document.querySelectorAll("[data-start-report]").forEach((button) => {
    button.addEventListener("click", () => startReportFlow(button.dataset.startReport));
  });

  document.querySelectorAll("[data-report-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      setState((current) => ({
        ...current,
        ui: { ...current.ui, reportFilter: button.dataset.reportFilter, activeSection: "reports" }
      }));
    });
  });

  document.querySelectorAll("[data-action='set-theme']").forEach((button) => {
    button.addEventListener("click", () => {
      setState((current) => ({
        ...current,
        theme: button.dataset.theme === "light" ? "light" : "dark"
      }));
    });
  });

  document.querySelectorAll("[data-action='logout']").forEach((button) => {
    button.addEventListener("click", () => {
      setState((current) => ({
        ...current,
        auth: { ...current.auth, loggedIn: false, loginStep: 1, otp: ["", "", "", "", "", ""] }
      }));
      pushToast("Sesion cerrada", "Volviste a la entrada segura de FELIX.");
    });
  });

  document.querySelectorAll("[data-action='simulate-attachment']").forEach((button) => {
    button.addEventListener("click", () => {
      const pending = state.ui.pendingFlow;
      if (pending && (pending.type === "food-add-product-image" || pending.type === "food-add-nutrition-image" || pending.type === "upload-document")) {
      pushAssistantMessage("Puedes escribir el nombre del archivo o una breve descripcion de la imagen y yo la sumare al mismo registro.");
      } else {
        pushAssistantMessage("Puedo tomar la imagen como parte del mismo registro y asociarla a comida, salud o convivencia.");
      }
    });
  });

  document.querySelectorAll("[data-action='simulate-audio']").forEach((button) => {
    button.addEventListener("click", () => {
      pushAssistantMessage("Si prefieres dictarlo, lo convierto en el mismo registro y despues te confirmo el siguiente paso.");
    });
  });

  document.querySelectorAll("[data-action='start-food-flow']").forEach((button) => {
    button.addEventListener("click", startFoodFlow);
  });

  document.querySelectorAll("[data-action='list-foods']").forEach((button) => {
    button.addEventListener("click", listFoodsInChat);
  });

  document.querySelectorAll("[data-action='start-compare-food']").forEach((button) => {
    button.addEventListener("click", startCompareFoodFlow);
  });

  document.querySelectorAll("[data-action='upload-prescription']").forEach((button) => {
    button.addEventListener("click", () => startDocumentFlow(button.dataset.petId, "prescription"));
  });

  document.querySelectorAll("[data-action='upload-vaccine']").forEach((button) => {
    button.addEventListener("click", () => startDocumentFlow(button.dataset.petId, "vaccineCard"));
  });

  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-text");
  const submitChat = () => {
    if (!chatInput) return;
    const value = chatInput.value.trim();
    if (!value) return;
    chatInput.value = "";
    handleChatInput(value);
  };

  if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      submitChat();
    });
  }

  if (chatInput) {
    chatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitChat();
      }
    });
  }
}

function handlePhoneSubmit(event) {
  event.preventDefault();
  const phone = state.auth.phone.trim();
  if (phone.replace(/\D/g, "").length < 7) {
    pushToast("Numero incompleto", "Usa un telefono demo un poco mas largo para continuar.");
    return;
  }
  setState((current) => ({ ...current, auth: { ...current.auth, loading: true } }));
  window.setTimeout(() => {
    setState((current) => ({ ...current, auth: { ...current.auth, loading: false, loginStep: 2 } }));
    pushToast("Codigo enviado", "La entrada demo quedo lista para el paso OTP.");
  }, 700);
}

function handleOtpInput(event) {
  const index = Number(event.target.dataset.otpIndex);
  const clean = event.target.value.replace(/\D/g, "").slice(0, 1);
  event.target.value = clean;
  state.auth.otp[index] = clean;
  saveState();
  if (clean && index < 5) {
    const next = document.querySelector(`[data-otp-index="${index + 1}"]`);
    if (next) next.focus();
  }
}

function handleOtpKeyDown(event) {
  const index = Number(event.target.dataset.otpIndex);
  if (event.key === "Backspace" && !event.target.value && index > 0) {
    const previous = document.querySelector(`[data-otp-index="${index - 1}"]`);
    if (previous) previous.focus();
  }
}

function handleOtpSubmit(event) {
  event.preventDefault();
  const code = state.auth.otp.join("");
  if (!/^\d{6}$/.test(code)) {
    pushToast("Codigo incompleto", "Escribe los 6 digitos para ingresar al demo.");
    return;
  }
  setState((current) => ({
    ...current,
    auth: { ...current.auth, loggedIn: true, loginStep: 1, otp: ["", "", "", "", "", ""] }
  }), { forceScroll: true });
  pushToast("Bienvenida, Lina", "Entraste al hogar demo de FELIX.");
}

function openPetModal() {
  setState((current) => ({ ...current, ui: { ...current.ui, modal: { type: "pet-form" } } }));
}

function openUserModal() {
  setState((current) => ({ ...current, ui: { ...current.ui, modal: { type: "user-form" } } }));
}

function closeModal() {
  setState((current) => ({ ...current, ui: { ...current.ui, modal: null } }));
}

function handlePetFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const name = String(formData.get("name") || "").trim();
  const species = String(formData.get("species") || "").trim();
  const pet = {
    id: uid(),
    name,
    species,
    age: String(formData.get("age") || "Sin definir").trim(),
    sex: String(formData.get("sex") || "Sin definir").trim(),
    anxiety: String(formData.get("anxiety") || "Media").trim(),
    status: String(formData.get("status") || "Nuevo registro").trim(),
    traits: splitCSV(String(formData.get("traits") || "nuevo registro")),
    sensitivities: splitCSV(String(formData.get("sensitivities") || "sin datos")),
    avatar: name.slice(0, 1).toUpperCase(),
    color: randomPetColor(),
    lastUpdateNote: "Ficha creada desde el demo.",
    doctor: "Pendiente",
    clinic: "Pendiente",
    medicines: ["Sin informacion aun"],
    documents: { prescription: "", vaccineCard: "" }
  };
  setState((current) => ({
    ...current,
    pets: [...current.pets, pet],
    ui: { ...current.ui, modal: null, activeSection: "pets" }
  }));
  pushToast("Mascota anadida", `${name} ya forma parte del hogar demo.`);
  pushAssistantMessage(`Listo. Ya registre a ${name}. Si quieres, ahora puedo completar salud, comida o contexto de convivencia.`);
}

function handleUserFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const keepSectionOpen = event.currentTarget.id === "settings-user-form";
  setState((current) => ({
    ...current,
    user: {
      ...current.user,
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      home: String(formData.get("home") || "").trim(),
      plan: String(formData.get("plan") || "").trim(),
      photo: String(formData.get("photo") || "").trim()
    },
    ui: { ...current.ui, modal: keepSectionOpen ? current.ui.modal : null, activeSection: "settings" }
  }));
  pushToast("Perfil guardado", "La configuracion del hogar quedo actualizada.");
}

function runConceptAction(action) {
  switch (action) {
    case "Anadir mascota":
      openPetModal();
      pushAssistantMessage("Abri el alta de mascota. Si prefieres, tambien puedo guiar el registro desde el chat.");
      break;
    case "Actualizar mascota":
      startUpdatePetFlow(state.pets[0] && state.pets[0].id);
      break;
    case "Registrar evento":
      pushUserMessage("Quiero registrar un evento de conducta");
      setState((current) => ({ ...current, ui: { ...current.ui, activeSection: "behavior" } }), { forceScroll: true });
      pushAssistantMessage("Claro. Cuentame que paso, cual fue la mascota principal, que otras mascotas estuvieron involucradas, que intensidad viste y en que contexto ocurrio. Primero lo registro y luego, si quieres, lo analizamos o creamos seguimiento.");
      break;
    case "Evento de salud":
      pushUserMessage("Quiero registrar un evento de salud");
      setState((current) => ({ ...current, ui: { ...current.ui, activeSection: "health" } }), { forceScroll: true });
      pushAssistantMessage("Perfecto. Dime que mascota fue, que ocurrio, desde cuando, que intensidad tuvo y si quieres solo dejarlo registrado o tambien pedir recomendaciones o seguimiento.");
      break;
    case "Registrar comida":
      startFoodFlow();
      break;
    case "Comparar comida":
      startCompareFoodFlow();
      break;
    default:
      break;
  }
}

function startUpdatePetFlow(petId) {
  const pet = state.pets.find((item) => item.id === petId) || state.pets[0];
  if (!pet) return;
  pushUserMessage(`Actualizar ${pet.name}`);
  setState((current) => ({
    ...current,
    ui: { ...current.ui, activeSection: "pets", pendingFlow: { type: "update-pet", petId: pet.id } }
  }), { forceScroll: true });
  pushAssistantMessage(`Hola! que informacion deseas actualizar de ${pet.name}? Puedes escribir cambios de estado, rasgos, sensibilidades o cualquier detalle nuevo.`);
}

function startFoodFlow() {
  pushUserMessage("Quiero anadir una comida nueva");
  setState((current) => ({
    ...current,
    ui: { ...current.ui, activeSection: "feeding", pendingFlow: { type: "food-add-basic", data: {} } }
  }), { forceScroll: true });
  pushAssistantMessage("Perfecto. Dime la informacion basica en una sola frase o separada por comas: marca, mascota, cantidad en kilos, fecha de compra, fecha de apertura, duracion, nivel de aceptacion, precio y efecto visible.");
}

function listFoodsInChat() {
  const summary = state.feedingEntries.map((entry) => `${entry.brand} para ${entry.pet}`).join(", ");
  pushUserMessage("Quiero ver todas las comidas registradas");
  setState((current) => ({ ...current, ui: { ...current.ui, activeSection: "feeding" } }), { forceScroll: true });
  pushAssistantMessage(`Ya deje abierta la seccion de alimentacion. Hoy tienes registradas: ${summary}.`);
}

function startCompareFoodFlow() {
  pushUserMessage("Quiero comparar una comida");
  setState((current) => ({
    ...current,
    ui: { ...current.ui, activeSection: "feeding", pendingFlow: { type: "compare-food" } }
  }), { forceScroll: true });
  pushAssistantMessage("Dime que comida registrada quieres comparar y contra cual otra comida o producto nuevo quieres enfrentarla.");
}

function startReportFlow(title) {
  const report = reportOptions.find((item) => item.title === title);
  if (!report) return;
  pushUserMessage(`Quiero el reporte: ${title}`);
  setState((current) => ({
    ...current,
    ui: { ...current.ui, activeSection: "reports", selectedReport: title, pendingFlow: { type: "report", reportTitle: title } }
  }), { forceScroll: true });
  pushAssistantMessage(report.prompt);
}

function startDocumentFlow(petId, kind) {
  const pet = state.pets.find((item) => item.id === petId);
  if (!pet) return;
  const label = kind === "prescription" ? "formula medica" : "carnet de vacunas";
  pushUserMessage(`Quiero cargar ${label} de ${pet.name}`);
  setState((current) => ({
    ...current,
    ui: { ...current.ui, activeSection: "health", selectedHealthPetId: pet.id, pendingFlow: { type: "upload-document", petId: pet.id, kind } }
  }), { forceScroll: true });
  pushAssistantMessage(`Perfecto. Escribe el nombre del archivo o una breve descripcion de la imagen para dejar registrado el ${label} de ${pet.name}.`);
}

function handleChatInput(text) {
  pushUserMessage(text);
  const pendingFlow = state.ui.pendingFlow;
  if (pendingFlow) {
    resolvePendingFlow(text, pendingFlow);
    return;
  }

  const lower = text.toLowerCase();
  const result = interpretMessage(text, lower);
  applyDemoUpdates(result);
  setState((current) => ({
    ...current,
    ui: { ...current.ui, activeSection: result.section || current.ui.activeSection }
  }), { forceScroll: true });
  pushAssistantMessage(result.reply);
}

function resolvePendingFlow(text, pendingFlow) {
  if (pendingFlow.type === "update-pet") {
    const pet = state.pets.find((item) => item.id === pendingFlow.petId);
    if (!pet) return;
    pet.lastUpdateNote = text;
    pet.status = inferStatusFromText(text, pet.status);
    if (text.includes(",")) pet.traits = splitCSV(text).slice(0, 3);
    clearPendingFlow("pets");
    pushAssistantMessage(`He actualizado la informacion de ${pet.name}. Ya deje registrada esta nota: ${text}`);
    pushToast("Mascota actualizada", `${pet.name} quedo actualizada desde el chat.`);
    return;
  }

  if (pendingFlow.type === "food-add-basic") {
    const parsed = parseFoodBasic(text);
    setState((current) => ({
      ...current,
      ui: { ...current.ui, pendingFlow: { type: "food-add-product-image", data: parsed } }
    }), { forceScroll: true });
    pushAssistantMessage("Perfecto. Ahora escribeme el nombre de la imagen del producto o una descripcion breve para dejarla asociada.");
    return;
  }

  if (pendingFlow.type === "food-add-product-image") {
    const nextData = { ...pendingFlow.data, productImage: text };
    setState((current) => ({
      ...current,
      ui: { ...current.ui, pendingFlow: { type: "food-add-nutrition-image", data: nextData } }
    }), { forceScroll: true });
    pushAssistantMessage("Bien. Ahora enviame el nombre o descripcion de la imagen de la tabla nutricional.");
    return;
  }

  if (pendingFlow.type === "food-add-nutrition-image") {
    const data = { ...pendingFlow.data, nutritionImage: text };
    const newEntry = {
      id: uid(),
      pet: data.pet || state.pets[0].name,
      brand: data.brand || "Comida nueva",
      quantityKg: data.quantityKg || 1,
      purchaseDate: data.purchaseDate || formatISODate(new Date()),
      openDate: data.openDate || formatISODate(new Date()),
      durationDays: data.durationDays || 10,
      acceptance: data.acceptance || "Pendiente",
      price: data.price || 0,
      effect: data.effect || "Por observar",
      productImage: data.productImage,
      nutritionImage: data.nutritionImage
    };
    setState((current) => ({
      ...current,
      feedingEntries: [newEntry, ...current.feedingEntries],
      ui: { ...current.ui, activeSection: "feeding", selectedFoodId: newEntry.id, pendingFlow: null }
    }), { forceScroll: true });
    pushToast("Comida registrada", `${newEntry.brand} ya quedo cargada.`);
    pushAssistantMessage(`Listo. Ya registre ${newEntry.brand} para ${newEntry.pet}. Tambien deje asociadas la imagen del producto y la tabla nutricional.`);
    return;
  }

  if (pendingFlow.type === "compare-food") {
    const summary = buildFoodComparisonFromText(text);
    clearPendingFlow("feeding");
    pushAssistantMessage(summary);
    return;
  }

  if (pendingFlow.type === "report") {
    const answer = buildReportResponse(pendingFlow.reportTitle, text);
    clearPendingFlow("reports");
    pushAssistantMessage(answer);
    return;
  }

  if (pendingFlow.type === "upload-document") {
    const pet = state.pets.find((item) => item.id === pendingFlow.petId);
    if (!pet) return;
    pet.documents[pendingFlow.kind] = text;
    clearPendingFlow("health");
    pushAssistantMessage(`Perfecto. Ya deje registrada la ${pendingFlow.kind === "prescription" ? "formula medica" : "imagen del carnet"} de ${pet.name}: ${text}`);
    pushToast("Documento cargado", `Actualice el archivo de ${pet.name}.`);
  }
}

function clearPendingFlow(sectionId) {
  setState((current) => ({
    ...current,
    ui: { ...current.ui, activeSection: sectionId || current.ui.activeSection, pendingFlow: null }
  }), { forceScroll: true });
}

function interpretMessage(text, lower) {
  if (lower.includes("agregar") || lower.includes("anadir") || lower.includes("nuevo perro") || lower.includes("nuevo gato")) {
    const nameMatch = text.match(/(?:agregar|anadir|a)\s+([A-Za-z][\w-]+)/i);
    const inferredName = nameMatch ? capitalize(nameMatch[1]) : "Max";
    return {
      type: "add-pet",
      section: "pets",
      payload: { name: inferredName },
      reply: `Claro. Ya cree el registro inicial de ${inferredName}. Si quieres, el siguiente paso puede ser completar su ficha o cargar su primera comida.`
    };
  }

  if (lower.includes("se peleo") || lower.includes("agresion") || lower.includes("bufo")) {
    const petNames = findPetsMentioned(text);
    const mainPet = petNames[0] || "Pepe";
    const relatedPets = petNames.slice(1).length ? petNames.slice(1) : ["Ronaldo"];
    return {
      type: "behavior",
      section: "behavior",
      payload: { mainPet, relatedPets, intensity: "Alta", note: text },
      reply: `Ya registre el evento de conducta con ${mainPet} como mascota principal y con ${relatedPets.join(" y ")} como mascotas relacionadas. Si quieres, ahora puedo analizarlo, proponerte acciones o crear un seguimiento aparte.`
    };
  }

  if (lower.includes("vomito") || lower.includes("tos") || lower.includes("diarrea") || lower.includes("vacuna")) {
    const pet = findPetsMentioned(text)[0] || "Frida";
    return {
      type: "health",
      section: "health",
      payload: { pet, symptom: text },
      reply: `Ya registre el evento de salud de ${pet}. Si quieres, el siguiente paso puede ser analizarlo mejor, generar una recomendacion o dejar un seguimiento.`
    };
  }

  if (lower.includes("comida") || lower.includes("alimento") || lower.includes("pienso") || lower.includes("cuido")) {
    return {
      type: "feeding",
      section: "feeding",
      payload: {},
      reply: "Puedo ayudarte con eso. Si quieres registrar una comida nueva, pulsa el boton de registrar comida o dime los datos basicos y empiezo a cargarlos."
    };
  }

  if (lower.includes("peso") || lower.includes("kg")) {
    const pet = findPetsMentioned(text)[0] || "Pepe";
    const valueMatch = lower.match(/(\d+[.,]?\d*)\s*kg/);
    const value = valueMatch ? Number(valueMatch[1].replace(",", ".")) : 6.8;
    return {
      type: "weight",
      section: "health",
      payload: { pet, value },
      reply: `Ya registre el peso de ${pet}. Frente al mes pasado hay una variacion leve; conviene observar si coincide con cambios de alimentacion.`
    };
  }

  if (lower.includes("reporte") || lower.includes("historial") || lower.includes("como va") || lower.includes("analiza")) {
    return {
      type: "report",
      section: "reports",
      payload: {},
      reply: "Ya deje abierta la seccion de reportes. Elige una opcion y yo te pedire el contexto exacto para construirla."
    };
  }

  return {
    type: "general",
    section: state.ui.activeSection,
    payload: {},
    reply: "Entendi el contexto general. Si quieres, lo convierto en actualizacion de mascota, evento, salud, comida o reporte con un siguiente paso claro."
  };
}

function applyDemoUpdates(result) {
  if (result.type === "add-pet") {
    const exists = state.pets.some((pet) => pet.name.toLowerCase() === result.payload.name.toLowerCase());
    if (!exists) {
      state.pets.push({
        id: uid(),
        name: result.payload.name,
        species: "Mascota por definir",
        age: "Sin definir",
        sex: "Sin definir",
        anxiety: "Media",
        traits: ["nuevo registro"],
        sensitivities: ["sin datos"],
        status: "Pendiente de completar ficha",
        avatar: result.payload.name.slice(0, 1).toUpperCase(),
        color: randomPetColor(),
        lastUpdateNote: "Registro inicial creado desde el chat.",
        doctor: "Pendiente",
        clinic: "Pendiente",
        medicines: ["Sin informacion aun"],
        documents: { prescription: "", vaccineCard: "" }
      });
      pushToast("Nueva mascota", `${result.payload.name} quedo creada como registro inicial.`);
    }
    return;
  }

  if (result.type === "behavior") {
    state.behaviorEvents.unshift({
      id: uid(),
      date: formatISODate(new Date()),
      mainPet: result.payload.mainPet,
      relatedPets: result.payload.relatedPets,
      intensity: result.payload.intensity,
      note: result.payload.note,
      recommendation: "Pendiente de analisis posterior.",
      followUpInDays: 0
    });
    pushToast("Evento registrado", "Deje guardado el evento de conducta sin crear seguimiento automatico.");
    return;
  }

  if (result.type === "health") {
    state.healthEvents.unshift({
      id: uid(),
      date: formatISODate(new Date()),
      pet: result.payload.pet,
      type: "Observacion",
      symptom: result.payload.symptom,
      status: "Registro creado",
      nextDate: ""
    });
    pushToast("Salud actualizada", `Deje registrado el evento de salud de ${result.payload.pet} sin crear seguimiento automatico.`);
    return;
  }

  if (result.type === "weight") {
    state.weightEntries.unshift({
      id: uid(),
      pet: result.payload.pet,
      date: formatISODate(new Date()),
      value: result.payload.value
    });
    pushToast("Peso registrado", `Guarde ${result.payload.value} kg para ${result.payload.pet}.`);
  }
}

function pushUserMessage(text) {
  state.chatMessages.push({
    id: uid(),
    role: "user",
    author: "Tu",
    text,
    time: currentTime()
  });
  saveState();
}

function pushAssistantMessage(text) {
  state.chatMessages.push({
    id: uid(),
    role: "assistant",
    author: "FELIX",
    text,
    time: currentTime()
  });
  saveState();
  render({ forceScroll: true });
}

function calculateHomeStress() {
  const total = state.behaviorEvents.reduce((acc, event) => acc + intensityValue(event.intensity), 0);
  const average = total / Math.max(1, state.behaviorEvents.length);
  return Math.max(0, Math.min(100, Math.round(average * 22)));
}

function deriveHomeStatus(stress) {
  if (stress >= 70) {
    return {
      label: "Alerta alta",
      level: "Rojo",
      className: "is-red",
      message: "La tension esta alta. Conviene bajar estimulos y observar detonantes concretos.",
      badge: "Critico"
    };
  }
  if (stress >= 40) {
    return {
      label: "Atencion",
      level: "Amarillo",
      className: "is-yellow",
      message: "Hay friccion manejable. Vale la pena ordenar contexto y hacer seguimiento.",
      badge: "Vigilado"
    };
  }
  return {
    label: "Estable",
    level: "Verde",
    className: "is-green",
    message: "El hogar se ve contenido y con buena capacidad de recuperacion.",
    badge: "Calmo"
  };
}

function renderStressGauge(stress) {
  const angle = -90 + (stress * 1.8);
  const status = deriveHomeStatus(stress);
  return `
    <div class="stress-gauge">
      <div class="gauge-visual">
        <svg class="gauge-svg" viewBox="0 0 300 180" role="img" aria-label="Indice de estres del hogar">
          <path class="gauge-track" d="M58 142 A92 92 0 0 1 242 142"></path>
          <path class="gauge-zone gauge-zone-calm" d="M58 142 A92 92 0 0 1 120 63"></path>
          <path class="gauge-zone gauge-zone-mid" d="M120 63 A92 92 0 0 1 180 63"></path>
          <path class="gauge-zone gauge-zone-high" d="M180 63 A92 92 0 0 1 242 142"></path>
          <circle class="gauge-mark gauge-mark-left" cx="106" cy="79" r="7"></circle>
          <circle class="gauge-mark gauge-mark-mid" cx="150" cy="58" r="7"></circle>
          <circle class="gauge-mark gauge-mark-right" cx="194" cy="79" r="7"></circle>
          <g class="gauge-needle-wrap" style="transform: rotate(${angle}deg);">
            <line class="gauge-needle-line" x1="150" y1="142" x2="150" y2="60"></line>
            <circle class="gauge-center-dot" cx="150" cy="142" r="8"></circle>
          </g>
        </svg>
      </div>
      <div class="gauge-reading">
        <strong>${status.label}</strong>
        <p>${status.message}</p>
      </div>
    </div>
  `;
}

function renderBehaviorHeatmap() {
  const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
  const hours = ["0:00", "", "", "3:00", "", "", "6:00", "", "", "9:00", "", "", "12:00", "", "", "15:00", "", "21:00"];
  const matrix = [
    [0, 1, 1, 0, 2, 2, 3, 4, 3, 4, 2, 3, 4, 4, 3, 3, 2, 0],
    [0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 2, 3, 4, 3, 3, 4, 2, 0],
    [0, 0, 0, 1, 2, 2, 3, 5, 4, 4, 2, 2, 3, 4, 4, 5, 2, 1],
    [0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 2, 3, 4, 3, 3, 4, 2, 0],
    [0, 1, 0, 0, 1, 2, 3, 5, 4, 4, 3, 3, 5, 4, 4, 4, 2, 1],
    [0, 0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 3, 3, 3, 4, 3, 2, 1],
    [0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 2, 2, 3, 3, 2, 1, 0]
  ];
  return `
    <div class="behavior-heatmap">
      <div class="behavior-heatmap-hours">
        <span></span>
        ${hours.map((hour) => `<span class="behavior-heatmap-hour">${hour}</span>`).join("")}
      </div>
      <div class="behavior-heatmap-body">
        ${days.map((day, dayIndex) => `
          <div class="behavior-heatmap-row">
            <span class="behavior-heatmap-day">${day}</span>
            ${matrix[dayIndex].map((value) => `
              <span class="behavior-heatmap-cell level-${value}"></span>
            `).join("")}
          </div>
        `).join("")}
      </div>
      <div class="behavior-heatmap-legend">
        <span>Baja</span>
        <div class="behavior-heatmap-legend-scale">
          <span class="behavior-heatmap-cell level-1"></span>
          <span class="behavior-heatmap-cell level-2"></span>
          <span class="behavior-heatmap-cell level-3"></span>
          <span class="behavior-heatmap-cell level-4"></span>
          <span class="behavior-heatmap-cell level-5"></span>
        </div>
        <span>Alta</span>
      </div>
    </div>
  `;
}

function renderRelationshipMap(conflictMap, id) {
  const petPositions = buildPetPositions();
  const lines = conflictMap.map((row) => {
    const names = row.pair.split("::");
    const left = petPositions[names[0]];
    const right = petPositions[names[1]];
    if (!left || !right) return "";
    return `
      <line
        x1="${left.x}"
        y1="${left.y}"
        x2="${right.x}"
        y2="${right.y}"
        stroke="${relationshipColor(row.count)}"
        stroke-width="${row.count >= 3 ? 5 : row.count === 2 ? 4 : 3}"
        stroke-linecap="round"
        stroke-dasharray="${row.count === 1 ? "10 10" : "0"}"
        opacity="0.92"
      />
    `;
  }).join("");

  const nodes = state.pets.map((pet) => {
    const pos = petPositions[pet.name];
    return `
      <g>
        <circle cx="${pos.x}" cy="${pos.y}" r="40" fill="#191f29" stroke="rgba(255,255,255,0.08)" stroke-width="2.5"></circle>
        <circle cx="${pos.x}" cy="${pos.y}" r="48" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2"></circle>
        <text x="${pos.x}" y="${pos.y + 10}" text-anchor="middle" fill="currentColor" font-size="34">${getPetEmoji(pet.name)}</text>
        <text x="${pos.x}" y="${pos.y + 66}" text-anchor="middle" fill="currentColor" font-size="15" font-weight="600">${pet.name}</text>
      </g>
    `;
  }).join("");

  return `
    <div class="relationship-map" id="${id}">
      <svg viewBox="0 0 520 360" role="img" aria-label="Mapa relacional de mascotas">
        ${lines}
        ${nodes}
      </svg>
      <div class="legend-row">
        <span class="mini-pill"><span class="legend-swatch safe"></span> Baja</span>
        <span class="mini-pill"><span class="legend-swatch warning"></span> Media</span>
        <span class="mini-pill"><span class="legend-swatch danger"></span> Alta</span>
      </div>
    </div>
  `;
}

function buildPetPositions() {
  const anchors = [
    { x: 140, y: 110 },
    { x: 380, y: 110 },
    { x: 380, y: 280 },
    { x: 140, y: 280 },
    { x: 260, y: 64 },
    { x: 260, y: 324 }
  ];
  const positions = {};
  state.pets.forEach((pet, index) => {
    positions[pet.name] = anchors[index] || {
      x: 120 + ((index % 3) * 120),
      y: 110 + (Math.floor(index / 3) * 120)
    };
  });
  return positions;
}

function renderFrequencyBars() {
  const values = [2, 4, 3, 5, 2, 4, 3];
  return `
    <div class="chart-bars">
      ${values.map((value, index) => `
        <div class="chart-bar-wrap">
          <div class="chart-bar ${index % 2 ? "alt" : ""}" style="height:${value * 30}px;"></div>
          <span class="caption">S${index + 1}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function buildConflictMap() {
  const pairCounts = {};
  state.behaviorEvents.forEach((event) => {
    event.relatedPets.forEach((related) => {
      const pair = [event.mainPet, related].sort().join("::");
      pairCounts[pair] = (pairCounts[pair] || 0) + 1;
    });
  });
  return Object.entries(pairCounts).map(([pair, count]) => ({
    pair,
    count,
    reading: count >= 3
      ? "Es una relacion que conviene manejar con contexto y anticipacion."
      : count === 2
        ? "Tiene friccion media y puede mejorar con mejor rutina."
        : "Por ahora la tension es leve y bastante controlable."
  }));
}

function getRecentBehaviorEvents() {
  return state.behaviorEvents.slice(0, 6).map((event) => ({
    ...event,
    shortLabel: summarizeEventNote(event.note),
    intensityScore: mapIntensityScore(event.intensity),
    toneClass: event.intensity === "Alta" ? "is-warm" : "is-calm"
  }));
}

function getLatestWeightForPet(petName) {
  const entries = state.weightEntries
    .filter((entry) => entry.pet === petName)
    .sort((left, right) => right.date.localeCompare(left.date));
  if (!entries.length) return "Sin dato";
  return `${entries[0].value.toFixed(1)} kg`;
}

function petAnxietyDisplay(anxiety) {
  const map = {
    Baja: "3/10",
    Media: "6/10",
    Alta: "7/10"
  };
  return map[anxiety] || "5/10";
}

function petStatusToneClass(status, anxiety) {
  const lower = `${status} ${anxiety}`.toLowerCase();
  if (lower.includes("estable") || lower.includes("baja")) return "tone-stable";
  if (lower.includes("observacion") || lower.includes("alta")) return "tone-watch";
  return "tone-alert";
}

function petStatusBadgeLabel(status, anxiety) {
  const tone = petStatusToneClass(status, anxiety);
  if (tone === "tone-stable") return "ESTABLE";
  if (tone === "tone-watch") return "OBSERVACION";
  return "VIGILADO";
}

function formatPetMeta(pet) {
  const kind = pet.species.toLowerCase().includes("gat") ? "GATO" : "PERRO";
  const age = (pet.age.match(/\d+/) || ["0"])[0];
  const sex = pet.sex.toLowerCase().startsWith("m") ? "M" : "F";
  return `${kind} · ${age} AÑOS · ${sex}`;
}

function compareFoods(first, second) {
  if (!first || !second) {
    return {
      title: "Comparacion pendiente",
      message: "Aun faltan dos comidas para una comparacion completa."
    };
  }
  const firstScore = foodScore(first);
  const secondScore = foodScore(second);
  const winner = firstScore >= secondScore ? first : second;
  return {
    title: `Hoy gana ${winner.brand}`,
    message: `${winner.brand} queda mejor posicionada por aceptacion, duracion y efecto visible. Si quieres una comparacion puntual, usa el boton comparar comida.`
  };
}

function countHighIntensityEvents() {
  const threshold = 5;
  const count = state.behaviorEvents.filter((event) => mapIntensityScore(event.intensity) >= threshold).length;
  return { count, threshold };
}

function summarizeEventNote(note) {
  const lower = note.toLowerCase();
  if (lower.includes("comedor")) return "Conflicto territorial";
  if (lower.includes("ansiedad") || lower.includes("visita")) return "Ansiedad grupal";
  if (lower.includes("juego")) return "Juego intenso";
  if (lower.includes("evitacion")) return "Miedo a visitas";
  if (lower.includes("mirada fija")) return "Agresion leve";
  if (lower.includes("corredor")) return "Persecucion";
  return "Interaccion observada";
}

function mapIntensityScore(intensity) {
  if (intensity === "Alta") return 7;
  if (intensity === "Media") return 5;
  return 3;
}

function getPetEmoji(petName) {
  const pet = state.pets.find((item) => item.name === petName);
  if (!pet) return "🐾";
  return pet.species.toLowerCase().includes("gato") || pet.species.toLowerCase().includes("gata") ? "🐱" : "🐶";
}

function getPetEmojiFromOwner(owner) {
  const firstName = owner.split("/")[0].trim();
  return getPetEmoji(firstName);
}

function getPetEmojiFromReminder(label) {
  const pet = state.pets.find((item) => label.toLowerCase().includes(item.name.toLowerCase()));
  return pet ? getPetEmoji(pet.name) : "🐾";
}

function normalizeShortDue(value) {
  if (value.toLowerCase().includes("3")) return "2026-03-20";
  if (value.toLowerCase().includes("2")) return "2026-03-18";
  return "2026-03-11";
}

function buildFoodComparisonFromText(text) {
  const lower = text.toLowerCase();
  const found = state.feedingEntries.filter((entry) => lower.includes(entry.brand.toLowerCase()));
  const first = found[0] || state.feedingEntries[0];
  const second = found[1] || state.feedingEntries[1];
  if (!first || !second) {
    return "Todavia me falta una referencia clara. Dime dos nombres de comida y te digo cual veo mas estable.";
  }
  const winner = foodScore(first) >= foodScore(second) ? first : second;
  return `Compare ${first.brand} contra ${second.brand}. Hoy veo mejor a ${winner.brand} porque combina mejor aceptacion, duracion y efecto visible mas estable.`;
}

function buildReportResponse(title, text) {
  const cleaned = text.trim();
  const byTitle = {
    "Analisis de conflictos": `Ya deje armado el analisis de conflictos con este alcance: ${cleaned}. Hoy veo que los picos se concentran en Pepe y Ronaldo, especialmente cuando el espacio se estrecha o coincide con comida.`,
    "Dinamica de mascotas": `Listo. Con este foco: ${cleaned}, la lectura principal es que Amara estabiliza el grupo y Ronaldo responde peor a cambios de entorno o trayectorias cerradas.`,
    "Eventos de conducta": `Perfecto. Para ${cleaned}, el patron mas repetido son eventos cortos, pero frecuentes, asociados a transiciones del hogar.`,
    "Historial de salud": `Ya tome el alcance: ${cleaned}. El historial muestra estabilidad general, con foco principal en la observacion digestiva de Frida.`,
    "Tendencias de peso": `Listo. Con el contexto ${cleaned}, la tendencia de peso luce estable en general, con una variacion leve en Pepe.`
  };
  return byTitle[title] || `Ya deje definido el reporte con este alcance: ${cleaned}. Si quieres, ahora puedo afinarlo mas por mascota o por rango de fechas.`;
}

function parseFoodBasic(text) {
  const parts = text.split(",").map((item) => item.trim()).filter(Boolean);
  const brand = parts[0] || "Comida nueva";
  const pet = findPetsMentioned(text)[0] || state.pets[0].name;
  const quantityKg = extractNumberBeforeKeyword(text.toLowerCase(), "kg") || 1;
  const durationDays = extractNumberBeforeKeyword(text.toLowerCase(), "dias") || 10;
  const priceMatch = text.match(/(\d{4,7})/);
  const acceptance = inferAcceptance(text);
  const dates = text.match(/\d{4}-\d{2}-\d{2}/g) || [];
  const effect = parts[parts.length - 1] || "Por observar";
  return {
    brand,
    pet,
    quantityKg,
    purchaseDate: dates[0] || formatISODate(new Date()),
    openDate: dates[1] || dates[0] || formatISODate(new Date()),
    durationDays,
    acceptance,
    price: priceMatch ? Number(priceMatch[1]) : 0,
    effect
  };
}

function inferAcceptance(text) {
  const lower = text.toLowerCase();
  if (lower.includes("alta")) return "Alta";
  if (lower.includes("baja")) return "Baja";
  return "Media";
}

function inferStatusFromText(text, fallback) {
  const lower = text.toLowerCase();
  if (lower.includes("mejor") || lower.includes("estable")) return "Estable";
  if (lower.includes("tension") || lower.includes("reactivo")) return "Tension leve";
  if (lower.includes("observacion")) return "Observacion";
  return fallback || "Actualizado";
}

function intensityValue(intensity) {
  if (intensity === "Alta") return 4;
  if (intensity === "Media") return 2.8;
  return 1.4;
}

function relationshipColor(count) {
  if (count >= 3) return "#ff6b6b";
  if (count === 2) return "#2dbcb3";
  return "#51627b";
}

function foodScore(food) {
  const acceptanceScore = food.acceptance === "Alta" ? 3 : food.acceptance === "Media" ? 2 : 1;
  const durationScore = Math.min(3, Math.round(food.durationDays / 8));
  const effectScore = food.effect.toLowerCase().includes("blanda") ? 1 : 3;
  return acceptanceScore + durationScore + effectScore;
}

function findPetsMentioned(text) {
  return state.pets.map((pet) => pet.name).filter((name) => new RegExp(`\\b${name}\\b`, "i").test(text));
}

function extractNumberBeforeKeyword(text, keyword) {
  const match = text.match(new RegExp(`(\\d+[.,]?\\d*)\\s*${keyword}`));
  return match ? Number(match[1].replace(",", ".")) : null;
}

function splitCSV(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function renderFlowLabel(flow) {
  const map = {
    "update-pet": "Flujo activo: actualizacion de mascota.",
    "food-add-basic": "Flujo activo: registrando informacion basica de comida.",
    "food-add-product-image": "Flujo activo: esperando imagen del producto.",
    "food-add-nutrition-image": "Flujo activo: esperando tabla nutricional.",
    "compare-food": "Flujo activo: comparacion de comida.",
    "report": "Flujo activo: preparando reporte.",
    "upload-document": "Flujo activo: cargando documento de salud."
  };
  return map[flow.type] || "Flujo activo en progreso.";
}

function renderThemeIcon() {
  if (state.theme === "dark") {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="5"></circle>
        <path d="M12 1v2"></path>
        <path d="M12 21v2"></path>
        <path d="M4.22 4.22l1.42 1.42"></path>
        <path d="M18.36 18.36l1.42 1.42"></path>
        <path d="M1 12h2"></path>
        <path d="M21 12h2"></path>
        <path d="M4.22 19.78l1.42-1.42"></path>
        <path d="M18.36 5.64l1.42-1.42"></path>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.6A9 9 0 1 1 11.4 3a7 7 0 0 0 9.6 9.6z"></path>
    </svg>
  `;
}

function renderNavIcon(sectionId) {
  const icons = {
    dashboard: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="4" y="4" width="6" height="6" rx="1.2"></rect>
        <rect x="14" y="4" width="6" height="6" rx="1.2"></rect>
        <rect x="4" y="14" width="6" height="6" rx="1.2"></rect>
        <rect x="14" y="14" width="6" height="6" rx="1.2"></rect>
      </svg>
    `,
    pets: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="8" cy="7.5" r="2"></circle>
        <circle cx="16" cy="7.5" r="2"></circle>
        <circle cx="6.5" cy="13" r="1.8"></circle>
        <circle cx="17.5" cy="13" r="1.8"></circle>
        <path d="M12 18.5c-2.7 0-4.8-1.6-4.8-3.5 0-1.6 1.5-2.9 3.2-2.9.6 0 1.2.2 1.6.6.3-.4.9-.6 1.6-.6 1.7 0 3.2 1.3 3.2 2.9 0 1.9-2.1 3.5-4.8 3.5z"></path>
      </svg>
    `,
    behavior: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M10 4c-2 0-3.5 1.4-3.5 3.3 0 1 .3 1.8.8 2.3-.9.4-1.7 1.4-1.7 2.6 0 1 .5 2 1.4 2.6-.8.5-1.3 1.4-1.3 2.4 0 1.8 1.4 3.3 3.2 3.3 1 0 1.9-.4 2.4-1.1.6.7 1.5 1.1 2.5 1.1 1.8 0 3.2-1.5 3.2-3.3 0-1-.5-1.9-1.3-2.4.9-.6 1.4-1.6 1.4-2.6 0-1.2-.8-2.2-1.7-2.6.5-.5.8-1.3.8-2.3 0-1.9-1.5-3.3-3.5-3.3-.9 0-1.8.3-2.4.9-.6-.6-1.5-.9-2.4-.9z"></path>
      </svg>
    `,
    feeding: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 20c4.2 0 7-3.2 7-7.6 0-4.2-2.7-6.8-7-8.4-4.3 1.6-7 4.2-7 8.4 0 4.4 2.8 7.6 7 7.6z"></path>
        <path d="M12 7c1.4 1.6 2.5 3 2.5 5"></path>
      </svg>
    `,
    health: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 20s-6.5-4.2-8.5-7.7C2.1 9.7 3.6 6.5 7 6.5c2 0 3.2 1 4 2 0.8-1 2-2 4-2 3.4 0 4.9 3.2 3.5 5.8C18.5 15.8 12 20 12 20z"></path>
      </svg>
    `,
    reports: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 18V6"></path>
        <path d="M4 18h16"></path>
        <path d="M8 14l3-3 3 2 4-5"></path>
      </svg>
    `,
    settings: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3.2"></circle>
        <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6z"></path>
      </svg>
    `
  };
  return icons[sectionId] || "";
}

function renderLogoutIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10 17l-5-5 5-5"></path>
      <path d="M5 12h10"></path>
      <path d="M14 5h4v14h-4"></path>
    </svg>
  `;
}

function renderChevronRightIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6"></path>
    </svg>
  `;
}

function renderExpandIcon(isExpanded) {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${isExpanded
        ? '<path d="M9 3H3v6"></path><path d="M15 21h6v-6"></path><path d="M3 9l6-6"></path><path d="M21 15l-6 6"></path>'
        : '<path d="M3 9V3h6"></path><path d="M15 3h6v6"></path><path d="M9 9L3 3"></path><path d="M15 9l6-6"></path><path d="M3 15v6h6"></path><path d="M15 21h6v-6"></path><path d="M9 15l-6 6"></path><path d="M15 15l6 6"></path>'}
    </svg>
  `;
}

function renderSendIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 12h12"></path>
      <path d="M13 5l7 7-7 7"></path>
    </svg>
  `;
}

function renderImageIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2"></rect>
      <circle cx="9" cy="10" r="1.3"></circle>
      <path d="M21 15l-4-4-6 6-3-3-5 5"></path>
    </svg>
  `;
}

function renderMicIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3"></rect>
      <path d="M5 11a7 7 0 0 0 14 0"></path>
      <path d="M12 18v3"></path>
      <path d="M8 21h8"></path>
    </svg>
  `;
}

function sectionHeadline(sectionId) {
  const map = {
    dashboard: "Inicio y contexto del hogar",
    pets: "Memoria viva de cada mascota",
    behavior: "Convivencia, eventos y contexto",
    feeding: "Comida, cambios y observaciones",
    health: "Salud organizada con antecedentes",
    reports: "Analisis guiado desde el chat",
    settings: "Cuenta, preferencias y hogar"
  };
  return map[sectionId] || "FELIX";
}

function sectionMenuHint(sectionId) {
  const map = {
    dashboard: "Empieza por registrar o consultar",
    pets: `${state.pets.length} perfiles con memoria`,
    behavior: `${state.behaviorEvents.length} eventos de convivencia`,
    feeding: `${state.feedingEntries.length} registros de comida`,
    health: `${state.healthEvents.length} registros de salud`,
    reports: `${reportOptions.length} rutas de analisis`,
    settings: "Cuenta, hogar y tema"
  };
  return map[sectionId] || "Vista principal";
}

function sectionMenuBadge(sectionId) {
  const map = {
    dashboard: "hoy",
    pets: `${state.pets.length} mascotas`,
    behavior: `${state.behaviorEvents.length} eventos`,
    feeding: `${state.feedingEntries.length} comidas`,
    health: `${state.healthEvents.length} registros`,
    reports: `${reportOptions.length} rutas`,
    settings: "cuenta"
  };
  return map[sectionId] || "menu";
}

function sectionDescription(sectionId) {
  const map = {
    dashboard: "FELIX te ayuda a registrar, recordar y entender mejor lo importante del hogar sin aumentar tu carga mental.",
    pets: "Cada mascota conserva rasgos, sensibilidades, antecedentes y actualizaciones recientes para que el seguimiento tenga memoria.",
    behavior: "Aqui primero registras lo ocurrido y, si hace falta, despues revisas patrones, contexto y posibles seguimientos.",
    feeding: "Registra comida, cambios, imagenes y efectos visibles; luego FELIX te ayuda a interpretar lo necesario.",
    health: "Sintomas, controles, documentos y antecedentes organizados con claridad, sin reemplazar criterio veterinario.",
    reports: "Usa esta vista cuando ya tengas una pregunta clara y quieras profundizar con un analisis guiado.",
    settings: "Edita tu cuenta, el hogar activo y las preferencias visuales desde una sola pantalla."
  };
  return map[sectionId] || "";
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function formatISODate(date) {
  return date.toISOString().slice(0, 10);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function offsetDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatISODate(date);
}

function currentTime() {
  return new Intl.DateTimeFormat("es-CO", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function getInitials(name) {
  return name.split(" ").slice(0, 2).map((chunk) => chunk[0]).join("").toUpperCase();
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function randomPetColor() {
  const palette = ["#63d8ff", "#f5b85c", "#d39bff", "#8ecb75", "#ff8d73"];
  return palette[Math.floor(Math.random() * palette.length)];
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
