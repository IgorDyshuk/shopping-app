import { Header } from "@/components/layout/Header";
import Home from "@/pages/Home";

function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>
        <Home />
      </main>
    </div>
  );
}

export default App;
