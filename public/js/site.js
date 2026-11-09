(function () {
  var params = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var key = 'h3df_utm';
  var stored = {};
  try { stored = JSON.parse(sessionStorage.getItem(key) || '{}') || {}; } catch (error) { stored = {}; }
  var query = new URLSearchParams(window.location.search);
  var found = false;
  params.forEach(function (name) {
    var value = query.get(name);
    if (value) {
      stored[name] = value.slice(0, 120);
      found = true;
    }
  });
  if (found) {
    try { sessionStorage.setItem(key, JSON.stringify(stored)); } catch (error) { /* a tárhely zárva lehet */ }
  }
  document.addEventListener('click', function (event) {
    document.querySelectorAll('.menu-drop[open]').forEach(function (menu) {
      if (!menu.contains(event.target)) menu.open = false;
    });
  });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.menu-drop[open]').forEach(function (menu) { menu.open = false; });
    var toggle = document.getElementById('nav-toggle');
    if (toggle && toggle.checked) toggle.checked = false;
  });
  var form = document.querySelector('[data-lead-form]');
  if (!form) return;
  params.forEach(function (name) {
    var input = form.querySelector('[name="' + name + '"]');
    if (input && !input.value && stored[name]) input.value = stored[name];
  });
  var sourceUrl = form.querySelector('[name="source_url"]');
  if (sourceUrl) sourceUrl.value = window.location.href.slice(0, 500);
  var sourceDomain = form.querySelector('[name="source_domain"]');
  if (sourceDomain) sourceDomain.value = window.location.hostname.slice(0, 120);
  form.addEventListener('submit', function () {
    var button = form.querySelector('[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Küldés…';
    }
  });
}());
