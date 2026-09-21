(function () {
  const SESSION_KEY = 'saimon-portal-session';

  const VIEWS = {
    login: {
      eyebrow: 'Saimon Robotics',
      title: 'Hola',
      lead: 'Bienvenido a tu cuenta. Accede a cotizaciones, pedidos y SaimonIQ.'
    },
    register: {
      eyebrow: 'Nueva cuenta',
      title: 'Crea tu cuenta',
      lead: 'Solo necesitamos tus datos de contacto para comenzar.'
    },
    reset: {
      eyebrow: 'Recuperación',
      title: 'Recuperar contraseña',
      lead: 'Ingresa el correo con el que te registraste y te enviaremos un enlace para restablecerla.'
    }
  };

  function getSession() {
    try {
      const data = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      return data && data.loggedIn ? data : null;
    } catch (err) {
      return null;
    }
  }

  function saveSession(partial) {
    const next = Object.assign({ loggedIn: true }, getSession() || {}, partial, { loggedIn: true });
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    syncAccountButtons();
    return next;
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    syncAccountButtons();
  }

  function isAccountControl(el) {
    if (!el || !el.getAttribute) return false;
    if (el.classList && el.classList.contains('nav-account-btn')) return true;
    if (!(el.classList && el.classList.contains('mobile-link'))) return false;
    const label = (el.textContent || '').trim();
    return (
      el.hasAttribute('data-open-auth') ||
      el.hasAttribute('data-open-portal') ||
      /^(cuenta|portal saimon)$/i.test(label)
    );
  }

  function wireAccountButton(btn) {
    if (!btn || btn.getAttribute('data-auth-wired') === '1') return;
    btn.setAttribute('data-auth-wired', '1');
    btn.addEventListener('click', handleAccountClick);
  }

  function syncAccountButtons() {
    const session = getSession();
    document.querySelectorAll('.nav-account-btn').forEach(function (btn) {
      btn.classList.toggle('is-logged', !!session);
      btn.setAttribute('aria-label', session ? 'Abrir Portal Saimon' : 'Iniciar sesión');
      btn.setAttribute('data-open-auth', 'login');
      if (session) btn.setAttribute('data-open-portal', '');
      else btn.removeAttribute('data-open-portal');
      wireAccountButton(btn);
    });
    document.querySelectorAll('.mobile-link').forEach(function (btn) {
      if (!isAccountControl(btn)) return;
      btn.textContent = session ? 'Portal Saimon' : 'Cuenta';
      btn.setAttribute('data-open-auth', 'login');
      if (session) btn.setAttribute('data-open-portal', '');
      else btn.removeAttribute('data-open-portal');
      wireAccountButton(btn);
    });
  }

  function handleAccountClick(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Siempre abrir el modal de login (aunque haya sesión demo previa).
    // El submit del form redirige al portal.
    openAuth('login');
  }

  function goToPortal() {
    window.location.href = 'portal.html';
  }

  function ensureStylesheet() {
    if (document.querySelector('link[data-auth-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'auth.css';
    link.setAttribute('data-auth-css', '1');
    document.head.appendChild(link);
  }

  function buildModal() {
    const existing = document.getElementById('authModal');
    if (existing && existing.getAttribute('data-auth-version') === '4') return false;
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'authModal';
    overlay.setAttribute('data-auth-version', '4');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'authModalTitle');
    overlay.innerHTML =
      '<div class="modal auth-modal">' +
        '<button class="modal-close" type="button" data-close-auth aria-label="Cerrar">×</button>' +
        '<aside class="auth-visual" aria-hidden="true">' +
          '<img src="robots/humanoide/dbs02x-navy-front-full.jpg" alt="">' +
          '<div class="auth-visual-shade"></div>' +
          '<div class="auth-visual-copy">' +
            '<span class="auth-brand">Saimon Robotics</span>' +
            '<h2>Tu operación, en un solo lugar</h2>' +
            '<p>Cotiza, da seguimiento y conecta con RoboSector, SaimonDeploy y SaimonIQ.</p>' +
          '</div>' +
        '</aside>' +
        '<div class="auth-panel">' +
          '<div class="auth-panel-head">' +
            '<span class="auth-panel-eyebrow" id="authEyebrow"></span>' +
            '<h2 class="auth-panel-title" id="authModalTitle"></h2>' +
            '<p class="auth-panel-lead" id="authLead"></p>' +
          '</div>' +

          '<div class="auth-view is-active" data-auth-view="login">' +
            '<form class="auth-form" id="authLoginForm" novalidate>' +
              '<div class="form-group">' +
                '<label class="form-label" for="authLoginEmail">Correo corporativo</label>' +
                '<input class="form-input" id="authLoginEmail" type="email" autocomplete="username" placeholder="correo@empresa.com">' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="form-label" for="authLoginPassword">Contraseña</label>' +
                '<input class="form-input" id="authLoginPassword" type="password" autocomplete="current-password" placeholder="••••••••">' +
              '</div>' +
              '<div class="auth-form-meta">' +
                '<label class="auth-check"><input type="checkbox" name="remember"> Recordarme</label>' +
                '<button type="button" class="auth-link-btn" data-auth-goto="reset">¿Olvidaste tu contraseña?</button>' +
              '</div>' +
              '<button type="submit" class="auth-submit">Iniciar sesión</button>' +
              '<div class="auth-feedback" data-auth-feedback></div>' +
            '</form>' +
            '<p class="auth-switch">¿No tienes cuenta? <button type="button" data-auth-goto="register">Regístrate</button></p>' +
          '</div>' +

          '<div class="auth-view" data-auth-view="register">' +
            '<form class="auth-form" id="authRegisterForm" novalidate>' +
              '<div class="auth-form-row">' +
                '<div class="form-group">' +
                  '<label class="form-label" for="authRegName">Nombre</label>' +
                  '<input class="form-input" id="authRegName" type="text" autocomplete="given-name" placeholder="Nombre" required>' +
                '</div>' +
                '<div class="form-group">' +
                  '<label class="form-label" for="authRegLastName">Apellidos</label>' +
                  '<input class="form-input" id="authRegLastName" type="text" autocomplete="family-name" placeholder="Apellidos" required>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="form-label" for="authRegPhone">Teléfono</label>' +
                '<input class="form-input" id="authRegPhone" type="tel" autocomplete="tel" placeholder="+52 55 0000 0000" required>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="form-label" for="authRegEmail">Correo electrónico</label>' +
                '<input class="form-input" id="authRegEmail" type="email" autocomplete="email" placeholder="correo@empresa.com" required>' +
              '</div>' +
              '<button type="submit" class="auth-submit">Crear cuenta</button>' +
              '<div class="auth-feedback" data-auth-feedback></div>' +
            '</form>' +
            '<p class="auth-switch">¿Ya tienes cuenta? <button type="button" data-auth-goto="login">Inicia sesión</button></p>' +
          '</div>' +

          '<div class="auth-view" data-auth-view="reset">' +
            '<form class="auth-form" id="authResetForm" novalidate>' +
              '<div class="form-group">' +
                '<label class="form-label" for="authResetEmail">Correo de registro</label>' +
                '<input class="form-input" id="authResetEmail" type="email" autocomplete="email" placeholder="correo@empresa.com" required>' +
              '</div>' +
              '<button type="submit" class="auth-submit">Enviar enlace de recuperación</button>' +
              '<div class="auth-feedback" data-auth-feedback></div>' +
            '</form>' +
            '<p class="auth-switch"><button type="button" data-auth-goto="login">Volver a iniciar sesión</button></p>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    return true;
  }

  function setView(name) {
    const meta = VIEWS[name] || VIEWS.login;
    const overlay = document.getElementById('authModal');
    const eyebrow = document.getElementById('authEyebrow');
    const title = document.getElementById('authModalTitle');
    const lead = document.getElementById('authLead');
    if (eyebrow) eyebrow.textContent = meta.eyebrow;
    if (title) title.textContent = meta.title;
    if (lead) lead.textContent = meta.lead;

    const root = overlay || document;
    root.querySelectorAll('[data-auth-view]').forEach(function (view) {
      view.classList.toggle('is-active', view.getAttribute('data-auth-view') === name);
      const feedback = view.querySelector('[data-auth-feedback]');
      if (feedback) {
        feedback.classList.remove('is-visible', 'is-error');
        feedback.textContent = '';
      }
    });
  }

  function openAuth(view) {
    if (buildModal()) bindForms();
    const overlay = document.getElementById('authModal');
    if (!overlay) return;
    setView(view || 'login');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('mobileMenu')?.classList.remove('open');
    document.getElementById('siteIntro')?.classList.add('is-exit');
    window.setTimeout(function () {
      const active = overlay.querySelector('.auth-view.is-active input');
      if (active && overlay.classList.contains('open')) active.focus();
    }, 60);
  }

  function closeAuth() {
    const overlay = document.getElementById('authModal');
    if (!overlay) return;
    overlay.classList.remove('open');
    if (!document.querySelector('.modal-overlay.open')) {
      document.body.style.overflow = '';
    }
  }

  function showFeedback(form, message, isError) {
    const el = form.querySelector('[data-auth-feedback]');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    el.classList.toggle('is-error', !!isError);
  }

  function bindForms() {
    const login = document.getElementById('authLoginForm');
    const register = document.getElementById('authRegisterForm');
    const reset = document.getElementById('authResetForm');

    login?.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('authLoginEmail')?.value?.trim() || 'demo@saimonvision.com';
      const btn = login.querySelector('.auth-submit');
      btn.disabled = true;
      btn.textContent = 'Entrando…';
      window.setTimeout(function () {
        saveSession({
          name: email.includes('@') && email !== 'demo@saimonvision.com'
            ? (email.split('@')[0] || 'Usuario')
            : 'Usuario Demo',
          email: email,
          company: 'Cliente Saimon'
        });
        closeAuth();
        goToPortal();
      }, 400);
    });

    register?.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('authRegName')?.value?.trim() || '';
      const lastName = document.getElementById('authRegLastName')?.value?.trim() || '';
      const phone = document.getElementById('authRegPhone')?.value?.trim() || '';
      const email = document.getElementById('authRegEmail')?.value?.trim() || '';
      if (!name || !lastName || !phone || !email) {
        showFeedback(register, 'Completa nombre, apellidos, teléfono y correo.', true);
        register.reportValidity();
        return;
      }
      const emailEl = document.getElementById('authRegEmail');
      if (emailEl && !emailEl.checkValidity()) {
        showFeedback(register, 'Ingresa un correo electrónico válido.', true);
        emailEl.focus();
        return;
      }
      const btn = register.querySelector('.auth-submit');
      btn.disabled = true;
      btn.textContent = 'Creando…';
      window.setTimeout(function () {
        saveSession({
          name: (name + ' ' + lastName).trim(),
          email: email,
          phone: phone,
          company: 'Cliente Saimon'
        });
        closeAuth();
        goToPortal();
      }, 500);
    });

    reset?.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailEl = document.getElementById('authResetEmail');
      const email = emailEl?.value?.trim() || '';
      if (!email || !emailEl.checkValidity()) {
        showFeedback(reset, 'Ingresa el correo con el que te registraste.', true);
        emailEl?.focus();
        return;
      }
      const btn = reset.querySelector('.auth-submit');
      const orig = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Enviando…';
      window.setTimeout(function () {
        btn.disabled = false;
        btn.textContent = orig;
        showFeedback(reset, 'Te enviamos un enlace de recuperación a ' + email + ' (demo). Revisa tu bandeja.');
      }, 600);
    });
  }

  function findClosest(el, selector) {
    if (!el) return null;
    if (el.closest) return el.closest(selector);
    while (el && el.nodeType === 1) {
      if (el.matches && el.matches(selector)) return el;
      el = el.parentElement;
    }
    return null;
  }

  function bindUi() {
    document.addEventListener('click', function (e) {
      const accountBtn = findClosest(e.target, '.nav-account-btn');
      if (accountBtn) {
        // Direct listener already handles it; keep as fallback for non-wired buttons
        if (accountBtn.getAttribute('data-auth-wired') !== '1') handleAccountClick(e);
        return;
      }

      const mobileAccount = findClosest(e.target, '.mobile-link');
      if (mobileAccount && isAccountControl(mobileAccount)) {
        if (mobileAccount.getAttribute('data-auth-wired') !== '1') handleAccountClick(e);
        return;
      }

      if (findClosest(e.target, '[data-close-auth]')) {
        e.preventDefault();
        closeAuth();
        return;
      }
      const goto = findClosest(e.target, '[data-auth-goto]');
      if (goto) {
        e.preventDefault();
        const view = goto.getAttribute('data-auth-goto');
        setView(view);
        if (view === 'reset') {
          const loginEmail = document.getElementById('authLoginEmail')?.value?.trim();
          const resetEmail = document.getElementById('authResetEmail');
          if (resetEmail && loginEmail) resetEmail.value = loginEmail;
          window.setTimeout(function () { resetEmail?.focus(); }, 40);
        }
        return;
      }
      if (e.target.id === 'authModal') closeAuth();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.getElementById('authModal')?.classList.contains('open')) {
        closeAuth();
      }
    });
  }

  window.openAuthModal = openAuth;
  window.closeAuthModal = closeAuth;
  window.getSaimonSession = getSession;
  window.clearSaimonSession = clearSession;
  window.saveSaimonSession = saveSession;

  ensureStylesheet();
  buildModal();
  bindForms();
  bindUi();
  setView('login');
  syncAccountButtons();

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === '1' && !getSession()) {
      openAuth('login');
    }
  } catch (err) { /* ignore */ }
})();
