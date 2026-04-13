export type UserRole = 'Administrador' | 'Gestor' | 'Funcionario';

export interface User {
  id: number;
  username: string;
  sector: string;
  role: UserRole;
  is_authorized?: boolean;
}

export type DocumentStatus = 'Revisão' | 'Aprovado' | 'Obsoleto';

export interface Document {
  id: number;
  doc_code?: string;
  title: string;
  description?: string;
  filename: string | null;
  original_name: string | null;
  mimetype: string | null;
  size: number;
  sector: string;
  category: string;
  responsible: string;
  version: string;
  status: DocumentStatus;
  creation_date: string;
  uploaded_at: string;
  is_favorite?: boolean;
  is_published?: boolean;
  my_approval_status?: 'Pendente' | 'Aprovado' | 'Rejeitado';
  user_reading_status?: 'Pendente' | 'Confirmado' | null;
  parent_id?: number;
  history?: Partial<Document>[];
  files?: Array<{
    id: number;
    filename: string;
    original_name: string;
    mimetype: string;
    size: number;
  }>;
  v?: number;
}

export type NotificationType = 'info' | 'success' | 'error' | 'warning';

export interface Notification {
  id: number;
  title: string;
  message: string;
  sector: string;
  document_id: number | null;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}
