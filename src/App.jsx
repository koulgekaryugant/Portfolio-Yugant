import { ViewModeProvider } from "./context/ViewModeContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Home } from "./pages/Home";

export default function App() {
  return (
    <ThemeProvider>
      <ViewModeProvider>
        <Home />
      </ViewModeProvider>
    </ThemeProvider>
  );
}
