import type { NoteStatus } from "../shared/value-objects";
import { Section } from "./section.entity";

export class Note {
  private _sections: Section[];

  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly templateId: string,
    public readonly ownerId: string,
    public readonly status: NoteStatus,
    sections: Section[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    if (!title.trim()) {
      throw new Error("Note title cannot be empty");
    }

    this._sections = [...sections];
  }

  get sections(): ReadonlyArray<Section> {
    return [...this._sections];
  }

  static create(params: {
    id: string;
    title: string;
    templateId: string;
    ownerId: string;
    status: NoteStatus;
    sections: Array<{
      id: string;
      fieldId: string;
      content: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }): Note {
    const sections = params.sections.map((s) => Section.create(s));

    return new Note(
      params.id,
      params.title,
      params.templateId,
      params.ownerId,
      params.status,
      sections,
      params.createdAt,
      params.updatedAt,
    );
  }

  canEdit(userId: string): boolean {
    return this.ownerId === userId;
  }

  isDraft(): boolean {
    return this.status === "Draft";
  }

  isPublished(): boolean {
    return this.status === "Publish";
  }

  publish(): Note {
    if (this.isPublished()) {
      throw new Error("Note is already published");
    }

    return new Note(
      this.id,
      this.title,
      this.templateId,
      this.ownerId,
      "Publish",
      this._sections,
      this.createdAt,
      new Date(),
    );
  }

  unpublish(): Note {
    if (this.isDraft()) {
      throw new Error("Note is already a draft");
    }

    return new Note(
      this.id,
      this.title,
      this.templateId,
      this.ownerId,
      "Draft",
      this._sections,
      this.createdAt,
      new Date(),
    );
  }

  updateTitle(title: string): Note {
    return new Note(
      this.id,
      title,
      this.templateId,
      this.ownerId,
      this.status,
      this._sections,
      this.createdAt,
      new Date(),
    );
  }

  updateSection(sectionId: string, content: string): Note {
    const newSections = this._sections.map((s) =>
      s.id === sectionId ? s.updateContent(content) : s,
    );

    return new Note(
      this.id,
      this.title,
      this.templateId,
      this.ownerId,
      this.status,
      newSections,
      this.createdAt,
      new Date(),
    );
  }

  toPlainObject() {
    return {
      id: this.id,
      title: this.title,
      templateId: this.templateId,
      ownerId: this.ownerId,
      status: this.status,
      sections: this.sections.map((s) => s.toPlainObject()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
