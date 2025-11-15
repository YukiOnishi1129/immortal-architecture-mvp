import { Email } from "../shared/value-objects";

interface AccountProfile {
  firstName: string;
  lastName: string;
  thumbnail?: string | null;
}

export class Account {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly isActive: boolean,
    public readonly provider: string,
    public readonly providerAccountId: string,
    public readonly thumbnail: string | null,
    public readonly lastLoginAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    if (!firstName.trim() && !lastName.trim()) {
      throw new Error("Account must have at least a first name or last name");
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * アカウントIDを生成する
   */
  static generateId(): string {
    return crypto.randomUUID();
  }

  /**
   * メールアドレスからデフォルトの名前を生成する
   */
  static generateDefaultNameFromEmail(email: string): string {
    try {
      const emailVO = Email.create(email);
      const localPart = emailVO.getValue().split("@")[0];
      return localPart;
    } catch {
      return "User";
    }
  }

  /**
   * OAuth プロバイダーから取得した名前を firstName と lastName に分割する
   */
  static splitFullName(fullName: string): {
    firstName: string;
    lastName: string;
  } {
    const trimmedName = fullName.trim();
    const parts = trimmedName.split(/\s+/).filter((part) => part.length > 0);

    if (parts.length === 0) {
      return { firstName: "", lastName: "" };
    }

    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");

    return { firstName, lastName };
  }

  /**
   * メールドメインが登録を許可されているかチェックする
   */
  static isEmailDomainAllowed(email: string): boolean {
    try {
      const emailVO = Email.create(email);
      const domain = emailVO.getValue().split("@")[1];

      // 明らかに不正なドメインを除外
      const blockedDomains = [
        "example.com",
        "test.com",
        "localhost",
        "127.0.0.1",
      ];

      if (blockedDomains.includes(domain.toLowerCase())) {
        return false;
      }

      // 本番環境では特定のドメインのみ許可する場合
      // const allowedDomains = ['company.com', 'partner.com'];
      // return allowedDomains.includes(domain.toLowerCase());

      return true;
    } catch {
      // Email VOの作成に失敗した場合は無効
      return false;
    }
  }

  /**
   * アカウント名が有効かチェックする
   */
  static isNameValid(name: string): boolean {
    const trimmedName = name.trim();
    return trimmedName.length > 0 && trimmedName.length <= 100;
  }

  static create(params: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    provider: string;
    providerAccountId: string;
    thumbnail: string | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Account {
    return new Account(
      params.id,
      Email.create(params.email),
      params.firstName,
      params.lastName,
      params.isActive,
      params.provider,
      params.providerAccountId,
      params.thumbnail,
      params.lastLoginAt,
      params.createdAt,
      params.updatedAt,
    );
  }

  canEdit(resourceOwnerId: string): boolean {
    return this.id === resourceOwnerId;
  }

  withProfile(profile: AccountProfile): Account {
    return new Account(
      this.id,
      this.email,
      profile.firstName,
      profile.lastName,
      this.isActive,
      this.provider,
      this.providerAccountId,
      profile.thumbnail ?? this.thumbnail,
      this.lastLoginAt,
      this.createdAt,
      new Date(),
    );
  }

  withLastLogin(date: Date): Account {
    return new Account(
      this.id,
      this.email,
      this.firstName,
      this.lastName,
      this.isActive,
      this.provider,
      this.providerAccountId,
      this.thumbnail,
      date,
      this.createdAt,
      new Date(),
    );
  }

  toPlainObject() {
    return {
      id: this.id,
      email: this.email.getValue(),
      firstName: this.firstName,
      lastName: this.lastName,
      isActive: this.isActive,
      provider: this.provider,
      providerAccountId: this.providerAccountId,
      thumbnail: this.thumbnail,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
