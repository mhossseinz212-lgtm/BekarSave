/**
 * Site Protection and Anti-Inspect Lock
 * Prevents right-click context menu, developer shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U),
 * and console tampering to protect client-side code and assets.
 */

export function initSiteProtection() {
  if (typeof window === 'undefined') return;

  // 1. Disable Right Click Context Menu
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  document.addEventListener('contextmenu', handleContextMenu, { capture: true });

  // 2. Disable Keyboard Shortcuts for Inspect / Developer Tools / View Source
  const handleKeyDown = (e: KeyboardEvent) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    if (isCtrlOrCmd) {
      const key = e.key.toLowerCase();
      
      // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element Picker), Ctrl+Shift+K (Firefox Console)
      if (e.shiftKey && (key === 'i' || key === 'j' || key === 'c' || key === 'k')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U (View Page Source), Ctrl+S (Save Page)
      if (key === 'u' || key === 's') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  };
  document.addEventListener('keydown', handleKeyDown, { capture: true });

  // 3. Disable Dragging of Images
  const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  };
  document.addEventListener('dragstart', handleDragStart, { capture: true });

  // 4. Mute Console Output and Clear
  try {
    const noop = () => {};
    window.console.log = noop;
    window.console.info = noop;
    window.console.warn = noop;
    window.console.debug = noop;
  } catch {
    // Ignore in restricted environments
  }
}
