import React, { useRef, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash } from 'lucide-react'
import { SchemaField, SchemaType } from './types'
import { ValidationEditor } from './validation-editor'
import { CalculatedFieldEditor } from './calculated-field-editor'

interface PropertiesPanelProps {
  field: SchemaField;
  onUpdate: (updatedField: SchemaField) => void;
  onDelete: () => void;
  availableFields: string[];
  isNewField?: boolean;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ field, onUpdate, onDelete, availableFields, isNewField }) => {
  const handleChange = (key: keyof SchemaField, value: any) => {
    onUpdate({ ...field, [key]: value });
  };

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNewField && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isNewField]);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <h3 className="text-lg font-semibold">Properties</h3>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          ref={nameInputRef}
          value={field.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={field.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          value={field.type}
          onValueChange={(value: SchemaType) => handleChange('type', value)}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
            <SelectItem value="array">Array</SelectItem>
            <SelectItem value="object">Object</SelectItem>
            <SelectItem value="enum">Enum</SelectItem>
            <SelectItem value="union">Union</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="file">File</SelectItem>
            <SelectItem value="calculated">Calculated</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {field.type === 'enum' && (
        <div>
          <Label htmlFor="enum-values">Enum Values (comma-separated)</Label>
          <Input
            id="enum-values"
            value={field.enumValues?.join(', ') || ''}
            onChange={(e) => handleChange('enumValues', e.target.value.split(',').map(v => v.trim()))}
          />
        </div>
      )}
      {field.type !== 'object' && (
        <div>
          <Label>Validations</Label>
          <ValidationEditor
            type={field.type}
            validations={field.validations || {}}
            onChange={(validations) => handleChange('validations', validations)}
          />
        </div>
      )}
      {field.type === 'calculated' && (
        <div>
          <Label>Calculated Field</Label>
          <CalculatedFieldEditor
            calculatedField={field.calculatedField || { dependencies: [], formula: '' }}
            onChange={(calculatedField) => handleChange('calculatedField', calculatedField)}
            availableFields={availableFields}
          />
        </div>
      )}
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash className="w-4 h-4 mr-2" /> Delete Field
      </Button>
    </div>
  );
};

