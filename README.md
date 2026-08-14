# Y STUDIO

自分がつくったプロダクトを静かに並べておく場所。

**URL**: https://y-studios.github.io/

## セクション構成

- **Products** (`data/products.json`) — 作ったプロダクト
- **Service** (`data/services.json`) — Webサービスとして提供しているもの

どちらに載せるかはユーザーが指定する。指定がなければ Products に登録する。スキーマは両ファイル共通。

## 登録の流れ

1. 登録したい URL を Claude に渡す
2. Claude が URL の中身を確認して、以下を行う
   - 対象セクションの JSON の配列の先頭にエントリを追加(名前・タグライン・詳細・登録日・タグ)
   - アイコンは **サイトにファビコンがあればそれを採用**(512pxの `icon.png` 等を `icons/<id>.png` に保存)。無い場合のみ、プロダクトの雰囲気に合わせた SVG を `icons/<id>.svg` に生成
3. `main` に push すると GitHub Pages に自動反映

## キャッシュ対策

GitHub Pages は全ファイル `max-age=600`(10分キャッシュ)。

- `data/products.json` は取得時に `?t=Date.now()` を付けて常に最新を読む
- `assets/style.css` / `assets/app.js` を編集したら、`index.html` 内の `?v=N` を必ず1つ上げる(古いCSS/JSで新しいHTMLが描画されるのを防ぐ)

## products.json のスキーマ

```json
{
  "id": "kebab-case-slug",
  "name": "プロダクト名",
  "url": "https://...",
  "icon": "icons/<id>.svg",
  "tagline": "カードに表示する一行説明",
  "description": "ポップアップに表示する詳細説明",
  "registeredAt": "YYYY-MM-DD",
  "tags": ["web", "..."]
}
```

一覧は `registeredAt` の降順(新しいものが先頭)で表示される。
