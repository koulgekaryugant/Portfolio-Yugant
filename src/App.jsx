import { ViewModeProvider } from "./context/ViewModeContext";
import { ThemeProvider } from "./context/ThemeContext";
import { GitHubStatsProvider } from "./context/GitHubStatsContext";
import { Home } from "./pages/Home";

export default function App() {
  return (
    <ThemeProvider>
      <ViewModeProvider>
        <GitHubStatsProvider>
          <Home />
        </GitHubStatsProvider>
      </ViewModeProvider>
    </ThemeProvider>
  );
}
