import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import Button from '../components/ui/Button.jsx';
import { TextField } from '../components/ui/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const RegisterPage = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    const name = values.name.trim();
    const email = values.email.trim();

    if (!name) next.name = 'وارد کردن نام الزامی است.';
    else if (name.length < 3) next.name = 'نام باید حداقل ۳ نویسه باشد.';

    if (!email) next.email = 'وارد کردن ایمیل الزامی است.';
    else if (!EMAIL_PATTERN.test(email)) next.email = 'قالب ایمیل معتبر نیست.';

    if (!values.password) next.password = 'وارد کردن رمز عبور الزامی است.';
    else if (values.password.length < 6) next.password = 'رمز عبور باید حداقل ۶ نویسه باشد.';

    // Confirmation is a client-only field; the API never sees it.
    if (values.confirmPassword !== values.password) {
      next.confirmPassword = 'تکرار رمز عبور با رمز عبور یکسان نیست.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      toast.success(`حساب شما ساخته شد. خوش آمدید، ${user.name}!`);
      navigate(location.state?.from ?? '/', { replace: true });
    } catch (error) {
      if (error.errors) setErrors(error.errors);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="ساخت حساب کاربری"
      subtitle="در کمتر از یک دقیقه ثبت‌نام کنید و خرید خود را آغاز کنید."
      footer={
        <>
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link to="/login" className="font-bold text-brand-700 hover:underline">
            وارد شوید
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          label="نام و نام خانوادگی"
          name="name"
          autoComplete="name"
          placeholder="مثلاً: زهرا محمدی"
          value={values.name}
          onChange={setField('name')}
          error={errors.name}
        />

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
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.password}
          onChange={setField('password')}
          error={errors.password}
          hint="حداقل ۶ نویسه انتخاب کنید."
        />

        <TextField
          label="تکرار رمز عبور"
          type="password"
          name="confirmPassword"
          dir="ltr"
          className="[&_input]:text-start"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.confirmPassword}
          onChange={setField('confirmPassword')}
          error={errors.confirmPassword}
        />

        <Button type="submit" fullWidth size="lg" loading={submitting} className="!mt-6">
          ساخت حساب کاربری
        </Button>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
