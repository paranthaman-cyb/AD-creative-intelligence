import React from 'react';
import { ColumnMapping } from '../../types';
import { CANONICAL_FIELDS } from '../../services/csv/columnMapping';
import { Select } from '../../components/ui/Select';

export interface ColumnMapperProps {
  headers: string[];
  mapping: ColumnMapping;
  onMappingChange: (newMapping: ColumnMapping) => void;
  previewRows: Record<string, string>[];
}

export const ColumnMapper: React.FC<ColumnMapperProps> = ({
  headers,
  mapping,
  onMappingChange,
  previewRows,
}) => {
  const selectOptions = [
    { value: '', label: '-- Not Mapped --' },
    ...headers.map((h) => ({ value: h, label: h })),
  ];

  const handleFieldChange = (fieldKey: string, selectedHeader: string) => {
    onMappingChange({
      ...mapping,
      [fieldKey]: selectedHeader,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-app-border p-6 shadow-card">
        <h3 className="text-base font-bold text-app-text mb-1">Column Mapping</h3>
        <p className="text-xs text-app-muted mb-6">
          Map your CSV columns to required and optional performance fields.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CANONICAL_FIELDS.map((field) => (
            <div key={field.key} className="p-3 bg-lavender-50 rounded-xl border border-app-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-app-text">
                  {field.label} {field.required && <span className="text-status-error">*</span>}
                </span>
                {field.required && (
                  <span className="text-[10px] uppercase font-semibold text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded">
                    Required
                  </span>
                )}
              </div>
              <p className="text-[11px] text-app-muted mb-2">{field.description}</p>
              <Select
                value={mapping[field.key] || ''}
                onChange={(e) => handleFieldChange(String(field.key), e.target.value)}
                options={selectOptions}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CSV Data Preview Table (First 5 rows) */}
      {previewRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-app-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-app-text">CSV Data Preview (First 5 Rows)</h4>
            <span className="text-xs text-app-muted font-medium">
              Showing {Math.min(5, previewRows.length)} sample rows
            </span>
          </div>

          <div className="overflow-x-auto border border-app-border rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-lavender-100 text-app-text font-bold border-b border-app-border">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  {headers.map((h) => (
                    <th key={h} className="py-2.5 px-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {previewRows.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className="hover:bg-lavender-50/50">
                    <td className="py-2 px-3 font-semibold text-app-muted">{idx + 1}</td>
                    {headers.map((h) => (
                      <td key={h} className="py-2 px-3 text-app-text whitespace-nowrap max-w-xs truncate">
                        {row[h] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
