export interface TemplateField {
  id: string;
  label: string;
  order: number;
  isRequired: boolean;
}

export interface Template {
  id: string;
  name: string;
  ownerId?: string;
  fields: TemplateField[];
  isUsed?: boolean;
  createdAt?: string;
  updatedAt: string;
}

export interface TemplateFilters {
  q?: string;
  page?: number;
  ownerId?: string;
}
