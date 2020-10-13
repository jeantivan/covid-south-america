import React from "react";
import { Layout } from "./components/Layout";

import { HomePage } from "./pages/HomePage";
import { CountryPage } from "./pages/CountryPage";

function App() {
  return (
    <Layout>
      <HomePage path="/" />
      <CountryPage path="/country/:country" />
    </Layout>
  );
}

export default App;
