/**
 * ドメインサービス - 複数の集約にまたがるビジネスルール
 */

import type { Account } from "./account/account.entity";
import type { Note } from "./note/note.entity";

/**
 * ノートを公開できるかチェックする
 * Note集約 + Account集約のビジネスルール
 */
export function canPublish(note: Note, account: Account): boolean {
  // 自分のノートのみ公開できる
  if (!note.canEdit(account.id)) {
    return false;
  }

  // 既に公開済みの場合は公開できない
  if (note.status === "Publish") {
    return false;
  }

  return true;
}

/**
 * ノートの公開を取り消せるかチェックする
 * Note集約 + Account集約のビジネスルール
 */
export function canUnpublish(note: Note, account: Account): boolean {
  // 自分のノートのみ公開取り消しできる
  if (!note.canEdit(account.id)) {
    return false;
  }

  // 下書き状態の場合は公開取り消しできない
  if (note.status === "Draft") {
    return false;
  }

  return true;
}
