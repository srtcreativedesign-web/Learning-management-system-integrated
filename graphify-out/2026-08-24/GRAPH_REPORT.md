# Graph Report - tnd-lms  (2026-08-24)

## Corpus Check
- 169 files · ~126,732 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1228 nodes · 1467 edges · 129 communities (68 shown, 61 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d994d3ff`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AiService
- sidebar.tsx
- audit.module.ts
- mobile-app/src/context/AuthContext.tsx
- app.module.ts
- dependencies
- lms.module.ts
- jest
- dependencies
- GamificationService
- SyncService
- react
- primitives/animate/tooltip.tsx
- InHouseService
- compilerOptions
- expo
- primitives/radix/sheet.tsx
- components.json
- compilerOptions
- dependencies
- compilerOptions
- components/radix/sheet.tsx
- highlight.tsx
- printEvaluationReport.ts
- frontend/src/context/AuthContext.tsx
- devDependencies
- include
- devDependencies
- TnD LMS & AUDIT MANAGEMENT SYSTEM
- components/animate/tooltip.tsx
- EmptyState.tsx
- exclude
- slot.tsx
- checkbox.tsx
- card.tsx
- nest-cli.json
- supertest
- backend/README.md
- tabs.tsx
- seed.ts
- InHouseSessionsView.tsx
- LibraryQuizGenerate.tsx
- LibraryView.tsx
- frontend/tsconfig.json
- BarChartCard.tsx
- LineChartCard.tsx
- DataTable.tsx
- StatusBadge.tsx
- AppLayout.tsx
- QuizBuilder.tsx
- DynamicInputList.tsx
- ChecklistBuilder.tsx
- InHouseChecklistBuilder.tsx
- SopViewer.tsx
- 1. Menjalankan Aplikasi (*Running*)
- test-db.ts
- Task: Rank Rewards (hadiah per level gamifikasi)
- plugins
- PageHeader.tsx
- ProtectedRoute.tsx
- AuthService
- badge.tsx
- button.tsx
- use-controlled-state.tsx
- QuizHistoryView.tsx
- RankRewardsView.tsx
- OutletManagement.tsx
- EmployeeManagement.tsx
- TabSwitcher.tsx
- scripts
- Panduan Mengatasi Docker & Server yang Terhenti (Force Restart Guide)
- React + TypeScript + Vite
- App.tsx
- LeaderboardView.tsx
- README.md
- rules/graphify.md
- workflows/graphify.md
- @eslint/eslintrc
- @eslint/js
- eslint-plugin-prettier
- globals
- jest
- @nestjs/cli
- @nestjs/schematics
- @nestjs/testing
- prettier
- prisma
- source-map-support
- metro.config.js
- nativewind-env.d.ts
- backend/package.json
- ts-jest
- ts-loader
- ts-node
- tsconfig-paths
- @types/jest
- @types/multer
- @types/node
- @types/pg
- @types/supertest
- typescript
- typescript-eslint
- AGENTS.md
- multer
- @nestjs/core
- @nestjs/platform-express
- openai
- pg
- rxjs

## God Nodes (most connected - your core abstractions)
1. `react` - 65 edges
2. `compilerOptions` - 21 edges
3. `compilerOptions` - 19 edges
4. `compilerOptions` - 16 edges
5. `InHouseService` - 14 edges
6. `scripts` - 13 edges
7. `GamificationService` - 13 edges
8. `CourseService` - 13 edges
9. `useAuth()` - 13 edges
10. `GamificationController` - 12 edges

## Surprising Connections (you probably didn't know these)
- `HomeScreen()` --calls--> `useAuth()`  [EXTRACTED]
  mobile-app/app/(tabs)/home.tsx → mobile-app/src/context/AuthContext.tsx
- `ProfileScreen()` --calls--> `useAuth()`  [EXTRACTED]
  mobile-app/app/(tabs)/profile.tsx → mobile-app/src/context/AuthContext.tsx
- `LoginScreen()` --calls--> `useAuth()`  [EXTRACTED]
  mobile-app/app/index.tsx → mobile-app/src/context/AuthContext.tsx
- `AuthContextType` --references--> `UserAuth`  [EXTRACTED]
  frontend/src/context/AuthContext.tsx → frontend/src/types/auth.ts
- `AuthContextType` --references--> `UserRole`  [EXTRACTED]
  frontend/src/context/AuthContext.tsx → frontend/src/types/auth.ts

## Import Cycles
- None detected.

## Communities (129 total, 61 thin omitted)

### Community 0 - "AiService"
Cohesion: 0.06
Nodes (24): AiService, pdfParse, Injectable, QuizController, ApiOperation, ApiTags, Body, Controller (+16 more)

### Community 1 - "sidebar.tsx"
Cohesion: 0.04
Nodes (27): [LocalSidebarProvider, useSidebar], SidebarContentProps, SidebarContextProps, SidebarFooterProps, SidebarGroupActionProps, SidebarGroupContentProps, SidebarGroupLabelProps, SidebarGroupProps (+19 more)

### Community 2 - "audit.module.ts"
Cohesion: 0.06
Nodes (23): AuditModule, Module, ChecklistController, Body, Controller, Get, Post, ChecklistService (+15 more)

### Community 3 - "mobile-app/src/context/AuthContext.tsx"
Cohesion: 0.05
Nodes (44): plugins, LoginScreen(), FindingsScreen(), SopItem, SopPoint, HomeScreen(), PALETTE, OutletItem (+36 more)

### Community 4 - "app.module.ts"
Cohesion: 0.10
Nodes (18): AppController, Controller, Get, AppModule, Module, AppService, Injectable, InHouseModule (+10 more)

### Community 5 - "dependencies"
Cohesion: 0.05
Nodes (37): @base-ui/react, chart.js, class-variance-authority, clsx, @floating-ui/react, @fontsource-variable/geist, dependencies, @base-ui/react (+29 more)

### Community 6 - "lms.module.ts"
Cohesion: 0.05
Nodes (31): ApiPropertyOptional, CertificateTemplateController, Body, Controller, Get, Param, Post, CertificateTemplateService (+23 more)

### Community 7 - "jest"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+5 more)

### Community 8 - "dependencies"
Cohesion: 0.10
Nodes (21): axios, dependencies, axios, groq-sdk, @nestjs/axios, @nestjs/common, @nestjs/jwt, @nestjs/swagger (+13 more)

### Community 9 - "GamificationService"
Cohesion: 0.11
Nodes (14): GamificationController, ApiOperation, ApiTags, Body, Controller, Get, Param, Post (+6 more)

### Community 10 - "SyncService"
Cohesion: 0.13
Nodes (14): SyncDivisionDto, ApiProperty, SyncUserDto, ApiProperty, SyncController, ApiOperation, ApiResponse, ApiTags (+6 more)

### Community 12 - "primitives/animate/tooltip.tsx"
Cohesion: 0.07
Nodes (24): Align, FloatingContextType, [FloatingProvider, useFloatingContext], getResolvedSide(), GlobalTooltipContextType, [GlobalTooltipProvider, useGlobalTooltip], initialFromSide(), [LocalTooltipProvider, useTooltip] (+16 more)

### Community 13 - "InHouseService"
Cohesion: 0.12
Nodes (10): InHouseController, Body, Controller, Get, Param, Post, Query, InHouseService (+2 more)

### Community 14 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, ignoreDeprecations, jsx, lib, module, moduleDetection (+16 more)

### Community 15 - "expo"
Cohesion: 0.09
Nodes (21): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, expo (+13 more)

### Community 16 - "primitives/radix/sheet.tsx"
Cohesion: 0.08
Nodes (13): SheetCloseProps, SheetContentProps, SheetContextType, SheetDescriptionProps, SheetFooterProps, SheetHeaderProps, SheetOverlayProps, SheetPortalProps (+5 more)

### Community 17 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 18 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+13 more)

### Community 19 - "dependencies"
Cohesion: 0.04
Nodes (45): babel-preset-expo, expo, expo-constants, expo-dev-client, expo-linking, expo-router, expo-status-bar, @expo/vector-icons (+37 more)

### Community 20 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, ignoreDeprecations, lib, module, moduleDetection, noEmit (+12 more)

### Community 21 - "components/radix/sheet.tsx"
Cohesion: 0.11
Nodes (9): SheetCloseProps, SheetContentProps, SheetDescriptionProps, SheetFooterProps, SheetHeaderProps, SheetOverlayProps, SheetProps, SheetTitleProps (+1 more)

### Community 22 - "highlight.tsx"
Cohesion: 0.12
Nodes (17): BaseHighlightProps, Bounds, ControlledChildrenModeHighlightProps, ControlledParentModeHighlightProps, DEFAULT_BOUNDS_OFFSET, ExtendedChildProps, getNonOverridingDataAttributes(), HighlightContext (+9 more)

### Community 24 - "frontend/src/context/AuthContext.tsx"
Cohesion: 0.15
Nodes (11): AuthContext, AuthContextType, AuthProvider(), DEFAULT_AUTH_CONTEXT_VALUE, DEFAULT_USERS, API_BASE_URL, getApiUrl(), ROLE_BADGES (+3 more)

### Community 26 - "devDependencies"
Cohesion: 0.06
Nodes (32): autoprefixer, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/vite, @types/node (+24 more)

### Community 27 - "include"
Cohesion: 0.17
Nodes (11): compilerOptions, strict, types, extends, include, **/*.ts, app.d.ts, expo/tsconfig.base (+3 more)

### Community 28 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, eslint-config-prettier, @types/express, eslint, eslint-config-prettier, @types/express

### Community 31 - "TnD LMS & AUDIT MANAGEMENT SYSTEM"
Cohesion: 0.11
Nodes (17): 1. Executive Summary & Vision, 2. Target Users & Stakeholders, 3.1 Technology Stack, 3. System Architecture & Tech Stack, 4.1 Modul 1: Pustaka Materi & Kursus (Course Management), 4.2 Modul 2: AI-Powered Quiz Generator & Evaluasi, 4.3 Modul 3: Integrasi SobatHR & Webhook Sertifikat, 4.4 Modul 4: Gamifikasi, Rank & Leaderboard (+9 more)

### Community 32 - "components/animate/tooltip.tsx"
Cohesion: 0.22
Nodes (4): TooltipContentProps, TooltipProps, TooltipProviderProps, TooltipTriggerProps

### Community 35 - "exclude"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 36 - "slot.tsx"
Cohesion: 0.32
Nodes (7): AnyProps, DOMMotionProps, mergeProps(), mergeRefs(), Slot(), SlotProps, WithAsChild

### Community 37 - "checkbox.tsx"
Cohesion: 0.29
Nodes (4): CheckboxContextType, CheckboxIndicatorProps, CheckboxProps, [CheckboxProvider, useCheckbox]

### Community 38 - "card.tsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 39 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 41 - "backend/README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 43 - "seed.ts"
Cohesion: 0.40
Nodes (3): adapter, pool, prisma

### Community 44 - "InHouseSessionsView.tsx"
Cohesion: 0.40
Nodes (3): AssessmentItem, InHouseSession, Outlet

### Community 45 - "LibraryQuizGenerate.tsx"
Cohesion: 0.40
Nodes (3): CourseItem, Option, Question

### Community 46 - "LibraryView.tsx"
Cohesion: 0.40
Nodes (3): Course, Material, QuizItem

### Community 47 - "frontend/tsconfig.json"
Cohesion: 0.40
Nodes (4): compilerOptions, ignoreDeprecations, files, references

### Community 53 - "QuizBuilder.tsx"
Cohesion: 0.67
Nodes (3): generateId(), Question, QuizBuilder()

### Community 58 - "1. Menjalankan Aplikasi (*Running*)"
Cohesion: 0.20
Nodes (9): 1. Menjalankan Aplikasi (*Running*), 2. Proses Debugging, 3. Pemecahan Masalah Umum (*Troubleshooting*), A. Di Perangkat Fisik (Sangat Direkomendasikan), B. Di Emulator iOS (Mac), C. Di Emulator Android, Cara Membuka Developer Menu:, Fitur Debugging Utama: (+1 more)

### Community 60 - "Task: Rank Rewards (hadiah per level gamifikasi)"
Cohesion: 0.20
Nodes (9): 1. Prisma model `RankReward`, 2. Endpoint publik (dipanggil sobat-api), 3. Admin CRUD (opsional, untuk HR mengubah hadiah tanpa akses database langsung), Cara verifikasi, Context, Rank yang harus dipakai (JANGAN diubah namanya), Task: Rank Rewards (hadiah per level gamifikasi), Yang perlu dibuat (+1 more)

### Community 61 - "plugins"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 64 - "AuthService"
Cohesion: 0.14
Nodes (11): AuthController, Body, Controller, Get, Post, AuthModule, Module, AuthService (+3 more)

### Community 73 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 74 - "Panduan Mengatasi Docker & Server yang Terhenti (Force Restart Guide)"
Cohesion: 0.33
Nodes (5): 1. Mematikan Paksa (Force Kill) Docker yang Stuck, 2. Membuka Kembali Docker Desktop, 3. Menghidupkan Kontainer Database (PostgreSQL), 4. Menjalankan Kembali Server Backend & Frontend, Panduan Mengatasi Docker & Server yang Terhenti (Force Restart Guide)

### Community 75 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 108 - "backend/package.json"
Cohesion: 0.22
Nodes (8): author, description, license, name, prisma, seed, private, version

## Knowledge Gaps
- **465 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `seed` (+460 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **61 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `sidebar.tsx`, `mobile-app/src/context/AuthContext.tsx`, `primitives/animate/tooltip.tsx`, `primitives/radix/sheet.tsx`, `components/radix/sheet.tsx`, `highlight.tsx`, `frontend/src/context/AuthContext.tsx`, `dropdown-menu.tsx`, `dialog.tsx`, `select.tsx`, `components/animate/tooltip.tsx`, `table.tsx`, `EmptyState.tsx`, `slot.tsx`, `checkbox.tsx`, `card.tsx`, `InHouseSessionsView.tsx`, `LibraryQuizGenerate.tsx`, `LibraryView.tsx`, `BarChartCard.tsx`, `LineChartCard.tsx`, `DataTable.tsx`, `StatusBadge.tsx`, `AppLayout.tsx`, `QuizBuilder.tsx`, `DynamicInputList.tsx`, `ChecklistBuilder.tsx`, `InHouseChecklistBuilder.tsx`, `SopViewer.tsx`, `plugins`, `PageHeader.tsx`, `ProtectedRoute.tsx`, `use-controlled-state.tsx`, `QuizHistoryView.tsx`, `RankRewardsView.tsx`, `OutletManagement.tsx`, `EmployeeManagement.tsx`, `TabSwitcher.tsx`, `App.tsx`, `LeaderboardView.tsx`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `expo` connect `expo` to `mobile-app/src/context/AuthContext.tsx`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `plugins` connect `mobile-app/src/context/AuthContext.tsx` to `expo`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _465 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AiService` be split into smaller, more focused modules?**
  _Cohesion score 0.05925925925925926 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0392156862745098 - nodes in this community are weakly interconnected._
- **Should `audit.module.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.060408163265306125 - nodes in this community are weakly interconnected._