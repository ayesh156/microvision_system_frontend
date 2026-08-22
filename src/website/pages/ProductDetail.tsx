import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Barcode,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react';
import { Box, Button, Container, Grid, IconButton, Skeleton, Typography } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../../lib/utils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=85';

interface PublicProduct {
  id: string;
  name: string;
  price: number;
  costPrice: number | null;
  stock: number;
  image: string | null;
  description: string | null;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  brand: { id: string; name: string } | null;
  barcode?: string | null;
  warranty?: string | null;
  warrantyMonths?: number | null;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 2 }).format(value);
}

function cardProduct(product: PublicProduct) {
  return {
    id: product.id,
    name: product.name,
    category: (product.category?.name || 'Uncategorized').toLowerCase().replace(/\s+/g, '-'),
    price: product.price,
    originalPrice: product.costPrice ? product.costPrice * 1.3 : product.price,
    rating: 0,
    reviews: 0,
    image: product.image || '',
    badge: product.stock > 0 && product.stock <= 5 ? 'Low Stock' : undefined,
    specs: product.brand ? [product.brand.name] : undefined,
    inStock: product.stock > 0,
  };
}

function DetailSkeleton() {
  return (
    <Box sx={{ minHeight: '100vh', background: '#0a0f1a', pt: { xs: 12, md: 16 }, pb: 10 }}>
      <Container maxWidth="lg">
        <Skeleton variant="text" width={180} sx={{ bgcolor: 'rgba(148,163,184,.15)', mb: 4 }} />
        <Grid container spacing={{ xs: 4, md: 8 }}>
          <Grid size={{ xs: 12, md: 6 }}><Skeleton variant="rounded" sx={{ height: { xs: 320, md: 520 }, bgcolor: 'rgba(148,163,184,.1)' }} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Skeleton variant="text" width="35%" sx={{ bgcolor: 'rgba(148,163,184,.15)' }} /><Skeleton variant="text" sx={{ bgcolor: 'rgba(148,163,184,.15)', fontSize: '3rem' }} /><Skeleton variant="rounded" height={180} sx={{ bgcolor: 'rgba(148,163,184,.1)', mt: 3 }} /></Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, setCartOpen } = useCart();
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [related, setRelated] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`${API_BASE_URL}/public/products`, { cache: 'no-store', signal: controller.signal })
      .then((response) => response.json())
      .then((result) => {
        const products: PublicProduct[] = result.success && Array.isArray(result.data) ? result.data : [];
        const current = products.find((item) => item.id === id) || null;
        setProduct(current);
        setRelated(current?.categoryId ? products.filter((item) => item.id !== id && item.categoryId === current.categoryId).slice(0, 4) : []);
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name !== 'AbortError') setProduct(null);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (!product) {
    return (
      <Box sx={{ minHeight: '70vh', background: '#0a0f1a', color: '#fff', pt: 20, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>Product not found</Typography>
        <Typography sx={{ color: '#94a3b8', mb: 4 }}>This hardware may have been removed or is no longer available.</Typography>
        <Button component={Link} to="/products" startIcon={<ArrowLeft size={18} />} variant="contained" sx={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}>Back to products</Button>
      </Box>
    );
  }

  const image = imageError ? FALLBACK_IMAGE : getImageUrl(product.image);
  const stockLabel = product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock';
  const warrantyLabel = product.warranty || `${product.warrantyMonths || 12} Months Warranty`;
  const addableQuantity = Math.min(quantity, product.stock);
  const handleAdd = () => {
    for (let index = 0; index < addableQuantity; index += 1) addToCart(cardProduct(product));
    setCartOpen(true);
  };

  const badges = [
    { icon: ShieldCheck, label: 'Warranty', value: warrantyLabel },
    { icon: CheckCircle2, label: 'Availability', value: stockLabel },
    { icon: Cpu, label: 'Brand & Model', value: product.brand?.name || 'Genuine Brand' },
    { icon: Barcode, label: 'Barcode / SKU', value: product.barcode || product.id.slice(-6).toUpperCase() },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: '#0a0f1a', color: '#f8fafc', pt: { xs: 11, md: 15 }, pb: 12 }}>
      <Container maxWidth="lg">
        <Button component={Link} to="/products" startIcon={<ArrowLeft size={17} />} sx={{ color: '#94a3b8', mb: 4, '&:hover': { color: '#60a5fa' } }}>Back to products</Button>
        <Grid container spacing={{ xs: 4, md: 8 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: 'relative', border: '1px solid rgba(51,65,85,.8)', background: 'radial-gradient(circle at 50% 40%, rgba(37,99,235,.16), transparent 60%), #111827', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Box component="img" src={image} alt={product.name} onError={() => setImageError(true)} sx={{ width: '88%', height: '88%', objectFit: 'contain', filter: 'drop-shadow(0 25px 35px rgba(0,0,0,.45))' }} />
              <IconButton aria-label="Previous image" sx={{ position: 'absolute', left: 12, top: '50%', color: '#cbd5e1', border: '1px solid rgba(148,163,184,.2)' }}><ChevronLeft size={20} /></IconButton>
              <IconButton aria-label="Next image" sx={{ position: 'absolute', right: 12, top: '50%', color: '#cbd5e1', border: '1px solid rgba(148,163,184,.2)' }}><ChevronRight size={20} /></IconButton>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography sx={{ color: '#60a5fa', textTransform: 'uppercase', letterSpacing: 2, fontSize: '.75rem', fontWeight: 700, mb: 1 }}>{product.category?.name || 'Computer Hardware'}</Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.2rem', md: '3.5rem' }, lineHeight: 1.05, fontWeight: 800, mb: 2 }}>{product.name}</Typography>
            <Typography sx={{ color: '#94a3b8', lineHeight: 1.8, mb: 3 }}>{product.description || 'Precision-selected hardware for dependable everyday performance.'}</Typography>
            <Typography sx={{ color: '#60a5fa', fontSize: '2rem', fontWeight: 800, mb: 3 }}>{formatPrice(product.price)}</Typography>
            <Grid container spacing={1.5} sx={{ mb: 4 }}>
              {badges.map(({ icon: Icon, label, value }) => <Grid size={{ xs: 6 }} key={label}><Box sx={{ border: '1px solid rgba(51,65,85,.8)', background: 'rgba(15,23,42,.65)', p: 1.5, minHeight: 82 }}><Icon size={18} color="#38bdf8" /><Typography sx={{ color: '#64748b', fontSize: '.68rem', mt: .7 }}>{label}</Typography><Typography sx={{ fontSize: '.82rem', fontWeight: 700 }}>{value}</Typography></Box></Grid>)}
            </Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #334155' }}><IconButton aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} sx={{ color: '#cbd5e1' }}><Minus size={17} /></IconButton><Typography sx={{ minWidth: 36, textAlign: 'center', fontWeight: 700 }}>{quantity}</Typography><IconButton aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} sx={{ color: '#cbd5e1' }}><Plus size={17} /></IconButton></Box>
              <Button fullWidth variant="contained" disabled={product.stock < 1} onClick={handleAdd} startIcon={<ShoppingCart size={18} />} sx={{ py: 1.5, background: 'linear-gradient(135deg, #2563eb, #06b6d4)', boxShadow: '0 12px 30px rgba(37,99,235,.25)' }}>{product.stock ? 'Add to cart' : 'Out of stock'}</Button>
            </Box>
          </Grid>
        </Grid>
        {related.length > 0 && <Box sx={{ mt: 12 }}><Typography variant="h4" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}><Layers size={22} color="#38bdf8" /> Related tech</Typography><Grid container spacing={3}>{related.map((item, index) => <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}><ProductCard product={cardProduct(item)} index={index} /></Grid>)}</Grid></Box>}
      </Container>
    </Box>
  );
}
