import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <AppRoutes />
      </Layout>
    </AuthProvider>
  );
};

export default App;
