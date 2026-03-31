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
  title: string;
  filename: string;
  original_name: string;
  mimetype: string;
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
  parent_id?: number;
  history?: Partial<Document>[];
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
