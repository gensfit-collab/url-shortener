#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1a6f807363fb8e1592b3c6851b3a699d082ca4699966af3941e84e3d07920802/contract';
import endContract from '../../snapshots/1a6f807363fb8e1592b3c6851b3a699d082ca4699966af3941e84e3d07920802/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Url',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('originalUrl', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('shortCode', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Url',
        constraint: 'Url_shortCode_key',
        columns: ['shortCode'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
