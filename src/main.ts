"use strict";

import hmpl from "hmpl-js";
import { HMPLInitFunction, HMPLInitOption } from "./types";

const INIT_ERROR = `InitError`;

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

  if (typeof option.id !== "string" && typeof option.id !== "number") {
    createError(`${INIT_ERROR}: ID must be a string or a number`);
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
  const ids: (string | number)[] = [];

  for (let i = 0; i < options.length; i++) {
    const id = options[i].id;
    if (ids.indexOf(id) > -1) {
      const isIdString = typeof id === "string";
      createError(
        `${INIT_ERROR}: ID with value ${isIdString ? `"${id}"` : id} already exists`
      );
    } else {
      ids.push(id);
    }
  }
};

let initialized = false;
const optionurations = new Map<string | number, HMPLInitOption>();

const onDocumentLoad = (callback: () => void): void => {
  const isDocumentLoaded =
    document.readyState === "complete" || document.readyState === "interactive";
  void (isDocumentLoaded
    ? callback()
    : document.addEventListener("DOMContentLoaded", callback));
};

const mountTemplates = (): void => {
  const templates = document.querySelectorAll(
    "template[data-hmpl], TEMPLATE[data-hmpl]"
  );

  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    const templateId = template.getAttribute("data-hmpl-id");
    let option: HMPLInitOption | undefined = undefined;

    if (templateId) {
      option = optionurations.get(templateId);
      if (!option) {
        console.warn(`HMPL optionuration not found for id: ${templateId}`);
      }
    }

    const templateHTML = template.innerHTML;
    const compileOptions = option?.value.compileOptions || {};
    const templateFunctionOptions = option?.value.templateFunctionOptions || {};

    const templateFn = hmpl.compile(templateHTML, compileOptions);
    const result = templateFn(templateFunctionOptions).response;
    if (result) {
      template.replaceWith(result);
    }
  }
};

export const init: HMPLInitFunction = (options: HMPLInitOption[]): void => {
  if (initialized) return;
  initialized = true;

  validateDuplicateIds(options);

  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    validateInitOption(option);
    optionurations.set(option.id, option);
  }

  onDocumentLoad(mountTemplates);
};

queueMicrotask(() => {
  if (!initialized) {
    onDocumentLoad(mountTemplates);
  }
});
