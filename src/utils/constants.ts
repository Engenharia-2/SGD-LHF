/**
 * Lista padronizada de setores da organização.
 * Centralizado para evitar inconsistências entre componentes e páginas.
 */
export const AVAILABLE_SECTORS = [
  'Qualidade',
  'Administrativo',
  'Vendas',
  'Assistência',
  'Almoxarifado',
  'Engenharia',
  'Produção - Engenheirados',
  'Produção - Seriados',
  'Produção - Eletrônica',
  'PCP',
  'Compras',
  'Geral'
] as const;

/**
 * Setores disponíveis para cadastro de usuários e atribuição de documentos.
 * O setor 'Geral' é omitido pois é exclusivo para visualização de Gestores/Administradores.
 */
export const REGISTRABLE_SECTORS = AVAILABLE_SECTORS.filter(s => s !== 'Geral');

export type Sector = (typeof AVAILABLE_SECTORS)[number];

/**
 * Níveis de acesso/roles disponíveis no sistema.
 */
export const ROLES = {
  ADMIN: 'Administrador',
  GESTOR: 'Gestor',
  FUNCIONARIO: 'Funcionario'
} as const;

export const USER_ROLES = [ROLES.ADMIN, ROLES.GESTOR, ROLES.FUNCIONARIO] as const;
export type UserRole = (typeof USER_ROLES)[number];
