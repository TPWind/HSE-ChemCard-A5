import React from 'react';
import { X, CheckCircle, SplitSquareVertical } from 'lucide-react';
import { ChemCardData } from '../types/chemCard';
import { A5ChemCard } from './A5ChemCard';

interface TemplateComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: ChemCardData;
}

export const TemplateComparisonModal: React.FC<TemplateComparisonModalProps> = ({
  isOpen,
  onClose,
  currentData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full border border-gray-200 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-[#111827] text-white px-6 py-3.5 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C8102E] text-white">
              <SplitSquareVertical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                So Sánh Đối Chiếu Với Mẫu Gốc (Template A5)
              </h2>
              <p className="text-xs text-gray-300">
                Đối chiếu độ chuẩn xác layout, màu sắc, biểu trưng GHS, PPE, Sơ cứu và Bảo quản
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start justify-items-center">
            
            {/* Left: Original Template */}
            <div className="flex flex-col items-center w-full max-w-[400px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                  Mẫu Gốc Đính Kèm (Template)
                </span>
              </div>
              <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-300 w-full overflow-hidden flex justify-center">
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_jych3sjych3sjych_0a889308.png"
                  alt="Template Thẻ An Toàn Hóa Chất A5"
                  className="w-full h-auto max-h-[650px] object-contain rounded-xl"
                  onError={(e) => {
                    // Fallback to relative public path
                    (e.target as HTMLElement).setAttribute('src', 'public/assets/aistudio/Gemini_Generated_Image_jych3sjych3sjych_0a889308.png');
                  }}
                />
              </div>
              <p className="text-[11px] text-gray-500 text-center mt-2">
                Hình ảnh mẫu chuẩn Loctite 4311 khổ A5 do bạn cung cấp
              </p>
            </div>

            {/* Right: Live Rendered Card */}
            <div className="flex flex-col items-center w-full max-w-[400px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                  Thẻ AI Trích Xuất & Hiển Thị Trực Tiếp
                </span>
                <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Vector In Ấn
                </span>
              </div>
              <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-300 w-full flex justify-center overflow-hidden">
                <div className="transform scale-[0.68] sm:scale-[0.72] origin-top mb-[-190px]">
                  <A5ChemCard data={currentData} />
                </div>
              </div>
              <p className="text-[11px] text-gray-500 text-center mt-2">
                Được dựng bằng vector SVG sắc nét đạt chuẩn in ấn A5 (148mm × 210mm)
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#111827] hover:bg-gray-800 rounded-xl transition-all"
          >
            Đã hiểu, quay lại màn hình chính
          </button>
        </div>

      </div>
    </div>
  );
};
