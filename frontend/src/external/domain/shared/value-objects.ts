// Value Objects

export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    const trimmed = value.trim();

    if (!trimmed) {
      throw new Error("Email cannot be empty");
    }

    if (!trimmed.includes("@")) {
      throw new Error("Email must contain @");
    }

    return new Email(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

export type NoteStatus = "Draft" | "Publish";

export const NoteStatusUtil = {
  isDraft: (status: NoteStatus): status is "Draft" => status === "Draft",
  isPublished: (status: NoteStatus): status is "Publish" =>
    status === "Publish",
  validate: (status: string): status is NoteStatus => {
    return status === "Draft" || status === "Publish";
  },
};

export class Status {
  static readonly DRAFT = new Status("Draft");
  static readonly PUBLISH = new Status("Publish");

  private constructor(private readonly value: NoteStatus) {}

  getValue(): NoteStatus {
    return this.value;
  }

  equals(other: Status): boolean {
    return this.value === other.value;
  }

  static fromValue(value: string): Status {
    if (value === "Draft") return Status.DRAFT;
    if (value === "Publish") return Status.PUBLISH;
    throw new Error(`Invalid status value: ${value}`);
  }
}
