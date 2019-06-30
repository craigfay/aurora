import { strict as assert } from 'assert';

export function enforceArgumentType(name, arg, type) {
  if (typeof arg !== type)
  throw new Error(`Argument "${name}" must be of type ${type}. Received type ${typeof arg}`);
}
