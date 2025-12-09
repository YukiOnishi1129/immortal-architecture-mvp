/**
 * Field - Template集約の子エンティティ
 * @internal 集約ルート(Template)からのみ生成・操作すること
 */
export class Field {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly order: number,
    public readonly isRequired: boolean,
  ) {
    if (!label.trim()) {
      throw new Error("Field label cannot be empty");
    }

    if (order <= 0) {
      throw new Error("Field order must be greater than 0");
    }
  }

  toPlainObject() {
    return {
      id: this.id,
      label: this.label,
      order: this.order,
      isRequired: this.isRequired,
    };
  }
}
