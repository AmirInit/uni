import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard.jsx';
import { BoxIcon, ChevronBack, ChevronNext, SearchIcon, SparkIcon } from '../components/Icons.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { SelectField } from '../components/ui/Field.jsx';
import { fetchCategories, fetchProducts } from '../services/productService.js';
import { toPersianDigits } from '../lib/format.js';
import { useToast } from '../context/ToastContext.jsx';

const SORT_OPTIONS = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
  { value: 'name', label: 'بر اساس نام' },
];

const PAGE_SIZE = 12;

const Hero = () => (
  <section className="relative overflow-hidden bg-brand-800">
    {/* Decorative glow — purely visual, hidden from assistive tech. */}
    <div
      className="pointer-events-none absolute -top-24 -start-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute -bottom-32 -end-16 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl"
      aria-hidden="true"
    />

    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-100 ring-1 ring-white/15">
        <SparkIcon className="h-4 w-4" />
        ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان
      </span>

      <h1 className="mt-5 max-w-2xl text-3xl leading-[1.45] font-extrabold text-white sm:text-4xl sm:leading-[1.4]">
        هر آنچه نیاز دارید، یک‌جا در <span className="text-accent-300">بازارک</span>
      </h1>

      <p className="mt-4 max-w-xl text-sm leading-8 text-brand-100 sm:text-base">
        از کالای دیجیتال و لوازم خانه گرفته تا پوشاک و تجهیزات ورزشی — با قیمت شفاف،
        ضمانت اصالت کالا و ارسال سریع به سراسر ایران.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="#products" variant="accent" size="lg">
          مشاهدهٔ محصولات
        </Button>
        <Button
          href="#products"
          size="lg"
          className="border border-white/25 bg-white/5 text-white hover:bg-white/10"
        >
          پیشنهادهای ویژه
        </Button>
      </div>
    </div>
  </section>
);

const CategoryChips = ({ categories, active, onSelect }) => (
  <div className="scroll-slim -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
    <button
      type="button"
      onClick={() => onSelect('')}
      className={`shrink-0 rounded-pill px-4 py-2 text-[13px] font-semibold transition ${
        active === ''
          ? 'bg-brand-600 text-white shadow-soft'
          : 'border border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700'
      }`}
    >
      همهٔ دسته‌ها
    </button>
    {categories.map((category) => (
      <button
        key={category.name}
        type="button"
        onClick={() => onSelect(category.name)}
        className={`shrink-0 rounded-pill px-4 py-2 text-[13px] font-semibold transition ${
          active === category.name
            ? 'bg-brand-600 text-white shadow-soft'
            : 'border border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700'
        }`}
      >
        {category.name}
        <span className="num ms-1.5 text-[11px] opacity-70">
          ({toPersianDigits(category.count)})
        </span>
      </button>
    ))}
  </div>
);

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  // Show a compact window of page numbers around the current page.
  const window = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i += 1) window.push(i);

  return (
    <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="صفحه‌بندی">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 bg-white text-ink-600 transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="صفحهٔ قبل"
      >
        {/* In RTL "previous" points to the right. */}
        <ChevronBack className="h-4.5 w-4.5" />
      </button>

      {window[0] > 1 && <span className="px-1 text-ink-400">…</span>}

      {window.map((number) => (
        <button
          key={number}
          type="button"
          onClick={() => onChange(number)}
          aria-current={number === page ? 'page' : undefined}
          className={`num grid h-10 min-w-10 place-items-center rounded-xl px-3 text-sm font-bold transition ${
            number === page
              ? 'bg-brand-600 text-white shadow-soft'
              : 'border border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700'
          }`}
        >
          {toPersianDigits(number)}
        </button>
      ))}

      {window[window.length - 1] < pages && <span className="px-1 text-ink-400">…</span>}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 bg-white text-ink-600 transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="صفحهٔ بعد"
      >
        <ChevronNext className="h-4.5 w-4.5" />
      </button>
    </nav>
  );
};

/** Storefront home: hero, filters and the paginated product grid. */
export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [result, setResult] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  /** Writes a filter change back into the URL so the view is shareable and back-navigable. */
  const applyParams = useCallback(
    (updates) => {
      const next = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(updates)) {
        if (value === '' || value == null) next.delete(key);
        else next.set(key, String(value));
      }
      // Any filter change resets to the first page.
      if (!('page' in updates)) next.delete('page');
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => {
        /* The chips are optional; a failure here shouldn't break the page. */
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);

    fetchProducts({ search, category, sort, page, limit: PAGE_SIZE }, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setResult({
          items: data.items ?? [],
          total: data.total ?? 0,
          page: data.page ?? 1,
          pages: data.pages ?? 1,
        });
      })
      .catch((error) => {
        if (error?.name === 'AbortError' || controller.signal.aborted) return;
        setFailed(true);
        toast.error(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [search, category, sort, page, toast]);

  const heading = useMemo(() => {
    if (search) return `نتایج جست‌وجو برای «${search}»`;
    if (category) return category;
    return 'همهٔ محصولات';
  }, [search, category]);

  return (
    <>
      <Hero />

      <div id="products" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 border-b border-ink-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-ink-900 sm:text-2xl">{heading}</h2>
            <p className="num mt-1.5 text-sm text-ink-500">
              {loading
                ? 'در حال بارگذاری…'
                : `${toPersianDigits(result.total)} کالا یافت شد`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {(search || category) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => applyParams({ search: '', category: '' })}
              >
                حذف فیلترها
              </Button>
            )}
            <SelectField
              label=""
              aria-label="مرتب‌سازی محصولات"
              value={sort}
              onChange={(event) => applyParams({ sort: event.target.value })}
              className="w-44"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mb-8">
            <CategoryChips
              categories={categories}
              active={category}
              onSelect={(value) => applyParams({ category: value })}
            />
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : failed ? (
          <EmptyState
            icon={BoxIcon}
            title="محصولات بارگذاری نشدند"
            description="ارتباط با سرور برقرار نشد. مطمئن شوید سرور در حال اجراست و دوباره تلاش کنید."
            action={
              <Button onClick={() => applyParams({ page: 1 })}>تلاش دوباره</Button>
            }
          />
        ) : result.items.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title="محصولی پیدا نشد"
            description={
              search
                ? `هیچ کالایی با عبارت «${search}» مطابقت نداشت. عبارت دیگری را امتحان کنید.`
                : 'در این دسته‌بندی هنوز کالایی ثبت نشده است.'
            }
            action={
              <Button onClick={() => applyParams({ search: '', category: '' })}>
                نمایش همهٔ محصولات
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {result.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && !failed && (
          <Pagination
            page={result.page}
            pages={result.pages}
            onChange={(nextPage) => applyParams({ page: nextPage })}
          />
        )}
      </div>
    </>
  );
};

export default ProductsPage;
