# Sora JavaScript SDK サンプル集

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

このリポジトリには、 [Sora JavaScript SDK](https://github.com/shiguredo/sora-js-sdk) を利用したサンプルアプリを掲載しています。

## About Shiguredo's open source software

We will not respond to PRs or issues that have not been discussed on Discord. Also, Discord is only available in Japanese.

Please read https://github.com/shiguredo/oss/blob/master/README.en.md before use.

## 時雨堂のオープンソースソフトウェアについて

利用前に https://github.com/shiguredo/oss をお読みください。

## 対応 WebRTC SFU Sora

- WebRTC SFU Sora 2023.1.0 以降

## 利用方法

### インストール

```console
$ pnpm install
```

### sendrecv

送受信ができるサンプルです。

- シグナリング URL 指定
- チャネル ID 指定
- アクセストークン指定
  - `metadata: {access_token: "<access_token>"}`
- 接続ボタン
- 切断ボタン

複数のタブやブラウザで開いて接続してみてください。

```console
$ pnpm run sendrecv
```

[CodeSandbox](https://codesandbox.io/p/github/shiguredo/sora-js-sdk-samples/codesandbox/sendrecv)

### video-codec-type

sendrecv に映像コーデックを指定できるようにしたサンプルです。

送受信ができるサンプルです。

- シグナリング URL 指定
- チャネル ID 指定
- アクセストークン指定
  - `metadata: {access_token: "<access_token>"}`
- ビデオコーデックタイプ指定
- 接続ボタン
- 切断ボタン

複数のタブやブラウザで開いて接続してみてください。

```
$ pnpm run video-codec-type
```

[CodeSandbox](https://codesandbox.io/p/github/shiguredo/sora-js-sdk-samples/codesandbox/video-codec-type)

### 環境変数設定

`.env.local.sample` を `.env.local` に変更してシグナリング URL とチャネル ID を指定します。

### 起動

それぞれのディレクトリで `pnpm run dev` を実行します。

## ライセンス

Apache License 2.0

```
Copyright 2023-2024, Shiguredo Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
