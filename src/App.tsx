import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Printer,
  Download,
  Edit3,
  SplitSquareVertical,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ShieldCheck,
  AlertTriangle,
  FolderOpen,
  HelpCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { ChemCardData } from './types/chemCard';
import { SAMPLE_CHEMICALS } from './data/sampleChemicals';
import { A5ChemCard } from './components/A5ChemCard';
import { UploadModal } from './components/UploadModal';
import { CardEditorModal } from './components/CardEditorModal';
import { TemplateComparisonModal } from './components/TemplateComparisonModal';
import { GHSPictogram, PPEIcon } from './components/GhsAndPpeIcons';

const STORAGE_KEY = 'hse_chemcards_warehouse_inventory';

export default function App() {
  // Load saved cards or default to SAMPLE_CHEMICALS
  const [cards, setCards] = useState<ChemCardData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved cards', e);
    }
    return SAMPLE_CHEMICALS;
  });

  const [activeCardId, setActiveCardId] = useState<string>(cards[0]?.id || SAMPLE_CHEMICALS[0].id);
  const [scale, setScale] = useState<number>(0.85);
  const [showHolePunch, setShowHolePunch] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const cardPrintRef = useRef<HTMLDivElement>(null);

  // Save to localStorage whenever cards change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [cards]);

  const activeCard = cards.find((c) => c.id === activeCardId) || cards[0] || SAMPLE_CHEMICALS[0];

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const handleNewCardExtracted = (newCard: ChemCardData) => {
    setCards((prev) => [newCard, ...prev]);
    setActiveCardId(newCard.id);
    showToast(`Đã trích xuất thành công Thẻ A5 cho: ${newCard.productName}!`);
  };

  const handleCardUpdated = (updatedCard: ChemCardData) => {
    setCards((prev) => prev.map((c) => (c.id === updatedCard.id ? updatedCard : c)));
    showToast(`Đã lưu thay đổi thẻ ${updatedCard.productName}`);
  };

  const handleDeleteCard = (id: string, name: string) => {
    if (cards.length <= 1) {
      showToast('Cần giữ ít nhất 1 thẻ hóa chất trong hệ thống.');
      return;
    }
    if (confirm(`Bạn có chắc muốn xóa thẻ "${name}" khỏi danh sách?`)) {
      const remaining = cards.filter((c) => c.id !== id);
      setCards(remaining);
      setActiveCardId(remaining[0].id);
      showToast(`Đã xóa thẻ ${name}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = async () => {
    if (!cardPrintRef.current) return;
    setIsExporting(true);
    showToast('Đang kết xuất ảnh thẻ A5 độ nét cao...');

    try {
      // Small pause to ensure rendering
      await new Promise((r) => setTimeout(r, 150));
      const dataUrl = await toPng(cardPrintRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        backgroundColor: '#FFFFFF',
      });

      const link = document.createElement('a');
      const filename = `THE-AN-TOAN-A5-${activeCard.productName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
      showToast('Tải về ảnh thẻ A5 thành công!');
    } catch (err) {
      console.error('Export PNG failed', err);
      showToast('Không thể xuất ảnh PNG, vui lòng dùng tính năng In PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {notification && (
        <div className="no-print fixed top-5 right-5 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2.5 text-xs animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#C8102E]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="no-print bg-[#111827] text-white border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8102E] flex items-center justify-center text-white font-black shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-wide uppercase">
                  HSE ChemCard A5
                </h1>
                <span className="text-[10px] font-bold bg-[#C8102E] px-2 py-0.5 rounded text-white tracking-wider">
                  TCVN / GHS
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Trích xuất tài liệu SDS/MSDS tự động sang Thẻ Kho A5
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="bg-[#C8102E] hover:bg-[#a50d25] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Trích Xuất SDS Mới</span>
              <span className="sm:hidden">Nhập SDS</span>
            </button>

            <button
              onClick={() => setIsComparisonOpen(true)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border border-gray-700"
              title="So sánh với mẫu hình ảnh đính kèm"
            >
              <SplitSquareVertical className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">So Sánh Mẫu Gốc</span>
            </button>

            <button
              onClick={() => setIsEditorOpen(true)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border border-gray-700"
              title="Chỉnh sửa chi tiết thẻ"
            >
              <Edit3 className="w-4 h-4 text-blue-400" />
              <span className="hidden md:inline">Chỉnh Sửa</span>
            </button>

            <button
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border border-gray-700 disabled:opacity-50"
              title="Tải ảnh PNG thẻ A5"
            >
              <Download className="w-4 h-4 text-green-400" />
              <span className="hidden lg:inline">Tải PNG</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-white hover:bg-gray-100 text-[#111827] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="In trực tiếp khổ A5 chuẩn"
            >
              <Printer className="w-4 h-4 text-[#C8102E]" />
              <span className="font-extrabold">In Khổ A5</span>
            </button>
          </div>

        </div>
      </header>

      {/* Chemical Inventory Selector Bar */}
      <div className="no-print bg-white border-b border-gray-200 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-[#C8102E]" />
              Hóa chất kho ({cards.length}):
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 overflow-x-auto py-1">
            {cards.map((card) => {
              const isActive = card.id === activeCardId;
              return (
                <div
                  key={card.id}
                  onClick={() => setActiveCardId(card.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shrink-0 border ${
                    isActive
                      ? 'bg-red-50 border-[#C8102E] text-[#C8102E] shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="max-w-[150px] truncate">{card.productName}</span>
                  <span
                    className={`text-[9px] px-1 rounded font-mono ${
                      isActive ? 'bg-red-100 text-[#C8102E]' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {card.chemicalCode}
                  </span>
                  {cards.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(card.id, card.productName);
                      }}
                      className="text-gray-400 hover:text-red-600 p-0.5 rounded hover:bg-red-100 transition-colors"
                      title="Xóa thẻ khỏi danh sách"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-2.5 py-1.5 border border-dashed border-gray-300 hover:border-[#C8102E] text-gray-600 hover:text-[#C8102E] rounded-xl text-xs font-medium flex items-center gap-1 shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: A5 Card Preview Workspace (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          {/* Controls Bar */}
          <div className="no-print w-full bg-white rounded-2xl p-3 border border-gray-200 mb-4 flex items-center justify-between shadow-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">Thu phóng xem:</span>
              <button
                onClick={() => setScale((s) => Math.max(0.6, Number((s - 0.05).toFixed(2))))}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-gray-800 w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.min(1.2, Number((s + 0.05).toFixed(2))))}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setScale(0.85)}
                className="text-[11px] font-semibold text-gray-600 hover:text-black underline ml-1"
              >
                Mặc định
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHolePunch}
                  onChange={(e) => setShowHolePunch(e.target.checked)}
                  className="rounded text-[#C8102E] focus:ring-[#C8102E]"
                />
                Lỗ móc treo kho
              </label>

              <button
                onClick={() => setIsComparisonOpen(true)}
                className="text-xs font-bold text-[#C8102E] hover:underline flex items-center gap-1"
              >
                <SplitSquareVertical className="w-3.5 h-3.5" />
                Đối chiếu mẫu đính kèm
              </button>
            </div>
          </div>

          {/* Card Presentation Container */}
          <div className="w-full flex justify-center overflow-x-auto py-2">
            <div
              className="transition-transform duration-150 origin-top flex justify-center"
              style={{
                width: '148mm',
                height: `calc(210mm * ${scale})`,
              }}
            >
              <A5ChemCard
                ref={cardPrintRef}
                data={activeCard}
                scale={scale}
                showHolePunch={showHolePunch}
              />
            </div>
          </div>

          {/* Quick Notice under card */}
          <div className="no-print mt-4 text-center text-xs text-gray-500 max-w-md">
            Khổ chuẩn in ấn: <strong>A5 (148 × 210 mm)</strong> • Thẻ thích hợp in màu trên giấy Couche/Decal nhựa chống nước, cán màng bóng hoặc lồng túi mica treo trước kệ hóa chất.
          </div>

        </div>

        {/* Right Side: Quick Inspector & HSE Action Panel (lg:col-span-4) */}
        <div className="no-print lg:col-span-4 space-y-4">
          
          {/* Chemical Card Summary Box */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Thông Tin Hóa Chất
                </span>
                <h3 className="text-base font-extrabold text-gray-900 mt-0.5">
                  {activeCard.productName}
                </h3>
                <p className="text-xs text-gray-600">{activeCard.productSubtitle}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                  activeCard.signalWord === 'NGUY HIỂM'
                    ? 'bg-red-100 text-[#C8102E]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {activeCard.signalWord}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-[10px] font-semibold text-gray-500 uppercase block">
                  Mã Hóa Chất:
                </span>
                <span className="font-bold text-gray-900 font-mono text-sm">
                  {activeCard.chemicalCode}
                </span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-[10px] font-semibold text-gray-500 uppercase block">
                  Nhà Sản Xuất:
                </span>
                <span className="font-bold text-[#C8102E] text-sm truncate block">
                  {activeCard.manufacturer}
                </span>
              </div>
            </div>

            {/* GHS Preview in inspector */}
            <div>
              <span className="text-[11px] font-bold text-gray-700 block mb-1.5">
                Biểu trưng GHS phân loại:
              </span>
              <div className="flex items-center gap-2">
                {activeCard.ghsPictograms?.map((pic, idx) => (
                  <GHSPictogram key={idx} type={pic} className="w-11 h-11" />
                ))}
              </div>
            </div>

            {/* PPE Preview in inspector */}
            <div>
              <span className="text-[11px] font-bold text-gray-700 block mb-1.5">
                Trang bị bảo hộ bắt buộc ({activeCard.ppe?.length || 0}):
              </span>
              <div className="flex items-center gap-2">
                {activeCard.ppe?.map((p, idx) => (
                  <div key={idx} title={p.label}>
                    <PPEIcon type={p.type} className="w-8 h-8" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setIsEditorOpen(true)}
                className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4 text-blue-600" />
                Chỉnh sửa nội dung & H-code
              </button>
              <button
                onClick={handlePrint}
                className="w-full py-2.5 px-3 bg-[#C8102E] hover:bg-[#a50d25] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                In Thẻ An Toàn A5 Ngay
              </button>
            </div>
          </div>

          {/* HSE Specialist Guidelines Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Quy Chuẩn Thẻ An Toàn Hóa Chất Kho
            </h4>
            <ul className="text-xs text-gray-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-[#C8102E] font-bold">•</span>
                <span><strong>Khổ A5 tiêu chuẩn:</strong> Đảm bảo nhân viên kho có thể đọc rõ cảnh báo từ khoảng cách 1 mét.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#C8102E] font-bold">•</span>
                <span><strong>Biểu trưng GHS:</strong> Hình thoi viền đỏ nền trắng theo chuẩn Luật Hóa chất Việt Nam và GHS Quốc tế.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#C8102E] font-bold">•</span>
                <span><strong>Sơ cứu & Tràn đổ:</strong> Cô đọng các bước hành động ngay lập tức trong 30 giây đầu tiên khi có sự cố.</span>
              </li>
            </ul>
          </div>

          {/* Template Info Card */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#C8102E]">
                Mẫu chuẩn: Loctite 4311
              </span>
              <button
                onClick={() => setIsComparisonOpen(true)}
                className="text-[11px] font-bold text-gray-700 hover:text-black underline"
              >
                Xem ảnh gốc
              </button>
            </div>
            <p className="text-[11px] text-gray-600">
              Mẫu thẻ A5 được thiết kế dựa trên chính xác ảnh mẫu bạn cung cấp, với đầy đủ các mục: Tên hóa chất, Mã kho, Cảnh báo H-code, 4 biểu tượng PPE tròn xanh, Phòng ngừa, 3 bước Sơ cứu màu xanh lá, Bảo quản nhiệt độ và Xử lý tràn đổ.
            </p>
          </div>

        </div>

      </main>

      {/* Hidden print container to ensure pure clean printout */}
      <div className="hidden print:block print-only-container">
        <A5ChemCard data={activeCard} scale={1} showHolePunch={showHolePunch} />
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleNewCardExtracted}
      />

      <CardEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        data={activeCard}
        onSave={handleCardUpdated}
      />

      <TemplateComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        currentData={activeCard}
      />

    </div>
  );
}
