import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { useTenant } from './lib/tenant';
import { applyTheme } from './lib/theme';
import Home from './pages/Home';
import Book from './pages/Book';
import Calculator from './pages/Calculator';
import { Process, Numbers, Faq, About, Lots } from './pages/Static';
import { Transfer, Reserve, Prep, Shipping, NotFound } from './pages/Flow';
import {
  Ask,
  Confirmed,
  Draft,
  Gallery,
  OrderStates,
  Pricing,
  ShippingInfo,
  SocialLanding,
  Testimonials,
  WhatYouSee,
} from './pages/Marketing';
import {
  CurrencyBuy,
  ForShoppers,
  InvestmentReturn,
  MarginQuiz,
  ProfitPerPiece,
  ShoeSizeChart,
} from './pages/Tools';
import { DropCheckout, DropDetail, Drops, School } from './pages/Lines';

export default function App() {
  const tenant = useTenant();

  useEffect(() => {
    applyTheme(tenant);
  }, [tenant]);

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Marketing */}
        <Route path="/" element={<Home />} />
        <Route path="/como-funciona" element={<Process />} />
        <Route path="/lo-que-veras" element={<WhatYouSee />} />
        <Route path="/numeros" element={<Numbers />} />
        <Route path="/precios" element={<Pricing />} />
        <Route path="/preguntas" element={<Faq />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/testimonios" element={<Testimonials />} />
        <Route path="/paqueteria" element={<ShippingInfo />} />
        <Route path="/pedidos" element={<OrderStates />} />
        <Route path="/preguntar" element={<Ask />} />
        <Route path="/web-para-shoppers" element={<ForShoppers />} />
        <Route path="/social" element={<SocialLanding />} />

        {/* Flujo de cliente */}
        <Route path="/transferencia" element={<Transfer />} />
        <Route path="/reservar" element={<Reserve />} />
        <Route path="/confirmado" element={<Confirmed />} />
        <Route path="/antes-de-tu-cita" element={<Prep />} />
        <Route path="/envio" element={<Shipping />} />
        {tenant.features.orderDraft && <Route path="/tu-pedido" element={<Draft />} />}

        {/* Herramientas */}
        {tenant.features.calculator && (
          <>
            <Route path="/calculadora" element={<Calculator />} />
            <Route path="/ganancia-por-pieza" element={<ProfitPerPiece />} />
            <Route path="/inversion-y-ganancia" element={<InvestmentReturn />} />
            <Route path="/compra-dolar" element={<CurrencyBuy />} />
            <Route path="/quiz-margen" element={<MarginQuiz />} />
          </>
        )}
        <Route path="/tabulador-tallas-zapatos" element={<ShoeSizeChart />} />

        {/* Líneas de negocio */}
        {tenant.features.lots && <Route path="/lotes" element={<Lots />} />}
        {tenant.features.school && <Route path="/school" element={<School />} />}
        {tenant.features.drops && (
          <>
            <Route path="/drops" element={<Drops />} />
            <Route path="/drops/:slug" element={<DropDetail />} />
            <Route path="/drops/:slug/checkout" element={<DropCheckout />} />
          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Superficies sin navegación del sitio */}
      <Route path="/agendar" element={<Book />} />
      <Route path="/tiktok" element={<SocialLanding />} />
    </Routes>
  );
}
