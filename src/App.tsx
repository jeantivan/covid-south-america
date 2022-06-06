import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import { Layout } from "./components/Layout";

import { CountryPage } from "./pages/CountryPage";
import { HomePage } from "./pages/HomePage";
import { Error404Page } from "./pages/Error404Page";

function App() {
  return (
    <Router>
      <Layout>
        <Route path="/404" element={<Error404Page />} />
        <Route path="/country/:country" element={<CountryPage />} />
        <Route path="/" element={<HomePage />} />
      </Layout>
    </Router>
  );
}

export default App;
