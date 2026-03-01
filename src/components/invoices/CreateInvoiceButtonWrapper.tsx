import { getClients, getNextInvoiceNumber } from '@/lib/data';
import CreateInvoiceButton from './CreateInvoiceButton';

export default async function CreateInvoiceButtonWrapper({
  className,
}: {
  className: string;
}) {
  const [clients, nextInvoiceNumber] = await Promise.all([
    getClients(),
    getNextInvoiceNumber(),
  ]);

  return (
    <CreateInvoiceButton
      clients={clients}
      nextInvoiceNumber={nextInvoiceNumber}
      className={className}
    />
  );
}
