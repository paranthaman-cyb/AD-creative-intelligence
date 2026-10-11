import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { FileUpload } from '../features/upload/FileUpload';
import { ColumnMapper } from '../features/validation/ColumnMapper';
import { ValidationSummary } from '../features/validation/ValidationSummary';
import { Button } from '../components/ui/Button';
import { parseCsvFile, parseCsvString } from '../services/csv/parseCsv';
import { autoDetectColumnMapping, validateColumnMapping } from '../services/csv/columnMapping';
import { validateAndNormalizeCsv, CsvValidationResult } from '../services/csv/validateCsv';
import {
  reconcileCreativesAndImages,
  processBatchImageFeatures,
} from '../services/analysis/featureExtraction';
import { useAnalysis } from '../context/AnalysisContext';
import { ColumnMapping } from '../types';
import { Check, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { SAMPLE_CSV_CONTENT } from '../data/demo/demoData';

export const AnalyzePage: React.FC = () => {
  const navigate = useNavigate();
  const { loadDemoData, loadRealDataset, setUploadedDataset } = useAnalysis();

  const [step, setStep] = useState<number>(1);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedCsv, setSelectedCsv] = useState<File | null>(null);

  // Parsing & validation states
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    creativeId: '',
    impressions: '',
    clicks: '',
  });
  const [validationResult, setValidationResult] = useState<CsvValidationResult | null>(null);
  const [_isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzeProgress, setAnalyzeProgress] = useState<string>('');

  const steps = [
    { num: 1, label: 'Upload' },
    { num: 2, label: 'Validate' },
    { num: 3, label: 'Analyze' },
    { num: 4, label: 'Results' },
  ];

  const handleFilesSelected = (images: File[], csvFile: File | null) => {
    setSelectedImages(images);
    setSelectedCsv(csvFile);
  };

  const handleClearCsv = () => {
    setSelectedCsv(null);
    setCsvHeaders([]);
    setRawRows([]);
    setValidationResult(null);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLoadDemo = () => {
    loadDemoData();
    navigate('/dashboard');
  };

  // Move from Step 1 (Upload) to Step 2 (Validate)
  const handleProceedToValidate = async () => {
    setIsParsing(true);
    try {
      let parsed;
      if (selectedCsv) {
        parsed = await parseCsvFile(selectedCsv);
      } else {
        // Fallback to sample CSV content if user didn't supply one
        parsed = await parseCsvString(SAMPLE_CSV_CONTENT);
      }

      setCsvHeaders(parsed.headers);
      setRawRows(parsed.rows);

      // Auto-detect column mapping
      const detected = autoDetectColumnMapping(parsed.headers);
      setColumnMapping(detected);

      // Initial validation
      const val = validateAndNormalizeCsv(parsed.rows, detected);
      setValidationResult(val);

      setStep(2);
    } catch (err) {
      alert('Error parsing CSV file: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsParsing(false);
    }
  };

  // Update mapping and re-validate
  const handleMappingChange = (newMapping: ColumnMapping) => {
    setColumnMapping(newMapping);
    const val = validateAndNormalizeCsv(rawRows, newMapping);
    setValidationResult(val);
  };

  // Step 3 & 4: Run Analysis & Feature Extraction
  const handleRunAnalysis = async () => {
    if (!validationResult || !validationResult.isValid) return;

    setStep(3);
    setIsAnalyzing(true);
    setAnalyzeProgress(`Discovering and reconciling ${selectedImages.length} uploaded creative images with CSV records...`);

    try {
      // 1. Reconcile uploaded files and CSV performance records
      const { items } = reconcileCreativesAndImages(
        selectedImages,
        validationResult.records,
        columnMapping
      );

      // 2. Concurrency-controlled batch processing of image visual features
      setAnalyzeProgress(`Extracting visual features for ${selectedImages.length} images in batches...`);
      const finalDiag = await processBatchImageFeatures(items, 10, (done, total) => {
        setAnalyzeProgress(`Extracting visual features: ${done} of ${total} assets processed...`);
      });

      // 3. Assign temporary browser object URLs for images so UI can render them
      for (const it of items) {
        if (it.imageFile && !it.creative.imageUrl) {
          it.creative.imageUrl = URL.createObjectURL(it.imageFile);
        }
      }

      setAnalyzeProgress('Calculating statistical comparisons and 95% confidence intervals...');
      await new Promise((r) => setTimeout(r, 300));

      const finalCreatives = items.map((it) => it.creative);
      setUploadedDataset(finalCreatives, validationResult.records, selectedCsv?.name || 'Uploaded Dataset', finalDiag);

      setStep(4);
      // Navigate to results
      setTimeout(() => {
        navigate('/results');
      }, 400);
    } catch (err) {
      alert('Error during analysis: ' + (err instanceof Error ? err.message : String(err)));
      setStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const mappingValidation = validateColumnMapping(columnMapping);

  return (
    <div className="space-y-8">
      <Header
        title="Upload &amp; Analyze"
        subtitle="Upload your ad images and matching performance data (CSV) to get started."
      />

      {/* Stepper matching mockup (1 Upload -> 2 Validate -> 3 Analyze -> 4 Results) */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-app-border -z-10" />

          {steps.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div key={s.num} className="flex flex-col items-center gap-1.5 bg-lavender-50 px-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-brand-700 text-white'
                      : isCurrent
                      ? 'bg-brand-700 text-white ring-4 ring-brand-100'
                      : 'bg-white border border-app-border text-app-muted'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-brand-700' : 'text-app-muted'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: File Upload */}
      {step === 1 && (
        <div className="max-w-3xl mx-auto space-y-6">
          <FileUpload
            selectedImages={selectedImages}
            selectedCsv={selectedCsv}
            onFilesSelected={handleFilesSelected}
            onClearCsv={handleClearCsv}
            onRemoveImage={handleRemoveImage}
            onLoadDemo={handleLoadDemo}
            onLoadRealDataset={() => {
              loadRealDataset();
              navigate('/dashboard');
            }}
          />

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              size="lg"
              isLoading={isParsing}
              onClick={handleProceedToValidate}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Validate Dataset
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Validate & Map Columns */}
      {step === 2 && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setStep(1)}
            >
              Back to Upload
            </Button>
            <div className="text-xs text-app-muted font-medium">
              File: <span className="font-bold text-app-text">{selectedCsv?.name || 'ads.csv'}</span>
            </div>
          </div>

          {validationResult && (
            <ValidationSummary
              isValid={validationResult.isValid && mappingValidation.isValid}
              totalRows={validationResult.totalParsedRows}
              errorCount={validationResult.errorCount + mappingValidation.missingFields.length}
              warningCount={validationResult.warningCount}
              issues={[
                ...mappingValidation.missingFields.map((f) => ({
                  field: f,
                  message: `Required mapping missing: ${f}`,
                  severity: 'error' as const,
                })),
                ...validationResult.issues,
              ]}
            />
          )}

          <ColumnMapper
            headers={csvHeaders}
            mapping={columnMapping}
            onMappingChange={handleMappingChange}
            previewRows={rawRows}
          />

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={!validationResult?.isValid || !mappingValidation.isValid}
              onClick={handleRunAnalysis}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Run Analysis
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Analyze Progress */}
      {step === 3 && (
        <div className="max-w-md mx-auto py-16 text-center space-y-6 bg-white rounded-3xl p-8 border border-app-border shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto shadow-inner animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-app-text mb-1">Analyzing Creative Data</h3>
            <p className="text-xs text-app-muted">{analyzeProgress}</p>
          </div>
          <div className="w-full bg-lavender-100 h-2 rounded-full overflow-hidden">
            <div className="bg-brand-700 h-full w-3/4 animate-pulse rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
};
