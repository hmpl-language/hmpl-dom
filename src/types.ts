"use strict";

import {
  HMPLCompileOptions,
  HMPLIdentificationRequestInit,
  HMPLRequestInit,
  HMPLRequestInitFunction
} from "hmpl-js";

type HMPLInitFunction = (
  compileOptions?: HMPLCompileOptions,
  templateFunctionOptions?:
    | HMPLIdentificationRequestInit[]
    | HMPLRequestInit
    | HMPLRequestInitFunction
) => void;

export { HMPLInitFunction };
