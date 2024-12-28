import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SchemaType, ValidationOptions } from './types'

interface ValidationEditorProps {
  type: SchemaType;
  validations: ValidationOptions;
  onChange: (validations: ValidationOptions) => void;
}

export const ValidationEditor: React.FC<ValidationEditorProps> = ({ type, validations, onChange }) => {
  const handleChange = (key: keyof ValidationOptions, value: any) => {
    onChange({ ...validations, [key]: value })
  }

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center space-x-2">
        <Switch
          id="required"
          checked={!validations.required}
          onCheckedChange={(checked) => handleChange('required', !checked)}
        />
        <Label htmlFor="required">Optional</Label>
      </div>
      {(type === 'string' || type === 'number' || type === 'date') && (
        <div>
          <Label htmlFor="default">Default Value</Label>
          <Input
            id="default"
            value={validations.default || ''}
            onChange={(e) => handleChange('default', e.target.value)}
            placeholder={type === 'date' ? 'YYYY-MM-DD' : ''}
          />
        </div>
      )}
      {(type === 'string' || type === 'array' || type === 'number' || type === 'date') && (
        <>
          <div>
            <Label htmlFor="min">{type === 'number' ? 'Min Value' : type === 'date' ? 'Min Date' : 'Min Length'}</Label>
            <Input
              id="min"
              type={type === 'date' ? 'date' : 'number'}
              value={validations.min || ''}
              onChange={(e) => handleChange('min', e.target.value ? (type === 'date' ? e.target.value : parseInt(e.target.value)) : undefined)}
            />
          </div>
          <div>
            <Label htmlFor="max">{type === 'number' ? 'Max Value' : type === 'date' ? 'Max Date' : 'Max Length'}</Label>
            <Input
              id="max"
              type={type === 'date' ? 'date' : 'number'}
              value={validations.max || ''}
              onChange={(e) => handleChange('max', e.target.value ? (type === 'date' ? e.target.value : parseInt(e.target.value)) : undefined)}
            />
          </div>
        </>
      )}
      {(type === 'string' || type === 'file') && (
        <div>
          <Label htmlFor="regex">Regex Pattern</Label>
          <Input
            id="regex"
            value={validations.regex || ''}
            onChange={(e) => handleChange('regex', e.target.value)}
          />
        </div>
      )}
      <div>
        <Label htmlFor="custom">Custom Validation</Label>
        <Input
          id="custom"
          value={validations.custom || ''}
          onChange={(e) => handleChange('custom', e.target.value)}
        />
      </div>
    </div>
  )
}

