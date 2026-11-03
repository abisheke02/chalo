import type { Metadata } from 'next';

// robots.txt disallows /auth/ too — this is defense-in-depth so the login
// page itself can't get indexed even if a crawler ignores robots.txt.
export const metadata: Metadata = {
  title: 'Sign In',
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
