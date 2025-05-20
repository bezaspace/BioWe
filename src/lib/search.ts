import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setSearch = useCallback((query: string) => {
    if (!query) {
      router.push('/products');
      return;
    }
    router.push(`/products?q=${encodeURIComponent(query)}`);
  }, [router]);

  const currentSearch = searchParams?.get('q') || '';

  return {
    search: currentSearch,
    setSearch,
  };
}
