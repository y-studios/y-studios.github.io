# Y STUDIO

自分がつくったプロダクトを静かに並べておく場所。

**URL**: https://y-studios.github.io/

## プロダクト登録の流れ

1. 登録したいプロダクトの URL を Claude に渡す
2. Claude が URL の中身を確認して、以下を行う
   - `data/products.json` の配列の先頭にエントリを追加(名前・タグライン・詳細・登録日・タグ)
   - アイコンは **サイトにファビコンがあればそれを採用**(512pxの `icon.png` 等を `icons/<id>.png` に保存)。無い場合のみ、プロダクトの雰囲気に合わせた SVG を `icons/<id>.svg` に生成
3. `main` に push すると GitHub Pages に自動反映

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
