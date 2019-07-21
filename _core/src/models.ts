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
  this.tests = [];
  this.constraints = {};
  this.constrain = constrain.bind(this);
  this.constrainWithArg = constrainWithArg.bind(this);
  this.test = (val=null) => this.tests.forEach(c => c(name, val));
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
 * Constraints available to boolean fields
 */

const booleanFieldType = () => (name, val) => {
  if (val != null && typeof val != 'boolean')
  throw new Error(`${name} must be a boolean. Received ${typeof val}`);
}

/**
 * The constrain function attached to every field type
 * which allows custom arbitrary constraints
 */
function constrain(fn) {
  this.tests.push(fn)
  return this;
}

/**
 * The constrainWithArg function attached to every field type
 * which allows custom arbitrary constraints that take an argument
 */
function constrainWithArg(fn) {
  return (arg=true) => {
    this.constraints[fn.name] = arg;
    this.tests.push(fn(arg))
    return this;
  }
}

/**
 * String Field
 */

export function string(name) {
  let f: any = new Field(name);
  f.constraints.type = 'string'
  f.constrain(stringFieldType());

  f.notNull = f.constrainWithArg(notNull)
  f.minLength = f.constrainWithArg(minLength);
  f.maxLength = f.constrainWithArg(maxLength);
  f.alphabetical = f.constrainWithArg(alphabetical)
  f.numeric = f.constrainWithArg(numeric)
  return f;
}

/**
 * Integer Field
 */

export function integer(name) {
  let f: any = new Field(name);
  f.constraints.type = 'integer';
  f.constrain(integerFieldType());

  f.notNull = f.constrainWithArg(notNull);
  f.notNegative = f.constrainWithArg(notNegative);
  f.notZero = f.constrainWithArg(notZero);
  f.range = f.constrainWithArg(range);
  return f;
}

/**
 * Integer Field
 */

export function boolean(name) {
  let f: any = new Field(name);
  f.constraints.type = 'boolean';
  f.constrain(booleanFieldType());

  f.notNull = f.constrainWithArg(notNull);
  return f;
}
