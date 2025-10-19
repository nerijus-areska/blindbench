export interface LanguageModel {
    id: number;
    name: string;
    notes: string | null;
}

export interface LanguageModelCreate {
    name: string;
    notes?: string | null;
}

export interface LanguageModelUpdate {
    name?: string;
    notes?: string | null;
}

