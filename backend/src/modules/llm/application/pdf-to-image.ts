import { fromBuffer } from 'pdf2pic';

export async function convertPdfToImageBase64(
    pdfBuffer: Buffer,
): Promise<string> {
    const options = {
        density: 300,
        saveFilename: 'page',
        savePath: '/tmp',
        format: 'png',
        width: 2480, // A4 width at 300 DPI
        height: 3508, // A4 height at 300 DPI
    };

    const convert = fromBuffer(pdfBuffer, options);
    const result = await convert(1, { responseType: 'base64' });

    if (!result || !result.base64) {
        throw new Error('Falha ao converter PDF para imagem Base64.');
    }

    return result.base64;
}
