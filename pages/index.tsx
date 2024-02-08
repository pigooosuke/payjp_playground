'use client';
import { useRouter } from 'next/router';
import Link from 'next/link'
import React, { useEffect, useState } from 'react';

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.pay.jp/';
    script.className = 'payjp-button';
    script.dataset.key = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY;
    document.querySelector('.card').appendChild(script);

    return () => {
      document.querySelector('.card').removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let routerQuery = {'token': router.query["payjp-token"], ...router.query};
      delete routerQuery["payjp-token"];
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, amount, note, ...routerQuery }),
      });

      const resp = await response.json();

      if (resp.success) {
        setIsSubmitted(true);
      } else {
        console.error('Payment error');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  if (isSubmitted) {
    return '決済完了';
  }

  return (
    <div className="mx-auto mt-10 max-w-md">
      <form
        className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
        onSubmit={handleSubmit as React.FormEventHandler<HTMLFormElement>}
      >
        <article className="card">
          <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="note">
            テストカード情報を入力してください:<br/>
            <Link className="text-blue-700" href="https://pay.jp/docs/testcard" target='_blank'>テストカードはここを確認</Link>
          </label>
          {router.query['payjp-token'] ? (
            <span className='text-sm font-bold text-blue-700'>カード情報が正常に登録されました。</span>
          ) : (
            <span className='text-sm font-bold text-red-700'>カード情報が登録されていません。</span>
          )}
        </article>
        <article className="mt-10 mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">
            メールアドレス:
          </label>
          <input
            className="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            value={email}
          />
        </article>
        <article className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="amount">
            金額:
          </label>
          <input
            className="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            id="amount"
            onChange={(e) => setAmount(e.target.value)}
            required
            type="number"
            value={amount}
          />
        </article>
        <article className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="note">
            備考:
          </label>
          <textarea
            className="mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            id="note"
            onChange={(e) => setNote(e.target.value)}
            value={note}
          />
        </article>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          type="submit"
        >
          決済確定
        </button>
      </form>
    </div>
  );
}
