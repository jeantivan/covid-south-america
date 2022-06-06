import { Route } from "react-router-dom";

import { Layout } from "./components/Layout";

import { CountryPage } from "./pages/CountryPage";
import { HomePage } from "./pages/HomePage";
import { Error404Page } from "./pages/Error404Page";

function App() {
  return (
    <Layout>
      <Route path="/404" component={Error404Page} />
      <Route path="/country/:country" component={CountryPage} />
      <Route path="/" component={HomePage} />
    </Layout>
  );
}

export default App;
