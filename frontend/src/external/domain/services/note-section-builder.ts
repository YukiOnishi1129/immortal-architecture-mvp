import { Section } from "../note/section.entity";
import type { Template } from "../template/template.entity";

export function buildSectionsFromTemplate(
  template: Template,
  generateId: () => string,
): Section[] {
  return template.fields.map((field) =>
    Section.create({
      id: generateId(),
      fieldId: field.id,
      content: "",
    }),
  );
}
