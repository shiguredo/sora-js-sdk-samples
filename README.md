# Sora JavaScript SDK サンプル集

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

このリポジトリには、 [Sora JavaScript SDK](https://github.com/shiguredo/sora-js-sdk) を利用したサンプルアプリを掲載しています。実際の利用シーンに即したサンプルをご用意しておりますので、目的に応じた Sora JavaScript SDK の使い方を簡単に学ぶことができます。

## About Shiguredo's open source software

We will not respond to PRs or issues that have not been discussed on Discord. Also, Discord is only available in Japanese.

Please read https://github.com/shiguredo/oss/blob/master/README.en.md before use.

## 時雨堂のオープンソースソフトウェアについて

利用前に https://github.com/shiguredo/oss をお読みください。

## 対応 WebRTC SFU Sora

- WebRTC SFU Sora 2023.1.0 以降

## 利用方法

```console
$ pnpm install
```

- hello-sora
  - hello-sora/ で pnpm run dev
- video-codec-type
  - 映像コーデックが指定可能です
  - video-codec-type/ で pnpm run dev

### 環境変数設定

`.env.local.sample` を `.env.local` に変更してシグナリング URL とチャネル ID を指定します。

### 起動

それぞれのディレクトリで `pnpm run dev` を実行します。

## ライセンス

Apache License 2.0

```
Copyright 2023-2023, Shiguredo Inc.

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
