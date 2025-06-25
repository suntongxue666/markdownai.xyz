"use client";

import { useState, useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
  FileIcon,
  Sparkles,
  FileType,
  Zap
} from "lucide-react";
import { toast } from "sonner";

const SUPPORTED_FILES = [
  { ext: "PDF", desc: "Portable Document Format" },
  { ext: "DOCX", desc: "Microsoft Word Document" },
  { ext: "PPTX", desc: "Microsoft PowerPoint" },
  { ext: "XLSX", desc: "Microsoft Excel" },
  { ext: "TXT", desc: "Plain Text File" },
  { ext: "HTML", desc: "Web Page" },
  { ext: "CSV", desc: "Comma Separated Values" },
  { ext: "JSON", desc: "JavaScript Object Notation" },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ConversionState {
  status: 'idle' | 'uploading' | 'converting' | 'success' | 'error';
  progress: number;
  file?: File;
  result?: string;
  error?: string;
}

export default function HomePage() {
  const [conversion, setConversion] = useState<ConversionState>({
    status: 'idle',
    progress: 0
  });

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        toast.error('File size must be less than 5MB');
      } else {
        toast.error('Please select a supported file format');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setConversion({ status: 'uploading', progress: 0, file });
      handleFileConversion(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'text/html': ['.html'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const handleFileConversion = async (file: File) => {
    try {
      // Simulate upload progress
      for (let i = 0; i <= 30; i += 10) {
        setConversion(prev => ({ ...prev, progress: i }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setConversion(prev => ({ ...prev, status: 'converting', progress: 40 }));

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      // Simulate conversion progress
      for (let i = 50; i <= 90; i += 10) {
        setConversion(prev => ({ ...prev, progress: i }));
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const result = await response.json();

      setConversion({
        status: 'success',
        progress: 100,
        file,
        result: result.markdown
      });

      toast.success('File converted successfully!');
    } catch (error) {
      setConversion({
        status: 'error',
        progress: 0,
        file,
        error: error instanceof Error ? error.message : 'Conversion failed'
      });
      toast.error('Failed to convert file');
    }
  };

  const downloadMarkdown = () => {
    if (!conversion.result || !conversion.file) return;

    const blob = new Blob([conversion.result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${conversion.file.name.split('.')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetConversion = () => {
    setConversion({ status: 'idle', progress: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">MarkdownAI</span>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center apple-shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
              Convert Documents to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Markdown
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
              Transform your PDF, Word, PowerPoint, and other documents into clean,
              structured Markdown format. Perfect for developers, writers, and content creators.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {SUPPORTED_FILES.slice(0, 4).map((file) => (
                <Badge key={file.ext} variant="outline" className="frosted-glass">
                  {file.ext}
                </Badge>
              ))}
              <Badge variant="outline" className="frosted-glass">
                +{SUPPORTED_FILES.length - 4} more
              </Badge>
            </div>
          </div>

          {/* Conversion Interface */}
          {conversion.status === 'idle' && (
            <Card className="frosted-glass border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-12">
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      {isDragActive ? (
                        <Download className="w-8 h-8 text-blue-600" />
                      ) : (
                        <Upload className="w-8 h-8 text-blue-600" />
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {isDragActive ? 'Drop your file here' : 'Choose a file or drag it here'}
                    </h3>

                    <p className="text-gray-600 mb-6">
                      Support for PDF, Word, PowerPoint, Excel, and more. Max size: 5MB
                    </p>

                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <FileIcon className="w-5 h-5 mr-2" />
                      Select File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing State */}
          {(conversion.status === 'uploading' || conversion.status === 'converting') && (
            <Card className="frosted-glass">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {conversion.status === 'uploading' ? 'Uploading file...' : 'Converting to Markdown...'}
                  </h3>

                  <p className="text-gray-600 mb-6">
                    Processing: {conversion.file?.name}
                  </p>

                  <div className="max-w-md mx-auto mb-4">
                    <Progress value={conversion.progress} className="h-2" />
                  </div>

                  <p className="text-sm text-gray-500">
                    {conversion.progress}% complete
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success State */}
          {conversion.status === 'success' && (
            <div className="space-y-6">
              <Card className="frosted-glass border-green-200">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Conversion Complete!
                    </h3>

                    <p className="text-gray-600 mb-6">
                      Your document has been successfully converted to Markdown
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={downloadMarkdown} size="lg" className="bg-green-600 hover:bg-green-700">
                        <Download className="w-5 h-5 mr-2" />
                        Download Markdown
                      </Button>

                      <Button onClick={resetConversion} variant="outline" size="lg">
                        Convert Another File
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="frosted-glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileType className="w-5 h-5 mr-2" />
                    Markdown Preview
                  </CardTitle>
                  <CardDescription>
                    Preview of your converted Markdown content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={conversion.result}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Converted markdown will appear here..."
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error State */}
          {conversion.status === 'error' && (
            <Card className="frosted-glass border-red-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Conversion Failed
                  </h3>

                  <p className="text-gray-600 mb-6">
                    {conversion.error || 'An error occurred while converting your file'}
                  </p>

                  <Button onClick={resetConversion} size="lg">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose MarkdownAI?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">
                  Convert your documents in seconds with our optimized processing engine.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">High Quality</h3>
                <p className="text-gray-600">
                  Preserves formatting, tables, and document structure in clean Markdown.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Formats</h3>
                <p className="text-gray-600">
                  Support for PDF, Word, PowerPoint, Excel, and many other file types.
                </p>
              </div>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Supported File Formats
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SUPPORTED_FILES.map((file) => (
                <div key={file.ext} className="frosted-glass p-4 rounded-xl text-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <FileIcon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="font-medium text-gray-900">{file.ext}</div>
                  <div className="text-xs text-gray-500">{file.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 apple-blur">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2025 MarkdownAI Converter.</p>
            <p className="text-sm mt-2">
              Convert your documents to Markdown with confidence and quality.
              PDF to Markdown, Word to Markdown, html to Markdown,PPT to Markdown,
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
