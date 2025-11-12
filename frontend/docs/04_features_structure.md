# Features ディレクトリ設計

## 概要

Featuresディレクトリは、アプリケーションの機能を**ドメイン単位**で整理します。各機能は独立したモジュールとして設計され、高い凝集性と低い結合性を保ちます。

## ディレクトリ構造

```
features/
├─ notes/        # ノート機能
├─ templates/    # テンプレート機能
├─ auth/         # 認証機能
└─ account/      # アカウント機能
```

## 機能モジュールの内部構造

```
features/note/
├─ components/
│  ├─ server/    # Server Components
│  │  ├─ NoteListPageTemplate/
│  │  │  ├─ index.ts
│  │  │  └─ NoteListPageTemplate.tsx
│  │  └─ NoteDetailPageTemplate/
│  │     ├─ index.ts
│  │     └─ NoteDetailPageTemplate.tsx
│  └─ client/    # Client Components
│     ├─ NoteList/
│     │  ├─ index.ts
│     │  ├─ NoteListContainer.tsx
│     │  ├─ NoteListPresenter.tsx
│     │  └─ useNoteList.ts
│     └─ NoteForm/
├─ hooks/        # カスタムフック
│  ├─ useNoteQuery.ts
│  └─ useNoteMutation.ts
├─ queries/      # TanStack Query関連
│  ├─ keys.ts
│  └─ helpers.ts
├─ actions/      # Server Actions
│  ├─ createNote.ts
│  └─ updateNote.ts
├─ types/        # 型定義
│  └─ index.ts
└─ utils/        # ユーティリティ
   └─ validation.ts
```

## Container/Presenterパターン

### Container (ロジック層)

```tsx
// features/note/components/client/NoteList/NoteListContainer.tsx
'use client'

import { NoteListPresenter } from './NoteListPresenter'
import { useNoteList } from './useNoteList'

interface NoteListContainerProps {
  initialFilters?: NoteFilters
}

export function NoteListContainer({ initialFilters }: NoteListContainerProps) {
  const {
    notes,
    isLoading,
    filters,
    updateFilters,
    handleDelete,
  } = useNoteList(initialFilters)

  return (
    <NoteListPresenter
      notes={notes}
      isLoading={isLoading}
      filters={filters}
      onFilterChange={updateFilters}
      onDelete={handleDelete}
    />
  )
}
```

### Presenter (表示層)

```tsx
// features/note/components/client/NoteList/NoteListPresenter.tsx
import { NoteCard } from '../NoteCard'
import { FilterBar } from '../FilterBar'
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner'

interface NoteListPresenterProps {
  notes: Note[]
  isLoading: boolean
  filters: NoteFilters
  onFilterChange: (filters: NoteFilters) => void
  onDelete: (noteId: string) => void
}

export function NoteListPresenter({
  notes,
  isLoading,
  filters,
  onFilterChange,
  onDelete,
}: NoteListPresenterProps) {
  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <FilterBar filters={filters} onChange={onFilterChange} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={() => onDelete(note.id)}
          />
        ))}
      </div>
    </div>
  )
}
```

### カスタムフック

```tsx
// features/note/components/client/NoteList/useNoteList.ts
import { useState, useCallback } from 'react'
import { useNoteListQuery } from '@/features/note/hooks/useNoteQuery'
import { useDeleteNoteMutation } from '@/features/note/hooks/useNoteMutation'

export function useNoteList(initialFilters?: NoteFilters) {
  const [filters, setFilters] = useState(initialFilters || {})
  const { data, isLoading } = useNoteListQuery(filters)
  const deleteMutation = useDeleteNoteMutation()

  // イベントハンドラーはuseCallbackで最適化
  const handleDelete = useCallback(async (noteId: string) => {
    await deleteMutation.mutateAsync(noteId)
  }, [deleteMutation])

  const updateFilters = useCallback((newFilters: NoteFilters) => {
    setFilters(newFilters)
  }, [])

  return {
    notes: data?.notes || [],
    isLoading,
    filters,
    updateFilters,
    handleDelete,
  }
}
```

## Server Componentsテンプレート

Server Components は専用のディレクトリを作成し、index.tsでエクスポートを管理します。

### ディレクトリ構成

```
server/
├─ LoginPageTemplate/
│  ├─ index.ts                 # export { LoginPageTemplate } from './LoginPageTemplate'
│  └─ LoginPageTemplate.tsx    # 実際のコンポーネント実装
└─ NoteListPageTemplate/
   ├─ index.ts
   └─ NoteListPageTemplate.tsx
```

### 実装例

```tsx
// features/note/components/server/NoteListPageTemplate/NoteListPageTemplate.tsx
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/shared/lib/query-client'
import { noteKeys } from '@/features/note/queries/keys'
import { listNotesServer } from '@/external/handler/note.query.server'
import { NoteListContainer } from '../../client/NoteList'

interface NoteListPageTemplateProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function NoteListPageTemplate({ searchParams }: NoteListPageTemplateProps) {
  const queryClient = getQueryClient()
  const filters = { 
    status: searchParams.status as NoteStatus,
    q: searchParams.q as string 
  }

  await queryClient.prefetchQuery({
    queryKey: noteKeys.list(filters),
    queryFn: () => listNotesServer(filters),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteListContainer initialFilters={filters} />
    </HydrationBoundary>
  )
}
```

```tsx
// features/note/components/server/NoteListPageTemplate/index.ts
export { NoteListPageTemplate } from './NoteListPageTemplate'
```

## Client Componentsの命名規則

index.tsでエクスポートする際は、より具体的で意味のある名前に変更します：

```tsx
// features/auth/components/client/Login/index.ts
export { LoginContainer as LoginForm } from './LoginContainer'

// features/note/components/client/NoteList/index.ts  
export { NoteListContainer as NoteList } from './NoteListContainer'
```

## ベストプラクティス

1. **単一責任の原則**: 各コンポーネントは1つの責任のみを持つ
2. **再利用性**: 汎用的なコンポーネントは`shared/`へ移動
3. **テスタビリティ**: PresenterはPropsのみに依存
4. **型安全性**: 全てのインターフェースを明示的に定義
5. **命名規則**: 
   - ファイル名とコンポーネント名を一致させる（アッパーキャメルケース）
   - Server ComponentsはxxxPageTemplateの命名規則
   - Client Componentsはindex.tsで適切な名前でエクスポート