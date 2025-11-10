export class Section {
  constructor(
    public readonly id: string,
    public readonly fieldId: string,
    public readonly content: string,
  ) {}

  static create(params: {
    id: string;
    fieldId: string;
    content: string;
  }): Section {
    return new Section(params.id, params.fieldId, params.content);
  }

  updateContent(content: string): Section {
    return new Section(this.id, this.fieldId, content);
  }

  toPlainObject() {
    return {
      id: this.id,
      fieldId: this.fieldId,
      content: this.content,
    };
  }
}
