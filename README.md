# BancoXYZ - Aplicación de Transferencias Bancarias

Sistema web de transferencias bancarias construido con React, TypeScript y Tailwind CSS.

## Descripción

Aplicación financiera que permite:
- Autenticación de usuarios
- Visualización de saldo disponible
- Realizar transferencias bancarias
- Historial de transferencias con filtrado avanzado

## Tecnologías

- **Frontend Framework:** React 19 con TypeScript
- **Routing:** React Router v7
- **HTTP Client:** Axios con proxy middleware
- **Estilos:** Tailwind CSS
- **Testing:** Jest + React Testing Library
- **Build Tool:** react-scripts (CRA 5)
- **Icons:** Heroicons

## Arquitectura

```
src/
├── pages/
│   ├── app/
│   │   ├── HistoryTransferPage.tsx    # Historial con filtros
│   │   └── NewTransferPage.tsx        # Formulario transferencias
│   ├── auth/
│   │   └── LoginPage.tsx              # Autenticación
│   └── home/
│       └── HomePage.tsx               # Dashboard principal
├── components/                        # Componentes reutilizables
│   ├── ActionCards.tsx
│   ├── BalanceCard.tsx
│   ├── Navbar.tsx
│   ├── PageHeader.tsx
│   ├── TransferFilters.tsx
│   └── TransferList.tsx
├── services/
│   ├── auth/
│   │   └── authService.ts
│   ├── balance/
│   │   └── balanceService.ts
│   └── transfer/
│       └── transferService.ts
├── context/
│   └── AuthContext.tsx
├── routes/
│   └── ProtectedRoute.tsx
├── helpers/
│   ├── currency.ts
│   └── serviceError.ts
├── types/
│   ├── Auth.ts
│   ├── Balance.ts
│   └── Transfer.ts
├── config/
│   ├── api.ts
│   └── axiosClient.ts
├── setupProxy.ts
└── App.tsx
```

## Instalación

### Requisitos
- Node.js 16+
- npm

### Pasos

```bash
git clone <repository-url>
cd bancoxyz
npm install
```

### Variables de entorno

Crear `.env` con las URLs completas de la API (obligatorias para que funcione):

```env
REACT_APP_API_LOGIN=https://dominio.com/default/login
REACT_APP_API_BALANCE=https://dominio.com/default/balance
REACT_APP_API_TRANSFER=https://dominio.com/default/transfer
REACT_APP_API_TRANSFER_LIST=https://dominio.com/default/transferList
```

> **Requerido:** Cada variable debe contener la URL completa de su endpoint correspondiente. Sin estas variables, la aplicación no podrá conectarse a la API.

## Ejecución

### Desarrollo
```bash
npm start
```
Inicia servidor en `http://localhost:3000`. El proxy redirige `/api/*` a los endpoints configurados en `.env`.

### Tests
```bash
# Watch mode
npm test

# Cobertura
npm run coverage
```

### Build
```bash
npm run build
```

## Cobertura de Tests

**7 suites · 27 tests** ✓

| Módulo | Cobertura |
|--------|-----------|
| App.tsx | ✓ |
| context/AuthContext | ✓ login, logout, hydrate, error |
| pages/auth/LoginPage | ✓ validación, happy path, API error |
| pages/app/NewTransferPage | ✓ validación, happy path, API error, cancel |
| pages/app/HistoryTransferPage | ✓ list, error, filtros x3, no results |
| pages/home/HomePage | ✓ logout flow |
| routes/ProtectedRoute | ✓ auth/guest routes |

> Threshold mínimo: 80% branches/functions/lines/statements  
> Excluidos: `config/`, `helpers/`, `components/`, tipos

## Flujo de la Aplicación

1. **Login** → `POST /api/login` → token en localStorage
2. **Home** → `GET /api/balance` → dashboard con saldo
3. **New Transfer** → validación en cliente → `POST /api/transfer`
4. **History** → `GET /api/transferList` → filtrado local por nombre/monto/fecha

## Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/login` | Autenticar usuario |
| GET | `/api/balance` | Obtener saldo actual |
| POST | `/api/transfer` | Realizar transferencia |
| GET | `/api/transferList` | Obtener historial |

## Features

- ✓ Validación de formularios en cliente
- ✓ Manejo centralizado de errores HTTP
- ✓ Autenticación JWT (token en localStorage)
- ✓ Rutas protegidas y rutas de invitado
- ✓ Filtrado dinámico sin refetch (nombre, monto, fecha)
- ✓ Formateo de monedas por locale
- ✓ Loading states y skeletons
- ✓ Path aliases `@/` en TypeScript y Jest
- ✓ Proxy de desarrollo para CORS
- ✓ Responsive design (Tailwind CSS)
