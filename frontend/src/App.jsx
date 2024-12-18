import "./App.css";
import { adminRoutes, publicRoutes } from "./routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultAdminLayout from "./layouts/DefaultAdminLayout";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route element={<AdminRoutes />}>
            {adminRoutes.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultAdminLayout;
              Layout = route.layout ? route.layout : DefaultAdminLayout;

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Route>

          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = null;
            Layout = route.layout ? route.layout : null;

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
