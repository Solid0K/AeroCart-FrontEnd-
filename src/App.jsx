import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CommandPaletteProvider } from "@/context/CommandPaletteContext";
import AppRoutes from "@/routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <CommandPaletteProvider>
            <AppRoutes />
          </CommandPaletteProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
