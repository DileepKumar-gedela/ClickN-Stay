import React, { useEffect, useState } from 'react';

const Admin = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/logins')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Login Logs</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Email</th>
            <th>Success</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx}>
              <td>{log.email}</td>
              <td>{log.success ? '✅ Success' : '❌ Failed'}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
