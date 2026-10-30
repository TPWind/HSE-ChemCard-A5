import React, { forwardRef } from 'react';
import { ChemCardData } from '../types/chemCard';
import {
  GHSPictogram,
  PPEIcon,
  FirstAidIcon,
  StorageThermometerIcon,
  SpillResponseIcon,
} from './GhsAndPpeIcons';

interface A5ChemCardProps {
  data: ChemCardData;
  scale?: number;
  showHolePunch?: boolean;
}

export const A5ChemCard = forwardRef<HTMLDivElement, A5ChemCardProps>(
  ({ data, scale = 1, showHolePunch = true }, ref) => {
    return (
      <div
        ref={ref}
        id="a5-chem-card-print-area"
        className="relative bg-white text-gray-900 select-none shadow-2xl transition-all duration-200"
        style={{
          width: '148mm',
          minHeight: '210mm',
          maxHeight: '210mm',
          boxSizing: 'border-box',
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
        }}
      >
        {/* Outer Red Card Border with Rounded Corners */}
        <div className="w-full h-full min-h-[210mm] border-[6px] border-[#C8102E] rounded-[28px] flex flex-col justify-between overflow-hidden relative p-[7px] bg-white">
          
          {/* Top Hanging Hole Punch Circle (Warehouse rack hanging tag) */}
          {showHolePunch && (
            <div className="absolute top-[8px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full border-2 border-gray-400 bg-white shadow-inner flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-gray-200" />
              </div>
            </div>
          )}

          {/* Top Header Banner */}
          <div className="bg-[#C8102E] text-white py-1.5 px-3 rounded-t-[20px] text-center mt-3.5 shadow-sm">
            <h1 className="text-[21px] font-black tracking-wider uppercase leading-tight font-sans">
              THẺ AN TOÀN HÓA CHẤT
            </h1>
          </div>

          {/* Body Content */}
          <div className="flex-1 flex flex-col justify-between px-2 pt-1.5 pb-1 space-y-1">
            
            {/* 1. Chemical Identification Block */}
            <div className="text-center pt-0.5">
              <h2 className="text-[20px] font-black uppercase text-[#111827] tracking-wide leading-tight">
                {data.productName}
              </h2>
              {data.productSubtitle && (
                <div className="text-[13px] font-extrabold uppercase text-[#1f2937] leading-snug tracking-normal">
                  {data.productSubtitle}
                </div>
              )}
              {data.chemicalFamily && (
                <div className="text-[12px] font-medium text-gray-700 italic leading-snug">
                  {data.chemicalFamily}
                </div>
              )}

              {/* Chemical Code & Manufacturer Box */}
              <div className="mx-auto mt-1 max-w-[92%] border-[1.5px] border-black rounded-lg py-0.5 px-3 bg-white text-center">
                <div className="text-[12px] font-bold text-black tracking-wide leading-tight">
                  MÃ HÓA CHẤT:{' '}
                  <span className="font-extrabold">{data.chemicalCode || 'CHƯA CÓ'}</span>
                  {data.casNumber && (
                    <span className="text-gray-600 font-normal ml-2">
                      (CAS: {data.casNumber})
                    </span>
                  )}
                </div>
                <div className="text-[12px] font-bold text-black leading-tight">
                  NHÀ SẢN XUẤT:{' '}
                  <span className="text-[#C8102E] font-black tracking-wide">
                    {data.manufacturer || 'Henkel'}
                  </span>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-[1.5px] bg-[#C8102E] w-full my-0.5" />

            {/* 2. Hazard Identification (GHS Pictograms + Signal Word + Hazard Statements) */}
            <div className="flex items-center gap-2.5 px-1 py-0.5 min-h-[64px]">
              {/* GHS Pictograms Column */}
              <div className="flex items-center justify-center gap-1 shrink-0">
                {data.ghsPictograms && data.ghsPictograms.length > 0 ? (
                  data.ghsPictograms.slice(0, 3).map((pic, idx) => (
                    <GHSPictogram key={idx} type={pic} className="w-[62px] h-[62px]" />
                  ))
                ) : (
                  <GHSPictogram type="exclamation" className="w-[62px] h-[62px]" />
                )}
              </div>

              {/* Signal Word & H-Statements */}
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-black text-[#C8102E] uppercase tracking-wide leading-none mb-1">
                  {data.signalWord || 'CẢNH BÁO'}
                </div>
                <ul className="text-[11px] font-semibold text-gray-900 leading-[1.3] space-y-0.5">
                  {data.hazardStatements && data.hazardStatements.length > 0 ? (
                    data.hazardStatements.map((stmt, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-[#111827] mr-1.5 font-black">•</span>
                        <span className="line-clamp-2">{stmt}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">• Tham khảo thông tin an toàn</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Separator */}
            <div className="h-[1.5px] bg-[#C8102E] w-full my-0.5" />

            {/* 3. Personal Protective Equipment (PPE) */}
            <div className="flex items-center gap-2 px-1 py-0.5">
              {/* Left Label */}
              <div className="w-[102px] shrink-0 text-left">
                <div className="text-[12px] font-black text-[#C8102E] uppercase leading-[1.15] tracking-tight">
                  TRANG BỊ<br />BẢO HỘ<br />CÁ NHÂN
                </div>
              </div>

              {/* Right PPE Icons List */}
              <div className="flex-1 flex items-center justify-around gap-1">
                {data.ppe && data.ppe.length > 0 ? (
                  data.ppe.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center max-w-[68px]">
                      <PPEIcon type={item.type} className="w-[44px] h-[44px]" />
                      <span className="text-[9px] font-bold text-gray-900 uppercase leading-[1.05] mt-1 line-clamp-2">
                        {item.label}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-[10px] text-gray-500 italic">Trang bị bảo hộ theo SDS</div>
                )}
              </div>
            </div>

            {/* Separator */}
            <div className="h-[1.5px] bg-[#C8102E] w-full my-0.5" />

            {/* 4. Phòng Ngừa (Prevention) */}
            <div className="flex items-start gap-2 px-1 py-0.5">
              {/* Left Label */}
              <div className="w-[102px] shrink-0 text-left pt-0.5">
                <div className="text-[13px] font-black text-[#C8102E] uppercase leading-[1.15] tracking-tight">
                  PHÒNG<br />NGỪA
                </div>
              </div>

              {/* Right Bullets */}
              <div className="flex-1">
                <ul className="text-[11px] font-medium text-gray-900 leading-[1.28] space-y-0.5">
                  {data.prevention && data.prevention.length > 0 ? (
                    data.prevention.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-[#111827] mr-1.5 font-black">•</span>
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">• Tuân thủ quy chuẩn phòng hộ</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Separator */}
            <div className="h-[1.5px] bg-[#C8102E] w-full my-0.5" />

            {/* 5. Sơ Cứu (First Aid) */}
            <div className="flex items-start gap-2 px-1 py-0.5">
              {/* Left Label */}
              <div className="w-[102px] shrink-0 text-left pt-2">
                <div className="text-[14px] font-black text-[#C8102E] uppercase leading-tight tracking-tight">
                  SƠ CỨU
                </div>
              </div>

              {/* Right First Aid Items */}
              <div className="flex-1 space-y-1.5">
                {/* DA (Skin) */}
                {data.firstAid?.skin && (
                  <div className="flex items-center gap-2">
                    <FirstAidIcon type="skin" className="w-[30px] h-[30px]" />
                    <div className="text-[10.5px] leading-[1.2] text-gray-900">
                      <span className="font-extrabold text-black">DA: </span>
                      {data.firstAid.skin.replace(/^DA:\s*/i, '')}
                    </div>
                  </div>
                )}

                {/* MẮT (Eye) */}
                {data.firstAid?.eye && (
                  <div className="flex items-center gap-2">
                    <FirstAidIcon type="eye" className="w-[30px] h-[30px]" />
                    <div className="text-[10.5px] leading-[1.2] text-gray-900">
                      <span className="font-extrabold text-black">MẮT: </span>
                      {data.firstAid.eye.replace(/^MẮT:\s*/i, '')}
                    </div>
                  </div>
                )}

                {/* HÍT PHẢI (Inhalation) */}
                {data.firstAid?.inhalation && (
                  <div className="flex items-center gap-2">
                    <FirstAidIcon type="inhalation" className="w-[30px] h-[30px]" />
                    <div className="text-[10.5px] leading-[1.2] text-gray-900">
                      <span className="font-extrabold text-black">HÍT PHẢI: </span>
                      {data.firstAid.inhalation.replace(/^HÍT PHẢI:\s*/i, '')}
                    </div>
                  </div>
                )}

                {/* NUỐT PHẢI (Ingestion) */}
                {data.firstAid?.ingestion && (
                  <div className="flex items-center gap-2">
                    <FirstAidIcon type="ingestion" className="w-[30px] h-[30px]" />
                    <div className="text-[10.5px] leading-[1.2] text-gray-900">
                      <span className="font-extrabold text-black">NUỐT PHẢI: </span>
                      {data.firstAid.ingestion.replace(/^NUỐT PHẢI:\s*/i, '')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Separator */}
            <div className="h-[1.5px] bg-[#C8102E] w-full my-0.5" />

            {/* 6. Bottom Split: BẢO QUẢN & XỬ LÝ TRÀN ĐỔ */}
            <div className="grid grid-cols-2 gap-2 pt-0.5 pb-1">
              
              {/* Left Column: BẢO QUẢN */}
              <div className="flex items-start gap-2 pr-1 border-r-[1.5px] border-[#C8102E]">
                <StorageThermometerIcon className="w-[28px] h-[52px] shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-black text-[#C8102E] uppercase leading-none tracking-tight">
                    BẢO QUẢN
                  </div>
                  <div className="text-[13px] font-black text-black leading-tight mt-0.5">
                    {data.storage?.temperature || 'Nhiệt độ phòng'}
                  </div>
                  <div className="text-[10px] font-medium text-gray-800 leading-[1.2] mt-0.5">
                    {data.storage?.condition || 'Nơi thoáng mát, tránh nhiệt độ cao.'}
                  </div>
                </div>
              </div>

              {/* Right Column: XỬ LÝ TRÀN ĐỔ */}
              <div className="flex items-start gap-2 pl-1">
                <SpillResponseIcon className="w-[32px] h-[48px] shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-black text-[#C8102E] uppercase leading-none tracking-tight">
                    XỬ LÝ TRÀN ĐỔ
                  </div>
                  <ul className="text-[10px] font-medium text-gray-900 leading-[1.2] space-y-0.5 mt-0.5">
                    {data.spillResponse && data.spillResponse.length > 0 ? (
                      data.spillResponse.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-[#111827] mr-1 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">• Thu gom an toàn bằng vật liệu trơ</li>
                    )}
                  </ul>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }
);

A5ChemCard.displayName = 'A5ChemCard';
