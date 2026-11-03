import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ChatBot from '@/components/ChatBot';
import PageChrome from '@/components/PageChrome';
import ScrollReveal from '@/components/ScrollReveal';
import MainBreadcrumb from '@/components/MainBreadcrumb';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainBreadcrumb />
      <PageChrome />
      <ScrollReveal />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <ChatBot />
    </div>
  );
}
