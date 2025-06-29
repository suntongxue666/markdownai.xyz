"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import Link from 'next/link';
import {
  Upload,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
  FileIcon,
  Zap,
  Copy,
  User,
  Globe,
  Calendar,
  Laptop,
  HelpCircle,
  Code,
  FileType,
} from "lucide-react";
import { toast } from "sonner";

const SUPPORTED_FILES = [
  { ext: "HTML", desc: "HyperText Markup Language" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface ConversionState {
  status: 'idle' | 'uploading' | 'converting' | 'success' | 'error';
  progress: number;
  file?: File;
  result?: string;
  error?: string;
}

interface ConversionLog {
  id: number;
  date: string;
  location: string;
  browser: string;
  message: string;
  avatarSeed: string;
}

const generateMockConversionLogs = (count: number): ConversionLog[] => {
  const logs: ConversionLog[] = [];
  const countryCityMap: { [key: string]: string[] } = {
    'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
    'China': ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Chengdu'],
    'India': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'],
    'Brazil': ['Rio de Janeiro', 'Sao Paulo', 'Brasília', 'Salvador', 'Fortaleza'],
    'UK': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Nagoya', 'Sapporo'],
  };
  const countries = Object.keys(countryCityMap);
  const browsers = ['Chrome', 'Firefox', 'Edge', 'Safari', 'Brave'];
  const messages = [
    "Transform HTML to markdown by www.markdownai.xyz. It's so great make html to markdown converter.",
    "Converted a complex HTML page quickly!",
    "Amazing tool for converting HTML to Markdown. Highly recommended!",
    "Finally found a reliable HTML to Markdown converter.",
    "Seamless conversion experience from web pages.",
    "Very useful for my workflow, turning HTML into editable Markdown.",
    "Efficient and accurate conversion from HTML to Markdown.",
    "Perfect for extracting content from web pages for documentation.",
    "The best online HTML to Markdown tool I've used!",
    "Quick and clean results every time for HTML.",
    "Saved me hours of manual reformatting from HTML.",
    "A fantastic solution for developers working with web content.",
    "Loved how easy it was to convert my HTML snippets.",
    "Fast and reliable, exceeded my expectations for HTML conversion.",
    "The output Markdown from HTML is clean and easy to work with."
  ];

  const getDateNDaysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const recentDaysCount = 4;
  for (let i = 0; i < recentDaysCount; i++) {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const randomCity = countryCityMap[randomCountry][Math.floor(Math.random() * countryCityMap[randomCountry].length)];
    logs.push({
      id: i + 1,
      date: getDateNDaysAgo(i),
      location: `${randomCountry}, ${randomCity}`,
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      avatarSeed: `html-seed-${Math.random().toString(36).substring(7)}`,
    });
  }

  for (let i = recentDaysCount; i < count; i++) {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const randomCity = countryCityMap[randomCountry][Math.floor(Math.random() * countryCityMap[randomCountry].length)];
    logs.push({
      id: i + 1,
      date: getDateNDaysAgo(Math.floor(Math.random() * 360) + 4),
      location: `${randomCountry}, ${randomCity}`,
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      avatarSeed: `html-seed-${Math.random().toString(36).substring(7)}`,
    });
  }

  return logs;
};

export default function HtmlToMarkdownPage() {
  const [conversion, setConversion] = useState<ConversionState>({
    status: 'idle',
    progress: 0
  });
  const [recentConversions, setRecentConversions] = useState<ConversionLog[]>([]);

  useEffect(() => {
    setRecentConversions(generateMockConversionLogs(15));
  }, []);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        toast.error('File size must be less than 10MB');
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
      'text/html': ['.html'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const handleFileConversion = async (file: File) => {
    try {
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

  const handleCopyMarkdown = () => {
    if (conversion.result) {
      navigator.clipboard.writeText(conversion.result)
        .then(() => {
          toast.success('Markdown copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy markdown: ', err);
          toast.error('Failed to copy markdown.');
        });
    } else {
      toast.info('No markdown to copy!');
    }
  };

  return (
    <div className="flex flex-col">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center apple-shadow-lg">
                <Code className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Convert HTML to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Markdown
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
            How to convert html to markdown, Select a file to this HTML convert markdown,After 15-90 secs, html to markdown converter will complete it.
          </p>
        </div>

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
                    {isDragActive ? 'Drop your HTML file here' : 'Choose an HTML file or drag it here'}
                  </h3>

                  <p className="text-gray-600 mb-6">
                    Only HTML files are supported for this converter. Max size: 10MB
                  </p>

                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-64">
                    <FileIcon className="w-5 h-5 mr-2" />
                    Select HTML File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(conversion.status === 'uploading' || conversion.status === 'converting') && (
          <Card className="frosted-glass">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {conversion.status === 'uploading' ? 'Uploading HTML file...' : 'Converting HTML to Markdown...'}
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

        {conversion.status === 'success' && (
          <div className="space-y-6">
            <Card className="frosted-glass border-green-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    HTML Conversion Complete!
                  </h3>

                  <p className="text-gray-600 mb-6">
                    Your HTML document has been successfully converted to Markdown
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={downloadMarkdown} size="lg" className="bg-green-600 hover:bg-green-700">
                      <Download className="w-5 h-5 mr-2" />
                      Download Markdown
                    </Button>

                    <Button onClick={resetConversion} variant="outline" size="lg">
                      Convert Another HTML File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="frosted-glass">
              <CardHeader className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <FileType className="w-5 h-5 mr-2" />
                    Markdown Preview
                  </CardTitle>
                  <CardDescription>
                    Preview of your converted Markdown content
                  </CardDescription>
                </div>
                <Button
                  onClick={handleCopyMarkdown}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Markdown
                </Button>
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

        {conversion.status === 'error' && (
          <Card className="frosted-glass border-red-200">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  HTML Conversion Failed
                </h3>

                <p className="text-gray-600 mb-6">
                  {conversion.error || 'An error occurred while converting your HTML file'}
                </p>

                <Button onClick={resetConversion} size="lg">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose{" "}
            <Link href="/" className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
              MarkdownAI
            </Link>
            ?
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
                <FileIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Formats</h3>
              <p className="text-gray-600">
                Support for PDF, Word, PowerPoint, Excel, and many other file types.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            They transformed HTML to markdown
          </h2>
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-6 w-max">
              {recentConversions.map((log) => (
                <Card
                  key={log.id}
                  className="frosted-glass p-6
                             w-[280px]
                             flex-shrink-0
                             flex flex-col items-start
                            "
                >
                  <CardContent className="p-0 flex flex-col w-full">
                    <div className="flex items-center mb-4">
                      <img
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${log.avatarSeed}&size=48&radius=50&backgroundColor=b6e3f4,c0aede,d1d4f9,a6e3e9,f9d0c2`}
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full mr-4 flex-shrink-0"
                      />
                      <div>
                        <p className="text-base font-semibold text-gray-900 flex items-center">
                          <User className="w-4 h-4 mr-1 text-gray-500" />
                          User {log.id}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Laptop className="w-4 h-4 mr-1 text-gray-400" />
                          {log.browser}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {log.date}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 flex items-center">
                      <Globe className="w-4 h-4 mr-1 text-gray-400" />
                      {log.location}
                    </p>
                    <p className="text-gray-800 font-medium leading-relaxed flex-grow">
                      {log.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            HTML to Markdown Converter FAQ
          </h2>
          <div className="space-y-6">
            <Card className="frosted-glass p-6">
              <CardTitle className="text-lg font-semibold mb-2 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                What is Markdown and why convert HTML to it?
              </CardTitle>
              <CardDescription>
                Markdown is a lightweight markup language for creating formatted text using a plain-text editor. Converting HTML to Markdown simplifies web content for reusability, easier editing, and integration into non-HTML platforms.
              </CardDescription>
            </Card>
            <Card className="frosted-glass p-6">
              <CardTitle className="text-lg font-semibold mb-2 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                How accurate is the HTML to Markdown conversion?
              </CardTitle>
              <CardDescription>
                Our AI-powered converter aims for high fidelity, handling various HTML structures including tables, lists, and links. Complex or heavily styled HTML might require minor adjustments to the output Markdown.
              </CardDescription>
            </Card>
            <Card className="frosted-glass p-6">
              <CardTitle className="text-lg font-semibold mb-2 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                Is my data secure during conversion?
              </CardTitle>
              <CardDescription>
                Yes, your privacy is our priority. Files uploaded are processed securely and are typically deleted from our servers shortly after conversion. We do not store your content long-term.
              </CardDescription>
            </Card>
          </div>
        </div>
      </div>
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
