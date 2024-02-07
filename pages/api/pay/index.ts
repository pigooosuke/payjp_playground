import Payjp from 'payjp';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const payjp = Payjp(process.env.PAYJP_SECRET_KEY || '');
    const { email, amount, note, token }: { email: string; amount: number; note: string; token: string } = req.body;

    try {
      const customer = await payjp.customers.create({
        email: email,
        card: token,
      });
      console.log(customer)

      const charge = await payjp.charges.create({
        amount: amount,
        currency: 'jpy',
        customer: customer.id,
        description: note,
      });
      console.log(charge)
      res.status(200).json({ success: true, charge });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}