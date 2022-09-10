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
- `yarn install`
- プロジェクトを開始
  - プロジェクトのディレクトリにて`json-server db.json --port 3100 --routes routes.json`
  - もう一つコマンドラインを開きプロジェクトのディレクトリにて`yarn start`
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
  - createUserForm.tsx : user作成用フォームコンポーネント
  - controller : APIがモデルごとにファイルを分けて定義されている
- prisma
  - schema.prisma : DBのモデル定義が書かれている
- その他のファイルについてはcreate-react-appしてから変更は加えていない(はず)
## データベースをモックサーバーからMySQLに移行
[参考ページ](https://numb86-tech.hatenablog.com/entry/2022/03/26/180052)
1. MySQLをインストール
2. 参考ページに従ってデータベースを用意する。データベースの名前はkangi_dbとする。
3．.env　ファイルの　DATABASE_URLを書き換える。↓例
~~~.env
DATABASE_URL="mysql://root:YOURPASSWORD@localhost:3306/kangi_db"
~~~
4．モデルはschema.prismaに定義済みなので以下を実行
~~~
 yarn run prisma migrate dev --name init
~~~

5. 以下をコマンドラインで実行して何かしらのデータを登録してみる
~~~
yarn run prisma studio
~~~
 - プロジェクトを起動
6．MySQLを起動
7. プロジェクトディレクトリにて　
~~~
yarn run start
~~~
8. コマンドラインをもう一つ開いて
~~~
yarn run react-scripts start
~~~
これでプロジェクトが起動する(はず)
エラーなどがあったらコメントで補足をお願いします。

