# Multi-Nuxt (Nuxt4 + Lambda Web Adapter + API Gateway + CloudFront + WAF) 検証プロジェクト

## 概要
このプロジェクトは、Nuxt4 アプリケーションを 3 つ（Central, FeatureA, FeatureB）用意し、AWS Lambda (Docker/Lambda Web Adapter) 上で SSR 実行するマルチアプリケーション構成です。

静的アセットは S3 + CloudFront から配信し、API Gateway HTTP API 経由で SSR/動的 API を提供します。  
CloudFront の前段に AWS WAF を設定し、Cognito JWT オーソライザーで API 認証を行います。

## 技術スタック
- **Frontend**: Nuxt4 (Node.js 22)
- **Package Manager**: Yarn
- **Deployment**: AWS Lambda (Docker/Lambda Web Adapter)
- **Static Assets**: S3 + CloudFront
- **API**: API Gateway HTTP API
- **Authentication**: AWS Cognito (Hosted UI + JWT)
- **Security**: AWS WAF
- **Infrastructure**: AWS CDK

## プロジェクト構成

```
multi-lwa/
├─ README.md
├─ package.json                 # ルートワークスペース設定
├─ yarn.lock                    # ルート依存関係
├─ .yarnrc.yml                  # Yarn設定 (node-modules mode)
├─ apps/
│  ├─ central/                  # Central アプリ (認証・メインページ)
│  │  ├─ package.json           # Nuxt4アプリ設定
│  │  ├─ yarn.lock              # 独立した依存関係
│  │  ├─ nuxt.config.ts         # Nuxt設定
│  │  ├─ app/                   # アプリケーションコード
│  │  └─ .nuxt/                 # Nuxt生成ファイル
│  ├─ feature-a/                # FeatureA アプリ (未作成)
│  └─ feature-b/                # FeatureB アプリ (未作成)
├─ infra/                       # CDKプロジェクト (未作成)
└─ development/
   └─ prompt/
      └─ 0010_first.md          # プロジェクト仕様書
```

## 開発環境セットアップ

### 前提条件
- Node.js 22.x
- Yarn

### 初期セットアップ
```bash
# リポジトリクローン
git clone <repository-url>
cd multi-lwa

# ルート依存関係インストール
yarn install

# Centralアプリ依存関係インストール
cd apps/central
yarn install
cd ../..
```

## 開発コマンド

### Central アプリ

#### ルートディレクトリから起動（推奨）
```bash
# 開発サーバー起動
yarn dev:central

# ビルド
yarn build:central
```

#### centralディレクトリから直接起動
```bash
cd apps/central

# 開発サーバー起動
yarn dev

# ビルド
yarn build
```

### アクセス情報
- **Central アプリ**: http://localhost:3001/
- **DevTools**: Shift + Option + D (ブラウザ内)

## アプリケーション仕様

### Central アプリ
- **役割**: ログイン前/認証/ログイン後トップページ
- **認証**: Cognito Hosted UI (Auth Code + PKCE)
- **機能**: 
  - ログイン前ページ
  - 認証処理
  - ログイン後ダッシュボード
  - Feature アプリへの SSO 遷移

### FeatureA/B アプリ (予定)
- **役割**: 特定ドメインの CRUD UI
- **認証**: Central からの SSO
- **機能**: ドメイン固有の業務機能

## AWS アーキテクチャ (予定)

### インフラ構成
- **S3**: 静的アセット配信
- **CloudFront**: CDN + WAF
- **API Gateway HTTP API**: SSR/API エンドポイント
- **Lambda (Docker)**: Nuxt SSR実行環境
- **Cognito**: 認証・認可
- **WAF**: セキュリティ

### Lambda Web Adapter
- **環境変数**: `AWS_LWA_REMOVE_BASE_PATH=true`
- **用途**: アプリ側ルーティング簡素化

## 検証タスク

1. ✅ **Central アプリ作成・起動確認**
2. ⏸️ **FeatureA/B アプリ作成**
3. ⏸️ **Lambda Web Adapter 対応**
4. ⏸️ **Docker化**
5. ⏸️ **CDK インフラ構築**
6. ⏸️ **S3 静的アセットデプロイ**
7. ⏸️ **API Gateway SSR 確認**
8. ⏸️ **CloudFront ルーティング確認**
9. ⏸️ **JWT オーソライザー確認**
10. ⏸️ **Cognito SSO フロー確認**

## 開発ステータス

- ✅ **Yarn Workspace 設定完了**
- ✅ **Central アプリ（Nuxt4）作成・起動確認**
- ⏸️ FeatureA/B アプリ作成
- ⏸️ 認証機能実装
- ⏸️ AWS インフラ構築

## トラブルシューティング

### Yarn Workspace エラー
プロジェクトは各アプリが独立したyarn環境を持つ構成になっています。
- ルートディレクトリ: workspace管理用
- apps/central: 独立したyarn.lock

### ポート競合
複数のNuxtアプリを同時起動する場合、自動的に別ポートが割り当てられます。
- Central: http://localhost:3001/
- FeatureA: http://localhost:3002/ (予定)
- FeatureB: http://localhost:3003/ (予定)