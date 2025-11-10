import { eq } from "drizzle-orm";
import { db } from "../client/database";
import { accounts, type NewAccount } from "../client/database/schema";
import { Account } from "../domain/account/account.entity";
import type { IAccountRepository } from "../domain/account/account.repository.interface";

export class AccountRepository implements IAccountRepository {
  async findById(id: string): Promise<Account | null> {
    const results = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, id))
      .limit(1);

    const result = results[0];
    if (!result) return null;

    return Account.create({
      id: result.id,
      name: result.name,
      email: result.email,
      authId: result.authId,
      createdAt: result.createdAt,
    });
  }

  async findByEmail(email: string): Promise<Account | null> {
    const results = await db
      .select()
      .from(accounts)
      .where(eq(accounts.email, email))
      .limit(1);

    const result = results[0];
    if (!result) return null;

    return Account.create({
      id: result.id,
      name: result.name,
      email: result.email,
      authId: result.authId,
      createdAt: result.createdAt,
    });
  }

  async findByAuthId(authId: string): Promise<Account | null> {
    const results = await db
      .select()
      .from(accounts)
      .where(eq(accounts.authId, authId))
      .limit(1);

    const result = results[0];
    if (!result) return null;

    return Account.create({
      id: result.id,
      name: result.name,
      email: result.email,
      authId: result.authId,
      createdAt: result.createdAt,
    });
  }

  async save(account: Account): Promise<void> {
    const data = account.toPlainObject();

    await db
      .insert(accounts)
      .values({
        id: data.id,
        name: data.name,
        email: data.email,
        authId: data.authId,
        createdAt: data.createdAt,
      })
      .onConflictDoUpdate({
        target: accounts.id,
        set: {
          name: data.name,
          email: data.email,
        },
      });
  }

  async create(data: Omit<NewAccount, "id" | "createdAt">): Promise<Account> {
    const [result] = await db.insert(accounts).values(data).returning();

    return Account.create({
      id: result.id,
      name: result.name,
      email: result.email,
      authId: result.authId,
      createdAt: result.createdAt,
    });
  }
}

export const accountRepository = new AccountRepository();
