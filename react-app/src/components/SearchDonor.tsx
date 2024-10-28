import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Donor = {
  id: number;
  organ: string;
  availability_status: string;
  donor: string;
};

// const navigate = useNavigate();
const DonorSearch: React.FC = () => {
  const [organSearch, setOrganSearch] = useState<string>('');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrganSearch(event.target.value);
  };

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
    setOrganSearch('');
    setDonors([]);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Search for Organ Donors</h2>
      <form onSubmit={handleSearch} className="mb-3">
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter organ name (e.g., Kidney)"
            value={organSearch}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="d-flex mb-3">
          <button type="submit" className="btn btn-outline-warning me-2" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button type="button" className="btn btn-outline-secondary me-2" onClick={handleClearSearch}>
            Clear
          </button>
          <button type="button" className="btn btn-outline-warning" onClick={() => window.location.href = 'http://localhost:3000'}>
            Return home
          </button>
        </div>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className='container'>
        {donors.length > 0 ? (
          <ul className="list-group">
            {donors.map((donor) => (
              <li key={donor.id} className="list-group-item mb-3">
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
