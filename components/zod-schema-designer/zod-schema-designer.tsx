'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Copy, Check, Save } from 'lucide-react'
import { SchemaField, ZodSchemaDesignerProps, InitialSchema } from './types'
import { SchemaFieldEditor } from './schema-field-editor'
import { PropertiesPanel } from './properties-panel'
import { generateZodSchema, zodToJson } from './schema-utils'
import { z } from 'zod'

export function ZodSchemaDesigner({ initialSchema, onSave, showGeneratedCode = true }: ZodSchemaDesignerProps) {
  const [schema, setSchema] = useState<SchemaField>(
    initialSchema instanceof z.ZodType ? zodToJson(initialSchema) : initialSchema
  );
  const [selectedField, setSelectedField] = useState<SchemaField | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newField, setNewField] = useState<SchemaField | null>(null);

  useEffect(() => {
    setSchema(initialSchema instanceof z.ZodType ? zodToJson(initialSchema) : initialSchema);
    setSelectedField(null);
    setHasUnsavedChanges(false);
    setNewField(null);
  }, [initialSchema]);

  const getAllFieldNames = (field: SchemaField): string[] => {
    let names: string[] = [field.name];
    if (field.children) {
      names = names.concat(field.children.flatMap(getAllFieldNames));
    }
    return names;
  };

  const availableFields = getAllFieldNames(schema);

  const handleSave = () => {
    onSave(schema);
    setHasUnsavedChanges(false);
  };

  const handleSchemaUpdate = (updatedSchema: SchemaField) => {
    setSchema(updatedSchema);
    setHasUnsavedChanges(true);
  };

  const handleFieldUpdate = (updatedField: SchemaField) => {
    setSchema(prevSchema => {
      const updateFieldRecursive = (field: SchemaField): SchemaField => {
        if (field === selectedField) {
          return updatedField;
        }
        if (field.children) {
          return {
            ...field,
            children: field.children.map(updateFieldRecursive)
          };
        }
        return field;
      };
      return updateFieldRecursive(prevSchema);
    });
    setSelectedField(updatedField);
    setNewField(null);
    setHasUnsavedChanges(true);
  };

  const handleFieldDelete = () => {
    setSchema(prevSchema => {
      const deleteFieldRecursive = (field: SchemaField): SchemaField | null => {
        if (field === selectedField) {
          return null;
        }
        if (field.children) {
          const updatedChildren = field.children
            .map(deleteFieldRecursive)
            .filter((child): child is SchemaField => child !== null);
          return { ...field, children: updatedChildren };
        }
        return field;
      };
      const updatedSchema = deleteFieldRecursive(prevSchema);
      return updatedSchema || prevSchema;
    });
    setSelectedField(null);
    setHasUnsavedChanges(true);
  };

  const handleCopyCode = () => {
    const code = generateZodSchema(schema);
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleAddField = (newField: SchemaField) => {
    setSelectedField(newField);
    setNewField(newField);
  };

  return (
    <div className="flex h-full">
      <div className="w-2/3 overflow-auto border-r">
        <div className="p-4">
          <SchemaFieldEditor
            field={schema}
            onUpdate={handleSchemaUpdate}
            onDelete={() => {}}
            depth={0}
            availableFields={availableFields}
            selectedField={selectedField}
            onSelectField={handleAddField}
            isNewField={newField === schema}
          />
        </div>
        {showGeneratedCode && (
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Generated Zod Schema</h3>
              <Button onClick={handleCopyCode} className="flex items-center">
                {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              <code>{generateZodSchema(schema)}</code>
            </pre>
          </div>
        )}
      </div>
      <div className="w-1/3 overflow-auto">
        {selectedField && (
          <PropertiesPanel
            field={selectedField}
            onUpdate={handleFieldUpdate}
            onDelete={handleFieldDelete}
            availableFields={availableFields}
            isNewField={newField === selectedField}
          />
        )}
      </div>
      <div className="absolute bottom-4 right-4">
        <Button
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          className="flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

