import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function useNationalityAPI(name) {
  const [nationality, setNationality] = useState(""); // State for storing the fetched nationality

  useEffect(() => {
    if (name) {
      // Fetch the nationality based on the provided name
      fetch(`https://api.nationalize.io?name=${name}`)
        .then((response) => response.json())
        .then((data) => {
          const countries = data.country;
          if (countries.length > 0) {
            // Get the first country object
            const firstCountry = countries[0];
            // Get the country ID and probability from the first country object
            const { country_id, probability } = firstCountry;
            // Fetch the full name of the country based on the country ID
            fetch(`https://restcountries.com/v2/alpha/${country_id}`)
              .then((response) => response.json())
              .then((countryData) => {
                const countryFullName = countryData.name;
                // Set the nationality to include the full name and probability
                setNationality(`${countryFullName} (${country_id}) - ${probability}`);
              })
              .catch((error) => {
                console.error("Error fetching country details:", error);
                setNationality("Error");
              });
          } else {
            setNationality("Unknown");
          }
        })
        .catch((error) => {
          console.error("Error fetching nationality:", error);
          setNationality("Error");
        });
    } else {
      setNationality(""); // Reset the nationality when the name is empty
    }
  }, [name]);

  return nationality;
}

function App() {
  const [name, setName] = useState(""); // State for storing the name input value
  const count = useRef(0); // Ref for counting the number of renders
  const nationality = useNationalityAPI(name); // Custom hook to fetch and handle nationality

  useEffect(() => {
    count.current = count.current + 1; // Increment the render count on each render
  });

  return (
    <div className="container">
      {/* Title */}
      <h1 className="title">Nationality Predictor</h1>

      {/* Form */}
      <div className="form-group">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update the name state on input change
          autoFocus
          className="input-field"
          placeholder="Enter a name"
        />
        <button className="fetch-button">Fetch Nationality</button>
      </div>

      {/* Result */}
      <div className="result">
        {/* Display the name */}
        <h2 className="name">Name: {name}</h2>
        {/* Display the nationality */}
        <h2 className="nationality">Nationality: {nationality}</h2>
      </div>

      {/* Render count */}
      <h2 className="render-count">Render Count: {count.current}</h2>
    </div>
  );
}

export default App;
