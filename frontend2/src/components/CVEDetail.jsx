import { useState, useEffect } from "react"; // Importing React, useState, and useEffect hooks
import axios from "axios"; // Importing axios for making HTTP requests
import { useParams } from "react-router-dom"; // Importing useParams to retrieve route parameters
import "./cveDetail.css"; // Importing the CSS file for styling

const CVEDetail = () => {
  // Extracting the `cve_id` parameter from the URL using useParams
  const { cve_id } = useParams();
  console.log(cve_id); // Debugging: Log the CVE ID for verification

  // State to store the CVE details fetched from the server
  const [cve, setCve] = useState(null);
  console.log(cve); // Debugging: Log the CVE details whenever the state is updated

  useEffect(() => {
    // Fetch the specific CVE details when the component mounts or `cve_id` changes
    axios
      .post(
        "http://localhost:5000/cves/list", // API endpoint to fetch CVE details
        { cve_id: cve_id } // Passing the CVE ID as a parameter in the request body
      )
      .then((response) => {
        console.log(response.data[0].cve); // Debugging: Log the fetched CVE data
        setCve(response.data[0].cve); // Update the state with the fetched CVE details
      })
      .catch((error) => {
        // Handle errors that occur during the API call
        console.error("Error fetching CVE details:", error);
      });
  }, [cve_id]); // Dependency array ensures this effect runs when `cve_id` changes

  // Show a loading message while the CVE details are being fetched
  if (!cve) {
    return <p>Loading...</p>;
  }

  // Render the CVE details once the data is available
  return (
    <div>
      {/* Display the CVE ID */}
      <h1>{cve.id}</h1>

      {/* Display the description of the CVE */}
      <p>
        <strong>Description:</strong> {cve.descriptions[0].value}
      </p>

      {/* CVSS V2 Metrics Table */}
      <h3>CVSS V2 Metrics:</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Access Vector</th>
            <th>Access Complexity</th>
            <th>Authentication</th>
            <th>Confidentiality Impact</th>
            <th>Integrity Impact</th>
            <th>Availability Impact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* Extracting and displaying CVSS V2 metrics */}
            <td>{cve.metrics.cvssMetricV2[0].cvssData.accessVector}</td>
            <td>{cve.metrics.cvssMetricV2[0].cvssData.accessComplexity}</td>
            <td>{cve.metrics.cvssMetricV2[0].cvssData.authentication}</td>
            <td>
              {cve.metrics.cvssMetricV2[0].cvssData.confidentialityImpact}
            </td>
            <td>{cve.metrics.cvssMetricV2[0].cvssData.integrityImpact}</td>
            <td>{cve.metrics.cvssMetricV2[0].cvssData.availabilityImpact}</td>
          </tr>
        </tbody>
      </table>

      {/* CVSS V2 Scores */}
      <h3>Scores:</h3>
      <p>
        Exploitability Score: {cve.metrics.cvssMetricV2[0].exploitabilityScore}
      </p>
      <p>Impact Score: {cve.metrics.cvssMetricV2[0].impactScore}</p>

      {/* CPE (Common Platform Enumeration) Configuration */}
      <h3>CPE:</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Match Criteria ID</th>
            <th>Vulnerable</th>
          </tr>
        </thead>
        <tbody>
          {/* Iterating through the CPE match data to display each item */}
          {cve.configurations[0].nodes[0].cpeMatch.map((item, index) => (
            <tr key={index}>
              <td>{item.criteria}</td>
              <td>{item.matchCriteriaId}</td>
              <td>{item.vulnerable ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CVEDetail;
