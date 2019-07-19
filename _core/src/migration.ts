import { Model } from './models';
import * as knex from 'knex';

export function toKnex(model) {
  const { name, fields } = model;

  let definition = '';
  definition += `db.schema.createTable('${name}', table => {\n`
  definition += `  table.increments();\n`

  for (const name in fields) {
    const { type, constraints } = fields[name];
    definition += `  table.${type}('${name}')`
    // notNull
    if (constraints.find(c => c.name == 'notNull')) {
      definition += '.notNullable()'
    }
    definition += ';\n';
  }
  definition += ')};\n'
  return definition;
}

function fromModels(...models)  {
  
  const tableDefinitions = models.map(toKnex)

  const up = async db => {
    db.schema.createTable()
  }
}

export const Migration = {
  fromModels,
}

/**
 * Users Migration
 */
const usersMigration = {
  up: async db => {
    return db.schema.createTable('users', (table) => {
      table.increments();
      table.string('username').unique().notNullable();
      table.string('password').notNullable();
    });
  },
  down: async db => {
    return db.schema.dropTableIfExists('users');
  }
}