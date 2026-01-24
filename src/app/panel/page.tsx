import { isAuthedViaCookies } from '@/lib/auth';
import AdminPanel from '@/components/AdminSoldPanel';
import LoginForm from '@/components/AdminLoginForm';
import AdminParcelPricingPanel from '@/components/AdminParcelPricingPanel';
import AdminStage2Panel from '@/components/AdminStage2Panel';

export const dynamic = 'force-dynamic';

export default async function PanelPage() {
  const authed = await isAuthedViaCookies();

  return (
    <div className="min-h-[100svh] bg-[#131313] text-[#F3EFF5] p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="font-evalinor text-3xl">Panel administracyjny</h1>

        {authed ? (
          <>
            <section className="space-y-4">
              <h2 className="text-2xl font-evalinor">SPRZEDANE</h2>
              <AdminPanel />
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-evalinor">ETAP 2 (NIEBIESKIE)</h2>
              <AdminStage2Panel />
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-evalinor">CENY DZIAŁEK</h2>
              <AdminParcelPricingPanel />
            </section>
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}