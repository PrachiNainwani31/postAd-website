import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserRow from '../components/userRow';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AdminUsers() {
  const { isAdmin, user } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      axios
        .get('http://localhost:5001/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Failed to fetch users:", err));
    } else {
      navigate('/'); // redirect if not admin
    }
  }, [isAdmin]);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const viewAds = (userId) => navigate(`/admin/users/${userId}/ads`);

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Users</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Delete</th>
            <th>Ads</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <UserRow key={u._id} user={u} onDelete={deleteUser} onViewAds={viewAds} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
