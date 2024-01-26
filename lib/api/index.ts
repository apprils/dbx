import type { Knex } from "knex"

import type {
  Config,
  ConfigWithoutPrimaryKey,
  Instance,
  InstanceWithoutPrimaryKey,
  ID,
  TruncateOpts,
  Returning,
  QueryBuilder,
  CompositeReturn,
} from "./@types"

import * as extend from "./extend"
import "./@types.knex"

const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom")

export * from "./@types"

export default function dbx<
  TTable extends Knex.TableNames = never,
  TExtra = unknown,
>(
  config: Config,
  extra?: TExtra,
): CompositeReturn<Instance<TTable>, TTable> & TExtra {
  const { tableName, primaryKey } = config

  const connection = config.connection.withUserParams({
    tableName,
    primaryKey,
  })

  const instance: Instance<TTable> = {
    ...extend,
    ...extra,

    connection,
    tableName,
    primaryKey,

    get knex(): QueryBuilder<TTable> {
      return connection(tableName)
    },

    raw: (raw: string, bindings: any[]) => connection.raw(raw, bindings),

    now: () => connection.raw("now()"),

    whereId(id) {
      return connection(tableName).where(primaryKey, id) as QueryBuilder<TTable>
    },

    async create(data: any, returning: Returning = "*") {
      const [rows] = await connection(tableName)
        .insert(data)
        .returning(returning)

      return rows
    },

    async createMany(data: any[], returning: Returning = "*") {
      const rows = []

      for (const entry of data) {
        const [row] = await connection(tableName)
          .insert(entry)
          .returning(returning)

        rows.push(row)
      }

      return rows
    },

    save(id: ID, data: any, returning: Returning = "*") {
      return connection(tableName)
        .where(primaryKey, id)
        .update(data)
        .returning(returning)
    },

    saveMany(ids: ID[], data: any, returning: Returning = "*") {
      return connection(tableName)
        .whereIn(primaryKey, ids.filter((e) => e) as string[])
        .update(data)
        .returning(returning)
    },

    batchInsert(rows: any[], batchSize = 1000) {
      return connection.batchInsert(tableName, rows as any, batchSize)
    },

    truncateCascade({ restartIdentity = false }: TruncateOpts = {}) {
      return connection.raw(
        `truncate table ?? ${restartIdentity ? "restart identity" : ""} cascade`,
        tableName,
      )
    },

    toString: () => tableName,
  }

  // using inner target to avoid infinite loops
  const proxyTarget: any = function () {}

  proxyTarget[customInspectSymbol] = () => tableName

  const proxy: unknown = new Proxy(
    proxyTarget,
    proxyHandler(tableName, connection, instance),
  )

  return proxy as CompositeReturn<Instance<TTable>, TTable> & TExtra
}

export function withoutPrimaryKey<
  TTable extends Knex.TableNames = never,
  TExtra = unknown,
>(
  config: ConfigWithoutPrimaryKey,
  extra?: TExtra,
): CompositeReturn<InstanceWithoutPrimaryKey<TTable>, TTable> & TExtra {
  const { tableName } = config

  const connection = config.connection.withUserParams({
    tableName,
  })

  const instance: InstanceWithoutPrimaryKey<TTable> = {
    ...extend,
    ...extra,

    connection,
    tableName,

    get knex(): QueryBuilder<TTable> {
      return connection(tableName)
    },

    raw: (raw: string, bindings: any[]) => connection.raw(raw, bindings),

    now: () => connection.raw("now()"),

    async create(data: any, returning: Returning = "*") {
      const [rows] = await connection(tableName)
        .insert(data)
        .returning(returning)

      return rows
    },

    async createMany(data: any[], returning: Returning = "*") {
      const rows = []

      for (const entry of data) {
        const [row] = await connection(tableName)
          .insert(entry)
          .returning(returning)

        rows.push(row)
      }

      return rows
    },

    batchInsert(rows: any[], batchSize = 1000) {
      return connection.batchInsert(tableName, rows as any, batchSize)
    },

    truncateCascade({ restartIdentity = false }: TruncateOpts = {}) {
      return connection.raw(
        `
        truncate table ??
        ${restartIdentity ? "restart identity" : ""}
        cascade
      `,
        tableName,
      )
    },

    toString: () => tableName,
  }

  // using inner target to avoid infinite loops
  const proxyTarget: any = function () {}

  proxyTarget[customInspectSymbol] = () => tableName

  const proxy: unknown = new Proxy(
    proxyTarget,
    proxyHandler(tableName, connection, instance),
  )

  return proxy as CompositeReturn<InstanceWithoutPrimaryKey<TTable>, TTable> &
    TExtra
}

function proxyHandler(tableName: string, connection: any, instance: any) {
  return {
    get(_: any, prop: any) {
      if (prop in instance) {
        if (typeof instance[prop] === "function") {
          return function (this: any) {
            return instance[prop].apply(this, arguments)
          }
        } else {
          return instance[prop]
        }
      }

      const conn = connection(tableName)

      if (typeof conn[prop] === "function") {
        return function (...args: any[]) {
          return conn[prop](...args)
        }
      } else {
        return conn[prop]
      }
    },
  }
}
