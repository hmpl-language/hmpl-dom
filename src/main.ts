import hmpl from "hmpl-js";
const templates = document.querySelectorAll("template[data-hmpl]");

templates.forEach((template) => {
  const templateHTML = template.innerHTML;
  const templateFn = hmpl.compile(templateHTML);
  const result = templateFn(() => ({})).response;
  template.replaceWith(result as any);
});
