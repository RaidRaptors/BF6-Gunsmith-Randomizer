/**
 * 图片 URL 解析助手
 * - image 以 `bf6data://` 开头：userData 目录中的用户导入图片，直接使用
 * - 其他情况：内置种子图片，走 assets/images/ 相对路径（兼容 file:// 协议）
 */

const BASE_URL = import.meta.env.BASE_URL;

/** 武器图片 URL */
export function weaponImgUrl(image?: string): string | undefined {
  if (!image) return undefined;
  if (image.startsWith('bf6data://')) return image;
  return `${BASE_URL}assets/images/weapons/${image}`;
}

/** 配件图片 URL */
export function attachmentImgUrl(image?: string): string | undefined {
  if (!image) return undefined;
  if (image.startsWith('bf6data://')) return image;
  return `${BASE_URL}assets/images/attachments/${image}`;
}
