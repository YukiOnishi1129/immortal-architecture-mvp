export interface TemplateField {
  id: string;
  label: string;
  order: number;
  isRequired: boolean;
}

export interface Template {
  id: string;
  name: string;
  fields: TemplateField[];
  updatedAt: Date;
}

export interface TemplateFilters {
  search?: string;
  ownerId?: string;
}
