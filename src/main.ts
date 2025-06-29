"use strict";

import hmpl from "hmpl-js";
import { HMPLInitFunction, HMPLTemplateConfig } from "./types";

const INIT_ERROR = `InitError`;
const TEMPLATE_ERROR = `TemplateError`;
const DATA_HMPL_ATTR = "data-hmpl";
const HMPL_ATTR = "hmpl";
const DATA_CONFIG_ID_ATTR = "data-config-id";
const CONFIG_ID_ATTR = "configId";

/**
 * Throws a new error with the provided message.
 * @param text - The error message.
 */
const createError = (text: string) => {
  throw new Error(text);
};

/**
 * Checks if a value is an object (not null, not array).
 * @param val - The value to check.
 */
const checkObject = (val: any): boolean => {
  return typeof val === "object" && !Array.isArray(val) && val !== null;
};

/**
 * Validates the HMPLTemplateConfig object.
 * @param option - The option to validate.
 */
const validateInitOption = (option: any): void => {
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

/**
 * Validates that there are no duplicate IDs in the options array.
 * @param options - The array of options to validate.
 */
const validateDuplicateIds = (options: HMPLTemplateConfig[]): void => {
  const ids: string[] = [];

  for (let i = 0; i < options.length; i++) {
    const id = options[i].id;
    if (ids.indexOf(id) > -1) {
      createError(`${INIT_ERROR}: ID with value "${id}" already exists`);
    } else {
      ids.push(id);
    }
  }
};

let initialized = false;
const initOptionsMap = new Map<string, HMPLTemplateConfig>();

const onDocumentLoad = (callback: () => void): void => {
  const isDocumentLoaded =
    document.readyState === "complete" || document.readyState === "interactive";
  void (isDocumentLoaded
    ? callback()
    : document.addEventListener("DOMContentLoaded", callback));
};

const mountTemplates = (): void => {
  const templates = document.querySelectorAll(
    `template[${DATA_HMPL_ATTR}], template[${HMPL_ATTR}]`
  );

  for (let i = 0; i < templates.length; i++) {
    const template = templates[i] as HTMLTemplateElement;

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
    let option: HMPLTemplateConfig | undefined = undefined;

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

    const templateHTML = template.innerHTML as string;

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
    const templateFn = hmpl.compile(templateHTML, compileOptions);
    const result = templateFn(templateFunctionOptions);

    if (result && result.response) {
      template.replaceWith(result.response);
    }
  }
};

/**
 * Initializes the HMPL DOM system with configuration options.
 * Can only be called once. Subsequent calls will throw an error.
 *
 * @param options - Array of configuration objects for different template options.
 * Each option should have a unique ID and contain compile options and template function options.
 *
 * @throws {Error} When called more than once
 * @throws {Error} When duplicate IDs are found in options
 * @throws {Error} When option structure is not valid
 *
 * @example
 * ```typescript
 * init([
 *   {
 *     id: "user-card",
 *     value: {
 *       compile: { memo: true },
 *       templateFunction: { credentials: "include" }
 *     }
 *   }
 * ]);
 * ```
 */
export const init: HMPLInitFunction = (
  configs: HMPLTemplateConfig[] = []
): void => {
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
