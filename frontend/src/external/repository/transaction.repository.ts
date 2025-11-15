import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { db } from "../client/database/client";
import type * as schema from "../client/database/schema";
import type { ITransactionManager } from "../domain/transaction/transaction-manager.interface";

// Drizzleのトランザクション型を定義
export type DbTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

// DBクライアントまたはトランザクションの型（Repository内で使用）
export type DbClient = typeof db | DbTransaction;

/**
 * TransactionRepository
 * トランザクション管理の実装クラス
 * ITransactionManagerインターフェースを実装し、Service層に提供
 */
class TransactionRepository implements ITransactionManager<DbClient> {
  /**
   * トランザクション内でコールバック関数を実行
   * @param callback トランザクション内で実行する処理
   * @returns コールバックの戻り値
   */
  async execute<T>(callback: (tx: DbClient) => Promise<T>): Promise<T> {
    return await db.transaction(async (tx) => {
      return await callback(tx);
    });
  }
}

// シングルトンインスタンスをエクスポート
export const transactionRepository = new TransactionRepository();
