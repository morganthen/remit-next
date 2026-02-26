import { CardContent, Card, CardHeader, CardTitle } from './ui/card';

type StatCard = {
  title: string;
  invoice: string;
};

export default function InvoiceCard({ title, invoice }: StatCard) {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{invoice}</CardContent>
    </Card>
  );
}
