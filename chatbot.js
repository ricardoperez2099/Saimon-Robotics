(function () {
  const QUICK = [
    { label: 'Cotizar un robot', q: 'Quiero cotizar un robot' },
    { label: 'DBS02-X', q: 'Cuéntame del DBS02-X' },
    { label: 'SR-K9', q: 'Cuéntame del SR-K9' },
    { label: 'Hablar con un asesor', q: 'Quiero hablar con un asesor' }
  ];

  const REPLIES = [
    {
      keys: ['hola', 'buenas', 'buen día', 'buen dia', 'hey', 'hi'],
      text: 'Hola. Soy el asistente de Saimon Robotics. ¿Buscas un modelo concreto, una cotización o hablar con un especialista?'
    },
    {
      keys: ['dbs02', 'humanoide', 'manipulación', 'manipulacion'],
      text: 'El DBS02-X es nuestro humanoide de manipulación: visión estéreo, aprendizaje por imitación y hasta 2 h de autonomía. Puedes ver la ficha completa o pedirme que te abra una cotización.'
    },
    {
      keys: ['sr-k9', 'sr k9', 'perro', 'cuadrúpedo', 'cuadrupedo'],
      text: 'El SR-K9 es el cuadrúpedo todo terreno de Saimon: agilidad, LiDAR y patrullaje autónomo. En la categoría SR-K9 puedes comparar Pro, Max e Industrial.'
    },
    {
      keys: ['cotiz', 'precio', 'renta', 'comprar', 'compra', 'costo'],
      text: 'Para una cotización de renta o compra, abre el carrito de cotización desde la ficha del modelo o deja tu contacto y un especialista te responde.'
    },
    {
      keys: ['asesor', 'contacto', 'llamar', 'email', 'hablar', 'humano'],
      text: 'Claro. Puedes escribir a contact@saimonvision.com o usar el formulario de contacto del sitio. ¿Quieres que te abra el formulario ahora?'
    },
    {
      keys: ['soporte', 'mantenimiento', 'roboalliance', 'deploy'],
      text: 'Con RoboAlliance y SaimonDeploy cubrimos despliegue, soporte y monitoreo. Si me dices tu industria, te oriento al modelo más adecuado.'
    },
    {
      keys: ['gracias', 'perfecto', 'ok', 'vale'],
      text: 'Con gusto. Si necesitas algo más sobre modelos, renta o compra, aquí estoy.'
    }
  ];

  const DEFAULT_REPLY =
    'Puedo ayudarte con modelos (DBS02-X, SR-K9 y más), cotizaciones de renta o compra, y contacto con un especialista. ¿Qué te interesa?';

  let chatOpen = false;
  let panel = null;
  let messagesEl = null;
  let inputEl = null;
  let typing = false;

  function ensurePanel() {
    if (panel) return panel;

    const fab = document.getElementById('chatbotFab');
    if (!fab) return null;

    panel = document.createElement('div');
    panel.className = 'chatbot-panel';
    panel.id = 'chatbotPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Asistente Saimon');
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div class="chatbot-panel-head">' +
        '<div class="chatbot-panel-brand">' +
          '<span class="chatbot-panel-avatar" aria-hidden="true">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z"/></svg>' +
          '</span>' +
          '<div>' +
            '<strong>Asistente Saimon</strong>' +
            '<span>Robótica industrial · LATAM</span>' +
          '</div>' +
        '</div>' +
        '<button type="button" class="chatbot-panel-close" aria-label="Cerrar chat">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="chatbot-messages" id="chatbotMessages"></div>' +
      '<div class="chatbot-quick" id="chatbotQuick"></div>' +
      '<form class="chatbot-compose" id="chatbotForm" autocomplete="off">' +
        '<input type="text" id="chatbotInput" class="chatbot-input" placeholder="Escribe tu mensaje…" maxlength="400" aria-label="Mensaje">' +
        '<button type="submit" class="chatbot-send" aria-label="Enviar">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>' +
        '</button>' +
      '</form>';

    fab.insertBefore(panel, fab.firstChild);

    messagesEl = panel.querySelector('#chatbotMessages');
    inputEl = panel.querySelector('#chatbotInput');

    panel.querySelector('.chatbot-panel-close').addEventListener('click', function () {
      setOpen(false);
    });

    const quickEl = panel.querySelector('#chatbotQuick');
    QUICK.forEach(function (item) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chatbot-chip';
      btn.textContent = item.label;
      btn.addEventListener('click', function () {
        sendUser(item.q);
      });
      quickEl.appendChild(btn);
    });

    panel.querySelector('#chatbotForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const text = (inputEl.value || '').trim();
      if (!text) return;
      inputEl.value = '';
      sendUser(text);
    });

    addBot(
      'Hola. Soy el asistente de Saimon Robotics. Puedo orientarte sobre modelos, cotizaciones y soporte. ¿En qué te ayudo?'
    );

    return panel;
  }

  function addBubble(role, text) {
    if (!messagesEl) return;
    const row = document.createElement('div');
    row.className = 'chatbot-msg chatbot-msg--' + role;
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addBot(text) {
    addBubble('bot', text);
  }

  function addUser(text) {
    addBubble('user', text);
  }

  function showTyping() {
    if (!messagesEl || typing) return;
    typing = true;
    const row = document.createElement('div');
    row.className = 'chatbot-msg chatbot-msg--bot chatbot-msg--typing';
    row.id = 'chatbotTyping';
    row.innerHTML = '<div class="chatbot-bubble"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    typing = false;
    document.getElementById('chatbotTyping')?.remove();
  }

  function replyFor(text) {
    const lower = text.toLowerCase();
    for (let i = 0; i < REPLIES.length; i++) {
      const rule = REPLIES[i];
      if (rule.keys.some(function (k) { return lower.indexOf(k) !== -1; })) {
        return rule.text;
      }
    }
    return DEFAULT_REPLY;
  }

  function maybeOpenContact(text) {
    const lower = text.toLowerCase();
    if (
      (lower.indexOf('asesor') !== -1 || lower.indexOf('formulario') !== -1 || lower.indexOf('contacto') !== -1) &&
      typeof window.openContactModal === 'function'
    ) {
      window.setTimeout(function () {
        window.openContactModal();
      }, 700);
    }
  }

  function sendUser(text) {
    addUser(text);
    showTyping();
    const answer = replyFor(text);
    window.setTimeout(function () {
      hideTyping();
      addBot(answer);
      maybeOpenContact(text);
      if (inputEl) inputEl.focus();
    }, 550 + Math.min(text.length * 8, 700));
  }

  function setOpen(open) {
    ensurePanel();
    chatOpen = open;
    const tooltip = document.getElementById('chatbotTooltip');
    const btn = document.querySelector('#chatbotFab .chatbot-btn');
    if (panel) {
      panel.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    if (btn) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.classList.toggle('is-open', open);
    }
    if (tooltip) tooltip.style.display = 'none';
    if (open && inputEl) {
      window.setTimeout(function () { inputEl.focus(); }, 180);
    }
  }

  window.toggleChatbot = function () {
    ensurePanel();
    setOpen(!chatOpen);
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && chatOpen) setOpen(false);
  });

  document.addEventListener('click', function (e) {
    if (!chatOpen || !panel) return;
    const fab = document.getElementById('chatbotFab');
    if (fab && !fab.contains(e.target)) setOpen(false);
  });

  window.setTimeout(function () {
    const tooltip = document.getElementById('chatbotTooltip');
    if (tooltip && !chatOpen) {
      tooltip.style.display = 'block';
      window.setTimeout(function () {
        if (!chatOpen) tooltip.style.display = 'none';
      }, 4000);
    }
  }, 3000);
})();
