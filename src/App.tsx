import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FamilySelection } from './components/pages/FamilySelection';
import { Designer } from './components/pages/Designer';
import { PackageReview } from './components/pages/PackageReview';
import { LoginPage } from './components/pages/LoginPage';
import { MyDesigns } from './components/pages/MyDesigns';
import { SharedDesign } from './components/pages/SharedDesign';
import { SubmitForQuote } from './components/pages/SubmitForQuote';
import { Configurator } from './components/configurator/ConfiguratorShell';
import { usePackageStore } from './stores/package-store';
import { useAuthStore } from './stores/auth-store';

const STORAGE_KEY = 'egx-sign-designer-draft';

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?' +
  'family=Questrial&' +
  'family=DM+Sans:wght@400;500;700&' +
  'family=Nunito+Sans:wght@400;600;700&' +
  'family=Outfit:wght@400;500;700&' +
  'display=swap';

function App() {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        usePackageStore.getState().hydrate(data);
      }
    } catch {
      // Ignore corrupt data
    }
  }, []);

  // Auto-save to localStorage on state changes (debounced 2s)
  useEffect(() => {
    const unsub = usePackageStore.subscribe((state) => {
      if (!state.isDirty && !state.familyId) return;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        try {
          const serialized = usePackageStore.getState().serialize();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
        } catch {
          // Ignore serialization errors
        }
      }, 2000);
    });

    return () => {
      unsub();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Load Google Fonts for ADA font options */}
      <link rel="stylesheet" href={GOOGLE_FONTS_URL} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FamilySelection />} />
          <Route path="/designer" element={<Designer />} />
          <Route path="/review" element={<PackageReview />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/designs" element={<MyDesigns />} />
          <Route path="/share/:token" element={<SharedDesign />} />
          <Route path="/submit" element={<SubmitForQuote />} />
          <Route path="/configure" element={<Configurator />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
