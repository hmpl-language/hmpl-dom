"use strict";

import hmpl, {
  HMPLCompileOptions,
  HMPLIdentificationRequestInit,
  HMPLRequestInit,
  HMPLRequestInitFunction
} from "hmpl-js";
import { HMPLInitFunction } from "./types";

let initialized = false;
let currentCompileOptions: HMPLCompileOptions | undefined;
let currecntTemplateFunctionOptions:
  | HMPLIdentificationRequestInit[]
  | HMPLRequestInit
  | HMPLRequestInitFunction
  | undefined;

function mountTemplates() {
  const templates = document.querySelectorAll("template[data-hmpl]");

  templates.forEach((template) => {
    const templateHTML = template.innerHTML;
    const templateFn = hmpl.compile(templateHTML, currentCompileOptions);
    const result = templateFn(currecntTemplateFunctionOptions).response;
    template.replaceWith(result);
  });
}

export const init: HMPLInitFunction = (
  compileOptions,
  templateFunctionOptions
) => {
  if (initialized) return;
  initialized = true;
  currentCompileOptions = compileOptions;
  currecntTemplateFunctionOptions = templateFunctionOptions;
  mountTemplates();
};

queueMicrotask(() => {
  if (!initialized) {
    mountTemplates();
  }
});
