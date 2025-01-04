import { useState, useEffect } from "react"; // Import React and necessary hooks
import axios from "axios"; // Axios for HTTP requests
import { useNavigate } from "react-router-dom"; // useNavigate hook for navigation
import "./cveList.css"; // Import CSS for styling

const CVEList = () => {
  // Component to render the list of CVEs

  const [cves, setCves] = useState([]); // State to store fetched CVEs data
  const [body, setBody] = useState({ filter: "recent", limit: 50 }); // State to manage request payload (default filter and limit)
  const [isLoading, setIsLoading] = useState(true); // State to track whether data is loading
  const navigate = useNavigate(); // useNavigate hook to navigate between routes

  /**
   * Helper function to format ISO date strings into a human-readable format
   * @param {string} isoString - The ISO date string
   * @returns {string} - Formatted date string in "DD-MMM-YYYY" format
   */
  function formatDate(isoString) {
    const date = new Date(isoString); // Convert ISO string to a Date object
    const options = { day: "2-digit", month: "short", year: "numeric" }; // Date formatting options
    return date.toLocaleDateString("en-GB", options); // Format the date to "DD-MMM-YYYY"
  }

  /**
   * useEffect to fetch CVE data whenever the `body` state changes.
   */
  useEffect(() => {
    const fetchCVEs = async () => {
      try {
        setIsLoading(true); // Set loading state to true before the request
        const response = await axios.post("http://localhost:5000/cves/list", body); // Send POST request to the API with `body` as payload
        setCves(response.data); // Update `cves` state with the response data
      } catch (error) {
        console.error("Error fetching CVEs:", error); // Log any errors
      } finally {
        setIsLoading(false); // Set loading state to false after the request is completed
      }
    };

    fetchCVEs(); // Call the function to fetch CVEs
  }, [body]); // Dependency array ensures data is refetched whenever `body` changes

  /**
   * Function to handle row click events and navigate to the CVE detail page.
   * @param {string} id - CVE ID
   */
  const handleRowClick = (id) => {
    navigate(`/cves/${id}`); // Navigate to the detail page for the selected CVE
  };

  /**
   * Function to handle filter changes.
   * Updates the `filter` property in the `body` state dynamically.
   * @param {Event} e - Change event
   */
  const handleFilterChange = (e) => {
    setBody((prevBody) => ({
      ...prevBody, // Retain other properties in `body`
      filter: e.target.value, // Update the filter value based on user selection
    }));
  };

  return (
    <div>
      <h1>CVE LIST</h1> {/* Header for the page */}
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
            // Display a loading message while the data is being fetched
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          ) : cves.length > 0 ? (
            // If CVEs are available, render them in table rows
            cves.map((CVE) => (
              <tr
                key={CVE.cve.id} // Use CVE ID as the unique key
                onClick={() => handleRowClick(CVE.cve.id)} // Handle row click to navigate
                style={{ cursor: "pointer" }} // Change cursor to pointer for clickable rows
              >
                <td>{CVE.cve.id}</td> {/* Display CVE ID */}
                <td>{CVE.cve.sourceIdentifier}</td> {/* Display source identifier */}
                <td>{formatDate(CVE.cve.published)}</td> {/* Format and display published date */}
                <td>{formatDate(CVE.cve.lastModified)}</td> {/* Format and display last modified date */}
                <td>{CVE.cve.vulnStatus}</td> {/* Display vulnerability status */}
              </tr>
            ))
          ) : (
            // If no CVEs are found, display a message
            <tr>
              <td colSpan="5">No CVEs found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CVEList; // Export the CVEList component
