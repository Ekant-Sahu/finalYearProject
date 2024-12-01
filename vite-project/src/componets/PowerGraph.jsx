import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const PowerGraph = () => {
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [loadRequirement, setLoadRequirement] = useState(250); // Example static load requirement
  const [date, setDate] = useState('2024-12-01'); // Default date
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://finalyrprojectbackend.onrender.com/api/get_data/${date}`);
        const allData = response.data.records || [];

        const formattedData = allData.map((record) => ({
          time: `${record.hours}:${record.minutes === 0 ? '00' : record.minutes}`,
          predictedPower: record.predicted_power,
          irrad: record.irrad,
          temperature: record.cell_temperature,
        }));

        setData(formattedData);
        setCurrentData(formattedData[formattedData.length - 1] || null); // Set latest data point as "current"
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        backgroundImage: "url('https://source.unsplash.com/1600x900/?solar,energy')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        fontFamily: "'Roboto', sans-serif",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {/* Date Picker */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="datePicker" style={{ marginRight: '10px', fontSize: '18px' }}>Select Date:</label>
        <input
          id="datePicker"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '16px',
            border: '2px solid #007bff',
            borderRadius: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            outline: 'none',
          }}
        />
      </div>

      {loading && (
        <div style={{ fontSize: '18px', color: '#007bff', marginBottom: '20px' }}>
          Loading data...
        </div>
      )}

      {error && (
        <div style={{ fontSize: '18px', color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {!error && currentData && (
        <>
          {/* Current Data Block */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginBottom: '30px',
              padding: '20px',
              background: 'rgba(0, 123, 255, 0.7)',
              borderRadius: '15px',
              width: '90%',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div>
              <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>Temperature</h3>
              <p style={{ fontSize: '18px' }}>{currentData.temperature.toFixed(1)} °C</p>
            </div>
            <div>
              <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>Irradiance</h3>
              <p style={{ fontSize: '18px' }}>{currentData.irrad} W/m²</p>
            </div>
            <div>
              <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>Generated Power</h3>
              <p style={{ fontSize: '18px' }}>{currentData.predictedPower.toFixed(2)} W</p>
            </div>
            <div>
              <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>Load Requirement</h3>
              <p style={{ fontSize: '18px' }}>{`${loadRequirement} W`}</p>
            </div>
          </div>

          {/* Graphs */}
          <div style={{ width: '100%', maxWidth: '900px' }}>
            {/* Irradiance Graph */}
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Irradiance Graph</h3>
              <LineChart
                width={800}
                height={350}
                data={data}
                margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
              >
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="time" label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }} />
                <YAxis label={{ value: 'Irradiance (W/m²)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="irrad" stroke="#82ca9d" name="Irradiance (W/m²)" />
              </LineChart>
            </div>

            {/* Temperature Graph */}
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Temperature Graph</h3>
              <LineChart
                width={800}
                height={350}
                data={data}
                margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
              >
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="time" label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }} />
                <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#FF8042" name="Temperature (°C)" />
              </LineChart>
            </div>

            {/* Generated Power Graph */}
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Generated Power Graph</h3>
              <LineChart
                width={800}
                height={350}
                data={data}
                margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
              >
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="time" label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }} />
                <YAxis label={{ value: 'Power (W)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predictedPower" stroke="#8884d8" name="Predicted Power (W)" />
              </LineChart>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PowerGraph;
