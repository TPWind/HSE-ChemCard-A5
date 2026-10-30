export type GHSPictogramType =
  | 'exclamation'
  | 'flame'
  | 'corrosion'
  | 'exploding-bomb'
  | 'gas-cylinder'
  | 'flame-over-circle'
  | 'skull'
  | 'health-hazard'
  | 'environment';

export type PPEType =
  | 'glasses'
  | 'gloves'
  | 'clothing'
  | 'mask'
  | 'respirator'
  | 'boots'
  | 'shield';

export interface PPEItem {
  type: PPEType;
  label: string;
}

export interface ChemCardData {
  id: string;
  productName: string;
  productSubtitle: string;
  chemicalFamily: string;
  chemicalCode: string;
  manufacturer: string;
  casNumber?: string;
  
  signalWord: 'CẢNH BÁO' | 'NGUY HIỂM';
  ghsPictograms: GHSPictogramType[];
  hazardStatements: string[];
  
  ppe: PPEItem[];
  prevention: string[];
  
  firstAid: {
    skin: string;
    eye: string;
    inhalation: string;
    ingestion?: string;
  };
  
  storage: {
    temperature: string;
    condition: string;
  };
  
  spillResponse: string[];
  
  emergencyPhone?: string;
  lastUpdated?: string;
  sourceDocName?: string;
}
