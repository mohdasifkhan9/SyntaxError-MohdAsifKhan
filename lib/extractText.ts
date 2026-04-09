// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParseRaw = require('pdf-parse');
const pdfParse = typeof pdfParseRaw === 'function' ? pdfParseRaw : pdfParseRaw.default;
import mammoth from 'mammoth';

/**
 * Extracts text from a buffer based on its file extension/type.
 * @param buffer - The file buffer downloaded from storage
 * @param fileName - The filename or path (to deduce the extension)
 * @returns The extracted text as string
 */
export async function extractTextFromBuffer(buffer: Buffer, fileName: string): Promise<string> {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      const pdfData = await pdfParse(buffer);
      if (!pdfData || !pdfData.text) {
        throw new Error('Failed to parse text from PDF.');
      }
      return pdfData.text.trim();

    case 'docx':
      const docxData = await mammoth.extractRawText({ buffer });
      if (!docxData || !docxData.value) {
         throw new Error('Failed to parse text from DOCX document.');
      }
      if (docxData.messages && docxData.messages.length > 0) {
        console.warn('Mammoth warnings:', docxData.messages);
      }
      return docxData.value.trim();

    case 'txt':
      const txtStr = buffer.toString('utf-8');
      if (!txtStr) {
        throw new Error('TXT file appears to be empty or invalid encoding.');
      }
      return txtStr.trim();

    case 'doc':
      throw new Error('Older .doc format is not fully supported. Please convert it to .docx first.');

    default:
      throw new Error(`Unsupported file type: ${extension || 'unknown'}. Only PDF, DOCX, and TXT are supported.`);
  }
}
