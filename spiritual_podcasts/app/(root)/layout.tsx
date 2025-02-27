import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col relative">
      <main className="relative flex bg-black-3">
        <LeftSidebar />
        <section className="border border-red-500 flex min-h-screen flex-1 flex-col sm:px-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            <div className="flex h-16 items-center justify-between md:hidden">
              {/* <Image src={} alt="" /> */}
              MobileNav
            </div>
            <div>
              Toaster noti Pop-up
              {children}
            </div>
          </div>
        </section>
        <RightSidebar />
      </main>
    </div>
  );
}
