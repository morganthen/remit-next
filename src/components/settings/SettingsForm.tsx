'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, SettingsFormData } from '@/lib/schemas';
import { upsertSettings } from '@/lib/actions';
import { Settings } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import DeleteAccountDialog from '../DeleteAccount';

type SettingsFormProps = {
  userId: string | undefined;
  settings: Settings | null;
  userEmail: string;
};

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4 border-b border-stone-100 pb-2 dark:border-stone-700">
      <h2 className="mb-1 font-semibold text-stone-800 dark:text-stone-100">
        {title}
      </h2>
      <p className="text-xs text-stone-400 dark:text-stone-500">
        {description}
      </p>
    </div>
  );
}

export default function SettingsForm({
  userId,
  settings,
  userEmail,
}: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      business_name: settings?.business_name ?? '',
      business_email: settings?.business_email ?? userEmail,
      business_phone: settings?.business_phone ?? '',
      business_address: settings?.business_address ?? '',
      payment_bank_name: settings?.payment_bank_name ?? '',
      payment_account_name: settings?.payment_account_name ?? '',
      payment_account_number: settings?.payment_account_number ?? '',
      payment_bsb: settings?.payment_bsb ?? '',
      payment_notes: settings?.payment_notes ?? '',
      email_new_invoice:
        settings?.email_new_invoice ??
        'Please find your invoice attached. Do not hesitate to reach out if you have any questions.',
      email_overdue_reminder:
        settings?.email_overdue_reminder ??
        'This is a friendly reminder that your invoice is now overdue. Please arrange payment at your earliest convenience.',
      email_receipt:
        settings?.email_receipt ??
        'Thank you for your payment. This email confirms receipt of your payment in full.',
      email_void:
        settings?.email_void ??
        'This email is to notify you that the invoice in question is void',
    },
  });

  async function onSubmit(data: SettingsFormData) {
    const result = await upsertSettings(data);
    if (result.success) {
      toast.success('Settings saved');
    } else {
      toast.error(result.error ?? 'Failed to save settings');
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-10 py-4"
      >
        {/* Business Details */}
        <section>
          <SectionHeader
            title="Business Details"
            description="Shown on your invoices and emails."
          />
          <div className="space-y-4">
            <div>
              <Label className="mb-2" htmlFor="business_name">
                Business Name
              </Label>
              <Input id="business_name" {...register('business_name')} />
              {errors.business_name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.business_name.message}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-2" htmlFor="business_email">
                Business Email
              </Label>
              <Input
                id="business_email"
                type="email"
                {...register('business_email')}
              />
              {errors.business_email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.business_email.message}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-2" htmlFor="business_phone">
                Phone
              </Label>
              <Input id="business_phone" {...register('business_phone')} />
            </div>
            <div>
              <Label className="mb-2" htmlFor="business_address">
                Address
              </Label>
              <Textarea
                id="business_address"
                rows={3}
                placeholder={'123 Example St\nSydney NSW 2000'}
                {...register('business_address')}
              />
            </div>
          </div>
        </section>

        {/* Payment Details */}
        <section>
          <SectionHeader
            title="Payment Details"
            description="Shown at the bottom of every invoice so clients know how to pay."
          />
          <div className="space-y-4">
            <div>
              <Label className="mb-2" htmlFor="payment_bank_name">
                Bank Name
              </Label>
              <Input
                id="payment_bank_name"
                {...register('payment_bank_name')}
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="payment_account_name">
                Account Name
              </Label>
              <Input
                id="payment_account_name"
                {...register('payment_account_name')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2" htmlFor="payment_account_number">
                  Account Number
                </Label>
                <Input
                  id="payment_account_number"
                  {...register('payment_account_number')}
                />
              </div>
              <div>
                <Label className="mb-2" htmlFor="payment_bsb">
                  BSB
                </Label>
                <Input
                  id="payment_bsb"
                  placeholder="000-000"
                  {...register('payment_bsb')}
                />
              </div>
            </div>
            <div>
              <Label className="mb-2" htmlFor="payment_notes">
                Payment Notes
              </Label>
              <Textarea
                id="payment_notes"
                rows={2}
                placeholder="e.g. Please use invoice number as reference"
                {...register('payment_notes')}
              />
            </div>
          </div>
        </section>

        {/* Email Templates */}
        <section>
          <SectionHeader
            title="Email Templates"
            description="Pre-filled message body used when emailing clients."
          />
          <div className="space-y-4">
            <div>
              <Label className="mb-2" htmlFor="email_new_invoice">
                New Invoice
              </Label>
              <Textarea
                id="email_new_invoice"
                rows={3}
                {...register('email_new_invoice')}
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="email_overdue_reminder">
                Overdue Reminder
              </Label>
              <Textarea
                id="email_overdue_reminder"
                rows={3}
                {...register('email_overdue_reminder')}
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="email_receipt">
                Receipt Acknowledgement
              </Label>
              <Textarea
                id="email_receipt"
                rows={3}
                {...register('email_receipt')}
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="email_receipt">
                Invoice Void Message
              </Label>
              <Textarea
                id="email_receipt"
                rows={3}
                {...register('email_void')}
              />
            </div>
          </div>
        </section>

        {/* Account */}
        <section>
          <SectionHeader title="Account" description="Your login details." />
          <div>
            <Label className="mb-2">Email</Label>
            <Input
              value={userEmail}
              disabled
              className="bg-stone-50 text-stone-400"
            />
            <p className="mt-1 text-xs text-stone-400">
              Your login email cannot be changed here.
            </p>
          </div>
        </section>

        <div className="flex justify-end pb-8">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
      {/* you will find some workplaces wont mind, and in personal code do what you like, but generally try and keep the code and comments professional.
        I've seen bugs where somebody tried to name something cleverly to make a joke,
        but then the variable got missed in a refactor because of the naming and caused issues.

        https://www.youtube.com/shorts/CXjU4SL-MT4
        or the longer version https://www.youtube.com/watch?v=mHEVLndYvko
       */}
      {/*danger zOOoone*/}
      <section className="w-full">
        <SectionHeader
          title="Danger Zone"
          description="Permanently delete your account and all associated data. This
              action is irreversible."
        />

        <DeleteAccountDialog userId={userId} />
      </section>
    </>
  );
}
