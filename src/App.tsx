import { Toaster } from "@/components/ui/sonner";
import { copy } from "@/data/profile";
import { usePreferences } from "@/hooks/use-preferences";
import MainLayout from "@/layouts/main.layout";
import HomeView from "@/views/home.view";

function App() {
  const { locale, setLocale, theme, setTheme, resolvedTheme } = usePreferences();
  return (
    <>
      <MainLayout locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme}>
        <HomeView locale={locale} />
      </MainLayout>
      <Toaster
        theme={resolvedTheme}
        position="bottom-right"
        toastOptions={{ duration: 4000 }}
        containerAriaLabel={copy[locale].notifications}
      />
    </>
  );
}
export default App;
