import hmpl from "hmpl-js";

const hmplDOM = (() => {
  let initialized = false;
  let initParams = () => ({});

  function mountTemplates() {
    const templates = document.querySelectorAll("template[data-hmpl]");

    templates.forEach((template) => {
      const templateHTML = template.innerHTML;
      const templateFn = hmpl.compile(templateHTML);
      const result = templateFn(initParams).response;
      template.replaceWith(result);
    });
  }

  function init(paramsFn = () => ({})) {
    if (initialized) return;
    initialized = true;
    initParams = paramsFn;
    mountTemplates();
  }

  queueMicrotask(() => {
    if (!initialized) {
      mountTemplates();
    }
  });

  return { init };
})();

export default hmplDOM;
