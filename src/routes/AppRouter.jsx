import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../Pages/Home/HomePage";
import Layout from "../components/Layout/Layout";
import ContactPage from "../Pages/Contact/ContactPage";
import AboutPage from "../Pages/About/AboutPage";
import WorkPage from "../Pages/Work/WorkPage";

const AppRouter = () => {
  return (
    <React.Fragment>
      <Layout>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/work" element={<WorkPage />} />
          <Route exact path="/about" element={<AboutPage />} />
          <Route exact path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </React.Fragment>
  );
};

export default AppRouter;
