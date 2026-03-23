This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

This project uses Prisma with PostgreSQL.

Set these environment variables in Vercel:

- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `USER_SESSION_SECRET` — müşteri girişi için HMAC anahtarı; production’da **en az 32 karakter** rastgele değer (admin ile **farklı** olsun)

### Müşteri üyeliği

- **Üye ol:** `/uye-ol` — şifre bcrypt ile saklanır (maliyet faktörü 12).
- **Giriş yap:** `/giris-yap` — httpOnly, `sameSite=lax`, production’da `secure` çerez.
- Sepete ekleme, sepet güncelleme, sepet sayfası ve ödeme yalnızca giriş yapmış kullanıcılar içindir; ödeme e-postası hesaptan alınır.
- Giriş ve kayıt için IP bazlı hız sınırı (çoklu hatalı denemede geçici kilit) `src/lib/login-rate-limit.ts` içindedir.

Then deploy normally. The build script runs `prisma db push` automatically before `next build` so tables are created/updated on the target database.
