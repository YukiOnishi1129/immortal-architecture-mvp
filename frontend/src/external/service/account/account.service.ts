import { Account } from "../../domain/account/account.entity";
import { AccountRepository } from "../../repository/account.repository";

export interface CreateAccountInput {
  email: string;
  name: string;
  provider: string;
  providerAccountId: string;
  thumbnail?: string;
}

export interface UpdateAccountInput {
  firstName?: string;
  lastName?: string;
  thumbnail?: string | null;
}

interface NormalizedProfile {
  firstName: string;
  lastName: string;
  thumbnail?: string;
}

export class AccountService {
  private accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }

  async findByProvider(
    provider: string,
    providerAccountId: string,
  ): Promise<Account | null> {
    return this.accountRepository.findByProvider(provider, providerAccountId);
  }

  async getAccountById(id: string): Promise<Account | null> {
    return this.accountRepository.findById(id);
  }

  async getCurrentAccountByEmail(email: string): Promise<Account | null> {
    return this.accountRepository.findByEmail(email);
  }

  private normalizeProfile(input: CreateAccountInput): NormalizedProfile {
    const { firstName, lastName } = Account.splitFullName(input.name);
    const fallbackName =
      firstName || Account.generateDefaultNameFromEmail(input.email);

    return {
      firstName: fallbackName,
      lastName,
      thumbnail: input.thumbnail,
    };
  }

  async create(
    input: CreateAccountInput,
    normalizedProfile?: NormalizedProfile,
  ): Promise<Account> {
    // Validate registration policies
    if (!Account.isEmailDomainAllowed(input.email)) {
      throw new Error("Email domain not allowed for registration");
    }

    if (!Account.isNameValid(input.name)) {
      throw new Error("Invalid account name");
    }

    const profile = normalizedProfile ?? this.normalizeProfile(input);

    return this.accountRepository.create({
      email: input.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      provider: input.provider,
      providerAccountId: input.providerAccountId,
      thumbnail: profile.thumbnail,
    });
  }

  async createOrGet(
    provider: string,
    providerAccountId: string,
    createInput: CreateAccountInput,
  ): Promise<Account> {
    const normalizedProfile = this.normalizeProfile(createInput);
    const now = new Date();

    const existingAccount = await this.findByProvider(
      provider,
      providerAccountId,
    );

    if (existingAccount) {
      const updatedAccount = existingAccount
        .withProfile({
          firstName: normalizedProfile.firstName,
          lastName: normalizedProfile.lastName,
          thumbnail: normalizedProfile.thumbnail,
        })
        .withLastLogin(now);

      return this.accountRepository.save(updatedAccount);
    }

    return this.create(createInput, normalizedProfile);
  }

  /**
   * Handle OAuth login - creates account if new user, returns existing if returning user
   * This is specifically for OAuth providers where we trust the email is verified
   */
  async handleOAuthLogin(authData: {
    email: string;
    name: string;
    provider: string;
    providerAccountId: string;
    thumbnail?: string;
  }): Promise<Account> {
    return this.createOrGet(
      authData.provider,
      authData.providerAccountId,
      authData,
    );
  }

  /**
   * Update account profile information
   */
  async update(id: string, input: UpdateAccountInput): Promise<Account> {
    const account = await this.getAccountById(id);
    if (!account) {
      throw new Error("Account not found");
    }

    // Check if the account is allowed to be updated
    if (!account.isActive) {
      throw new Error("Account is not active");
    }

    // Apply updates using the entity's methods
    let updatedAccount = account;

    if (
      input.firstName !== undefined ||
      input.lastName !== undefined ||
      input.thumbnail !== undefined
    ) {
      updatedAccount = account.withProfile({
        firstName: input.firstName ?? account.firstName,
        lastName: input.lastName ?? account.lastName,
        thumbnail:
          input.thumbnail === undefined ? account.thumbnail : input.thumbnail,
      });
    }

    // Save the updated account
    return this.accountRepository.save(updatedAccount);
  }

  /**
   * Get account statistics (for admin or analytics)
   */
  async getAccountStats(): Promise<{
    totalAccounts: number;
    accountsCreatedToday: number;
  }> {
    // For MVP, return mock data
    // In production, this would query the database
    return {
      totalAccounts: 0,
      accountsCreatedToday: 0,
    };
  }
}

// シングルトンインスタンスをエクスポート
export const accountService = new AccountService();
