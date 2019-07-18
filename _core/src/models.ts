import { strict as assert } from 'assert';

function Field(name) {
  assert(typeof name == 'string');
  this.name = name;
  this.constraints = [];
  this.test = (val=null) => this.constraints.forEach(c => c(val));
}

const notNull = (name, val) => {
  if (val == null)
  throw new Error(`${name} must not be null`);
}
const minLength = (name, val, arg) => {
  if (val.length < arg)
  throw new Error(`${name} has a min length of ${arg}`)
}
const maxLength = (name, val, arg) => {
  if (val.length > arg)
  throw new Error(`${name} has a max length of ${arg}`)
}
const alphabetical = (name, val) => {
  if (false == /^[a-zA-Z]+$/.test(val))
  throw new Error(`${name} must only use alphabetical characters`);
}
const numeric = (name, val) => {
  if (false == /^\d+$/.test(val))
  throw new Error(`${name} must only use numeric characters`);
}

export function string(name) {
  let f: any = new Field(name);
  f.constraints.push(val => assert(val === null || typeof val == 'string'));

  f.constrain = (fn, ...args) => {
    f.constraints.push(val => fn(name, val, ...args));
    return f;
  }

  f.notNull = () => f.constrain(notNull);
  f.minLength = arg => f.constrain(minLength, arg)
  f.maxLength = arg => f.constrain(maxLength, arg)
  f.alphabetical = () => f.constrain(alphabetical)
  f.numeric = () => f.constrain(numeric)

  return f;
}

const notNegative = (name, val) => {
  if (val < 0)
  throw new Error(`${name} must not be negative`)
}
const notZero = (name, val) => {
  if (val == 0)
  throw new Error(`${name} must not be 0`)
}

export function integer(name) {
  let f: any = new Field(name);
  f.constraints.push(val => assert(val === null || Number.isInteger(val)));

  f.constrain = fn => {
    f.constraints.push(val => fn(name, val));
    return f;
  }

  f.notNull = () => f.constrain(notNull);
  f.notNegative = () => f.constrain(notNegative);
  f.notZero = () => f.constrain(notZero);

  return f;
}

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
