import { strict as assert } from 'assert';

function field(name) {
  assert(typeof name == 'string');
  this.name = name;
  this.constraints = [];
  this.test = val => this.constraints.forEach(c => c(val));
}

export function string(name) {
  let f: any = new field(name);
  f.constraints.push(val => assert(typeof val == 'string'));

  f.maxLength = len => {
    f.constraints.push(val => {
      if (val.length > len) throw new Error(`${name} has a max length of ${len}`);
    });
  }

  return f;
}
