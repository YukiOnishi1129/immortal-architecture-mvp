# データベース設計書

## 📦 テーブルとカラム（PK/FK付き）

### 1) accounts（ユーザー）

| **カラム** | **型** | **説明** |
|-----------|--------|----------|
| id (PK) | uuid | ユーザーID |
| email | text | メールアドレス（@必須／ユニーク） |
| first_name | text | 名前（空NG） |
| last_name | text | 苗字（空NG） |
| is_active | boolean | アクティブ状態（デフォルト: true） |
| provider | text | 認証プロバイダー（例: google） |
| provider_account_id | text | プロバイダー側のID |
| thumbnail | text | プロフィール画像URL（nullable） |
| last_login_at | timestamptz | 最終ログイン日時（nullable） |
| created_at | timestamptz | 作成日時 |
| updated_at | timestamptz | 更新日時 |

**索引**：
- UNIQUE(email)
- UNIQUE(provider, provider_account_id)

### 2) templates（テンプレート）

| **カラム** | **型** | **説明** |
|-----------|--------|----------|
| id (PK) | uuid | テンプレID |
| name | text | テンプレ名（空NG） |
| owner_id (FK→accounts.id) | uuid | 作成者 |
| updated_at | timestamptz | 最終更新 |

**関係**：accounts 1 ─< templates

### 3) fields（テンプレの項目）

| **カラム** | **型** | **説明** |
|-----------|--------|----------|
| id (PK) | uuid | フィールドID |
| template_id (FK→templates.id) | uuid | 親テンプレ |
| label | text | 項目名（空NG） |
| order | int | 表示順（テンプレ内で重複NG） |
| is_required | boolean | 必須ならtrue |

**制約例**：
- UNIQUE(template_id, order)（順番の重複を防ぐ）
- CHECK(order > 0)

**関係**：templates 1 ─< fields

### 4) notes（ノート）

| **カラム** | **型** | **説明** |
|-----------|--------|----------|
| id (PK) | uuid | ノートID |
| title | text | タイトル（空NG） |
| template_id (FK→templates.id) | uuid | 使ったテンプレ |
| owner_id (FK→accounts.id) | uuid | 作成者 |
| status | text | Draft or Publish（VOで制御しDBはTEXTでもOK） |
| created_at | timestamptz | 作成日時 |
| updated_at | timestamptz | 更新日時 |

**関係**：
- accounts 1 ─< notes
- templates 1 ─< notes（「参照」：テンプレの存在が必要）

**索引**：INDEX(owner_id), INDEX(template_id), INDEX(updated_at DESC)

### 5) sections（ノートのセクション：本文の各パート）

| **カラム** | **型** | **説明** |
|-----------|--------|----------|
| id (PK) | uuid | セクションID |
| note_id (FK→notes.id) | uuid | 親ノート |
| field_id (FK→fields.id) | uuid | 対応するテンプレ項目 |
| content | text | 入力内容（MVPは文字列のみ） |

**制約例**：
- UNIQUE(note_id, field_id)（同じノートで同じ項目の重複を防ぐ）
- 必須項目チェックはアプリ/ドメインで実施（is_required を参照）

**関係**：notes 1 ─< sections，sections → fields（多→1参照）

**索引**：INDEX(note_id), INDEX(field_id)

## 🗺️ つながり図（ERダイアグラム：関係）

```
accounts (ユーザー)
 ├─< templates (テンプレート)
 │       └─< fields (テンプレの項目)
 └─< notes (ノート)
         └─< sections (ノートのセクション)
                 └─→ fields (どの項目の中身か参照)
```

- A ├─< B … Aが親、Bが子（1対多）
- sections └─→ fields … sections は **どの field の中身か** を参照（多→1）