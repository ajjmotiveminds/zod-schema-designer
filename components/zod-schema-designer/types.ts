import { ComponentType } from 'react';
import { z } from 'zod';

export type SchemaType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum' | 'union' | 'date' | 'file' | 'calculated';

export interface ValidationOptions {
  required?: boolean;
  min?: number;
  max?: number;
  regex?: string;
  custom?: string;
}

export interface CalculatedFieldOptions {
  dependencies: string[];
  formula: string;
}

export interface SchemaField {
  name: string;
  type: SchemaType;
  description?: string;
  children?: SchemaField[];
  enumValues?: string[];
  validations?: ValidationOptions;
  label?: string;
  displayComponent?: ComponentType<any>;
  editComponent?: ComponentType<any>;
  filterComponent?: ComponentType<any>;
  calculatedField?: CalculatedFieldOptions;
}

export type InitialSchema = SchemaField | z.ZodType<any>;

export interface ZodSchemaDesignerProps {
  initialSchema: InitialSchema;
  onSave: (schema: SchemaField) => void;
  showGeneratedCode?: boolean;
}

