import { Model } from './models';
import * as knex from 'knex';

/**
 * Experimental: Build knex table definition from Model
 * @param model
 */
export function toKnex(model) {
  const { name, fields } = model;

  let definition = '';
  definition += `db.schema.createTable('${name}', table => {\n`
  definition += `  table.increments();\n`

  for (const name in fields) {
    const { type, notNull, maxLength } = fields[name].flags;
    definition += `  table.${type}('${name}'${maxLength ? `, ${maxLength}` : ''})`
    definition += notNull ? '.notNullable()' : ''
    definition += ';\n';
  }
  definition += ')};\n'
  return definition;
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