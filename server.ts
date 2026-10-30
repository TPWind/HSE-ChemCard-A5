import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Support large payloads (PDF / images in base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const chemCardSchema = {
  type: Type.OBJECT,
  properties: {
    productName: {
      type: Type.STRING,
      description: "Tên thương mại hóa chất in hoa, ngắn gọn, e.g. 'LOCTITE 4311' hoặc 'ACETONE'",
    },
    productSubtitle: {
      type: Type.STRING,
      description: "Tên mô tả kỹ thuật in hoa, e.g. 'LIGHT CURE ADHESIVE' hoặc 'INDUSTRIAL SOLVENT'",
    },
    chemicalFamily: {
      type: Type.STRING,
      description: "Nhóm hóa chất hoặc bản chất hóa học trong ngoặc đơn, e.g. '(Keo Cyanoacrylate UV)' hoặc '(Dung môi hữu cơ)'",
    },
    chemicalCode: {
      type: Type.STRING,
      description: "Mã hóa chất quản lý nội bộ nếu có trong SDS, hoặc sinh mã định danh ngắn e.g. 'ADH-0001', 'SOLV-0102'",
    },
    manufacturer: {
      type: Type.STRING,
      description: "Tên hãng sản xuất hoặc nhà cung cấp, e.g. 'Henkel'",
    },
    casNumber: {
      type: Type.STRING,
      description: "Số đăng ký CAS chính nếu có trong SDS",
    },
    signalWord: {
      type: Type.STRING,
      description: "Từ cảnh báo GHS chuẩn: 'CẢNH BÁO' (Warning) hoặc 'NGUY HIỂM' (Danger)",
    },
    ghsPictograms: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: "Chọn từ danh sách chuẩn GHS: 'exclamation', 'flame', 'corrosion', 'exploding-bomb', 'gas-cylinder', 'flame-over-circle', 'skull', 'health-hazard', 'environment'",
      },
      description: "Mảng chứa 1 đến 3 biểu trưng nguy hại GHS phù hợp nhất với tài liệu",
    },
    hazardStatements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 đến 4 câu cảnh báo nguy cơ chính kèm mã H-code trong ngoặc, e.g. 'Gây kích ứng da (H315)', 'Gây kích ứng mắt nghiêm trọng (H319)'",
    },
    ppe: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            description: "Loại trang bị: 'glasses', 'gloves', 'clothing', 'mask', 'respirator', 'boots', 'shield'",
          },
          label: {
            type: Type.STRING,
            description: "Nhãn ngắn gọn in hoa tiếng Việt (dưới 4 từ), e.g. 'KÍNH BẢO HỘ', 'GĂNG TAY NITRILE', 'QUẦN ÁO BẢO HỘ', 'KHẨU TRANG khi cần'",
          },
        },
        required: ['type', 'label'],
      },
      description: "Chính xác 3 đến 4 trang bị bảo hộ cá nhân (PPE) cần thiết nhất",
    },
    prevention: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 đến 4 biện pháp phòng ngừa P-code ngắn gọn súc tích tiếng Việt",
    },
    firstAid: {
      type: Type.OBJECT,
      properties: {
        skin: {
          type: Type.STRING,
          description: "Biện pháp sơ cứu khi tiếp xúc da, bắt đầu bằng 'DA: ...'",
        },
        eye: {
          type: Type.STRING,
          description: "Biện pháp sơ cứu khi vào mắt, bắt đầu bằng 'MẮT: ...'",
        },
        inhalation: {
          type: Type.STRING,
          description: "Biện pháp sơ cứu khi hít phải, bắt đầu bằng 'HÍT PHẢI: ...'",
        },
        ingestion: {
          type: Type.STRING,
          description: "Biện pháp sơ cứu khi nuốt phải (nếu cần), bắt đầu bằng 'NUỐT PHẢI: ...'",
        },
      },
      required: ['skin', 'eye', 'inhalation'],
    },
    storage: {
      type: Type.OBJECT,
      properties: {
        temperature: {
          type: Type.STRING,
          description: "Khoảng nhiệt độ bảo quản ngắn gọn, e.g. '2 – 8°C' hoặc '15 – 25°C' hoặc 'Dưới 30°C'",
        },
        condition: {
          type: Type.STRING,
          description: "Điều kiện kho bãi quan trọng nhất, e.g. 'Nơi thoáng mát, tránh nhiệt, tia lửa, nguồn lửa.'",
        },
      },
      required: ['temperature', 'condition'],
    },
    spillResponse: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 bước xử lý tràn đổ cốt lõi nhất trong kho",
    },
  },
  required: [
    'productName',
    'productSubtitle',
    'chemicalFamily',
    'manufacturer',
    'signalWord',
    'ghsPictograms',
    'hazardStatements',
    'ppe',
    'prevention',
    'firstAid',
    'storage',
    'spillResponse',
  ],
};

// API Endpoint to parse SDS / MSDS document
app.post('/api/extract-sds', async (req, res) => {
  try {
    const { text, fileData, mimeType, fileName } = req.body;

    if (!text && !fileData) {
      return res.status(400).json({
        error: 'Vui lòng cung cấp nội dung văn bản SDS hoặc tải lên tập tin PDF/Hình ảnh.',
      });
    }

    const parts: any[] = [];

    // Multimodal payload
    if (fileData && mimeType) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: fileData,
        },
      });
    }

    const promptText = `
Bạn là Chuyên gia Cấp cao về An toàn Sức khỏe Môi trường (HSE Specialist) và Phân loại Hóa chất theo GHS (Globally Harmonized System).
Nhiệm vụ của bạn là phân tích tài liệu Phiếu An toàn Hóa chất (SDS / MSDS) được cung cấp dưới đây và trích xuất dữ liệu chính xác để điền vào "Thẻ An Toàn Hóa Chất Kho Khổ A5" (Chemical Safety Placard/Card).

Quy chuẩn trích xuất:
1. TÊN HÓA CHẤT: Lấy tên thương mại chính xác (in hoa, ngắn gọn), tên mô tả kỹ thuật (subtitle), và bản chất hóa học / nhóm hóa chất.
2. MÃ HÓA CHẤT: Lấy mã sản phẩm / mã quản lý nếu có, hoặc tạo mã tiền tố phù hợp (ví dụ: ADH-0001 cho adhesive, SOLV-0001 cho solvent, ACID-0001 cho axit, CHEM-0001).
3. NHÀ SẢN XUẤT: Tên công ty/nhà sản xuất (ví dụ: Henkel, SK, Merck, v.v.).
4. PHÂN LOẠI NGUY HIỂM:
   - Từ cảnh báo: Chỉ chọn "CẢNH BÁO" (Warning) hoặc "NGUY HIỂM" (Danger).
   - Biểu trưng GHS: Chọn chính xác 1 đến 3 biểu trưng ('exclamation', 'flame', 'corrosion', 'exploding-bomb', 'gas-cylinder', 'flame-over-circle', 'skull', 'health-hazard', 'environment').
   - Câu cảnh báo nguy cơ: 3 câu súc tích kèm mã H-code chuẩn (ví dụ: 'Gây kích ứng da (H315)', 'Gây kích ứng mắt nghiêm trọng (H319)').
5. TRANG BỊ BẢO HỘ CÁ NHÂN (PPE): 3-4 trang bị cốt lõi (kính bảo hộ, găng tay nitrile/chống hóa chất, quần áo bảo hộ, khẩu trang/mặt nạ lọc hơi). Nhãn ngắn gọn dưới 4 từ in hoa tiếng Việt.
6. PHÒNG NGỪA: 3-4 câu ngắn súc tích, thực tế cho nhân viên thủ kho và công nhân sản xuất.
7. SƠ CỨU: Hướng dẫn khẩn cấp rõ ràng cho DA, MẮT, HÍT PHẢI, NUỐT PHẢI. Bắt đầu bằng tiền tố 'DA: ', 'MẮT: ', 'HÍT PHẢI: '.
8. BẢO QUẢN: Nhiệt độ khuyến nghị cụ thể (ví dụ: '2 – 8°C' hoặc '15 – 25°C' hoặc 'Dưới 30°C') và điều kiện kho lưu trữ.
9. XỬ LÝ TRÀN ĐỔ: 3 hành động an toàn khi xảy ra sự cố rò rỉ hoặc đổ vỡ tại kho.

${text ? `Dưới đây là nội dung văn bản trích từ tài liệu SDS/MSDS:\n"""\n${text}\n"""` : ''}
${fileName ? `Tên tập tin tài liệu: ${fileName}` : ''}
`;

    parts.push({ text: promptText });

    // Call Gemini with model fallback for high availability
    let response: any = null;
    let lastError: any = null;
    const modelsToTry = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.8-flash'];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying extraction with model: ${modelName}`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: parts,
          config: {
            systemInstruction:
              'Bạn là Chuyên gia HSE hàng đầu. Trả về kết quả phân tích SDS/MSDS dưới định dạng JSON theo đúng schema quy định, dịch thuật chuẩn xác sang tiếng Việt theo thuật ngữ An toàn hóa chất chuẩn TCVN và GHS.',
            responseMimeType: 'application/json',
            responseSchema: chemCardSchema,
          },
        });
        if (response && response.text) {
          console.log(`Extraction succeeded with ${modelName}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} attempt failed:`, err?.message || err);
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('Không nhận được phản hồi từ mô hình AI sau các lần thử lại.');
    }

    let responseText = (response.text || '').trim();
    if (!responseText) {
      throw new Error('Không nhận được phản hồi từ mô hình AI.');
    }

    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedData = JSON.parse(responseText);
    const result = {
      ...parsedData,
      id: `chem-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      sourceDocName: fileName || 'Nhập thủ công SDS',
    };

    return res.json(result);
  } catch (error: any) {
    console.error('Error extracting SDS data:', error);
    return res.status(500).json({
      error: error?.message || 'Có lỗi xảy ra khi phân tích tài liệu SDS/MSDS.',
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
