import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./cveList.css";

const CVEList = () => {
  const [cves, setCves] = useState([]);
  const [filteredCves, setFilteredCves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageWindow, setPageWindow] = useState([1, 2, 3, 4, 5]); // Carousel for page numbers
  const navigate = useNavigate();

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    const fetchCVEs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post("http://localhost:5000/cves/list");
        setCves(response.data);
      } catch (error) {
        console.error("Error fetching CVEs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCVEs();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    setFilteredCves(cves.slice(startIndex, endIndex));
  }, [currentPage, recordsPerPage, cves]);

  const handleRowClick = (id) => {
    navigate(`/cves/${id}`);
  };

  const handleRecordsChange = (e) => {
    setRecordsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
    setPageWindow([1, 2, 3, 4, 5]); // Reset page window
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    // Update carousel window
    const windowSize = 5; // Show 5 page numbers at a time
    const totalPages = Math.ceil(cves.length / recordsPerPage);
    if (page > pageWindow[pageWindow.length - 1]) {
      // If current page is outside the window, shift forward
      const newWindowStart = Math.min(totalPages - windowSize + 1, page);
      setPageWindow(
        Array.from({ length: windowSize }, (_, i) => newWindowStart + i)
      );
    } else if (page < pageWindow[0]) {
      // If current page is before the window, shift backward
      const newWindowStart = Math.max(1, page - windowSize + 1);
      setPageWindow(
        Array.from({ length: windowSize }, (_, i) => newWindowStart + i)
      );
    }
  };

  const totalPages = Math.ceil(cves.length / recordsPerPage);

  return (
    <div>
      <div
        style={{
          // display: "flex",
          // justifyContent: "space-between",
          alignItems: "center",
          height:"20%"
        }}
      >
        <h1>CVE LIST</h1>
        <div style={{height:"20%"}}>
          <label htmlFor="recordsPerPage" style={{ marginLeft: "80%" }}>
            Results Per Page:
          </label>
          <select
            id="recordsPerPage"
            value={recordsPerPage}
            onChange={handleRecordsChange}
            style={{ padding: "5px", fontSize: "14px" }}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>CVE ID</th>
            <th>IDENTIFIER</th>
            <th>PUBLISHED DATE</th>
            <th>LAST MODIFIED DATE</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody id="cve-body">
          {isLoading ? (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          ) : filteredCves.length > 0 ? (
            filteredCves.map((CVE) => (
              <tr
                key={CVE.cve.id}
                onClick={() => handleRowClick(CVE.cve.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{CVE.cve.id}</td>
                <td>{CVE.cve.sourceIdentifier}</td>
                <td>{formatDate(CVE.cve.published)}</td>
                <td>{formatDate(CVE.cve.lastModified)}</td>
                <td>{CVE.cve.vulnStatus}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No CVEs found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{
          marginTop: "0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height:"40%"
        }}
      >
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          &laquo; First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          &lsaquo; Prev
        </button>
        {pageWindow.map(
          (page) =>
            page <= totalPages && (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  backgroundColor: page === currentPage ? "#007BFF" : "#FFF",
                  color: page === currentPage ? "#FFF" : "#000",
                  border: "1px solid #007BFF",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {page}
              </button>
            )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next &rsaquo;
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Last &raquo;
        </button>
      </div>
    </div>
  );
};

export default CVEList;
