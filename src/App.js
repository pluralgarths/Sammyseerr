import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/opportunities")
      .then((response) => setOpportunities(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Opportunities</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Posted Date</th>
            <th>Description</th>
            <th>Agency</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.posted_date}</td>
              <td>{item.description}</td>
              <td>{item.full_parent_path_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
