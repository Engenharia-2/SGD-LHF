# Diretrizes do Projeto: SGD-LHF

Este documento serve como a fonte da verdade para padrões de desenvolvimento, arquitetura e contexto de negócio do sistema SGD-LHF.

## 🚀 Contexto do Projeto
O **SGD-LHF** é um sistema interno para gerenciamento de documentos, integrando conceitos de **SOP (Standard Operating Procedure)** e **BPM (Business Process Management)**.
- **Plataforma:** Aplicação React convertida para aplicativo nativo via **Electron**.
- **Ambiente de API:** Servidor Synology (Linux).
- **Funcionalidades Principais:** Login centralizado e controle de permissões por setor.
- **Permissões:** Leitura, Escrita, Modificação e Autorização.

## 🛠️ Padrões de Desenvolvimento

### Princípios Core
- **SOLID:** Aplicar rigorosamente os princípios de responsabilidade única, aberto/fechado, substituição de Liskov, segregação de interface e inversão de dependência.
- **TypeScript:** Uso estrito de tipagem, evitando `any`. Preferência por interfaces para definições de contratos.
- **Clean Code:** Nomes semânticos, funções pequenas e código autoexplicativo.

### Arquitetura de Componentes
Cada componente deve seguir a estrutura de pasta:
```text
src/components/NomeDoComponente/
├── index.tsx   # Lógica e Estrutura JSX
└── styles.css  # Estilização específica
```

### Abstração e Organização
- **Hooks:** Lógica de estado e efeitos colaterais reutilizáveis devem residir em `src/hooks/`.
- **Services:** Integrações com APIs e serviços externos devem residir em `src/services/`.
- **Utils:** Funções utilitárias puras e auxiliares devem residir em `src/utils/`.

## 🏗️ Fluxo de Trabalho
1. **Pense antes de agir:** Sempre valide se a nova implementação respeita a estrutura de pastas e os princípios SOLID.
2. **Estilização:** CSS puro em arquivos `styles.css` locais ao componente, a menos que seja uma configuração global.
3. **Segurança:** O controle de permissões deve ser validado tanto no Front-end (UI) quanto considerado na comunicação com o Back-end.
