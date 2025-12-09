import { Field } from "./field.entity";

export class Template {
  private _fields: Field[];

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly ownerId: string,
    fields: Field[],
    public readonly updatedAt: Date,
  ) {
    if (!name.trim()) {
      throw new Error("Template name cannot be empty");
    }

    this._fields = [...fields];
    this.validateFieldOrders();
  }

  get fields(): ReadonlyArray<Field> {
    return [...this._fields].sort((a, b) => a.order - b.order);
  }

  private validateFieldOrders(): void {
    const orders = this._fields.map((f) => f.order);
    const uniqueOrders = new Set(orders);

    if (orders.length !== uniqueOrders.size) {
      throw new Error("Field orders must be unique within a template");
    }
  }

  static create(params: {
    id: string;
    name: string;
    ownerId: string;
    fields: Array<{
      id: string;
      label: string;
      order: number;
      isRequired: boolean;
    }>;
    updatedAt: Date;
  }): Template {
    const fields = params.fields.map(
      (f) => new Field(f.id, f.label, f.order, f.isRequired),
    );

    return new Template(
      params.id,
      params.name,
      params.ownerId,
      fields,
      params.updatedAt,
    );
  }

  addField(field: Field): Template {
    const newFields = [...this._fields, field];
    return new Template(
      this.id,
      this.name,
      this.ownerId,
      newFields,
      new Date(),
    );
  }

  removeField(fieldId: string): Template {
    const newFields = this._fields.filter((f) => f.id !== fieldId);
    return new Template(
      this.id,
      this.name,
      this.ownerId,
      newFields,
      new Date(),
    );
  }

  updateField(fieldId: string, updatedField: Field): Template {
    const newFields = this._fields.map((f) =>
      f.id === fieldId ? updatedField : f,
    );
    return new Template(
      this.id,
      this.name,
      this.ownerId,
      newFields,
      new Date(),
    );
  }

  reorderFields(fieldIds: string[]): Template {
    const fieldMap = new Map(this._fields.map((f) => [f.id, f]));
    const newFields = fieldIds.map((id, index) => {
      const field = fieldMap.get(id);
      if (!field) throw new Error(`Field ${id} not found`);

      return new Field(field.id, field.label, index + 1, field.isRequired);
    });

    return new Template(
      this.id,
      this.name,
      this.ownerId,
      newFields,
      new Date(),
    );
  }

  /**
   * セクション生成用の設計図を返す
   * 集約外部にFieldを直接公開せず、必要な情報のみを提供
   */
  getSectionBlueprints(): Array<{ fieldId: string }> {
    return this.fields.map((f) => ({ fieldId: f.id }));
  }

  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      ownerId: this.ownerId,
      fields: this.fields.map((f) => f.toPlainObject()),
      updatedAt: this.updatedAt,
    };
  }
}
