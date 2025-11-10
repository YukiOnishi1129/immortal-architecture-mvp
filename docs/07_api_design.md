# API URL & スキーマ設計（MVP）

> ルール：
> - 読む＝**GET**、作る＝**POST**、直す＝**PUT**、消す＝**DELETE**
> - 親子はURLで表現（例：/notes/:noteId/sections）
> - 認証・権限（Ownerチェック）はアプリ層、値チェック（Status等）はVO/ドメインで実施

## 🗒️ Notes（ノート）

### 1) 一覧取得

- **GET** /api/notes?q=&status=&page=1
- **Query**
  - q（任意）: string（タイトル/本文のキーワード）
  - status（任意）: "Draft" | "Publish"
  - page（任意）: number（1開始）
- **Response**

```json
{
  "items": [
    { "id":"n1", "title":"設計メモ", "status":"Draft", "updatedAt":"2025-11-10T12:00:00Z" }
  ],
  "page": 1,
  "total": 23
}
```

### 2) 詳細取得

- **GET** /api/notes/:noteId
- **Response**

```json
{
  "id":"n1",
  "title":"設計メモ",
  "status":"Draft",
  "templateId":"t1",
  "ownerId":"a1",
  "sections":[
    { "id":"s1","fieldId":"f_problem","content":"..." },
    { "id":"s2","fieldId":"f_solution","content":"" }
  ],
  "createdAt":"2025-11-10T11:00:00Z",
  "updatedAt":"2025-11-10T12:00:00Z"
}
```

### 3) 作成

- **POST** /api/notes
- **Request**

```json
{ "title":"新しいノート", "templateId":"t1" }
```

- **Response**

```json
{
  "id":"n2",
  "title":"新しいノート",
  "status":"Draft",
  "templateId":"t1",
  "ownerId":"a1",
  "sections":[
    { "id":"s10","fieldId":"f_problem","content":"" },
    { "id":"s11","fieldId":"f_solution","content":"" }
  ],
  "createdAt":"2025-11-10T13:00:00Z",
  "updatedAt":"2025-11-10T13:00:00Z"
}
```

### 4) 更新（タイトル／ステータス／セクション内容の一括更新）

- **PUT** /api/notes/:noteId
- **Request**

```json
{
  "title":"タイトル更新",
  "status":"Publish",
  "sections":[
    { "id":"s1","content":"直した内容" },
    { "id":"s2","content":"" }
  ]
}
```

- **Response**

```json
{ "ok": true }
```

### 5) 削除

- **DELETE** /api/notes/:noteId
- **Response**

```json
{ "ok": true }
```

## ✏️ Sections（ノート内の欄）

### ＊個別更新が必要なら

### 6) セクション一覧（ノート内）

- **GET** /api/notes/:noteId/sections
- **Response**

```json
{
  "items": [
    { "id":"s1","fieldId":"f_problem","content":"..." },
    { "id":"s2","fieldId":"f_solution","content":"" }
  ]
}
```

### 7) セクション更新（1件）

- **PUT** /api/notes/:noteId/sections/:sectionId
- **Request**

```json
{ "content":"書き直したテキスト" }
```

- **Response**

```json
{ "ok": true }
```

## 🧩 Templates（テンプレート）

### 8) 一覧取得

- **GET** /api/templates?q=&page=1
- **Response**

```json
{
  "items": [
    { "id":"t1","name":"基本テンプレ","ownerId":"a1","updatedAt":"2025-11-10T10:00:00Z" }
  ],
  "page": 1,
  "total": 5
}
```

### 9) 詳細取得

- **GET** /api/templates/:templateId
- **Response**

```json
{
  "id":"t1",
  "name":"基本テンプレ",
  "ownerId":"a1",
  "fields":[
    { "id":"f_problem","label":"問題","order":1,"isRequired":true },
    { "id":"f_solution","label":"対策","order":2,"isRequired":false }
  ],
  "updatedAt":"2025-11-10T10:00:00Z"
}
```

### 10) 作成

- **POST** /api/templates
- **Request**

```json
{
  "name":"軽量テンプレ",
  "fields":[
    { "label":"問題","order":1,"isRequired":true },
    { "label":"対策","order":2,"isRequired":false }
  ]
}
```

- **Response**

```json
{ "id":"t2" }
```

### 11) 更新（名前・Field一括）

- **PUT** /api/templates/:templateId
- **Request**

```json
{
  "name":"基本テンプレ_v2",
  "fields":[
    { "id":"f_problem","label":"課題","order":1,"isRequired":true },
    { "id":"f_solution","label":"解決策","order":2,"isRequired":false },
    { "label":"検証","order":3,"isRequired":false }   // 新規追加行（id省略）
  ]
}
```

- **Response**

```json
{ "ok": true }
```

### 12) 削除

- **DELETE** /api/templates/:templateId
- **Response**

```json
{ "ok": true }
```

## 📄 Fields（テンプレ内の項目）

### ＊個別APIが必要なら

### 13) Field一覧

- **GET** /api/templates/:templateId/fields

### 14) Field追加

- **POST** /api/templates/:templateId/fields

```json
{ "label":"前提", "order":3, "isRequired": false }
```

### 15) Field更新

- **PUT** /api/templates/:templateId/fields/:fieldId

```json
{ "label":"課題", "order":1, "isRequired": true }
```

### 16) Field削除

- **DELETE** /api/templates/:templateId/fields/:fieldId

## 🔐 認証まわり（MVP方針）

- すべてのAPIは「ログイン済み（Account）」が前提
- Ownerチェック（自分のノート／テンプレだけ編集可）は**アプリ層**で実施
- 値チェック（Status, Labelの空NG等）は**VO/ドメイン**で実施