import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import Button from '../components/ui/Button.jsx';
import { TextField } from '../components/ui/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    // Clear the field's error as soon as the user starts fixing it.
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  /** Client-side checks mirror the server's, so obvious mistakes never round-trip. */
  const validate = () => {
    const next = {};
    if (!values.email.trim()) next.email = 'وارد کردن ایمیل الزامی است.';
    else if (!EMAIL_PATTERN.test(values.email.trim())) next.email = 'قالب ایمیل معتبر نیست.';
    if (!values.password) next.password = 'وارد کردن رمز عبور الزامی است.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await login({ email: values.email.trim(), password: values.password });
      toast.success(`خوش آمدید، ${user.name}!`);
      navigate(location.state?.from ?? '/', { replace: true });
    } catch (error) {
      // The API returns a `{ field: message }` map for validation failures.
      if (error.errors) setErrors(error.errors);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="ورود به حساب کاربری"
      subtitle="برای پیگیری سفارش‌ها و تکمیل خرید، وارد حساب خود شوید."
      footer={
        <>
          حساب کاربری ندارید؟{' '}
          <Link to="/register" className="font-bold text-brand-700 hover:underline">
            ثبت‌نام کنید
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          label="ایمیل"
          type="email"
          name="email"
          dir="ltr"
          className="[&_input]:text-start"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={setField('email')}
          error={errors.email}
        />

        <TextField
          label="رمز عبور"
          type="password"
          name="password"
          dir="ltr"
          className="[&_input]:text-start"
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={setField('password')}
          error={errors.password}
        />

        <Button type="submit" fullWidth size="lg" loading={submitting} className="!mt-6">
          ورود به حساب
        </Button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
