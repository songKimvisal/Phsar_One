import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProductDetails(id: string) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            seller:users(*),
            category:categories(id, name_key, parent:categories(id, name_key))
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
