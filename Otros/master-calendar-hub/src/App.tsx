import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/Landing";
import Calendar from "@/pages/Calendar";
import Auth from "@/pages/Auth";
import ProfileSettings from "@/pages/ProfileSettings";
import Pricing from "@/pages/Pricing";
import Checkout from "@/pages/Checkout";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/profile/:section" element={<ProfileSettings />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;