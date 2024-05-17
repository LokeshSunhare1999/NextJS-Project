import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = { firtName: "Adrian", lastName: "JSM" };
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />
      <div className="size-full flex flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" alt="menu icon" width={30} height={30} />
        </div>
      </div>
      {children}
    </main>
  );
}
