import { enforceArgumentType } from './util';

/**
 * Models can be used to define complex data structures
 * that have logical constraints, in addition to type constraints
 */

/**
 * Models are made up of Fields, which are made up of Constraints
 * See models.test.ts for examples of how Models are composed
 */

export function Model(name:string, ...fields) {
  enforceArgumentType('name', name, 'string');
  this.name = name;
  this.fields = {}
  fields.forEach(f => {
    const { name, ...rest } = f;
    this.fields[name] = { ...rest };
  });

  this.test = obj => {
    Object.keys(obj).forEach(name => this.fields[name].test(obj[name]));
  }
}

/**
 * Used as a base class for concrete field types
 * @param name
 */
function Field(name:string) {
  enforceArgumentType('name', name, 'string');
  this.name = name;
  this.constraints = [];
  this.args = {};
  this.test = (val=null) => this.constraints.forEach(c => c(name, val));
}

/**
 * The constrain function attached to every field type
 * which allows custom arbitrary constraints
 * @param fn will receive (name, val) of a field, and maybe throw
 */
function constrain(fn) {
  this.constraints.push(fn)
  return this;
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

const stringFieldType = () => (name, val) => {
  if (val != null && typeof val != 'string')
  throw new Error(`${name} must be a string. Received ${typeof val}`);
}
const stringMinLength = arg => (name, val) => {
  if (val.length < arg)
  throw new Error(`${name} has a min length of ${arg}`)
}
const stringMaxLength = arg => (name, val) => {
  if (val.length > arg)
  throw new Error(`${name} has a max length of ${arg}`)
}
const stringAlphabetical = () => (name, val) => {
  if (false == /^[a-zA-Z]+$/.test(val))
  throw new Error(`${name} must only use alphabetical characters`);
}
const stringNumeric = () => (name, val) => {
  if (false == /^\d+$/.test(val))
  throw new Error(`${name} must only use numeric characters`);
}

/**
 * Constraints available to integer fields
 */

const integerFieldType = () => (name, val) => {
  if (val != null && !Number.isInteger(val))
  throw new Error(`${name} must be an integer. Received ${typeof val}`);
}
const integerNotNegative = () => (name, val) => {
  if (val < 0)
  throw new Error(`${name} must not be negative`)
}
const integerNotZero = () => (name, val) => {
  if (val == 0)
  throw new Error(`${name} must not be 0`)
}
const integerRange = (...args) => (name, val) => {
  const [min, max] = args;
  if (val < min || val > max)
  throw new Error(`${name} must be between ${min} and ${max}`)
}

/**
 * String Field
 */

export function string(name) {
  let f: any = new Field(name);
  f.type = 'string'
  f.constrain = constrain.bind(f);
  f.constrain(stringFieldType());
  f.notNull = () => f.constrain(genericNotNull());

  // Length constraint args are necessary for database table creation
  f.minLength = arg => {
    f.args.minLength = arg;
    return f.constrain(stringMinLength(arg));
  }
  f.maxLength = arg => {
    f.args.maxLength = arg;
    return f.constrain(stringMaxLength(arg));
  }
  
  f.alphabetical = () => f.constrain(stringAlphabetical())
  f.numeric = () => f.constrain(stringNumeric())
  return f;
}

/**
 * Integer Field
 */

export function integer(name) {
  let f: any = new Field(name);
  f.type = 'integer';
  f.constrain = constrain.bind(f);
  f.constrain(integerFieldType());
  f.notNull = () => f.constrain(genericNotNull());
  f.notNegative = () => f.constrain(integerNotNegative());
  f.notZero = () => f.constrain(integerNotZero());
  f.range = (...args) => f.constrain(integerRange(...args))
  return f;
}
