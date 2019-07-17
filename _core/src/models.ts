import { strict as assert } from 'assert';

function Field(name) {
  assert(typeof name == 'string');
  this.name = name;
  this.constraints = [];
  this.test = (val=null) => this.constraints.forEach(c => c(val));
}

export function string(name) {
  let f: any = new Field(name);
  f.constraints.push(val => assert(val === null || typeof val == 'string'));

  f.maxLength = len => {
    f.constraints.push(val => {
      if (val.length > len) throw new Error(`${name} has a max length of ${len}`);
    });
  }

  f.notNull = () => {
    f.constraints.push(val => {
      if (val == null) throw new Error(`${name} must not be null`)
    })
  }
  return f;
}
