# بازارک — فروشگاه آنلاین | Bazarak — Persian E-Commerce Store

<div align="right">

یک فروشگاه اینترنتی کامل و راست‌به‌چپ (RTL) که با **React + Vite** در سمت کاربر و
**Node.js + Express + SQLite** در سمت سرور ساخته شده است. تمام رابط کاربری فارسی است،
اعداد با ارقام فارسی نمایش داده می‌شوند و پایگاه داده یک فایل ساده است — بنابراین برای
اجرای پروژه به نصب هیچ پایگاه دادهٔ جداگانه‌ای نیاز ندارید.

</div>

A complete right-to-left (RTL) Persian e-commerce application: **React + Vite** on the
front end, **Node.js + Express + SQLite** on the back end. The entire UI is in Persian,
all numbers render in Persian digits, and the database is a single file — no separate
database server to install.

---

## ⚡ اجرای سریع | Quick Start

```bash
npm install     # ۱. نصب وابستگی‌های سرور و کلاینت با هم
npm run seed    # ۲. ساخت جداول + افزودن حساب‌ها و ۲۲ محصول نمونه
npm run dev     # ۳. اجرای هم‌زمان بک‌اند و فرانت‌اند
```

سپس مرورگر را باز کنید | Then open your browser at:

### 👉 **http://localhost:5173**

> این پروژه از **npm workspaces** استفاده می‌کند، بنابراین یک بار `npm install` در پوشهٔ
> اصلی، وابستگی‌های `server/` و `client/` را با هم نصب می‌کند.
>
> This project uses **npm workspaces**, so a single `npm install` at the root installs
> dependencies for both `server/` and `client/`.

---

## 🔑 حساب‌های آماده | Login Credentials

این حساب‌ها توسط `npm run seed` ساخته می‌شوند و هنگام اجرای اسکریپت در ترمینال نیز چاپ می‌شوند.

These accounts are created by `npm run seed` and are also printed in the terminal when it runs.

| نقش / Role                 | ایمیل / Email    | رمز عبور / Password |
| -------------------------- | ---------------- | ------------------- |
| 👑 مدیر فروشگاه / **Admin** | `admin@shop.com` | `admin123`          |
| 👤 کاربر عادی / **User**    | `user@shop.com`  | `user123`           |

> حساب مدیر به «پنل مدیریت» دسترسی دارد و می‌تواند محصول اضافه، ویرایش و حذف کند.
> The admin account unlocks the **Admin Panel** for adding, editing and deleting products.

---

## 📋 پیش‌نیازها | Prerequisites

| مورد / Requirement | نسخه / Version                                  |
| ------------------ | ----------------------------------------------- |
| **Node.js**        | `20.19` یا بالاتر (پیشنهاد: نسخهٔ LTS جاری)      |
| **npm**            | `10` یا بالاتر (همراه Node.js نصب می‌شود)        |
| پایگاه داده        | ❌ هیچ‌چیز — SQLite داخل پروژه است               |

بررسی نسخه | Check your version:

```bash
node --version   # باید v20.19.0 یا بالاتر باشد
npm --version
```

> **دربارهٔ SQLite:** پایگاه داده یک فایل معمولی در مسیر `server/data/shop.db` است که
> با اجرای `npm run seed` ساخته می‌شود. کتابخانهٔ `better-sqlite3` فایل‌های اجرایی
> از‌پیش‌ساخته را برای ویندوز، مک و لینوکس به‌همراه دارد، بنابراین هیچ کامپایلری لازم نیست.
>
> **About SQLite:** the database is an ordinary file at `server/data/shop.db`, created by
> `npm run seed`. `better-sqlite3` ships prebuilt binaries for Windows, macOS and Linux
> (x64 + arm64), so **no compiler or build toolchain is required** on the demo machine.

---

## 🚀 راه‌اندازی گام‌به‌گام | Step-by-Step Setup

### فارسی

۱. **نصب وابستگی‌ها** — در پوشهٔ اصلی پروژه:

```bash
npm install
```

۲. **(اختیاری) تنظیم متغیرهای محیطی** — پروژه بدون این مرحله هم اجرا می‌شود، اما برای
   تغییر پورت یا کلید JWT:

```bash
cp server/.env.example server/.env
```

۳. **ساخت پایگاه داده و افزودن داده‌های نمونه:**

```bash
npm run seed
```

این دستور جداول را می‌سازد، دو حساب کاربری بالا و ۲۲ محصول فارسی واقع‌گرایانه را اضافه
می‌کند و اطلاعات ورود را در ترمینال چاپ می‌کند.

۴. **اجرای پروژه:**

```bash
npm run dev
```

۵. مرورگر را روی **http://localhost:5173** باز کنید. سرور API روی
   **http://localhost:5000** اجرا می‌شود.

### English

1. **Install dependencies** from the project root:

   ```bash
   npm install
   ```

2. **(Optional) configure environment variables** — the app runs fine without this, but
   to change the port or JWT secret:

   ```bash
   cp server/.env.example server/.env
   ```

3. **Create the database and seed demo data:**

   ```bash
   npm run seed
   ```

   This creates the tables, inserts the two accounts above plus 22 realistic Persian
   products, and prints the credentials to the terminal.

4. **Start both servers:**

   ```bash
   npm run dev
   ```

5. Open **http://localhost:5173** in your browser. The API runs on
   **http://localhost:5000**.

---

## 🧰 دستورات موجود | Available Scripts

اجرا از پوشهٔ اصلی پروژه | Run these from the project root:

| دستور / Command      | کار / What it does                                                     |
| -------------------- | ---------------------------------------------------------------------- |
| `npm install`        | نصب وابستگی‌های سرور و کلاینت (workspaces)                              |
| `npm run seed`       | ساخت جداول + افزودن داده‌های نمونه (موارد موجود دست‌نخورده می‌مانند)      |
| `npm run seed:reset` | **پاک کردن کامل** پایگاه داده و ساخت دوبارهٔ آن از صفر                   |
| `npm run dev`        | اجرای هم‌زمان API (پورت ۵۰۰۰) و رابط کاربری (پورت ۵۱۷۳)                 |
| `npm run dev:server` | اجرای فقط بک‌اند                                                        |
| `npm run dev:client` | اجرای فقط فرانت‌اند                                                     |
| `npm run build`      | ساخت نسخهٔ تولیدی فرانت‌اند در `client/dist`                            |
| `npm run start`      | اجرای سرور در حالت تولیدی                                              |

---

## ✨ امکانات | Features

### 🛍️ فروشگاه | Storefront
- شبکهٔ محصولات با تصویر، نام، قیمت به تومان و توضیح کوتاه
- صفحهٔ جزئیات محصول با گالری، موجودی انبار و ضمانت‌ها
- جست‌وجو، فیلتر بر اساس دسته‌بندی، مرتب‌سازی (جدیدترین / ارزان‌ترین / گران‌ترین / نام)
- صفحه‌بندی — وضعیت فیلترها در نشانی صفحه ذخیره می‌شود و قابل اشتراک‌گذاری است

### 🛒 سبد خرید | Shopping Cart
- افزودن، تغییر تعداد و حذف کالا
- محاسبهٔ زندهٔ جمع کل، هزینهٔ ارسال و مبلغ قابل پرداخت
- **کشوی سبد خرید** که از لبهٔ راست (شروع خط در RTL) باز می‌شود
- **ماندگاری سبد:** برای کاربران واردشده در پایگاه داده، و برای مهمان‌ها در `localStorage`
- سبد مهمان هنگام ورود به حساب، به‌صورت خودکار با سبد کاربر ادغام می‌شود
- تعداد هر کالا هرگز از موجودی انبار بیشتر نمی‌شود

### 👤 حساب کاربری | User Account
- ثبت‌نام و ورود با JWT و رمزنگاری `bcrypt`
- ویرایش نام، ایمیل و رمز عبور (تغییر رمز نیازمند رمز فعلی است)
- تاریخچهٔ سفارش‌ها با تاریخ شمسی و مبلغ هر سفارش

### 🛡️ پنل مدیریت | Admin Panel
- افزودن، ویرایش و حذف محصول از طریق یک فرم مودال با پیش‌نمایش زنده
- جدول محصولات با جست‌وجوی هم‌زمان (debounce)
- تأییدیه پیش از حذف
- مسیر `/admin` هم در سمت کاربر و هم در سمت سرور محافظت شده است

---

## 🌐 فارسی‌سازی و RTL | Persian & RTL Support

| مورد                        | پیاده‌سازی                                                                 |
| --------------------------- | -------------------------------------------------------------------------- |
| جهت صفحه                    | `<html lang="fa" dir="rtl">`                                               |
| قلم                         | **وزیرمتن (Vazirmatn)** — به‌صورت محلی همراه پروژه، بدون نیاز به اینترنت      |
| اعداد                       | همهٔ اعداد با ارقام فارسی (`۰۱۲۳۴۵۶۷۸۹`) و جداکنندهٔ هزارگان فارسی (`٬`)      |
| ورودی اعداد                 | فرم‌ها ارقام فارسی **و** انگلیسی را می‌پذیرند و به سرور به‌صورت استاندارد می‌فرستند |
| چیدمان                      | استفاده از ویژگی‌های منطقی CSS (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) |
| آیکون‌های جهت‌دار             | فلش «بازگشت» در RTL به راست اشاره می‌کند، «بعدی» به چپ                       |
| انیمیشن کشوی سبد            | جهت ورود کشو با متغیر `--drawer-from` بر اساس `dir` تنظیم می‌شود              |
| تاریخ                       | تقویم شمسی با `Intl.DateTimeFormat('fa-IR')`                               |

> **نکته:** تبدیل‌های CSS (`transform`) به‌صورت خودکار در RTL آینه نمی‌شوند؛ به همین دلیل
> جهت انیمیشن کشوی سبد خرید به‌طور صریح بر اساس `dir` تعیین شده است.

---

## 🗂️ ساختار پروژه | Project Structure

```
shop-site-js/
├── package.json              ← ریشهٔ workspaces + اسکریپت‌های اجرا
├── README.md
│
├── server/                   ← Express REST API
│   ├── .env.example
│   ├── data/shop.db          ← فایل SQLite (با npm run seed ساخته می‌شود)
│   └── src/
│       ├── index.js          ← نقطهٔ شروع + خاموشی تمیز سرور
│       ├── app.js            ← ساخت اپلیکیشن Express و میان‌افزارها
│       ├── config/           ← env.js، database.js
│       ├── models/           ← schema.js + لایهٔ دسترسی به داده
│       ├── controllers/      ← منطق هر مسیر
│       ├── routes/           ← تعریف مسیرهای API
│       ├── middleware/       ← auth (JWT)، مدیریت خطا، لاگر
│       ├── utils/            ← ApiError، asyncHandler، اعتبارسنجی، توکن
│       └── seed/             ← اسکریپت داده‌های نمونه
│
└── client/                   ← React + Vite
    ├── vite.config.js        ← پراکسی /api → :5000
    ├── public/logo.svg
    └── src/
        ├── main.jsx          ← ریشهٔ React + بارگذاری قلم
        ├── App.jsx           ← مسیرها و Providerها
        ├── styles/index.css  ← توکن‌های طراحی Tailwind v4
        ├── lib/format.js     ← ارقام فارسی، قیمت، تاریخ شمسی
        ├── services/         ← فراخوانی‌های API
        ├── context/          ← Auth، Cart، Toast
        ├── components/       ← ui/، layout/ و اجزای مشترک
        └── pages/            ← محصولات، جزئیات، سبد، ورود، ثبت‌نام، پروفایل، مدیریت
```

---

## 🗄️ پایگاه داده | Database Schema

| جدول          | ستون‌ها                                                                              |
| ------------- | ------------------------------------------------------------------------------------ |
| `users`       | `id`, `name`, `email` (یکتا), `password_hash`, `role` (`user`\|`admin`), `created_at` |
| `products`    | `id`, `name`, `description`, `price`, `image_url`, `stock`, `category`, `created_by`, `created_at`, `updated_at` |
| `cart_items`  | `id`, `user_id`, `product_id`, `quantity`, `created_at` — یکتا روی (`user_id`, `product_id`) |
| `orders`      | `id`, `user_id`, `total`, `items_count`, `status`, `created_at`                       |
| `order_items` | `id`, `order_id`, `product_id`, `name`, `price`, `image_url`, `quantity`              |

> `order_items` یک **کپی از نام و قیمت** کالا را در لحظهٔ خرید نگه می‌دارد، بنابراین
> تاریخچهٔ سفارش‌ها حتی پس از ویرایش یا حذف محصول توسط مدیر درست باقی می‌ماند.
>
> `order_items` stores a **snapshot** of the product name and price at purchase time, so
> past orders stay correct even after an admin edits or deletes the product.

---

## 🔌 مسیرهای API | API Endpoints

| متد      | مسیر                       | دسترسی  | توضیح                            |
| -------- | -------------------------- | ------- | -------------------------------- |
| `GET`    | `/api/health`              | عمومی   | بررسی سلامت سرور                  |
| `POST`   | `/api/auth/register`       | عمومی   | ثبت‌نام                           |
| `POST`   | `/api/auth/login`          | عمومی   | ورود                             |
| `GET`    | `/api/auth/me`             | کاربر   | اطلاعات کاربر جاری                |
| `GET`    | `/api/users/me`            | کاربر   | پروفایل + آمار سفارش‌ها            |
| `PUT`    | `/api/users/me`            | کاربر   | ویرایش پروفایل / رمز عبور         |
| `GET`    | `/api/products`            | عمومی   | فهرست + جست‌وجو/فیلتر/مرتب‌سازی     |
| `GET`    | `/api/products/categories` | عمومی   | دسته‌بندی‌ها و تعداد کالای هرکدام   |
| `GET`    | `/api/products/:id`        | عمومی   | یک محصول                         |
| `POST`   | `/api/products`            | **مدیر** | افزودن محصول                     |
| `PUT`    | `/api/products/:id`        | **مدیر** | ویرایش محصول                     |
| `DELETE` | `/api/products/:id`        | **مدیر** | حذف محصول                        |
| `GET`    | `/api/cart`                | کاربر   | سبد خرید                         |
| `POST`   | `/api/cart`                | کاربر   | افزودن به سبد                     |
| `PUT`    | `/api/cart/:productId`     | کاربر   | تغییر تعداد                       |
| `DELETE` | `/api/cart/:productId`     | کاربر   | حذف یک کالا                       |
| `DELETE` | `/api/cart`                | کاربر   | خالی کردن سبد                     |
| `POST`   | `/api/cart/merge`          | کاربر   | ادغام سبد مهمان پس از ورود          |
| `POST`   | `/api/orders`              | کاربر   | ثبت سفارش (تسویه حساب)            |
| `GET`    | `/api/orders`              | کاربر   | تاریخچهٔ سفارش‌ها                  |
| `GET`    | `/api/orders/:id`          | کاربر   | یک سفارش                          |

---

## 🔐 امنیت | Security Notes

- رمزهای عبور با **bcrypt** (۱۰ دور) هش می‌شوند و هرگز به کلاینت فرستاده نمی‌شوند.
- احراز هویت با **JWT**؛ توکن در `localStorage` نگهداری و در هدر `Authorization` ارسال می‌شود.
- مسیرهای مدیریتی هم با `protect` و هم با `adminOnly` در سمت سرور محافظت می‌شوند —
  محافظت سمت کاربر فقط برای تجربهٔ کاربری است.
- تمام کوئری‌ها از **prepared statements** استفاده می‌کنند (بدون امکان SQL Injection).
- پیام «ایمیل یا رمز عبور نادرست است» برای هر دو حالت یکسان است تا امکان شناسایی
  ایمیل‌های ثبت‌شده وجود نداشته باشد.
- ورودی‌ها هم در سمت کاربر و هم در سمت سرور اعتبارسنجی می‌شوند.

---

## 🛠️ فناوری‌ها | Tech Stack

**Frontend:** React 19 · Vite 8 · React Router 7 · Tailwind CSS 4 · Vazirmatn
**Backend:** Node.js · Express 4 · better-sqlite3 · jsonwebtoken · bcryptjs
**Database:** SQLite (فایل محلی، بدون نصب جداگانه)

---

## ❓ رفع اشکال | Troubleshooting

| مشکل                                          | راه‌حل                                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------- |
| `EADDRINUSE` روی پورت ۵۰۰۰ یا ۵۱۷۳            | برنامهٔ دیگری آن پورت را گرفته؛ آن را ببندید یا `PORT` را در `server/.env` تغییر دهید |
| صفحه خالی است / «ارتباط با سرور برقرار نشد»    | مطمئن شوید `npm run dev` هر دو سرویس (API و WEB) را اجرا کرده است           |
| «سرور در حال اجراست ولی محصولی نیست»           | `npm run seed` را اجرا کنید                                                |
| می‌خواهم داده‌ها را از صفر بسازم                 | `npm run seed:reset`                                                      |
| تصاویر محصولات نمایش داده نمی‌شوند              | طبیعی است — تصاویر از `picsum.photos` می‌آیند. بدون اینترنت، کارت‌ها به‌طور خودکار یک طرح جایگزین رنگی با نام کالا نشان می‌دهند |
| خطای نسخهٔ Node.js                             | Node.js 20.19 یا بالاتر نصب کنید                                           |

---

<div align="center">

**پروژهٔ درسی توسعهٔ وب — ساخته‌شده با React، Express و SQLite**

</div>
