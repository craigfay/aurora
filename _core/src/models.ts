import { strict as assert } from 'assert';

/**
 * Models can be used to define complex data structures
 * that have logical constraints, in addition to type constraints
 */

/**
 * Models are made up of Fields, which are made up of Constraints
 * See models.test.ts for examples of how Models are composed
 */

export function Model(...fields) {
  this.fields = {}
  fields.forEach(f => {
    const { name, constraints, test } = f;
    this.fields[name] = { constraints, test };
  });

  this.test = obj => {
    Object.keys(obj).forEach(name => this.fields[name].test(obj[name]));
  }
}

function Field(name) {
  assert(typeof name == 'string');
  this.name = name;
  this.constraints = [];
  this.test = (val=null) => this.constraints.forEach(c => c(name, val));
}

/**
 * Generic constraints that are available to multiple field types
 */

const genericNotNull = () => function notNull(name, val) {
  if (val == null)
  throw new Error(`${name} must not be null`);
}

/**
 * Constraints available to string fields
 */

const stringFieldType = () => function fieldType(name, val) {
  if (val != null && typeof val != 'string')
  throw new Error(`${name} must be a string. Received ${typeof val}`);
}
const stringLength = arg => function length(name, val) {
  if (val.length != arg)
  throw new Error(`${name} must be exactly ${arg} characters long`)
}
const stringMinLength = arg => function minLength(name, val) {
  if (val.length < arg)
  throw new Error(`${name} has a min length of ${arg}`)
}
const stringMaxLength = arg => function maxLength(name, val) {
  if (val.length > arg)
  throw new Error(`${name} has a max length of ${arg}`)
}
const stringAlphabetical = () =>  function alphabetical(name, val) {
  if (false == /^[a-zA-Z]+$/.test(val))
  throw new Error(`${name} must only use alphabetical characters`);
}
const stringNumeric = () => function numeric(name, val) {
  if (false == /^\d+$/.test(val))
  throw new Error(`${name} must only use numeric characters`);
}

/**
 * Constraints available to integer fields
 */

const integerFieldType = () => function fieldType(name, val) {
  if (val != null && !Number.isInteger(val))
  throw new Error(`${name} must be an integer. Received ${typeof val}`);
}
const integerNotNegative = () => function notNegative(name, val) {
  if (val < 0)
  throw new Error(`${name} must not be negative`)
}
const integerNotZero = () => function notZero(name, val) {
  if (val == 0)
  throw new Error(`${name} must not be 0`)
}
const integerRange = (...args) => function range(name, val) {
  const [min, max] = args;
  if (val < min || val > max)
  throw new Error(`${name} must be between ${min} and ${max}`)
}

/**
 * String Field
 */

export function string(name) {
  let f: any = new Field(name);
  f.constrain = fn => {
    f.constraints.push(fn)
    return f;
  }
  f.constrain(stringFieldType());
  f.notNull = () => f.constrain(genericNotNull());
  f.length = arg => f.constrain(stringLength(arg));
  f.minLength = arg => f.constrain(stringMinLength(arg));
  f.maxLength = arg => f.constrain(stringMaxLength(arg));
  f.alphabetical = () => f.constrain(stringAlphabetical())
  f.numeric = () => f.constrain(stringNumeric())
  return f;
}

/**
 * Integer Field
 */

export function integer(name) {
  let f: any = new Field(name);
  f.constrain = fn => {
    f.constraints.push(fn)
    return f;
  }
  f.constrain(integerFieldType());
  f.notNull = () => f.constrain(genericNotNull());
  f.notNegative = () => f.constrain(integerNotNegative());
  f.notZero = () => f.constrain(integerNotZero());
  f.range = (...args) => f.constrain(integerRange(...args))
  return f;
}
