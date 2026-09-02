import { SearchIcon } from '../components/Icons.jsx';
import Button from '../components/ui/Button.jsx';
import { toPersianDigits } from '../lib/format.js';

export const NotFoundPage = () => (
  <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
    <span className="num text-6xl font-extrabold text-brand-200">{toPersianDigits(404)}</span>

    <h1 className="mt-4 text-2xl font-extrabold text-ink-900">این صفحه پیدا نشد</h1>
    <p className="mt-3 max-w-sm text-sm leading-8 text-ink-500">
      نشانی واردشده اشتباه است یا صفحهٔ موردنظر حذف شده است. می‌توانید از فروشگاه ادامه دهید.
    </p>

    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Button to="/" size="lg">
        بازگشت به فروشگاه
      </Button>
      <Button to="/cart" size="lg" variant="outline">
        <SearchIcon className="h-5 w-5" />
        مشاهدهٔ سبد خرید
      </Button>
    </div>
  </div>
);

export default NotFoundPage;
