import Payjp from 'payjp';
import type {PayAPIRequest} from '../../../interface/pay.d.ts';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const payjp = Payjp(process.env.PAYJP_SECRET_KEY || '');
    const { email, amount, note, token } = req.body as PayAPIRequest;
    try {
      const customer = await payjp.customers.create({
        email: email,
        card: token,
      });

      await payjp.charges.create({
        amount: amount,
        currency: 'jpy',
        customer: customer.id,
        description: note,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
