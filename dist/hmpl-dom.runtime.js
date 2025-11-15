"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, "default", { value: mod, enumerable: true })
      : target,
    mod
  )
);
var __toCommonJS = (mod) =>
  __copyProps(__defProp({}, "__esModule", { value: true }), mod);

var main_exports = {};
__export(main_exports, {
  init: () => init
});
module.exports = __toCommonJS(main_exports);
var import_hmpl_js = __toESM(require("hmpl-js"));
var INIT_ERROR = `InitError`;
var TEMPLATE_ERROR = `TemplateError`;
var DATA_HMPL_ATTR = "data-hmpl";
var HMPL_ATTR = "hmpl";
var DATA_CONFIG_ID_ATTR = "data-config-id";
var CONFIG_ID_ATTR = "configId";
var createError = (text) => {
  throw new Error(text);
};
var checkObject = (val) => {
  return typeof val === "object" && !Array.isArray(val) && val !== null;
};
var validateInitOption = (option) => {
  if (!checkObject(option)) {
    createError(`${INIT_ERROR}: HMPLTemplateConfig must be an object`);
  }
  if (!option.hasOwnProperty("id") || !option.hasOwnProperty("value")) {
    createError(`${INIT_ERROR}: Missing "id" or "value" property`);
  }
  if (typeof option.id !== "string") {
    createError(`${INIT_ERROR}: ID must be a string`);
  }
  if (!checkObject(option.value)) {
    createError(`${INIT_ERROR}: Value must be an object`);
  }
};
var validateDuplicateIds = (options) => {
  const ids = [];
  for (let i = 0; i < options.length; i++) {
    const id = options[i].id;
    if (ids.indexOf(id) > -1) {
      createError(`${INIT_ERROR}: ID with value "${id}" already exists`);
    } else {
      ids.push(id);
    }
  }
};
var initialized = false;
var initOptionsMap = /* @__PURE__ */ new Map();
var onDocumentLoad = (callback) => {
  const isDocumentLoaded =
    document.readyState === "complete" || document.readyState === "interactive";
  void (isDocumentLoaded
    ? callback()
    : document.addEventListener("DOMContentLoaded", callback));
};
var mountTemplates = () => {
  const templates = document.querySelectorAll(
    `template[${DATA_HMPL_ATTR}], template[${HMPL_ATTR}]`
  );
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    const hasDataHmpl = template.hasAttribute(DATA_HMPL_ATTR);
    const hasHmpl = template.hasAttribute(HMPL_ATTR);
    if (hasDataHmpl && hasHmpl) {
      createError(
        `${TEMPLATE_ERROR}: Cannot use both ${DATA_HMPL_ATTR} and ${HMPL_ATTR} attributes`
      );
    }
    const hasDataConfigId = template.hasAttribute(DATA_CONFIG_ID_ATTR);
    const hasConfigId = template.hasAttribute(CONFIG_ID_ATTR);
    if (hasDataConfigId && hasConfigId) {
      createError(
        `${TEMPLATE_ERROR}: Cannot use both ${DATA_CONFIG_ID_ATTR} and ${CONFIG_ID_ATTR} attributes`
      );
    }
    const configId =
      template.getAttribute(DATA_CONFIG_ID_ATTR) ||
      template.getAttribute(CONFIG_ID_ATTR);
    let option = void 0;
    if (configId === "") {
      createError(
        `${TEMPLATE_ERROR}: configId cannot be empty. Use ${DATA_CONFIG_ID_ATTR} or ${CONFIG_ID_ATTR} attribute`
      );
    }
    if (configId) {
      option = initOptionsMap.get(configId);
      if (!option) {
        createError(
          `${TEMPLATE_ERROR}: Option with id "${configId}" not found. Make sure to define it in init() call`
        );
      }
    }
    const templateHTML = template.innerHTML;
    if (template.content.children.length > 1) {
      createError(
        `${TEMPLATE_ERROR}: Template must contain exactly one root element, found ${template.content.children.length}`
      );
    }
    if (template.content.children.length === 0) {
      createError(
        `${TEMPLATE_ERROR}: Template must contain at least one element`
      );
    }
    const compileOptions = option?.value.compile || {};
    const templateFunctionOptions = option?.value.templateFunction || {};
    const templateFn = import_hmpl_js.default.compile(
      templateHTML,
      compileOptions
    );
    const result = templateFn(templateFunctionOptions);
    if (result && result.response) {
      template.replaceWith(result.response);
    }
  }
};
var init = (configs = []) => {
  if (initialized) {
    createError(`${INIT_ERROR}: init() can only be called once`);
  }
  initialized = true;
  validateDuplicateIds(configs);
  for (let i = 0; i < configs.length; i++) {
    const option = configs[i];
    validateInitOption(option);
    initOptionsMap.set(option.id, option);
  }
  onDocumentLoad(mountTemplates);
};
queueMicrotask(() => {
  if (!initialized) {
    onDocumentLoad(mountTemplates);
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    init
  });
