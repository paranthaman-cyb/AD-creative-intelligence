import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface FileUploadProps {
  onFilesSelected: (images: File[], csvFile: File | null) => void;
  selectedImages: File[];
  selectedCsv: File | null;
  onClearCsv: () => void;
  onRemoveImage: (index: number) => void;
  onLoadDemo: () => void;
  onLoadRealDataset?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  selectedImages,
  selectedCsv,
  onClearCsv,
  onRemoveImage,
  onLoadDemo,
  onLoadRealDataset,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [dragActiveImages, setDragActiveImages] = useState(false);
  const [dragActiveCsv, setDragActiveCsv] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validImages = files.filter((f) =>
        ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(f.type)
      );
      if (validImages.length < files.length) {
        setUploadError('Some files were ignored because only JPG, PNG, and WebP are supported.');
      } else {
        setUploadError(null);
      }
      onFilesSelected([...selectedImages, ...validImages], selectedCsv);
    }
  };

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
        setUploadError(null);
        onFilesSelected(selectedImages, file);
      } else {
        setUploadError('Please choose a valid .csv file.');
      }
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActiveImages(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const validImages = files.filter((f) =>
        ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(f.type)
      );
      onFilesSelected([...selectedImages, ...validImages], selectedCsv);
    }
  };

  const handleCsvDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActiveCsv(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        onFilesSelected(selectedImages, file);
      } else {
        setUploadError('Please drop a valid .csv file.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {uploadError && (
        <div className="p-3.5 bg-status-errorBg border border-status-error/30 rounded-xl text-status-error text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Image Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActiveImages(true);
        }}
        onDragLeave={() => setDragActiveImages(false)}
        onDrop={handleImageDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-white flex flex-col items-center justify-center ${
          dragActiveImages
            ? 'border-brand-600 bg-brand-50/50'
            : 'border-app-border hover:border-brand-500'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-lavender-100 text-brand-600 flex items-center justify-center mb-4 shadow-sm">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-app-text mb-1">
          Drop ad images here or click to browse
        </h3>
        <p className="text-xs text-app-muted mb-5">
          Supports JPG, JPEG, PNG, WebP (Max 10MB each)
        </p>

        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/jpg"
          className="hidden"
          onChange={handleImageChange}
        />

        <Button
          type="button"
          variant="primary"
          onClick={() => imageInputRef.current?.click()}
        >
          Choose Images
        </Button>

        {/* Selected Images Grid Preview */}
        {selectedImages.length > 0 && (
          <div className="mt-6 w-full pt-6 border-t border-app-border">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-app-text">
                {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} ready
              </span>
              <button
                type="button"
                onClick={() => onFilesSelected([], selectedCsv)}
                className="text-status-error hover:underline"
              >
                Clear all images
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 items-center">
              {selectedImages.slice(0, 16).map((img, idx) => (
                <div
                  key={`${img.name}_${idx}`}
                  className="relative group w-16 h-16 rounded-lg border border-app-border overflow-hidden shrink-0 bg-lavender-50"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(idx)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {selectedImages.length > 16 && (
                <div className="w-16 h-16 rounded-lg border border-dashed border-brand-300 bg-brand-50 flex items-center justify-center shrink-0 text-center p-1">
                  <span className="text-[11px] font-bold text-brand-700">
                    +{selectedImages.length - 16} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CSV Upload Card */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActiveCsv(true);
        }}
        onDragLeave={() => setDragActiveCsv(false)}
        onDrop={handleCsvDrop}
        className={`bg-white rounded-2xl border p-6 transition-all ${
          dragActiveCsv ? 'border-brand-600 bg-brand-50/30' : 'border-app-border'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0">
              CSV
            </div>
            <div>
              <h4 className="text-sm font-bold text-app-text">
                Advertisement Performance Data
              </h4>
              <p className="text-xs text-app-muted">
                Upload a CSV file with ad metrics (impressions, clicks, conversions, spend).
              </p>
            </div>
          </div>

          <input
            ref={csvInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleCsvChange}
          />

          {!selectedCsv ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => csvInputRef.current?.click()}
            >
              Choose CSV
            </Button>
          ) : (
            <div className="flex items-center gap-3 bg-lavender-50 px-4 py-2 rounded-xl border border-app-border">
              <FileText className="w-4 h-4 text-brand-600" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-app-text">{selectedCsv.name}</span>
                <span className="text-[10px] text-app-muted">
                  {(selectedCsv.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                type="button"
                onClick={onClearCsv}
                className="text-app-muted hover:text-status-error p-1 transition-colors"
                title="Remove CSV"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-app-border flex items-start gap-2 text-[11px] text-app-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-1" />
          <span>
            Expected CSV columns: <code className="bg-lavender-100 px-1 py-0.5 rounded text-brand-700">ad_id</code>, <code className="bg-lavender-100 px-1 py-0.5 rounded text-brand-700">impressions</code>, <code className="bg-lavender-100 px-1 py-0.5 rounded text-brand-700">clicks</code>. Optional: <code className="bg-lavender-100 px-1 py-0.5 rounded text-brand-700">conversions</code>, <code className="bg-lavender-100 px-1 py-0.5 rounded text-brand-700">spend</code>, <code className="bg-lavender-100 px-1 py-0.5 rounded text-brand-700">revenue</code>, <code className="bg-lavender-100 px-1 py-0.5 rounded text-brand-700">attributes</code>.
          </span>
        </div>
      </div>

      {/* Or Load Pre-Configured Dataset Options */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 text-xs">
        {onLoadRealDataset && (
          <button
            type="button"
            onClick={onLoadRealDataset}
            className="font-bold text-brand-700 hover:text-brand-600 bg-brand-100 hover:bg-brand-50 px-3.5 py-1.5 rounded-xl border border-brand-200 transition-colors"
          >
            Load Halcyon Meta Dataset (150 Creatives)
          </button>
        )}
        <button
          type="button"
          onClick={onLoadDemo}
          className="text-app-muted hover:text-app-text hover:underline"
        >
          Load 60-Creative Synthetic Fixtures
        </button>
      </div>
    </div>
  );
};
