# Graph Report - tnd-lms  (2026-09-01)

## Corpus Check
- 195 files · ~169,458 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1813 nodes · 2200 edges · 131 communities (90 shown, 41 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d2b43542`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- prisma
- sidebar.tsx
- audit.module.ts
- outlets.tsx
- AiService
- dependencies
- eslint-config-prettier
- scripts
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
- mobile-app/tsconfig.json
- devDependencies
- TnD LMS & AUDIT MANAGEMENT SYSTEM
- components/animate/tooltip.tsx
- Android Platform Guidelines
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
- Touch Psychology Reference
- DataTable.tsx
- StatusBadge.tsx
- Mobile Performance Reference
- QuizBuilder.tsx
- ChecklistBuilder.tsx
- InHouseChecklistBuilder.tsx
- iOS Platform Guidelines
- 1. Menjalankan Aplikasi (*Running*)
- test-db.ts
- Task: Rank Rewards (hadiah per level gamifikasi)
- plugins
- Mobile Backend Patterns
- app.module.ts
- badge.tsx
- button.tsx
- SKILL.md
- QuizHistoryView.tsx
- Mobile Color System Reference
- OutletManagement.tsx
- EmployeeManagement.tsx
- Mobile Typography Reference
- Mobile Navigation Reference
- Panduan Mengatasi Docker & Server yang Terhenti (Force Restart Guide)
- React + TypeScript + Vite
- home.tsx
- Mobile Testing Patterns
- README.md
- rules/graphify.md
- workflows/graphify.md
- @eslint/eslintrc
- @eslint/js
- eslint-plugin-prettier
- @nestjs/cli
- @nestjs/schematics
- @nestjs/testing
- prettier
- source-map-support
- metro.config.js
- nativewind-env.d.ts
- Mobile Decision Trees
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
- Mobile Design System
- TrainingReportService
- lms.module.ts
- BarChartCard.tsx
- InHouseAssessmentBottomSheet.tsx
- use-controlled-state.tsx
- index.tsx
- MobileAuditor
- TrainingAnalytics.tsx
- Avatar.tsx
- LeaderboardView.tsx
- printTrainingReport.ts
- globals
- jest

## God Nodes (most connected - your core abstractions)
1. `react` - 69 edges
2. `compilerOptions` - 21 edges
3. `compilerOptions` - 19 edges
4. `compilerOptions` - 16 edges
5. `COLORS` - 16 edges
6. `RADIUS` - 15 edges
7. `InHouseService` - 14 edges
8. `scripts` - 13 edges
9. `GamificationService` - 13 edges
10. `CourseService` - 13 edges

## Surprising Connections (you probably didn't know these)
- `HomeScreen()` --calls--> `useAuth()`  [EXTRACTED]
  mobile-app/app/(tabs)/home.tsx → mobile-app/src/context/AuthContext.tsx
- `OutletsScreen()` --calls--> `useAuth()`  [EXTRACTED]
  mobile-app/app/(tabs)/outlets.tsx → mobile-app/src/context/AuthContext.tsx
- `ProfileScreen()` --calls--> `useAuth()`  [EXTRACTED]
  mobile-app/app/(tabs)/profile.tsx → mobile-app/src/context/AuthContext.tsx
- `LoginScreen()` --calls--> `useAuth()`  [EXTRACTED]
  mobile-app/app/index.tsx → mobile-app/src/context/AuthContext.tsx
- `AuthContextType` --references--> `UserAuth`  [EXTRACTED]
  frontend/src/context/AuthContext.tsx → frontend/src/types/auth.ts

## Import Cycles
- None detected.

## Communities (131 total, 41 thin omitted)

### Community 1 - "sidebar.tsx"
Cohesion: 0.04
Nodes (27): [LocalSidebarProvider, useSidebar], SidebarContentProps, SidebarContextProps, SidebarFooterProps, SidebarGroupActionProps, SidebarGroupContentProps, SidebarGroupLabelProps, SidebarGroupProps (+19 more)

### Community 2 - "audit.module.ts"
Cohesion: 0.06
Nodes (25): AuditModule, Module, ChecklistController, ApiOperation, ApiTags, Body, Controller, Get (+17 more)

### Community 3 - "outlets.tsx"
Cohesion: 0.17
Nodes (15): HomeScreen(), OutletItem, OutletsScreen(), AuthContext, AuthContextType, AuthProvider(), API_BASE_URL, fetchAuditInspectionsApi() (+7 more)

### Community 4 - "AiService"
Cohesion: 0.06
Nodes (24): AiService, pdfParse, Injectable, QuizController, ApiOperation, ApiTags, Body, Controller (+16 more)

### Community 5 - "dependencies"
Cohesion: 0.05
Nodes (39): @base-ui/react, chart.js, class-variance-authority, clsx, @floating-ui/react, @fontsource-variable/geist, dependencies, @base-ui/react (+31 more)

### Community 7 - "scripts"
Cohesion: 0.06
Nodes (34): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+26 more)

### Community 8 - "dependencies"
Cohesion: 0.06
Nodes (33): axios, dependencies, axios, groq-sdk, multer, @nestjs/axios, @nestjs/common, @nestjs/core (+25 more)

### Community 9 - "GamificationService"
Cohesion: 0.11
Nodes (14): GamificationController, ApiOperation, ApiTags, Body, Controller, Get, Param, Post (+6 more)

### Community 10 - "SyncService"
Cohesion: 0.13
Nodes (14): SyncDivisionDto, ApiProperty, SyncUserDto, ApiProperty, SyncController, ApiOperation, ApiResponse, ApiTags (+6 more)

### Community 11 - "react"
Cohesion: 0.04
Nodes (17): App(), queryClient, LineChartCardProps, LineDataset, EmptyStateProps, PageHeaderProps, ProtectedRouteProps, StatCardProps (+9 more)

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
Cohesion: 0.08
Nodes (23): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, expo (+15 more)

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
Nodes (47): babel-preset-expo, expo, expo-constants, expo-dev-client, expo-image-picker, expo-linking, expo-router, expo-status-bar (+39 more)

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

### Community 27 - "mobile-app/tsconfig.json"
Cohesion: 0.13
Nodes (14): compilerOptions, strict, types, exclude, extends, include, node_modules, **/*.ts (+6 more)

### Community 28 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, ts-jest, @types/express, eslint, ts-jest, @types/express

### Community 31 - "TnD LMS & AUDIT MANAGEMENT SYSTEM"
Cohesion: 0.11
Nodes (17): 1. Executive Summary & Vision, 2. Target Users & Stakeholders, 3.1 Technology Stack, 3. System Architecture & Tech Stack, 4.1 Modul 1: Pustaka Materi & Kursus (Course Management), 4.2 Modul 2: AI-Powered Quiz Generator & Evaluasi, 4.3 Modul 3: Integrasi SobatHR & Webhook Sertifikat, 4.4 Modul 4: Gamifikasi, Rank & Leaderboard (+9 more)

### Community 32 - "components/animate/tooltip.tsx"
Cohesion: 0.22
Nodes (4): TooltipContentProps, TooltipProps, TooltipProviderProps, TooltipTriggerProps

### Community 34 - "Android Platform Guidelines"
Cohesion: 0.04
Nodes (48): 10. Android Checklist, 1. Material Design 3 Philosophy, 2. Android Typography, 3. Material Color System, 4. Android Layout & Spacing, 5. Android Navigation Patterns, 6. Material Components, 7. Android-Specific Patterns (+40 more)

### Community 35 - "exclude"
Cohesion: 0.25
Nodes (7): exclude, extends, node_modules, dist, **/*spec.ts, test, ./tsconfig.json

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
Cohesion: 0.32
Nodes (7): AssessmentItem, buildColumns(), column, getGradeBadge(), InHouseSession, InHouseSessionsView(), Outlet

### Community 45 - "LibraryQuizGenerate.tsx"
Cohesion: 0.40
Nodes (3): CourseItem, Option, Question

### Community 46 - "LibraryView.tsx"
Cohesion: 0.40
Nodes (3): Course, Material, QuizItem

### Community 47 - "frontend/tsconfig.json"
Cohesion: 0.40
Nodes (4): compilerOptions, ignoreDeprecations, files, references

### Community 48 - "Touch Psychology Reference"
Cohesion: 0.04
Nodes (47): 10. Quick Reference Card, 1. Fitts' Law for Touch, 2. Thumb Zone Anatomy, 3. Touch vs Click Psychology, 4. Gesture Psychology, 5. Haptic Feedback Patterns, 6. Mobile Cognitive Load, 7. Touch Accessibility (+39 more)

### Community 50 - "DataTable.tsx"
Cohesion: 0.24
Nodes (9): alignClass(), DataTable(), DataTableColumn, DataTableColumnMeta, DataTableFeatures, DataTableProps, EMPTY, parseSorting() (+1 more)

### Community 52 - "Mobile Performance Reference"
Cohesion: 0.04
Nodes (46): 1. The Mobile Performance Mindset, 2. React Native Performance, 3. Flutter Performance, 4. Animation Performance (Both Platforms), 5. Memory Management, 6. Battery Optimization, 7. Network Performance, 8. Performance Testing (+38 more)

### Community 53 - "QuizBuilder.tsx"
Cohesion: 0.67
Nodes (3): generateId(), Question, QuizBuilder()

### Community 57 - "iOS Platform Guidelines"
Cohesion: 0.04
Nodes (44): 10. iOS Checklist, 1. Human Interface Guidelines Philosophy, 2. iOS Typography, 3. iOS Color System, 4. iOS Layout & Spacing, 5. iOS Navigation Patterns, 6. iOS Components, 7. iOS Specific Patterns (+36 more)

### Community 58 - "1. Menjalankan Aplikasi (*Running*)"
Cohesion: 0.20
Nodes (9): 1. Menjalankan Aplikasi (*Running*), 2. Proses Debugging, 3. Pemecahan Masalah Umum (*Troubleshooting*), A. Di Perangkat Fisik (Sangat Direkomendasikan), B. Di Emulator iOS (Mac), C. Di Emulator Android, Cara Membuka Developer Menu:, Fitur Debugging Utama: (+1 more)

### Community 60 - "Task: Rank Rewards (hadiah per level gamifikasi)"
Cohesion: 0.20
Nodes (9): 1. Prisma model `RankReward`, 2. Endpoint publik (dipanggil sobat-api), 3. Admin CRUD (opsional, untuk HR mengubah hadiah tanpa akses database langsung), Cara verifikasi, Context, Rank yang harus dipakai (JANGAN diubah namanya), Task: Rank Rewards (hadiah per level gamifikasi), Yang perlu dibuat (+1 more)

### Community 61 - "plugins"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 63 - "Mobile Backend Patterns"
Cohesion: 0.05
Nodes (43): 1. Push Notifications, 2. Offline Sync & Conflict Resolution, 3. Mobile API Optimization, 4. App Versioning, 5. Authentication for Mobile, 6. Error Handling for Mobile, 7. Media & Binary Handling, 8. Security for Mobile (+35 more)

### Community 64 - "app.module.ts"
Cohesion: 0.06
Nodes (29): AppController, Controller, Get, AppModule, Module, AppService, Injectable, AuthController (+21 more)

### Community 67 - "SKILL.md"
Cohesion: 0.05
Nodes (37): 1. The Toolset, 2. Common Debugging Workflows, 3. Platform-Specific Nightmares, 🚫 AI DEBUGGING ANTI-PATTERNS, Android, 🌐 "API Request Failed" (Network), 📝 DEBUGGING CHECKLIST, iOS (+29 more)

### Community 68 - "QuizHistoryView.tsx"
Cohesion: 0.53
Nodes (5): Attempt, buildColumns(), column, formatDate(), QuizHistoryView()

### Community 69 - "Mobile Color System Reference"
Cohesion: 0.05
Nodes (38): 10. Quick Reference, 1. Mobile Color Fundamentals, 2. OLED Considerations, 3. Dark Mode Design, 4. Outdoor Visibility, 5. Semantic Colors, 6. Dynamic Color (Android), 7. Color Accessibility (+30 more)

### Community 70 - "OutletManagement.tsx"
Cohesion: 0.40
Nodes (3): column, columns, Outlet

### Community 71 - "EmployeeManagement.tsx"
Cohesion: 0.40
Nodes (3): column, columns, Employee

### Community 72 - "Mobile Typography Reference"
Cohesion: 0.05
Nodes (38): 10. Quick Reference, 1. Mobile Typography Fundamentals, 2. System Fonts, 3. Type Scale, 4. Dynamic Type / Text Scaling, 5. Typography Accessibility, 6. Dark Mode Typography, 7. Typography Anti-Patterns (+30 more)

### Community 73 - "Mobile Navigation Reference"
Cohesion: 0.06
Nodes (35): 10. Navigation Checklist, 1. Navigation Selection Decision Tree, 2. Tab Bar Navigation, 3. Stack Navigation, 4. Drawer Navigation, 5. Modal Navigation, 6. Deep Linking, 7. Navigation State Persistence (+27 more)

### Community 74 - "Panduan Mengatasi Docker & Server yang Terhenti (Force Restart Guide)"
Cohesion: 0.33
Nodes (5): 1. Mematikan Paksa (Force Kill) Docker yang Stuck, 2. Membuka Kembali Docker Desktop, 3. Menghidupkan Kontainer Database (PostgreSQL), 4. Menjalankan Kembali Server Backend & Frontend, Panduan Mengatasi Docker & Server yang Terhenti (Force Restart Guide)

### Community 75 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 76 - "home.tsx"
Cohesion: 0.21
Nodes (16): SopItem, SopPoint, BrandHeader(), BrandHeaderProps, BrandStatusScrim(), ButtonProps, Card(), GradeBadge() (+8 more)

### Community 77 - "Mobile Testing Patterns"
Cohesion: 0.06
Nodes (33): 1. Testing Tool Selection, 2. Testing Pyramid for Mobile, 3. What to Test at Each Level, 4. Platform-Specific Testing, 5. Offline & Network Testing, 6. Performance Testing, 7. Accessibility Testing, 8. CI/CD Integration (+25 more)

### Community 108 - "Mobile Decision Trees"
Cohesion: 0.06
Nodes (30): 10. Quick Reference, 1. Framework Selection, 2. State Management Selection, 3. Navigation Pattern Selection, 4. Storage Strategy Selection, 5. Offline Strategy Selection, 6. Authentication Pattern Selection, 7. Project Type Templates (+22 more)

### Community 123 - "Mobile Design System"
Cohesion: 0.07
Nodes (30): ⛔ AI MOBILE ANTI-PATTERNS (YASAK LİSTESİ), Animation Performance, Architecture Sins, Before Every Screen, Before Release, Before Starting ANY Mobile Project, 📝 CHECKPOINT (MANDATORY Before Any Mobile Work), ⚠️ CRITICAL: ASK BEFORE ASSUMING (MANDATORY) (+22 more)

### Community 124 - "TrainingReportService"
Cohesion: 0.14
Nodes (12): TrainingReportController, ApiOperation, ApiTags, Controller, Get, Query, TrainingReportModule, Module (+4 more)

### Community 125 - "lms.module.ts"
Cohesion: 0.05
Nodes (31): ApiPropertyOptional, CertificateTemplateController, Body, Controller, Get, Param, Post, CertificateTemplateService (+23 more)

### Community 127 - "InHouseAssessmentBottomSheet.tsx"
Cohesion: 0.14
Nodes (16): AuditInspectionBottomSheet(), AuditInspectionBottomSheetProps, styles, { height: SCREEN_HEIGHT }, InHouseAssessmentBottomSheet(), InHouseAssessmentBottomSheetProps, styles, Path (+8 more)

### Community 129 - "index.tsx"
Cohesion: 0.13
Nodes (15): DEMO_ACCOUNTS, LoginScreen(), FindingsScreen(), ProfileScreen(), AUDITOR_TABS, CustomTabBar(), styles, TabMeta (+7 more)

### Community 131 - "TrainingAnalytics.tsx"
Cohesion: 0.29
Nodes (5): column, OutletItem, OverviewData, TabType, TrainingRecord

### Community 132 - "Avatar.tsx"
Cohesion: 0.53
Nodes (3): Avatar(), AvatarProps, initials()

### Community 133 - "LeaderboardView.tsx"
Cohesion: 0.50
Nodes (4): buildColumns(), column, LeaderboardUser, LeaderboardView()

## Knowledge Gaps
- **835 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `seed` (+830 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `use-controlled-state.tsx`, `sidebar.tsx`, `index.tsx`, `TrainingAnalytics.tsx`, `outlets.tsx`, `LeaderboardView.tsx`, `Avatar.tsx`, `primitives/animate/tooltip.tsx`, `primitives/radix/sheet.tsx`, `components/radix/sheet.tsx`, `highlight.tsx`, `frontend/src/context/AuthContext.tsx`, `dropdown-menu.tsx`, `dialog.tsx`, `select.tsx`, `components/animate/tooltip.tsx`, `table.tsx`, `slot.tsx`, `checkbox.tsx`, `card.tsx`, `InHouseSessionsView.tsx`, `LibraryQuizGenerate.tsx`, `LibraryView.tsx`, `DataTable.tsx`, `StatusBadge.tsx`, `QuizBuilder.tsx`, `ChecklistBuilder.tsx`, `InHouseChecklistBuilder.tsx`, `plugins`, `QuizHistoryView.tsx`, `OutletManagement.tsx`, `EmployeeManagement.tsx`, `home.tsx`, `BarChartCard.tsx`, `InHouseAssessmentBottomSheet.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _835 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0392156862745098 - nodes in this community are weakly interconnected._
- **Should `audit.module.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `AiService` be split into smaller, more focused modules?**
  _Cohesion score 0.06103896103896104 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._