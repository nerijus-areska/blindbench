import type { LanguageModel, LanguageModelCreate, LanguageModelUpdate } from '../types/languageModel';

const API_BASE_URL = 'http://localhost:8055/api/v1';

class ApiService {
    private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
            throw new Error(error.detail || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Language Model operations
    async getLanguageModels(skip = 0, limit = 100, search?: string): Promise<LanguageModel[]> {
        const params = new URLSearchParams({
            skip: skip.toString(),
            limit: limit.toString(),
        });
        if (search) {
            params.append('search', search);
        }
        return this.fetchJson<LanguageModel[]>(`${API_BASE_URL}/slm?${params}`);
    }

    async getLanguageModel(id: number): Promise<LanguageModel> {
        return this.fetchJson<LanguageModel>(`${API_BASE_URL}/slm/${id}`);
    }

    async createLanguageModel(data: LanguageModelCreate): Promise<LanguageModel> {
        return this.fetchJson<LanguageModel>(`${API_BASE_URL}/slm`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateLanguageModel(id: number, data: LanguageModelUpdate): Promise<LanguageModel> {
        return this.fetchJson<LanguageModel>(`${API_BASE_URL}/slm/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteLanguageModel(id: number): Promise<void> {
        await this.fetchJson<{ message: string }>(`${API_BASE_URL}/slm/${id}`, {
            method: 'DELETE',
        });
    }

    async getLanguageModelCount(): Promise<number> {
        const result = await this.fetchJson<{ count: number }>(`${API_BASE_URL}/slm/count/total`);
        return result.count;
    }
}

export const api = new ApiService();

