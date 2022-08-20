# atwiki
Kangi Programmer's wiki　の機能を移行する
## 概要
- 現状あまり使われていないkangi atwikiの代替となるwebサイトを作成する。
- ReactやHTTPプロトコル等のWebアプリを作成する際に必要な知識の勉強も兼ねる。
## Getting Start
- このリポジトリをクローン
- yarnをインストール
-`npm install -g yarn`
- 必要なパッケージをインストール
- `yarn add axios react-datepicker @types/react-datepicker date-fns json-server`
## 機能
- 出欠管理
-- 欠席者が欠席日を書き込める機能
- タスク管理
-- 各人が行っているタスクを書き込める機能
- 連絡先の記録
--在籍者、過去に在籍していた人の連絡先記録
- 編集ログ
- ログイン機能
## 設計
- フロントエンド
-- React
- バックエンド
-- Express
- DB
-- MySQL
- ReactとExpressの接続
-- axios
- ORM
-- Prisma
## ディレクトリ構成
- db.json　: モックサーバー                   
- routes.json : モックサーバーのルーティングを調整するためのファイル
- src
  - index.tsx : このコードにReact Componentをexportして表示している
  - Http.tsx　: index.tsxにexportするComponentが書かれている
- その他のファイルについてはcreate-react-appしてから変更は加えていない(はず)
