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

  f.notNull = () => {
    f.constraints.push(val => {
      if (val == null)
      throw new Error(`${name} must not be null`);
    })
    return f;
  }

  f.minLength = len => {
    f.constraints.push(val => {
      if (val.length < len)
      throw new Error(`${name} has a min length of ${len}`);
    });
    return f;
  }

  f.maxLength = len => {
    f.constraints.push(val => {
      if (val.length > len)
      throw new Error(`${name} has a max length of ${len}`);
    });
    return f;
  }

  f.alphabetical = () => {
    f.constraints.push(val => {
      if (false == /^[a-zA-Z]+$/.test(val))
      throw new Error(`${name} must only use alphabetical characters`);
    })
    return f;
  }

  f.constrain = fn => {
    f.constraints.push(val => fn(name, val));
    return f;
  }

  return f;
}

export function integer(name) {
  let f: any = new Field(name);
  f.constraints.push(val => assert(val === null || Number.isInteger(val)));

  f.notNull = () => {
    f.constraints.push(val => {
      if (val == null)
      throw new Error(`${name} must not be null`);
    })
    return f;
  }

  f.notNegative = () => {
    f.constraints.push(val => {
      if (val < 0)
      throw new Error(`${name} must not be negative`)
    })
    return f;
  }

  f.notZero = () => {
    f.constraints.push(val => {
      if (val == 0)
      throw new Error(`${name} must not be 0`)
    })
    return f;
  }

  f.constrain = fn => {
    f.constraints.push(val => fn(name, val));
    return f;
  }
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
