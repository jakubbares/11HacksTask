import {FieldType} from "../models/models";

export function fieldSize(type: FieldType) {
  switch(type) {
    case 'penalty':
      return { width: 800, height: 600 };
    case 'vertical':
      return { width: 762.5, height: 1132.6 };
    default:
      return { width: 771, height: 520 };
  }
}

export function fieldDimensions(type: FieldType) {
  switch(type) {
    case 'penalty':
      return { x: [0, 68], y: [105/2, 105]};
    case 'vertical':
      return {x: [0, 105], y: [0, 68]};
    default:
      return { x: [0, 105], y: [0, 68]};
  }
}
