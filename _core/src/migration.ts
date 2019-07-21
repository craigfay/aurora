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
    const { type, notNull, maxLength, unique } = fields[name].constraints;
    definition += `  table.${type}('${name}'${maxLength ? `, ${maxLength}` : ''})`
    definition += notNull ? '.notNullable()' : ''
    definition += unique ? '.unique()' : ''
    definition += ';\n';
  }
  definition += ')};\n'
  return definition;
}
