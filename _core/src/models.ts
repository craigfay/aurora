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
  this.flags = {};
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
const notNull = () => (name, val) => {
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
const minLength = arg => (name, val) => {
  if (val.length < arg)
  throw new Error(`${name} has a min length of ${arg}`)
}
const maxLength = arg => (name, val) => {
  if (val.length > arg)
  throw new Error(`${name} has a max length of ${arg}`)
}
const alphabetical = () => (name, val) => {
  if (false == /^[a-zA-Z]+$/.test(val))
  throw new Error(`${name} must only use alphabetical characters`);
}
const numeric = () => (name, val) => {
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
const notNegative = () => (name, val) => {
  if (val < 0)
  throw new Error(`${name} must not be negative`)
}
const notZero = () => (name, val) => {
  if (val == 0)
  throw new Error(`${name} must not be 0`)
}
const range = (arg) => (name, val) => {
  const [min, max] = arg;
  if (val < min || val > max)
  throw new Error(`${name} must be between ${min} and ${max}`)
}

/**
 * String Field
 */

function flagAndConstrain(fn) {
  return function(arg) {
    this.flags[fn.name] = arg == undefined ? true : arg;
    return this.constrain(fn(arg));
  }
}

export function string(name) {
  let f: any = new Field(name);
  f.flags.type = 'string'

  f.constrain = constrain.bind(f);
  f.constrain(stringFieldType());
  const flag = flagAndConstrain.bind(f);

  f.notNull = flag(notNull)
  f.minLength = flag( minLength);
  f.maxLength = flag(maxLength);
  f.alphabetical = flag(alphabetical)
  f.numeric = flag(numeric)
  return f;
}

/**
 * Integer Field
 */

export function integer(name) {
  let f: any = new Field(name);
  f.flags.type = 'integer';

  f.constrain = constrain.bind(f);
  f.constrain(integerFieldType());
  const flag = flagAndConstrain.bind(f);

  f.notNull = flag(notNull);
  f.notNegative = flag(notNegative);
  f.notZero = flag(notZero);
  f.range = flag(range);
  return f;
}
