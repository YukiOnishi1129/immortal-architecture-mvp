import type { Account } from "./account.entity";

export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  findByAuthId(authId: string): Promise<Account | null>;
  save(account: Account): Promise<void>;
  create(data: {
    name: string;
    email: string;
    authId: string;
  }): Promise<Account>;
}
