import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../Pages/Home/HomePage";
import Layout from "../components/Layout/Layout";

const AppRouter = () => {
  return (
    <React.Fragment>
      <Layout>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/work" element={<h1>Work</h1>} />
          <Route exact path="/about" element={<h1>About</h1>} />
          <Route exact path="/contact" element={<h1>Contact</h1>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </React.Fragment>
  );
};

export default AppRouter;
