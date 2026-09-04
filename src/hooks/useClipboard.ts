import { useCallback, useState } from 'react';

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copyText = useCallback(async (text: string) => {
    try {
      // 优先使用 Electron clipboard API
      if (window.electronAPI?.clipboard) {
        window.electronAPI.clipboard.writeText(text);
      } else if (navigator.clipboard?.writeText) {
        // 浏览器环境fallback
        await navigator.clipboard.writeText(text);
      } else {
        // 最后方案：创建临时textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 复制失败静默处理
    }
  }, []);

  return { copyText, copied };
}
