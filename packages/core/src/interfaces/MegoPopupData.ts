import { PopupModality } from "./popup-enum";

export interface MegoPopupData {
    isOpen: boolean;
    message: string;
    title?: string;
    modality?: PopupModality;
    autoCloseTime?: number; // in millisecondi
  }