/**
 * Lista padronizada de setores da organização.
 * Centralizado para evitar inconsistências entre componentes e páginas.
 */
export const AVAILABLE_SECTORS = [
  'Qualidade',
  'Produção',
  'Administrativo',
  'Vendas',
  'Assistência',
  'Estoque',
  'Engenharia',
  'Geral'
] as const;

export type Sector = (typeof AVAILABLE_SECTORS)[number];

/**
 * Níveis de acesso/roles disponíveis no sistema.
 */
export const USER_ROLES = ['Administrador', 'Gestor', 'Funcionario'] as const;
export type UserRole = (typeof USER_ROLES)[number];
