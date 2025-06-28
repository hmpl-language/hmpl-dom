"use strict";

import {
  HMPLCompileOptions,
  HMPLIdentificationRequestInit,
  HMPLRequestInit,
  HMPLRequestInitFunction
} from "hmpl-js";

type HMPLInitOption = {
  id: string | number;
  value: {
    compileOptions?: HMPLCompileOptions;
    templateFunctionOptions?:
      | HMPLIdentificationRequestInit[]
      | HMPLRequestInit
      | HMPLRequestInitFunction;
  };
};

type HMPLInitFunction = (options: HMPLInitOption[]) => void;

export { HMPLInitFunction, HMPLInitOption };
