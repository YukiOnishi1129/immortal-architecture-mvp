import { and, eq } from "drizzle-orm";
import { db } from "../client/database";
import { accounts } from "../client/database/schema";
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
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      isActive: result.isActive,
      provider: result.provider,
      providerAccountId: result.providerAccountId,
      thumbnail: result.thumbnail,
      lastLoginAt: result.lastLoginAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
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
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      isActive: result.isActive,
      provider: result.provider,
      providerAccountId: result.providerAccountId,
      thumbnail: result.thumbnail,
      lastLoginAt: result.lastLoginAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async findByProvider(
    provider: string,
    providerAccountId: string,
  ): Promise<Account | null> {
    const results = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.provider, provider),
          eq(accounts.providerAccountId, providerAccountId),
        ),
      )
      .limit(1);

    const result = results[0];
    if (!result) return null;

    return Account.create({
      id: result.id,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      isActive: result.isActive,
      provider: result.provider,
      providerAccountId: result.providerAccountId,
      thumbnail: result.thumbnail,
      lastLoginAt: result.lastLoginAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async save(account: Account): Promise<Account> {
    const data = account.toPlainObject();

    const [result] = await db
      .insert(accounts)
      .values({
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        isActive: data.isActive,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        thumbnail: data.thumbnail,
        lastLoginAt: data.lastLoginAt,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
      .onConflictDoUpdate({
        target: accounts.id,
        set: {
          firstName: data.firstName,
          lastName: data.lastName,
          thumbnail: data.thumbnail,
          lastLoginAt: data.lastLoginAt,
          updatedAt: new Date(),
        },
      })
      .returning();

    return Account.create({
      id: result.id,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      isActive: result.isActive,
      provider: result.provider,
      providerAccountId: result.providerAccountId,
      thumbnail: result.thumbnail,
      lastLoginAt: result.lastLoginAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async create(data: {
    email: string;
    firstName: string;
    lastName: string;
    provider: string;
    providerAccountId: string;
    thumbnail?: string | null;
  }): Promise<Account> {
    const [result] = await db
      .insert(accounts)
      .values({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        thumbnail: data.thumbnail,
        lastLoginAt: new Date(),
      })
      .returning();

    return Account.create({
      id: result.id,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      isActive: result.isActive,
      provider: result.provider,
      providerAccountId: result.providerAccountId,
      thumbnail: result.thumbnail,
      lastLoginAt: result.lastLoginAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }
}

export const accountRepository = new AccountRepository();
