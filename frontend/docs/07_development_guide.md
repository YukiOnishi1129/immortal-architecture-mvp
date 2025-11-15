# 開発ガイド

## 新規画面追加フロー

### 1. ルート設計

適切なルートグループを選択：
- `(guest)` - 未ログインユーザー向け
- `(authenticated)` - ログイン必須
- `(neutral)` - 認証不問

### 2. ページ作成

```bash
# 例：ノート詳細画面
mkdir -p app/(authenticated)/notes/[noteId]
touch app/(authenticated)/notes/[noteId]/page.tsx
touch app/(authenticated)/notes/[noteId]/loading.tsx
```

### 3. Feature実装

```bash
# Featureモジュール作成
mkdir -p features/note/components/server
mkdir -p features/note/components/client/NoteDetail
mkdir -p features/note/hooks
mkdir -p features/note/types
```

### 4. 実装チェックリスト

- [ ] ページコンポーネント（RSC）
- [ ] サーバーテンプレート
- [ ] クライアントコンポーネント（Container/Presenter）
- [ ] カスタムフック
- [ ] Server Actions
- [ ] 型定義
- [ ] ローディング状態
- [ ] エラーハンドリング

## コーディング規約

### ファイル命名規則

```
- コンポーネント: PascalCase.tsx
- フック: useCamelCase.ts
- ユーティリティ: camelCase.ts
- 型定義: types/index.ts
- Server Actions: camelCase.action.ts
```

### インポート順序

```tsx
// 1. React/Next
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. 外部ライブラリ
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// 3. 内部モジュール（絶対パス）
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/shared/hooks/use-auth'

// 4. 相対パス
import { NoteCard } from './NoteCard'
import type { NoteListProps } from './types'
```

### コンポーネント構造

```tsx
// 1. 型定義
interface ComponentProps {
  // ...
}

// 2. コンポーネント定義
export function Component({ prop1, prop2 }: ComponentProps) {
  // 3. フック
  const router = useRouter()
  const { data } = useQuery()
  
  // 4. ローカル状態
  const [state, setState] = useState()
  
  // 5. 副作用
  useEffect(() => {}, [])
  
  // 6. ハンドラー（必ずuseCallbackを使用）
  const handleClick = useCallback(() => {
    // 処理
  }, [/* 依存配列 */])
  
  // 7. レンダリング
  return <div>...</div>
}
```

## 型定義ガイドライン

### 基本的な型定義

```ts
// ❌ 避けるべき
const data: any = {}
const items: Array<Object> = []

// ✅ 推奨
const data: UserData = {}
const items: Item[] = []
```

### ユーティリティ型の活用

```ts
// Partial（一部のプロパティ）
type UpdateNoteInput = Partial<Note>

// Omit（特定のプロパティを除外）
type CreateNoteInput = Omit<Note, 'id' | 'createdAt'>

// Pick（特定のプロパティのみ）
type NotePreview = Pick<Note, 'id' | 'title' | 'status'>
```

## Next.js グローバル型定義

Next.js 15以降では、`LayoutProps`と`PageProps`がグローバルに利用可能です。importする必要はありません。

### Layout Component

```tsx
// app/(authenticated)/layout.tsx
export default function AuthenticatedLayout(props: LayoutProps<'/'>) {
  return (
    <AuthenticatedLayoutWrapper>
      {props.children}
    </AuthenticatedLayoutWrapper>
  )
}
```

### Page Component

```tsx
// app/notes/[noteId]/page.tsx
export default async function NotePage(props: PageProps<'/notes/[noteId]'>) {
  const params = await props.params
  const searchParams = await props.searchParams
  
  return <NoteDetailTemplate noteId={params.noteId} />
}

// パラメータが不要な場合
export default function ApprovalsPage(_props: PageProps<'/approvals'>) {
  return <PendingApprovalsPageTemplate />
}
```

### 型の詳細

- `LayoutProps<T>`: Tはルートパス。childrenとparamsを含む
- `PageProps<T>`: Tはルートパス。paramsとsearchParamsを含む
- 両方ともPromiseを返すため、awaitが必要

## Server ActionsとServer Functions

### 重要な使い分けルール

**RSC (React Server Component) から呼び出す場合は必ず`*Server`関数を使用すること。`*Action`関数は使用しない。**

- **`*Action`**: Client ComponentやフォームアクションからのみOK
- **`*Server`**: Server Component (page.tsx, layout.tsx, PageTemplate.tsx) からはこちらを使用

| 呼び出し元 | 使用すべき関数 | 例 |
|---|---|---|
| Client Component | `*Action` | `useQuery`のqueryFn、フォームsubmit |
| Server Component (RSC) | `*Server` | page.tsx, layout.tsx, PageTemplate.tsx |

### 認証ヘルパー関数

Server Componentで認証を扱う際は、以下のヘルパー関数を使用してください。

#### requireAuthServer

認証チェックのみを行い、未認証の場合は`/login`にリダイレクトします。セッション情報が不要な場合に使用します。

```ts
// external/handler/note/note.query.server.ts
import { requireAuthServer } from "@/features/auth/servers/redirect.server";

export async function getNoteByIdServer(id: string) {
  await requireAuthServer(); // 認証チェックのみ

  const note = await noteService.getNoteById(id);
  return note;
}
```

#### getAuthenticatedSessionServer

認証チェックとセッション取得を1回で行います。未認証の場合は`/login`にリダイレクトします。セッション情報（`session.account.id`など）が必要な場合に使用します。

```ts
// external/handler/note/note.command.server.ts
import { getAuthenticatedSessionServer } from "@/features/auth/servers/redirect.server";

export async function createNoteServer(request: unknown) {
  const session = await getAuthenticatedSessionServer(); // 認証チェック + セッション取得

  const validated = CreateNoteRequestSchema.parse(request);
  const note = await noteService.createNote(session.account.id, validated);
  return note;
}
```

**使い分けのポイント:**
- セッション情報が**不要** → `requireAuthServer()`
- セッション情報が**必要** → `getAuthenticatedSessionServer()`

### Server Actions（クライアントから呼び出し可能）

```ts
// external/handler/note.command.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createNoteServer } from './note.command.server'

export async function createNoteAction(input: CreateNoteInput) {
  const result = await createNoteServer(input)

  if (result.success) {
    revalidatePath('/notes')
  }

  return result
}
```

**使用例（Client Component）:**
```tsx
// features/note/hooks/useNoteQuery.ts
export function useNoteListQuery(filters?: NoteFilters) {
  return useQuery({
    queryKey: noteKeys.list(filters),
    queryFn: () => listNotesAction(filters), // ✅ Client ComponentからはAction
  })
}
```

### Server Functions（サーバー専用）

```ts
// external/handler/note.command.server.ts
import 'server-only'

export async function createNoteServer(input: CreateNoteInput) {
  // ビジネスロジック
}
```

**使用例（Server Component）:**
```tsx
// app/(authenticated)/notes/page.tsx
export default async function NotesPage() {
  const notes = await listNotesServer() // ✅ RSCからはServer

  return <NoteList notes={notes} />
}
```

**使用例（layout.tsx - generateMetadata）:**
```tsx
// app/(authenticated)/notes/[id]/layout.tsx
export async function generateMetadata({ params }: LayoutProps) {
  const id = (await params).id
  const note = await getNoteByIdServer(id) // ✅ RSCからはServer

  return {
    title: note ? `${note.title} | Mini Notion` : 'ノート詳細 | Mini Notion'
  }
}
```

## テスト戦略

### 単体テスト

```ts
// features/note/utils/validation.test.ts
import { describe, it, expect } from 'vitest'
import { validateNoteTitle } from './validation'

describe('validateNoteTitle', () => {
  it('空文字を拒否する', () => {
    expect(validateNoteTitle('')).toBe(false)
  })
  
  it('100文字以内を許可する', () => {
    expect(validateNoteTitle('a'.repeat(100))).toBe(true)
  })
})
```

### 統合テスト

```tsx
// features/note/components/client/NoteList/NoteList.test.tsx
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NoteList } from './NoteList'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('NoteList', () => {
  it('ノート一覧を表示する', async () => {
    render(<NoteList />, { wrapper: createWrapper() })
    
    expect(await screen.findByText('ノート1')).toBeInTheDocument()
  })
})
```

## パフォーマンス最適化

### 動的インポート

```tsx
// 重いコンポーネントの遅延読み込み
const RichTextEditor = dynamic(
  () => import('@/shared/components/RichTextEditor'),
  { 
    loading: () => <EditorSkeleton />,
    ssr: false 
  }
)
```

### 画像最適化

```tsx
import Image from 'next/image'

<Image
  src="/avatar.png"
  alt="User Avatar"
  width={40}
  height={40}
  priority // Above the fold画像
/>
```

### バンドルサイズ削減

```ts
// ❌ 全体インポート
import _ from 'lodash'

// ✅ 個別インポート
import debounce from 'lodash/debounce'
```

## デバッグテクニック

### React Query Devtools

開発環境で自動的に有効化されます。

### Server Componentsのデバッグ

```tsx
// コンソール出力はサーバー側に表示
export default async function Page() {
  console.log('This logs on the server')
  
  const data = await fetchData()
  console.log('Fetched data:', data)
  
  return <div>...</div>
}
```

### Client Componentsのデバッグ

```tsx
'use client'

export function Component() {
  // ブラウザコンソールに表示
  console.log('This logs in the browser')
  
  // React Developer Tools で確認可能
  return <div>...</div>
}
```