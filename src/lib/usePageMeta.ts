import { useEffect } from 'react';
import { setMeta } from './theme';

export function usePageMeta(title: string, description: string, path: string) {
  useEffect(() => {
    setMeta({ title, description, path });
    window.scrollTo(0, 0);
  }, [title, description, path]);
}
