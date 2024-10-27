import React, { useState } from 'react';
import axios from 'axios';

type Donor = {
  id: number;
  organ: string;
  availability_status: string;
  donor: string;
};

const DonorSearch: React.FC = () => {
  const [organSearch, setOrganSearch] = useState<string>('');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrganSearch(event.target.value);
  };

  // Search donors based on organ name
  const fetchDonors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ results: Donor[] }>(
        `http://127.0.0.1:8000/api/organ-donor?organ=${organSearch}`
      );
      setDonors(response.data.results); 
    } catch (error: any) {
      setError('Failed to fetch donors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (organSearch.trim()) {
      fetchDonors();
    }
  };

  const handleClearSearch = () => {
    setOrganSearch(''); // Clear the search term
    setDonors([]);
};


  return (
    <div className="container">
      <h2>Search for Organ Donors</h2>
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter organ name (e.g., Kidney)"
            value={organSearch}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-outline-warning btn-small flex-fill mx-1" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button type="submit" className="btn btn-outline-secondary btn-small flex-fill mx-1" onClick={handleClearSearch}>Clear</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {donors.length > 0 ? (
          <ul className="list-group mt-4">
            {donors.map((donor) => (
              <li key={donor.id} className="list-group-item">
                <strong>Organ:</strong> {donor.organ} <br />
                <strong>Availability:</strong> {donor.availability_status} <br />
                <strong>Donor ID:</strong> {donor.donor}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No donors found for this organ.</p>
        )}
      </div>
    </div>
  );
};

export default DonorSearch;
