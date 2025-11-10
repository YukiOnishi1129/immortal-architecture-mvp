import { Email } from "../shared/value-objects";

export class Account {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: Email,
    public readonly authId: string,
    public readonly createdAt: Date,
  ) {
    if (!name.trim()) {
      throw new Error("Account name cannot be empty");
    }
  }

  static create(params: {
    id: string;
    name: string;
    email: string;
    authId: string;
    createdAt: Date;
  }): Account {
    return new Account(
      params.id,
      params.name,
      Email.create(params.email),
      params.authId,
      params.createdAt,
    );
  }

  canEdit(resourceOwnerId: string): boolean {
    return this.id === resourceOwnerId;
  }

  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.getValue(),
      authId: this.authId,
      createdAt: this.createdAt,
    };
  }
}
