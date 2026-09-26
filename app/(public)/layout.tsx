import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {/* Main Content with Mobile Bottom Padding */}
      <main className="flex-1 md:pb-0 pb-[72px]">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
