import { DataShape } from './datashapes';
import * as knex from 'knex';

/**
 * Experimental: Build knex table definition from DataShape
 * @param DataShape
 */
export function toKnex(DataShape, tableName) {
  const { fields } = DataShape;

  let definition = '';
  definition += `db.schema.createTable('${tableName}', table => {\n`
  definition += `  table.increments();\n`

  for (const name in fields) {
    const {
      type,
      notNull,
      maxLength,
      notNegative,
      defaultTo,
      unique,
      references,
    } = fields[name].constraints;
    definition += `  table.${type}('${name}'${maxLength ? `, ${maxLength}` : ''})`;
    definition += notNull ? '.notNullable()' : ''
    definition += notNegative ? '.unsigned()' : '';
    definition += defaultTo ? `.defaultTo(${JSON.stringify(defaultTo)})` : ''
    definition += unique ? '.unique()' : ''
    definition += references ? `.references('${references}')` : ''
    definition += ';\n';
  }
  definition += ')};\n'
  return definition;
}
