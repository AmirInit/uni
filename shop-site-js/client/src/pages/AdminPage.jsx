import { useCallback, useEffect, useState } from 'react';
import {
  BoxIcon,
  EditIcon,
  PlusIcon,
  SearchIcon,
  ShieldIcon,
  TrashIcon,
} from '../components/Icons.jsx';
import ProductImage from '../components/ProductImage.jsx';
import Button from '../components/ui/Button.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { SelectField, TextAreaField, TextField } from '../components/ui/Field.jsx';
import Modal from '../components/ui/Modal.jsx';
import { LoadingBlock } from '../components/ui/Spinner.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  updateProduct,
} from '../services/productService.js';
import { formatPrice, toEnglishDigits, toPersianDigits } from '../lib/format.js';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
  category: '',
};

const PAGE_SIZE = 20;

/* ---------------------------- product form modal --------------------------- */

const ProductFormModal = ({ open, product, categories, onClose, onSaved }) => {
  const toast = useToast();
  const isEditing = Boolean(product);

  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Re-seed the form each time the modal opens for a different product.
  useEffect(() => {
    if (!open) return;
    setValues(
      product
        ? {
            name: product.name ?? '',
            description: product.description ?? '',
            price: String(product.price ?? ''),
            stock: String(product.stock ?? ''),
            imageUrl: product.imageUrl ?? '',
            category: product.category ?? '',
          }
        : EMPTY_FORM,
    );
    setErrors({});
  }, [open, product]);

  const setField = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    const name = values.name.trim();
    // Persian digits are accepted in the numeric fields and normalised here.
    const price = toEnglishDigits(values.price).replace(/[,٬\s]/g, '');
    const stock = toEnglishDigits(values.stock).replace(/[,٬\s]/g, '');

    if (!name) next.name = 'وارد کردن نام محصول الزامی است.';
    else if (name.length < 2) next.name = 'نام محصول باید حداقل ۲ نویسه باشد.';

    if (price === '') next.price = 'وارد کردن قیمت الزامی است.';
    else if (!/^\d+$/.test(price)) next.price = 'قیمت باید یک عدد صحیح باشد.';

    if (stock === '') next.stock = 'وارد کردن موجودی الزامی است.';
    else if (!/^\d+$/.test(stock)) next.stock = 'موجودی باید یک عدد صحیح باشد.';

    const imageUrl = values.imageUrl.trim();
    if (imageUrl && !/^(https?:\/\/|\/)/i.test(imageUrl)) {
      next.imageUrl = 'نشانی تصویر باید با http://، https:// یا / شروع شود.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const result = isEditing
        ? await updateProduct(product.id, values)
        : await createProduct(values);
      toast.success(result.message || 'محصول ذخیره شد.');
      onSaved();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const previewName = values.name.trim() || 'پیش‌نمایش تصویر';

  return (
    <Modal
      open={open}
      onClose={saving ? undefined : onClose}
      size="lg"
      title={isEditing ? 'ویرایش محصول' : 'افزودن محصول جدید'}
      description={
        isEditing
          ? 'تغییرات پس از ذخیره بلافاصله در فروشگاه اعمال می‌شود.'
          : 'محصول جدید بلافاصله پس از ذخیره در فهرست فروشگاه نمایش داده می‌شود.'
      }
      footer={
        <>
          <Button type="submit" form="product-form" loading={saving}>
            {isEditing ? 'ذخیرهٔ تغییرات' : 'افزودن محصول'}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            انصراف
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          label="نام محصول"
          value={values.name}
          onChange={setField('name')}
          error={errors.name}
          placeholder="مثلاً: هدفون بی‌سیم حذف نویز"
        />

        <TextAreaField
          label="توضیحات"
          optional
          rows={4}
          value={values.description}
          onChange={setField('description')}
          error={errors.description}
          placeholder="ویژگی‌های اصلی محصول را بنویسید…"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="قیمت (تومان)"
            inputMode="numeric"
            value={values.price}
            onChange={setField('price')}
            error={errors.price}
            placeholder="۲۵۰۰۰۰۰"
            hint="فقط عدد — با ارقام فارسی یا انگلیسی."
          />
          <TextField
            label="موجودی انبار"
            inputMode="numeric"
            value={values.stock}
            onChange={setField('stock')}
            error={errors.stock}
            placeholder="۲۵"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="دسته‌بندی"
            value={values.category}
            onChange={setField('category')}
            error={errors.category}
          >
            <option value="">— انتخاب دسته‌بندی —</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
            {/* Keep an edited product's category selectable even if it's the only one. */}
            {values.category && !categories.some((c) => c.name === values.category) && (
              <option value={values.category}>{values.category}</option>
            )}
          </SelectField>

          <TextField
            label="نشانی تصویر"
            optional
            dir="ltr"
            className="[&_input]:text-start"
            value={values.imageUrl}
            onChange={setField('imageUrl')}
            error={errors.imageUrl}
            placeholder="https://picsum.photos/seed/example/800/800"
          />
        </div>

        {/* Live preview so the admin sees a broken URL before saving. */}
        <div className="flex items-center gap-4 rounded-xl border border-ink-100 bg-ink-50/60 p-3">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-100">
            <ProductImage
              src={values.imageUrl.trim()}
              alt={previewName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ink-600">پیش‌نمایش کارت محصول</p>
            <p className="line-clamp-2-fa mt-1 text-sm font-bold text-ink-900">{previewName}</p>
            <p className="num mt-0.5 text-xs text-ink-500">
              {values.price ? formatPrice(toEnglishDigits(values.price).replace(/\D/g, '') || 0) : '— تومان'}
            </p>
          </div>
        </div>
      </form>
    </Modal>
  );
};

/* --------------------------------- page ----------------------------------- */

export const AdminPage = () => {
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletePending, setDeletePending] = useState(false);

  const load = useCallback(
    async (signal) => {
      setLoading(true);
      try {
        const [productData, categoryData] = await Promise.all([
          fetchProducts({ search, sort: 'newest', limit: PAGE_SIZE }, signal),
          fetchCategories(signal),
        ]);
        if (signal?.aborted) return;
        setProducts(productData.items ?? []);
        setCategories(categoryData.categories ?? []);
      } catch (error) {
        if (error?.name !== 'AbortError' && !signal?.aborted) toast.error(error.message);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [search, toast],
  );

  useEffect(() => {
    const controller = new AbortController();
    // Debounce so typing in the search box doesn't fire a request per keystroke.
    const timer = setTimeout(() => load(controller.signal), 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [load]);

  const handleSaved = () => {
    setFormOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async () => {
    setDeletePending(true);
    try {
      const result = await deleteProduct(deleting.id);
      toast.success(result.message || 'محصول حذف شد.');
      setDeleting(null);
      load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletePending(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-100 px-3 py-1 text-[11px] font-bold text-accent-700">
            <ShieldIcon className="h-3.5 w-3.5" />
            پنل مدیریت
          </span>
          <h1 className="mt-3 text-2xl font-extrabold text-ink-900">مدیریت محصولات</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            محصولات فروشگاه را اضافه، ویرایش یا حذف کنید.
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <PlusIcon className="h-5 w-5" />
          افزودن محصول
        </Button>
      </div>

      {/* Search */}
      <div className="mb-5 max-w-md">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute inset-y-0 start-3.5 my-auto h-4.5 w-4.5 text-ink-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="جست‌وجوی محصول بر اساس نام یا دسته‌بندی…"
            aria-label="جست‌وجوی محصول"
            className="h-11 w-full rounded-xl border border-ink-200 bg-white ps-10 pe-4 text-sm transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingBlock label="در حال دریافت محصولات…" />
      ) : products.length === 0 ? (
        <EmptyState
          icon={BoxIcon}
          title={search ? 'محصولی با این مشخصات پیدا نشد' : 'هنوز محصولی ثبت نشده است'}
          description={
            search
              ? 'عبارت جست‌وجو را تغییر دهید یا فیلتر را پاک کنید.'
              : 'نخستین محصول فروشگاه را با دکمهٔ «افزودن محصول» ثبت کنید.'
          }
          action={
            search ? (
              <Button variant="outline" onClick={() => setSearch('')}>
                پاک کردن جست‌وجو
              </Button>
            ) : (
              <Button onClick={() => setFormOpen(true)}>افزودن محصول</Button>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-ink-100 bg-white shadow-soft">
          {/* Desktop table */}
          <table className="hidden w-full text-start md:table">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/70 text-xs text-ink-500">
                <th className="px-5 py-3.5 text-start font-semibold">محصول</th>
                <th className="px-5 py-3.5 text-start font-semibold">دسته‌بندی</th>
                <th className="px-5 py-3.5 text-start font-semibold">قیمت</th>
                <th className="px-5 py-3.5 text-start font-semibold">موجودی</th>
                <th className="px-5 py-3.5 text-end font-semibold">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-ink-50/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                        <ProductImage
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="line-clamp-2-fa max-w-xs text-[13px] leading-6 font-semibold text-ink-800">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-pill bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="num px-5 py-3.5 text-[13px] font-bold text-ink-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`num rounded-pill px-2.5 py-1 text-[11px] font-bold ${
                        product.stock <= 0
                          ? 'bg-rose-50 text-rose-600'
                          : product.stock <= 5
                            ? 'bg-accent-100 text-accent-700'
                            : 'bg-ink-100 text-ink-600'
                      }`}
                    >
                      {product.stock <= 0 ? 'ناموجود' : `${toPersianDigits(product.stock)} عدد`}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(product);
                          setFormOpen(true);
                        }}
                        className="rounded-lg p-2 text-ink-500 transition hover:bg-brand-50 hover:text-brand-700"
                        aria-label={`ویرایش ${product.name}`}
                      >
                        <EditIcon className="h-4.5 w-4.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(product)}
                        className="rounded-lg p-2 text-ink-500 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`حذف ${product.name}`}
                      >
                        <TrashIcon className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="divide-y divide-ink-100 md:hidden">
            {products.map((product) => (
              <li key={product.id} className="flex gap-3.5 p-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2-fa text-[13px] leading-6 font-bold text-ink-900">
                    {product.name}
                  </p>
                  <p className="num mt-1 text-xs font-semibold text-ink-700">
                    {formatPrice(product.price)}
                  </p>
                  <p className="num mt-0.5 text-[11px] text-ink-500">
                    {product.category} ·{' '}
                    {product.stock <= 0 ? 'ناموجود' : `${toPersianDigits(product.stock)} عدد موجود`}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(product);
                      setFormOpen(true);
                    }}
                    className="rounded-lg p-2 text-ink-500 transition hover:bg-brand-50 hover:text-brand-700"
                    aria-label={`ویرایش ${product.name}`}
                  >
                    <EditIcon className="h-4.5 w-4.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(product)}
                    className="rounded-lg p-2 text-ink-500 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`حذف ${product.name}`}
                  >
                    <TrashIcon className="h-4.5 w-4.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ProductFormModal
        open={formOpen}
        product={editing}
        categories={categories}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="حذف محصول"
        message={`آیا از حذف «${deleting?.name ?? ''}» مطمئن هستید؟ این محصول از فروشگاه و از سبد خرید کاربران حذف خواهد شد.`}
        confirmLabel="بله، حذف کن"
        loading={deletePending}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
};

export default AdminPage;
