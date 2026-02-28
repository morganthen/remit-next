import { CardContent, Card, CardHeader, CardTitle } from './ui/card';

type StatCard = {
  title: string;
  stat: string;
};

export default function StatCard({ title, stat }: StatCard) {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{stat}</CardContent>
    </Card>
  );
}
