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

export default function App() {
  const tenant = useTenant();

  useEffect(() => {
    applyTheme(tenant);
  }, [tenant]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/como-funciona" element={<Process />} />
        <Route path="/numeros" element={<Numbers />} />
        <Route path="/preguntas" element={<Faq />} />
        <Route path="/sobre" element={<About />} />
        {tenant.features.lots && <Route path="/lotes" element={<Lots />} />}
        {tenant.features.calculator && <Route path="/calculadora" element={<Calculator />} />}
        <Route path="/transferencia" element={<Transfer />} />
        <Route path="/reservar" element={<Reserve />} />
        <Route path="/antes-de-tu-cita" element={<Prep />} />
        <Route path="/envio" element={<Shipping />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      {/* El asistente vive fuera del layout: su propio header, sin navegación. */}
      <Route path="/agendar" element={<Book />} />
    </Routes>
  );
}
