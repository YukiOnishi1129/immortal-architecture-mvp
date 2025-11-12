export type NoteStatus = "Draft" | "Publish";

export interface NoteSection {
  id: string;
  fieldId: string;
  fieldLabel: string;
  content: string;
  isRequired: boolean;
}

export interface Note {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  status: NoteStatus;
  sections: NoteSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFilters {
  status?: NoteStatus;
  templateId?: string;
  search?: string;
}
