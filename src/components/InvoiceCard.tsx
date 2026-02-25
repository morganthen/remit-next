import { CardContent, Card, CardHeader, CardTitle } from './ui/card';

type InvoiceCard = {
  title: string;
  invoice: string; // this will change later depending on what is returned by Supabase
};

export default function InvoiceCard({ title, invoice }: InvoiceCard) {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{invoice}</CardContent>
    </Card>
  );
}
