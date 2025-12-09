/**
 * Section - Note集約の子エンティティ
 * @internal 集約ルート(Note)からのみ生成・操作すること
 */
export class Section {
  constructor(
    public readonly id: string,
    public readonly fieldId: string,
    public readonly content: string,
  ) {}

  /** @internal 集約ルート(Note)からのみ呼び出すこと */
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
