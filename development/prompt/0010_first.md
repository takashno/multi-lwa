# Multi-Nuxt (Nuxt4 + Lambda Web Adapter + API Gateway + CloudFront + WAF) 検証指示

## 概要
このプロジェクトは、Nuxt4 アプリケーションを 3 つ（Central, FeatureA, FeatureB）用意し、AWS Lambda (Docker/Lambda Web Adapter) 上で SSR 実行します。  
静的アセットは S3 + CloudFront から配信し、API Gateway HTTP API 経由で SSR/動的 API を提供します。  
CloudFront の前段に AWS WAF を設定し、Cognito JWT オーソライザーで API 認証を行います。

## 要件
- Nuxt4 (Node.js 22) 各アプリを Lambda(Docker) + LWA で稼働
- Central アプリ：ログイン前/認証/ログイン後トップページ
- FeatureA/B アプリ：特定ドメインの CRUD UI
- 認証は Central アプリで Cognito Hosted UI (Auth Code + PKCE) → Feature アプリへ SSO 的遷移
- API Gateway HTTP API に JWT オーソライザー（Cognito連携）を設定
- CloudFront で S3 (静的) と API Gateway (SSR) をオリジン分離
- CloudFront に WAF を設定
- AWS_LWA_REMOVE_BASE_PATH でアプリ側ルーティング簡素化

## 検証タスク
1. **CDKデプロイ**で S3, CloudFront, WAF, API Gateway, Lambda を作成
2. 各アプリ (apps/central, apps/feature-a, apps/feature-b) をビルドし .output/public を S3 へデプロイ
3. API Gateway HTTP API の /api/* 経由で SSR/動的 API を呼び出す
4. CloudFront ビヘイビア設定が S3 と API Gateway に正しくルーティングされることを確認
5. JWT オーソライザーが有効で、認証無しアクセスが拒否されることを確認
6. Hosted UI ログイン → Feature アプリ遷移 → SSO 成立を確認

## プロジェクト構成

plaintext
multi-lwa/
├─ infra/ # CDKプロジェクト
│ ├─ bin/infra.ts
│ ├─ lib/stack.ts
│ ├─ package.json
│ └─ tsconfig.json
├─ apps/
│ ├─ central/
│ │ └─ see: https://nuxt.com/docs/4.x/guide/directory-structure/nuxt
│ ├─ feature-a/
│ │ └─ same as central
│ ├─ feature-b
│ │ └─ same as central
├─ .gitignore
├─ README.md