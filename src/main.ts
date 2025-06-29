"use strict";

import hmpl from "hmpl-js";
import { HMPLInitFunction, HMPLInitOption } from "./types";

const INIT_ERROR = `InitError`;
const TEMPLATE_ERROR = `TemplateError`;

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
 * Validates the HMPLInitOption object.
 * @param option - The option to validate.
 */
const validateInitOption = (option: any): void => {
  if (!checkObject(option)) {
    createError(`${INIT_ERROR}: HMPLInitOption must be an object`);
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
const validateDuplicateIds = (options: HMPLInitOption[]): void => {
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
const initOptionsMap = new Map<string, HMPLInitOption>();

const onDocumentLoad = (callback: () => void): void => {
  const isDocumentLoaded =
    document.readyState === "complete" || document.readyState === "interactive";
  void (isDocumentLoaded
    ? callback()
    : document.addEventListener("DOMContentLoaded", callback));
};

const mountTemplates = (): void => {
  const templates = document.querySelectorAll("[data-hmpl], [hmpl]");

  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    const nestedElements = template.querySelectorAll("[data-hmpl], [hmpl]");
    if (nestedElements.length > 0) {
      createError(
        `${TEMPLATE_ERROR}: Nested template with data-hmpl is not allowed`
      );
    }

    const hasDataHmpl = template.hasAttribute("data-hmpl");
    const hasHmpl = template.hasAttribute("hmpl");
    if (hasDataHmpl && hasHmpl) {
      createError(
        `${TEMPLATE_ERROR}: Cannot use both data-hmpl and hmpl attributes`
      );
    }

    const hasDataOptionId = template.hasAttribute("data-option-id");
    const hasOptionId = template.hasAttribute("optionId");
    if (hasDataOptionId && hasOptionId) {
      createError(
        `${TEMPLATE_ERROR}: Cannot use both data-option-id and optionId attributes`
      );
    }

    const optionId =
      template.getAttribute("data-option-id") ||
      template.getAttribute("optionId");
    let option: HMPLInitOption | undefined = undefined;

    if (optionId) {
      option = initOptionsMap.get(optionId);
    }

    const templateClone = template.cloneNode(true) as Element;

    templateClone.removeAttribute("data-hmpl");
    templateClone.removeAttribute("hmpl");
    templateClone.removeAttribute("data-option-id");
    templateClone.removeAttribute("optionId");

    const templateHTML = templateClone.outerHTML;
    const compileOptions = option?.value.compileOptions || {};
    const templateFunctionOptions = option?.value.templateFunctionOptions || {};

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
 *       compileOptions: { memo: true },
 *       templateFunctionOptions: { credentials: "include" }
 *     }
 *   }
 * ]);
 * ```
 */
export const init: HMPLInitFunction = (options: HMPLInitOption[]): void => {
  if (initialized) {
    createError(`${INIT_ERROR}: init() can only be called once`);
  }
  initialized = true;

  validateDuplicateIds(options);

  for (let i = 0; i < options.length; i++) {
    const option = options[i];
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
