# 图片资源目录

请将武器和配件图片放入对应文件夹。

## 目录结构

```
images/
├── weapons/       # 武器图片（命名与 weapon.image 字段对应，如 m5a3.png）
└── attachments/   # 配件图片（命名与 attachment.image 字段对应，如 supp_std.png）
```

## 命名规则

图片文件名必须与 JSON 数据中的 `image` 字段完全一致。

例如：
- `src/data/weapons/assault-rifles.json` 中 M5A3 的 `"image": "m5a3.png"` → `weapons/m5a3.png`
- `src/data/attachments/muzzles.json` 中标准消音器的 `"image": "supp_std.png"` → `attachments/supp_std.png`

## 支持格式

PNG、JPG、WebP、SVG 均可。推荐使用 PNG 格式，透明背景。

## 降级行为

如果图片文件缺失或加载失败，界面会自动显示对应的 emoji 占位图标。
