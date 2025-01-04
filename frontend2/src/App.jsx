// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CVEList from "./components/CVEList";
import CVEDetail from "./components/CVEDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for CVE List */}
        <Route path="/cves/list" element={<CVEList />} />

        {/* Route for specific CVE detail */}
        <Route path="/cves/:cve_id" element={<CVEDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
