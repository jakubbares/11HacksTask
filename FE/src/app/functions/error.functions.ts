import {CallProperties} from "../models/models";

export function addToErrorMap(map, call: CallProperties) {
  if (!map.hasOwnProperty(call.dataType)) {
    map[call.dataType] = call;
  }
}

export function createErrorMessage(call: CallProperties) {
  return `${call.dataType} data for entity ${call.entityName} is not available.`;
}
