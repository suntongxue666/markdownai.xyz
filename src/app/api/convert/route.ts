import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// 从环境变量获取 Python 后端 URL
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';

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

    const backendFormData = new FormData();
    backendFormData.append('file', file);

    console.log(`Forwarding file ${file.name} to Python backend at ${PYTHON_BACKEND_URL}/convert`);

    const pythonResponse = await fetch(`${PYTHON_BACKEND_URL}/convert`, {
      method: 'POST',
      body: backendFormData,
    });

    if (!pythonResponse.ok) {
      const errorText = await pythonResponse.text();
      console.error('Error from Python backend:', pythonResponse.status, errorText);
      return NextResponse.json(
        { error: `Conversion failed: ${errorText}` },
        { status: pythonResponse.status }
      );
    }

    const markdown = await pythonResponse.text();
    console.log(`Successfully received markdown for ${file.name} from Python backend.`);

    return NextResponse.json({
      markdown: markdown,
      originalFileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('Conversion (Next.js side) error:', error);
    return NextResponse.json(
      { error: 'Internal server error during conversion processing' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'MarkDownAI Converter API (Next.js Proxy)',
      version: '1.0.0',
      supportedFormats: ['PDF', 'DOCX', 'PPTX', 'XLSX', 'TXT', 'HTML', 'CSV', 'JSON']
    },
    { status: 200 }
  );
}
