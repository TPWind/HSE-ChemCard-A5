import React, { useState } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  Shield,
  HeartPulse,
  Thermometer,
  RotateCcw,
} from 'lucide-react';
import { ChemCardData, GHSPictogramType, PPEType } from '../types/chemCard';
import { GHSPictogram, PPEIcon } from './GhsAndPpeIcons';

interface CardEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ChemCardData;
  onSave: (updatedData: ChemCardData) => void;
}

const ALL_GHS_TYPES: { type: GHSPictogramType; label: string }[] = [
  { type: 'exclamation', label: 'Chấm than (Nguy hại)' },
  { type: 'flame', label: 'Dễ cháy' },
  { type: 'corrosion', label: 'Ăn mòn' },
  { type: 'health-hazard', label: 'Nguy hại sức khỏe' },
  { type: 'skull', label: 'Độc cấp tính' },
  { type: 'environment', label: 'Độc môi trường' },
  { type: 'exploding-bomb', label: 'Chất nổ' },
  { type: 'gas-cylinder', label: 'Khí nén' },
  { type: 'flame-over-circle', label: 'Oxy hóa' },
];

const ALL_PPE_TYPES: { type: PPEType; label: string; defaultText: string }[] = [
  { type: 'glasses', label: 'Kính bảo hộ', defaultText: 'KÍNH BẢO HỘ' },
  { type: 'gloves', label: 'Găng tay', defaultText: 'GĂNG TAY NITRILE' },
  { type: 'clothing', label: 'Quần áo bảo hộ', defaultText: 'QUẦN ÁO BẢO HỘ' },
  { type: 'mask', label: 'Khẩu trang', defaultText: 'KHẨU TRANG khi cần' },
  { type: 'respirator', label: 'Mặt nạ phòng độc', defaultText: 'MẶT NẠ LỌC HƠI' },
  { type: 'shield', label: 'Khiên chắn mặt', defaultText: 'KHIÊN CHE MẶT' },
  { type: 'boots', label: 'Ủng bảo hộ', defaultText: 'ỦNG BẢO HỘ HSE' },
];

export const CardEditorModal: React.FC<CardEditorModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [formData, setFormData] = useState<ChemCardData>({ ...data });

  if (!isOpen) return null;

  const handleTextChange = (field: keyof ChemCardData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFirstAidChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      firstAid: {
        ...prev.firstAid,
        [field]: value,
      },
    }));
  };

  const handleStorageChange = (field: 'temperature' | 'condition', value: string) => {
    setFormData((prev) => ({
      ...prev,
      storage: {
        ...prev.storage,
        [field]: value,
      },
    }));
  };

  // Toggle GHS Pictogram
  const toggleGHS = (type: GHSPictogramType) => {
    const current = [...(formData.ghsPictograms || [])];
    const index = current.indexOf(type);
    if (index >= 0) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      if (current.length < 3) {
        current.push(type);
      }
    }
    setFormData((prev) => ({ ...prev, ghsPictograms: current }));
  };

  // Toggle PPE Item
  const togglePPE = (type: PPEType, defaultText: string) => {
    const current = [...(formData.ppe || [])];
    const index = current.findIndex((p) => p.type === type);
    if (index >= 0) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      if (current.length < 4) {
        current.push({ type, label: defaultText });
      }
    }
    setFormData((prev) => ({ ...prev, ppe: current }));
  };

  const updatePPELabel = (index: number, newLabel: string) => {
    const current = [...formData.ppe];
    if (current[index]) {
      current[index] = { ...current[index], label: newLabel };
      setFormData((prev) => ({ ...prev, ppe: current }));
    }
  };

  // Array item helpers (Hazard statements, prevention, spill)
  const updateArrayItem = (
    field: 'hazardStatements' | 'prevention' | 'spillResponse',
    index: number,
    value: string
  ) => {
    const list = [...(formData[field] || [])];
    list[index] = value;
    setFormData((prev) => ({ ...prev, [field]: list }));
  };

  const addArrayItem = (field: 'hazardStatements' | 'prevention' | 'spillResponse') => {
    const list = [...(formData[field] || [])];
    list.push('Chỉ dẫn an toàn bổ sung...');
    setFormData((prev) => ({ ...prev, [field]: list }));
  };

  const removeArrayItem = (
    field: 'hazardStatements' | 'prevention' | 'spillResponse',
    index: number
  ) => {
    const list = [...(formData[field] || [])];
    if (list.length > 1) {
      list.splice(index, 1);
      setFormData((prev) => ({ ...prev, [field]: list }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#111827] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C8102E] text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Chỉnh Sửa & Tinh Chỉnh Thẻ An Toàn A5</h2>
              <p className="text-xs text-gray-300">
                Hiệu chỉnh thông tin kỹ thuật, mã quản lý kho, biểu trưng và chỉ dẫn ứng phó
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* 1. Thông tin định danh */}
          <section className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
              1. Thông Tin Nhận Diện Hóa Chất & Nhà Sản Xuất
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Tên thương mại hóa chất (In hoa):
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => handleTextChange('productName', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg font-bold uppercase focus:ring-2 focus:ring-[#C8102E] outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Mô tả kỹ thuật (Subtitle):
                </label>
                <input
                  type="text"
                  value={formData.productSubtitle}
                  onChange={(e) => handleTextChange('productSubtitle', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg font-semibold uppercase focus:ring-2 focus:ring-[#C8102E] outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Nhóm hóa học / Bản chất:
                </label>
                <input
                  type="text"
                  value={formData.chemicalFamily}
                  onChange={(e) => handleTextChange('chemicalFamily', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Mã hóa chất kho (Chemical Code):
                </label>
                <input
                  type="text"
                  value={formData.chemicalCode}
                  onChange={(e) => handleTextChange('chemicalCode', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg font-bold focus:ring-2 focus:ring-[#C8102E] outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Nhà sản xuất:
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => handleTextChange('manufacturer', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-[#C8102E] font-bold focus:ring-2 focus:ring-[#C8102E] outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Số đăng ký CAS (nếu có):
                </label>
                <input
                  type="text"
                  value={formData.casNumber || ''}
                  onChange={(e) => handleTextChange('casNumber', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] outline-none"
                />
              </div>
            </div>
          </section>

          {/* 2. Mối nguy GHS */}
          <section className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C8102E]" />
              2. Mối Nguy GHS & Từ Cảnh Báo
            </h3>

            <div className="flex items-center gap-4 py-1">
              <span className="font-semibold text-gray-700">Từ cảnh báo (Signal Word):</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleTextChange('signalWord', 'CẢNH BÁO')}
                  className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                    formData.signalWord === 'CẢNH BÁO'
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                      : 'bg-white border border-gray-300 text-gray-700'
                  }`}
                >
                  CẢNH BÁO (Warning)
                </button>
                <button
                  type="button"
                  onClick={() => handleTextChange('signalWord', 'NGUY HIỂM')}
                  className={`px-4 py-1.5 rounded-lg font-black transition-all ${
                    formData.signalWord === 'NGUY HIỂM'
                      ? 'bg-[#C8102E] text-white shadow-sm ring-2 ring-red-400'
                      : 'bg-white border border-gray-300 text-gray-700'
                  }`}
                >
                  NGUY HIỂM (Danger)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">
                Chọn biểu trưng GHS (Chọn 1 đến 3 biểu trưng phù hợp):
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {ALL_GHS_TYPES.map((item) => {
                  const isSelected = formData.ghsPictograms?.includes(item.type);
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => toggleGHS(item.type)}
                      className={`p-1.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                        isSelected
                          ? 'border-[#C8102E] bg-red-50 ring-2 ring-red-300 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <GHSPictogram type={item.type} className="w-10 h-10" />
                      <span className="text-[9px] font-medium text-gray-700 mt-1 line-clamp-1">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-gray-700 font-semibold">
                  Câu cảnh báo nguy cơ (H-statements):
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('hazardStatements')}
                  className="text-[#C8102E] hover:text-red-800 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm câu cảnh báo
                </button>
              </div>
              <div className="space-y-2">
                {formData.hazardStatements?.map((stmt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-bold text-[#C8102E]">•</span>
                    <input
                      type="text"
                      value={stmt}
                      onChange={(e) =>
                        updateArrayItem('hazardStatements', idx, e.target.value)
                      }
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('hazardStatements', idx)}
                      className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Trang bị bảo hộ cá nhân (PPE) */}
          <section className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              3. Trang Bị Bảo Hộ Cá Nhân (PPE)
            </h3>
            <p className="text-gray-600 text-[11px]">
              Chọn tối đa 4 trang bị bảo hộ cốt lõi theo SDS và chỉnh sửa nhãn hiển thị:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {ALL_PPE_TYPES.map((item) => {
                const isSelected = formData.ppe?.some((p) => p.type === item.type);
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => togglePPE(item.type, item.defaultText)}
                    className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-300 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <PPEIcon type={item.type} className="w-10 h-10" />
                    <span className="text-[9px] font-bold text-gray-800 mt-1">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              {formData.ppe?.map((item, idx) => (
                <div key={idx} className="p-2 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <PPEIcon type={item.type} className="w-6 h-6" />
                    <span className="font-semibold text-gray-700 capitalize">{item.type}</span>
                  </div>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updatePPELabel(idx, e.target.value)}
                    className="w-full p-1.5 border border-gray-300 rounded font-bold text-[10px] uppercase focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 4. Phòng ngừa (Prevention) */}
          <section className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
                4. Biện Pháp Phòng Ngừa
              </h3>
              <button
                type="button"
                onClick={() => addArrayItem('prevention')}
                className="text-[#C8102E] hover:text-red-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm chỉ dẫn
              </button>
            </div>
            <div className="space-y-2">
              {formData.prevention?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-bold text-[#C8102E]">•</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem('prevention', idx, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('prevention', idx)}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Sơ cứu (First Aid) */}
          <section className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-green-600" />
              5. Biện Pháp Sơ Cứu Khẩn Cấp
            </h3>
            <div className="space-y-2">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Sơ cứu khi tiếp xúc Da:
                </label>
                <input
                  type="text"
                  value={formData.firstAid?.skin}
                  onChange={(e) => handleFirstAidChange('skin', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Sơ cứu khi vào Mắt:
                </label>
                <input
                  type="text"
                  value={formData.firstAid?.eye}
                  onChange={(e) => handleFirstAidChange('eye', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Sơ cứu khi Hít Phải:
                </label>
                <input
                  type="text"
                  value={formData.firstAid?.inhalation}
                  onChange={(e) => handleFirstAidChange('inhalation', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Sơ cứu khi Nuốt Phải (tùy chọn):
                </label>
                <input
                  type="text"
                  value={formData.firstAid?.ingestion || ''}
                  onChange={(e) => handleFirstAidChange('ingestion', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>
            </div>
          </section>

          {/* 6. Bảo quản & Xử lý tràn đổ */}
          <section className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-[#0052cc]" />
              6. Bảo Quản & Xử Lý Tràn Đổ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Bảo quản */}
              <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                <span className="font-bold text-[#C8102E] text-xs">BẢO QUẢN KHO</span>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Nhiệt độ bảo quản:
                  </label>
                  <input
                    type="text"
                    value={formData.storage?.temperature}
                    onChange={(e) => handleStorageChange('temperature', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg font-bold focus:ring-2 focus:ring-[#C8102E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Điều kiện môi trường:
                  </label>
                  <textarea
                    rows={2}
                    value={formData.storage?.condition}
                    onChange={(e) => handleStorageChange('condition', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] outline-none"
                  />
                </div>
              </div>

              {/* Tràn đổ */}
              <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#C8102E] text-xs">XỬ LÝ TRÀN ĐỔ</span>
                  <button
                    type="button"
                    onClick={() => addArrayItem('spillResponse')}
                    className="text-[#C8102E] hover:text-red-800 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm bước
                  </button>
                </div>
                <div className="space-y-1.5">
                  {formData.spillResponse?.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="font-bold text-[#C8102E]">•</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) =>
                          updateArrayItem('spillResponse', idx, e.target.value)
                        }
                        className="flex-1 p-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#C8102E] outline-none text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('spillResponse', idx)}
                        className="text-gray-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-[#C8102E] hover:bg-[#a50d25] rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Lưu và Cập nhật Thẻ A5
          </button>
        </div>

      </div>
    </div>
  );
};
