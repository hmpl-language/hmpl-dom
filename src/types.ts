"use strict";

import {
  HMPLCompileOptions,
  HMPLIdentificationRequestInit,
  HMPLRequestInit,
  HMPLRequestInitFunction
} from "hmpl-js";

/**
 * Configuration object for a single template option.
 * Contains an ID and associated value with compile and template function options.
 */
type HMPLTemplateConfig = {
  /**
   * Unique identifier for this option configuration.
   * Must be a string and should match the option-id attribute in HTML templates.
   */
  id: string;
  /**
   * Configuration value containing compile options and template function options.
   */
  value: {
    /**
     * Options passed to the HMPL compile function.
     * Controls how templates are compiled and processed.
     */
    compile?: HMPLCompileOptions;
    /**
     * Options passed to the template function during execution.
     * Can be a single request init object, a function, or an array of identification request init objects.
     */
    templateFunction?:
      | HMPLIdentificationRequestInit[]
      | HMPLRequestInit
      | HMPLRequestInitFunction;
  };
};

/**
 * Function type for initializing the HMPL DOM system.
 * Takes an array of configuration options and sets up the template processing system.
 * Can only be called once per page lifecycle.
 */
type HMPLInitFunction = (configs: HMPLTemplateConfig[]) => void;

export { HMPLInitFunction, HMPLTemplateConfig };
