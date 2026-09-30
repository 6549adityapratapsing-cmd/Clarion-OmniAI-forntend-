import { authStore } from '../store/authStore';
import {
  DashboardMetrics,
  DemoScenario,
  DocumentEntity,
  ExtractedField,
  ExtractionVersion,
  Insight,
  LineItem,
  Supplier,
  User,
  ValidationResult,
  AssistantResponse
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStore.getState().token;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type to JSON if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const json = await response.json();

  if (!response.ok || json.success === false) {
    const errorMsg = json.error?.message || `HTTP ${response.status}: Failed to perform request.`;
    throw new Error(errorMsg);
  }

  return json.data as T;
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    register: (userData: { email: string; password: string; fullName: string; role?: string; department?: string }) =>
      request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    getMe: () => request<{ user: User }>('/auth/me')
  },

  // Documents
  documents: {
    list: (params: { status?: string; type?: string; supplier?: string; search?: string; page?: number; limit?: number } = {}) => {
      const query = new URLSearchParams();
      if (params.status) query.set('status', params.status);
      if (params.type) query.set('type', params.type);
      if (params.supplier) query.set('supplier', params.supplier);
      if (params.search) query.set('search', params.search);
      if (params.page) query.set('page', String(params.page));
      if (params.limit) query.set('limit', String(params.limit));

      return request<{
        documents: DocumentEntity[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>(`/documents?${query.toString()}`);
    },

    getById: (id: string) =>
      request<{
        document: DocumentEntity;
        fields: ExtractedField[];
        lineItems: LineItem[];
        validationResult: ValidationResult | null;
        versions: ExtractionVersion[];
        comments: any[];
      }>(`/documents/${id}`),

    upload: (formData: FormData) =>
      request<{ document: DocumentEntity; jobId: string; duplicateWarning: string | null }>('/documents', {
        method: 'POST',
        body: formData
      }),

    updateExtraction: (id: string, fieldUpdates: Array<{ fieldName: string; correctedValue: any }>, reason?: string) =>
      request<{ document: DocumentEntity; version: ExtractionVersion }>(`/documents/${id}/extraction`, {
        method: 'PATCH',
        body: JSON.stringify({ fieldUpdates, reason })
      }),

    approve: (id: string, reason?: string) =>
      request<{ document: DocumentEntity }>(`/documents/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      }),

    reject: (id: string, reason: string) =>
      request<{ document: DocumentEntity }>(`/documents/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      }),

    addComment: (id: string, text: string, fieldAnchor?: string) =>
      request<{ comment: any }>(`/documents/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text, fieldAnchor })
      }),

    reprocess: (id: string) =>
      request<{ document: DocumentEntity }>(`/documents/${id}/reprocess`, {
        method: 'POST'
      }),

    delete: (id: string) =>
      request<{ success: boolean }>(`/documents/${id}`, {
        method: 'DELETE'
      })
  },

  // Search
  search: {
    query: (params: Record<string, any>) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.set(k, String(v));
      });
      return request<{ results: Array<{ document: DocumentEntity; score: number; highlights: string[] }>; count: number }>(
        `/search?${query.toString()}`
      );
    }
  },

  // Assistant
  assistant: {
    query: (queryText: string, documentId?: string) =>
      request<{
        answer: string;
        sources: Array<{ documentId: string; documentTitle: string; page: number; excerpt: string }>;
      }>('/assistant/query', {
        method: 'POST',
        body: JSON.stringify({ query: queryText, documentId })
      })
  },

  // Suppliers
  suppliers: {
    list: () => request<{ suppliers: Supplier[] }>('/suppliers'),
    getById: (id: string) => request<{ supplier: Supplier; documents: DocumentEntity[] }>(`/suppliers/${id}`)
  },

  // Insights & Dashboard
  insights: {
    list: () => request<{ insights: Insight[] }>('/insights'),
    getMetrics: () => request<DashboardMetrics>('/dashboard/metrics')
  },

  // Demo Scenarios
  demo: {
    getScenarios: () => request<{ scenarios: DemoScenario[] }>('/demo/scenarios'),
    loadScenario: (scenarioId: string) =>
      request<{
        document: DocumentEntity;
        fields: ExtractedField[];
        lineItems: LineItem[];
        validationResult: ValidationResult | null;
        scenario: DemoScenario;
      }>(`/demo/load/${scenarioId}`, {
        method: 'POST'
      })
  },

  // Direct convenience aliases
  getInsights: () => request<{ insights: Insight[] }>('/insights'),
  getDashboardMetrics: () => request<DashboardMetrics>('/dashboard/metrics'),
  queryAssistant: (queryText: string, documentId?: string) =>
    request<AssistantResponse>('/assistant/query', {
      method: 'POST',
      body: JSON.stringify({ query: queryText, documentId })
    })
};
