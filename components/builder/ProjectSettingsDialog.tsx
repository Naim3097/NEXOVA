'use client';

import { useState, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { currentProjectAtom, elementsAtom, sortedElementsAtom } from '@/store/builder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { generateHTML } from '@/lib/publishing/html-generator';
import {
  convertTemplate,
  detectSource,
  validateConvertedTemplate,
  ConvertedTemplate,
} from '@/lib/template-converter';
import {
  X,
  Settings,
  Download,
  Upload,
  FileJson,
  FileCode,
  CheckCircle,
  AlertCircle,
  Loader2,
  Info,
  Sparkles,
} from 'lucide-react';

interface ProjectSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: ImportedProjectData) => Promise<void>;
}

export interface ImportedProjectData {
  project: {
    name: string;
    description?: string;
    seo_settings?: any;
  };
  elements: Array<{
    type: string;
    order: number;
    props: Record<string, any>;
  }>;
}

interface ExportedTemplate {
  version: '1.0';
  exportedAt: string;
  project: {
    name: string;
    description: string | null;
    seo_settings: any;
  };
  elements: Array<{
    type: string;
    order: number;
    props: Record<string, any>;
  }>;
}

export function ProjectSettingsDialog({
  open,
  onOpenChange,
  onImport,
}: ProjectSettingsDialogProps) {
  const currentProject = useAtomValue(currentProjectAtom);
  const elements = useAtomValue(elementsAtom);
  const sortedElements = useAtomValue(sortedElementsAtom);

  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
    details?: string[];
  }>({ type: null, message: '', details: [] });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  // Export as JSON
  const handleExportJSON = () => {
    if (!currentProject) return;

    const exportData: ExportedTemplate = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      project: {
        name: currentProject.name,
        description: currentProject.description,
        seo_settings: currentProject.seo_settings,
      },
      elements: sortedElements.map((el) => ({
        type: el.type,
        order: el.order,
        props: el.props,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export as HTML
  const handleExportHTML = () => {
    if (!currentProject) return;

    const html = generateHTML(currentProject, sortedElements, null);

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle file selection for import
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportStatus({ type: null, message: '', details: [] });

    try {
      const text = await file.text();
      let jsonData: any;

      try {
        jsonData = JSON.parse(text);
      } catch {
        throw new Error('Invalid JSON file. Please check the file format.');
      }

      // Detect the source format
      const detection = detectSource(jsonData);
      console.log('Detected source:', detection);

      // Convert the template to our format
      const convertedTemplate = convertTemplate(jsonData);

      // Validate the converted template
      const validation = validateConvertedTemplate(convertedTemplate);
      if (!validation.valid) {
        throw new Error(`Conversion failed: ${validation.errors.join(', ')}`);
      }

      // Call the import handler
      await onImport({
        project: convertedTemplate.project,
        elements: convertedTemplate.elements,
      });

      // Build success message with conversion details
      const details: string[] = [];
      if (convertedTemplate.source !== 'native') {
        details.push(`Converted from ${formatSourceName(convertedTemplate.source)} format`);
      }
      if (convertedTemplate.conversionNotes && convertedTemplate.conversionNotes.length > 0) {
        details.push(...convertedTemplate.conversionNotes);
      }

      setImportStatus({
        type: 'success',
        message: `Successfully imported ${convertedTemplate.elements.length} elements from "${convertedTemplate.project.name}"`,
        details: details.length > 0 ? details : undefined,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to import template',
      });
    } finally {
      setImporting(false);
    }
  };

  // Format source name for display
  const formatSourceName = (source: string): string => {
    const names: Record<string, string> = {
      native: 'Native',
      product_page: 'Product Page',
      elementor: 'Elementor',
      webflow: 'Webflow',
      unbounce: 'Unbounce',
      leadpages: 'Leadpages',
      clickfunnels: 'ClickFunnels',
      instapage: 'Instapage',
      carrd: 'Carrd',
      framer: 'Framer',
      generic: 'Generic',
      unknown: 'Unknown',
    };
    return names[source] || source;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Project Settings</h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('export')}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'export'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Template
              </div>
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'import'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Template
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'export' && (
            <div className="space-y-6">
              {/* Project Info */}
              <Card className="p-4 bg-gray-50">
                <h3 className="font-semibold text-sm mb-2">Current Project</h3>
                <p className="text-gray-900 font-medium">
                  {currentProject?.name || 'Untitled Project'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {elements.length} {elements.length === 1 ? 'element' : 'elements'}
                </p>
              </Card>

              {/* Export Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-900">Export Options</h3>

                {/* JSON Export */}
                <Card
                  className="p-4 border-2 border-gray-200 hover:border-blue-500 cursor-pointer transition-colors"
                  onClick={handleExportJSON}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileJson className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Export as JSON Template</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Download your project as a JSON file. This format can be imported back into
                        the builder to recreate your page structure.
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        Best for: Backup, sharing templates, transferring between projects
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400" />
                  </div>
                </Card>

                {/* HTML Export */}
                <Card
                  className="p-4 border-2 border-gray-200 hover:border-green-500 cursor-pointer transition-colors"
                  onClick={handleExportHTML}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileCode className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Export as HTML</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Download your page as a standalone HTML file with all styles included. Ready
                        to host anywhere.
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        Best for: Self-hosting, sharing as a static page, offline viewing
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400" />
                  </div>
                </Card>
              </div>

              {/* Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Payment elements and integrations may require
                  reconfiguration after import, as API keys and credentials are not exported for
                  security reasons.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-6">
              {/* Import Instructions */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm text-blue-900 mb-2">Smart Template Import</h3>
                    <p className="text-sm text-blue-800">
                      Upload a JSON template file from any supported page builder. Our converter will
                      automatically detect the format and convert it to work with our builder.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Supported Formats */}
              <Card className="p-4 bg-gray-50">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Supported Formats</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Native (Our format)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Product Page JSON</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Elementor</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Webflow</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>ClickFunnels</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Generic JSON</span>
                  </div>
                </div>
              </Card>

              {/* File Upload */}
              <div className="space-y-4">
                <Label htmlFor="template-file">Select Template File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="template-file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={importing}
                  />
                  <label
                    htmlFor="template-file"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <span className="text-sm text-gray-600">Importing template...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Click to select a <strong>.json</strong> template file
                        </span>
                        <span className="text-xs text-gray-500">
                          or drag and drop here
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Import Status */}
              {importStatus.type && (
                <Card
                  className={`p-4 ${
                    importStatus.type === 'success'
                      ? 'bg-green-50 border-green-200'
                      : importStatus.type === 'info'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {importStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : importStatus.type === 'info' ? (
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          importStatus.type === 'success'
                            ? 'text-green-800'
                            : importStatus.type === 'info'
                            ? 'text-blue-800'
                            : 'text-red-800'
                        }`}
                      >
                        {importStatus.message}
                      </p>
                      {importStatus.details && importStatus.details.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {importStatus.details.map((detail, index) => (
                            <li
                              key={index}
                              className={`text-xs ${
                                importStatus.type === 'success'
                                  ? 'text-green-700'
                                  : importStatus.type === 'info'
                                  ? 'text-blue-700'
                                  : 'text-red-700'
                              }`}
                            >
                              • {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Warning:</strong> Importing a template will replace all current elements
                  on this page. Make sure to save or export your current work first if needed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
