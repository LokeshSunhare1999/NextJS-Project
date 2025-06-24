import { useEffect } from 'react';

interface CSSModule {
  href: string;
  media?: string;
  priority?: 'high' | 'low';
}

export function useLazyCSS(cssModules: CSSModule[]) {
  useEffect(() => {
    const loadCSS = (href: string, media = 'all'): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if CSS is already loaded
        if (document.querySelector(`link[href="${href}"]`)) {
          resolve();
          return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print'; // Load as print first to avoid render blocking
        link.onload = () => {
          link.media = media; // Switch to target media after load
          resolve();
        };
        link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
        
        document.head.appendChild(link);
      });
    };

    // Load high priority CSS first
    const highPriority = cssModules.filter(css => css.priority === 'high');
    const lowPriority = cssModules.filter(css => css.priority !== 'high');

    // Load high priority CSS immediately
    Promise.all(
      highPriority.map(css => loadCSS(css.href, css.media))
    ).then(() => {
      // Load low priority CSS after high priority is done
      lowPriority.forEach(css => {
        loadCSS(css.href, css.media);
      });
    });

  }, [cssModules]);
}
