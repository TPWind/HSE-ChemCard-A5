import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileCode,
  Sparkles,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { ChemCardData } from '../types/chemCard';
import { SAMPLE_CHEMICALS } from '../data/sampleChemicals';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (cardData: ChemCardData) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'preset'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErrorMessage(null);
    }
  };

  const processExtraction = async (payload: {
    text?: string;
    fileData?: string;
    mimeType?: string;
    fileName?: string;
  }) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setProgressStep(1);

    try {
      // Step 1: Document reading
      await new Promise((r) => setTimeout(r, 600));
      setProgressStep(2);

      // Step 2: Request server-side Gemini 3.8 Flash
      const response = await fetch('/api/extract-sds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Lỗi máy chủ (${response.status})`);
      }

      setProgressStep(3);
      const cardData: ChemCardData = await response.json();
      await new Promise((r) => setTimeout(r, 400));

      onSuccess(cardData);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Không thể trích xuất thông tin SDS. Vui lòng kiểm tra lại tài liệu.');
    } finally {
      setIsProcessing(false);
      setProgressStep(0);
    }
  };

  const handleSubmit = async () => {
    if (activeTab === 'upload') {
      if (!file) {
        setErrorMessage('Vui lòng chọn một tập tin tài liệu SDS/MSDS (PDF, ảnh hoặc txt).');
        return;
      }

      const reader = new FileReader();
      const isTextFile = file.type === 'text/plain' || file.name.endsWith('.txt');

      if (isTextFile) {
        reader.onload = (e) => {
          const text = e.target?.result as string;
          processExtraction({ text, fileName: file.name });
        };
        reader.readAsText(file);
      } else {
        reader.onload = (e) => {
          const resultStr = e.target?.result as string;
          // extract base64 part
          const base64Data = resultStr.split(',')[1];
          processExtraction({
            fileData: base64Data,
            mimeType: file.type || 'application/pdf',
            fileName: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } else if (activeTab === 'paste') {
      if (!pastedText.trim()) {
        setErrorMessage('Vui lòng dán nội dung các mục từ tài liệu SDS/MSDS vào ô.');
        return;
      }
      processExtraction({ text: pastedText, fileName: 'Văn bản SDS dán trực tiếp' });
    }
  };

  const handleSelectPreset = (sample: ChemCardData) => {
    onSuccess(sample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#111827] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C8102E] text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Nhập Tài Liệu SDS / MSDS</h2>
              <p className="text-xs text-gray-300">
                AI HSE tự động phân tích và trích xuất thẻ an toàn kho khổ A5 theo chuẩn GHS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-[#C8102E] text-[#C8102E]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Tải lên Tập Tin (PDF/Ảnh)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-[#C8102E] text-[#C8102E]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Dán Văn Bản SDS
          </button>
          <button
            onClick={() => setActiveTab('preset')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'preset'
                ? 'border-[#C8102E] text-[#C8102E]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Dùng Mẫu Hóa Chất Sẵn Có
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  file
                    ? 'border-[#C8102E] bg-red-50/20'
                    : 'border-gray-300 hover:border-[#C8102E] hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/webp,text/plain"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-[#C8102E] mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                {file ? (
                  <div>
                    <p className="text-sm font-bold text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024).toFixed(1)} KB • Nhấn để thay đổi tập tin
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Kéo thả tập tin SDS/MSDS vào đây hoặc nhấn để duyệt
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Hỗ trợ PDF (đầy đủ các trang), Hình ảnh (PNG, JPG), hoặc Text
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Mẹo chuyên gia HSE:</span> Gemini 3.8 Flash có thể đọc trực tiếp các file SDS tiếng Anh hoặc tiếng Việt dài nhiều trang, tự động phân loại biểu trưng GHS (H-code, P-code, PPE) chuẩn xác.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700">
                Dán nội dung từ tài liệu SDS/MSDS (Mục 1, 2, 4, 7, 8):
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Ví dụ dán các phần:&#10;1. Tên sản phẩm: LOCTITE 4311 Light Cure Adhesive&#10;2. Nhận diện mối nguy: H315, H319, H335, Warning&#10;3. Biện pháp sơ cứu: Da, mắt, hô hấp...&#10;4. Bảo quản & Tràn đổ..."
                rows={8}
                className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C8102E] focus:border-transparent outline-none font-mono"
              />
            </div>
          )}

          {activeTab === 'preset' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-600">
                Chọn ngay một hóa chất chuẩn để trải nghiệm thẻ an toàn A5 tức thì:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SAMPLE_CHEMICALS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectPreset(sample)}
                    className="p-3 border border-gray-200 rounded-xl hover:border-[#C8102E] hover:bg-red-50/20 cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 group-hover:text-[#C8102E]">
                          {sample.productName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-700 font-semibold rounded">
                          {sample.chemicalCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">{sample.productSubtitle}</p>
                      <p className="text-[10px] text-gray-500 italic">{sample.chemicalFamily}</p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#C8102E] font-semibold">
                      <span>{sample.signalWord}</span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Chọn mẫu <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="mt-5 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-[#C8102E] animate-spin" />
                <span className="text-xs font-bold text-gray-900">
                  Hệ thống HSE AI đang phân tích tài liệu SDS...
                </span>
              </div>
              <div className="space-y-1.5">
                <div className={`text-xs flex items-center gap-2 ${progressStep >= 1 ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                  {progressStep > 1 ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                  1. Đọc và giải mã dữ liệu tài liệu
                </div>
                <div className={`text-xs flex items-center gap-2 ${progressStep >= 2 ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                  {progressStep > 2 ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                  2. Trích xuất mã H, P, GHS Pictograms & hướng dẫn sơ cứu
                </div>
                <div className={`text-xs flex items-center gap-2 ${progressStep >= 3 ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                  {progressStep >= 3 ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                  3. Tổng hợp và điền vào Thẻ An toàn Kho khổ A5
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Đóng
          </button>
          {activeTab !== 'preset' && (
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="px-5 py-2 text-xs font-bold text-white bg-[#C8102E] hover:bg-[#a50d25] disabled:opacity-50 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang trích xuất...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Bắt đầu trích xuất Thẻ A5
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
