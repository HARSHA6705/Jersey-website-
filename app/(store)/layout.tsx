import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

// Shared chrome for every page except the full-screen home hero
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[90rem] flex-1 px-4 pt-10 md:px-[max(5.6vw,2rem)] md:pt-16">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
