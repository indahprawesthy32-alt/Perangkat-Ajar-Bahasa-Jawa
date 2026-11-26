export async function generateWithAi<T>(task: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, payload }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Gagal menghasilkan data (${response.status}).`);
  }
  return result.data as T;
}

export interface ExtractedDocumentResult {
  title?: string;
  extractedText?: string;
  detectedQuestions?: Array<{
    no: number;
    bentuk: string;
    pertanyaan: string;
    opsi?: string[];
    kunciJawaban?: string;
  }>;
}

export async function extractDocumentWithAi(params: {
  mimeType?: string;
  base64Data?: string;
  textContent?: string;
  targetMenu?: string;
}): Promise<ExtractedDocumentResult> {
  const response = await fetch('/api/extract-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Gagal membaca isi file (${response.status}).`);
  }
  return result.data as ExtractedDocumentResult;
}
