'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, SettingsFormData } from '@/lib/schemas';
import { upsertSettings } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function OnboardingForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      business_name: '',
      business_email: '',
      business_phone: '',
      business_address: '',
      payment_bank_name: '',
      payment_account_name: '',
      payment_account_number: '',
      payment_bsb: '',
      payment_notes: '',
      email_new_invoice:
        'Please find your invoice attached. Do not hesitate to reach out if you have any questions.',
      email_overdue_reminder:
        'This is a friendly reminder that your invoice is now overdue. Please arrange payment at your earliest convenience.',
      email_receipt:
        'Thank you for your payment. This email confirms receipt of your payment in full.',
    },
  });

  async function onSubmit(data: SettingsFormData) {
    const result = await upsertSettings(data);
    if (result.success) {
      toast.success('All set! Welcome to Remit.');
      router.push('/overview');
    } else {
      toast.error(result.error ?? 'Something went wrong. Please try again.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6 rounded-xl border border-stone-800 bg-stone-900 p-6"
    >
      {/* Required */}
      <div>
        <p className="mb-4 text-xs font-semibold tracking-widest text-stone-500 uppercase">
          Required
        </p>
        <div className="space-y-4">
          <div>
            <Label htmlFor="business_name" className="text-stone-300">
              Business Name
            </Label>
            <Input
              id="business_name"
              placeholder="Acme Co."
              className="border-stone-700 bg-stone-800 text-stone-100 placeholder:text-stone-600"
              {...register('business_name')}
            />
            {errors.business_name && (
              <p className="mt-1 text-xs text-red-400">
                {errors.business_name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="business_email" className="text-stone-300">
              Business Email
            </Label>
            <Input
              id="business_email"
              type="email"
              placeholder="hello@acme.com"
              className="border-stone-700 bg-stone-800 text-stone-100 placeholder:text-stone-600"
              {...register('business_email')}
            />
            {errors.business_email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.business_email.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Optional */}
      <div>
        <p className="mb-4 text-xs font-semibold tracking-widest text-stone-500 uppercase">
          Optional — you can fill these in later
        </p>
        <div className="space-y-4">
          <div>
            <Label htmlFor="business_phone" className="text-stone-300">
              Phone
            </Label>
            <Input
              id="business_phone"
              placeholder="+61 400 000 000"
              className="border-stone-700 bg-stone-800 text-stone-100 placeholder:text-stone-600"
              {...register('business_phone')}
            />
          </div>
          <div>
            <Label htmlFor="business_address" className="text-stone-300">
              Address
            </Label>
            <Textarea
              id="business_address"
              rows={2}
              placeholder={'123 Example St\nSydney NSW 2000'}
              className="border-stone-700 bg-stone-800 text-stone-100 placeholder:text-stone-600"
              {...register('business_address')}
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Setting up...' : 'Get Started →'}
      </Button>
    </form>
  );
}
