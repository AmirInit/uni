import ApiError from './ApiError.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Converts Persian/Arabic-Indic digits to ASCII so numeric input always parses. */
export const normaliseDigits = (value) =>
  String(value ?? '')
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

export const asTrimmedString = (value) => (typeof value === 'string' ? value.trim() : '');

/** ASCII digits → Persian, so numbers inside Persian error messages read naturally. */
export const toPersianDigits = (value) =>
  String(value).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const fa = toPersianDigits;

/**
 * Small validation helper. Collects every problem instead of failing on the
 * first one, so the client can highlight all invalid fields at once.
 */
export class FieldValidator {
  constructor() {
    this.errors = {};
    this.values = {};
  }

  #fail(field, message) {
    if (!this.errors[field]) this.errors[field] = message;
  }

  name(field, raw, { required = true, min = 3, max = 60 } = {}) {
    const value = asTrimmedString(raw);
    this.values[field] = value;
    if (!value) {
      if (required) this.#fail(field, 'وارد کردن این فیلد الزامی است.');
      return this;
    }
    if (value.length < min) this.#fail(field, `حداقل ${fa(min)} نویسه لازم است.`);
    else if (value.length > max) this.#fail(field, `حداکثر ${fa(max)} نویسه مجاز است.`);
    return this;
  }

  email(field, raw, { required = true } = {}) {
    const value = asTrimmedString(raw).toLowerCase();
    this.values[field] = value;
    if (!value) {
      if (required) this.#fail(field, 'وارد کردن ایمیل الزامی است.');
      return this;
    }
    if (!EMAIL_PATTERN.test(value)) this.#fail(field, 'قالب ایمیل معتبر نیست.');
    else if (value.length > 120) this.#fail(field, 'ایمیل بیش از حد طولانی است.');
    return this;
  }

  password(field, raw, { required = true, min = 6, max = 72 } = {}) {
    const value = typeof raw === 'string' ? raw : '';
    this.values[field] = value;
    if (!value) {
      if (required) this.#fail(field, 'وارد کردن رمز عبور الزامی است.');
      return this;
    }
    if (value.length < min) this.#fail(field, `رمز عبور باید حداقل ${fa(min)} نویسه باشد.`);
    // bcrypt silently truncates beyond 72 bytes; reject instead of surprising the user.
    else if (Buffer.byteLength(value, 'utf8') > max) {
      this.#fail(field, `رمز عبور بیش از حد طولانی است.`);
    }
    return this;
  }

  text(field, raw, { required = false, max = 1000 } = {}) {
    const value = asTrimmedString(raw);
    this.values[field] = value;
    if (!value && required) this.#fail(field, 'وارد کردن این فیلد الزامی است.');
    else if (value.length > max) this.#fail(field, `حداکثر ${fa(max)} نویسه مجاز است.`);
    return this;
  }

  integer(field, raw, { required = true, min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
    const raw2 = normaliseDigits(raw).trim().replace(/[,٬\s]/g, '');
    if (raw2 === '') {
      this.values[field] = null;
      if (required) this.#fail(field, 'وارد کردن این فیلد الزامی است.');
      return this;
    }
    const value = Number(raw2);
    this.values[field] = value;
    if (!Number.isFinite(value) || !Number.isInteger(value)) {
      this.#fail(field, 'باید یک عدد صحیح باشد.');
    } else if (value < min) this.#fail(field, `نباید کمتر از ${fa(min)} باشد.`);
    else if (value > max) this.#fail(field, `نباید بیشتر از ${fa(max)} باشد.`);
    return this;
  }

  url(field, raw, { required = false, max = 500 } = {}) {
    const value = asTrimmedString(raw);
    this.values[field] = value;
    if (!value) {
      if (required) this.#fail(field, 'وارد کردن نشانی تصویر الزامی است.');
      return this;
    }
    if (value.length > max) {
      this.#fail(field, 'نشانی تصویر بیش از حد طولانی است.');
      return this;
    }
    if (!/^(https?:\/\/|\/)/i.test(value)) {
      this.#fail(field, 'نشانی تصویر باید با http://، https:// یا / شروع شود.');
    }
    return this;
  }

  get isValid() {
    return Object.keys(this.errors).length === 0;
  }

  /** Throws a 400 carrying a `{ field: message }` map the frontend renders inline. */
  throwIfInvalid(message = 'اطلاعات واردشده معتبر نیست.') {
    if (!this.isValid) throw ApiError.badRequest(message, this.errors);
    return this.values;
  }
}

export default FieldValidator;
