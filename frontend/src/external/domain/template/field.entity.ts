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

  static create(params: {
    id: string;
    label: string;
    order: number;
    isRequired: boolean;
  }): Field {
    return new Field(params.id, params.label, params.order, params.isRequired);
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
