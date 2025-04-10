export enum MegoMetadataInputType {
  TEXT = 'TEXT',
  SELECT = 'SELECT',
  EMAIL = 'EMAIL',
  CHECKBOX = 'CHECKBOX',
  TEXTAREA = 'TEXTAREA',
}

export interface MegoMetadataFieldConfig {
  metadata: string; 
  type: MegoMetadataInputType;
  placeholder?: string;
  options?: string[];
} 