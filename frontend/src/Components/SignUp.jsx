import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5002/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Signup successful!', {
          position: 'top-right'
        });
      } else {
        toast.error(data.message || 'Signup failed!', {
          position: 'top-right'
        });
      }
    } catch (error) {
      toast.error('Something went wrong!', {
        position: 'top-right'
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9EDE1] px-4">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl w-full">
        
        <div className="hidden md:flex md:w-1/2">
          <img 
            src="https://cdn.pixabay.com/photo/2022/08/11/18/47/care-for-the-elderly-7380108_1280.jpg"
            alt="Elderly Care"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#5A4230] text-center">Join Our Community</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-[#5A4230]">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required 
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C48F65] bg-gray-50" />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-[#5A4230]">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required 
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C48F65] bg-gray-50" />
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-[#5A4230]">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} required 
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C48F65] bg-gray-50">
                <option value="" disabled>Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Family">Family</option>
                <option value="Elder">Elder</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-[#5A4230]">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required 
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C48F65] bg-gray-50" />
            </div>

            <button type="submit" 
              className="w-full bg-[#C48F65] text-white py-3 rounded-lg font-semibold hover:bg-[#A77250] transition duration-300">
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C48F65] hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
