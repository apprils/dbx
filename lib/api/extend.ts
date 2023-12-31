
import type { Knex } from "knex";
import knex from "knex";

// If T is an array, get the type of member, else retain original
type UnwrapArrayMember<T> = T extends (infer M)[] ? M : T;

declare module "knex" {
  namespace Knex {
    interface QueryBuilder<TRecord, TResult> {

      find(): Promise<UnwrapArrayMember<TResult>>;
      find(column: string): Promise<UnwrapArrayMember<TResult>>;
      find(columns: string[]): Promise<UnwrapArrayMember<TResult>>;
      find(...columns: string[]): Promise<UnwrapArrayMember<TResult>>;

      selectRaw(raw: string): Knex.QueryBuilder<TRecord, TResult>;

      onConflictRaw(columns: string): Knex.OnConflictQueryBuilder<TRecord, TResult>;
      onConflictRaw(columns: string[]): Knex.OnConflictQueryBuilder<TRecord, TResult>;

      // sort of pluck but does not add column to select statement.
      // should be LAST statement!
      pick<T = any>(column: string): Promise<T | undefined>;

      minValue<TResult = any>(column: string | Knex.Raw): Promise<TResult | undefined>;
      maxValue<TResult = any>(column: string | Knex.Raw): Promise<TResult | undefined>;

      sumValue(column: string | Knex.Raw): Promise<number>;
      avgValue(column: string | Knex.Raw): Promise<number>;

      countRows(): Promise<number>;
      countDistinctRows(...columns: string[]): Promise<number>;

      satisfies<T>(): Knex.QueryBuilder<TRecord, T>;

    }
  }
}

// same as `first` but throws error if no record found
export const find = async function(
  this: Knex.QueryBuilder,
  ...args: any[]
) {

  const row = await this.first(...args)

  if (row) {
    return row
  }

  throw new Error(`${ this.table }: no record found by given params`)

}

export const selectRaw = function(
  this: Knex.QueryBuilder,
  raw: string,
) {
  return this.select(this.client.raw(raw))
}

// not exporting cause not supposed to be used in first place, chained only
const onConflictRaw = function(
  this: Knex.QueryBuilder,
  raw: string,
) {
  return this.onConflict(this.client.raw(raw))
}

export const pick = async function(
  this: Knex.QueryBuilder,
  column: string,
) {

  const result = await this

  if (!result) {
    return
  }

  if (Array.isArray(result)) {
    return result[0]?.[column]
  }

  return result[column]

}

export const minValue = async function <TResult = any>(
  this: Knex.QueryBuilder,
  column: string | Knex.Raw,
): Promise<TResult | undefined> {
  const [{ min }] = await this.min(column)
  return min
}

export const maxValue = async function <TResult = any>(
  this: Knex.QueryBuilder,
  column: string | Knex.Raw,
): Promise<TResult | undefined> {
  const [{ max }] = await this.max(column)
  return max
}

export const sumValue = async function(
  this: Knex.QueryBuilder,
  column: string | Knex.Raw,
): Promise<number> {
  const [{ sum }] = await this.sum(column)
  return Number(sum || 0)
}

export const avgValue = async function(
  this: Knex.QueryBuilder,
  column: string | Knex.Raw,
): Promise<number> {
  const [{ avg }] = await this.avg(column)
  return Number(avg || 0)
}

export const countRows = async function(
  this: Knex.QueryBuilder,
): Promise<number> {
  const [{ count }] = await countQueryBuilder(this).count({ count: "*" })
  return count
    ? Number(count)
    : 0
}

export const countDistinctRows = async function(
  this: Knex.QueryBuilder,
  ...columns: string[]
): Promise<number> {
  const [{ count }] = await countQueryBuilder(this).countDistinct(...columns)
  return count
    ? Number(count)
    : 0
}

function countQueryBuilder(queryBuilder: Knex.QueryBuilder) {

  const builder = queryBuilder
    .clone()
    .clear("columns") // dropping "columns" statements from query
    .clear("order") // dropping "order" statements from query

  return builder

}

export const satisfies = function(
  this: Knex.QueryBuilder,
) {
  return this
}

knex.QueryBuilder.extend("find", find)

knex.QueryBuilder.extend("selectRaw", selectRaw)
knex.QueryBuilder.extend("onConflictRaw", <any>onConflictRaw)

knex.QueryBuilder.extend("pick", pick)

knex.QueryBuilder.extend("minValue", <any>minValue)
knex.QueryBuilder.extend("maxValue", <any>maxValue)

knex.QueryBuilder.extend("sumValue", <any>sumValue)
knex.QueryBuilder.extend("avgValue", <any>avgValue)

knex.QueryBuilder.extend("countRows", <any>countRows)
knex.QueryBuilder.extend("countDistinctRows", <any>countDistinctRows)

knex.QueryBuilder.extend("satisfies", satisfies)

