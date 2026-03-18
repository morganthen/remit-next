import { Suspense } from 'react';
import LoginForm from '@/components/login/LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}
