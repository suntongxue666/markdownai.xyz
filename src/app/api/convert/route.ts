import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileName = file.name.toLowerCase();
    const supportedExtensions = ['.pdf', '.docx', '.pptx', '.xlsx', '.txt', '.html', '.csv', '.json'];
    const isSupported = supportedExtensions.some(ext => fileName.endsWith(ext));

    if (!isSupported) {
      return NextResponse.json(
        { error: 'Unsupported file format' },
        { status: 400 }
      );
    }

    // For now, return a mock response since we haven't set up Python backend yet
    // This will be replaced with actual MarkItDown processing
    const mockMarkdown = generateMockMarkdown(file);

    return NextResponse.json({
      markdown: mockMarkdown,
      originalFileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Internal server error during conversion' },
      { status: 500 }
    );
  }
}

// Mock function to simulate markdown conversion
// This will be replaced with actual MarkItDown integration
function generateMockMarkdown(file: File): string {
  const fileName = file.name;
  const fileType = fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN';

  return `# Converted Document: ${fileName}

This is a **mock conversion** of your ${fileType} file. In the actual implementation, this would be the real markdown content converted from your document using Microsoft's MarkItDown library.

## Document Information

- **File Name:** ${fileName}
- **File Size:** ${(file.size / 1024).toFixed(2)} KB
- **File Type:** ${fileType}
- **Conversion Date:** ${new Date().toISOString()}

## Sample Content

This is where the actual content of your document would appear. The MarkItDown library preserves:

### Formatting Features
- **Bold text**
- *Italic text*
- Lists and bullet points
- Tables and data structures
- Headers and subheaders
- Links and references

### Supported Elements
1. Text formatting
2. Document structure
3. Tables and data
4. Images (with descriptions)
5. Lists and enumerations

### Table Example

| Feature | Status | Notes |
|---------|--------|-------|
| Text Extraction | ✅ | Full support |
| Table Conversion | ✅ | Preserves structure |
| Image Descriptions | ✅ | AI-powered |
| Formatting | ✅ | Clean output |

## Next Steps

To implement full functionality:
1. Set up Python environment with MarkItDown
2. Create file processing pipeline
3. Integrate with Supabase for storage
4. Add error handling and validation

---

*This is a demonstration of the conversion output. The actual implementation will process your ${fileType} file and extract all text, formatting, and structural elements.*`;
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'MarkItDown Converter API',
      version: '1.0.0',
      supportedFormats: ['PDF', 'DOCX', 'PPTX', 'XLSX', 'TXT', 'HTML', 'CSV', 'JSON']
    },
    { status: 200 }
  );
}
