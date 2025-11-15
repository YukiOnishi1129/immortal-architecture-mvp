import type { Account } from "./account.entity";

export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  findByProvider(
    provider: string,
    providerAccountId: string,
  ): Promise<Account | null>;
  save(account: Account): Promise<Account>;
  create(data: {
    email: string;
    firstName: string;
    lastName: string;
    provider: string;
    providerAccountId: string;
    thumbnail?: string | null;
  }): Promise<Account>;
}
