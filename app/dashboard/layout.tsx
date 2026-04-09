import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-6 md:p-8 relative overflow-y-auto w-full h-screen scroll-smooth">
        {/* Background elements for all dashboard pages */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-[30%] w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
        </div>
        
        {/* Grid pattern */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-50" />

        <div className="relative z-10 max-w-6xl mx-auto pt-12 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
