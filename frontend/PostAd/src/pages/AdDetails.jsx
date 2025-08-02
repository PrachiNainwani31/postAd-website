import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api'; 
import Footer from '../components/Footer';
import '../styles/AdDetails.css';
import { AuthContext } from '../context/AuthContext';

const AdDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % ad.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + ad.images.length) % ad.images.length);
  };

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await API.get(`/ads/${id}`);
        setAd(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAd();
  }, [id]);

  if (!ad) return <p>Loading...</p>;
  const handleOpenLogin = () => {
    console.log("Login clicked");
  };
  const handlePostAdClick = () => {
    console.log("Post Ad clicked");
  };

  return (
    <>
      <div className="app-container">
        <div className="main-content">
          <div className="ad-details-container">
            <div className="breadcrumb">Home &gt; {ad.category} &gt; {ad.title}</div>

            <div className="ad-main">
              <div className="carousel">
                {ad.images && ad.images.length > 0 && (
                  <>
                    <button className="arrow left" onClick={prevImage}>&#10094;</button>
                    {/* CHANGED: Use the full Cloudinary URL directly */}
                    <img
                      src={ad.images[currentImage]}
                      alt={`Ad ${currentImage}`}
                      className="carousel-image"
                    />
                    <button className="arrow right" onClick={nextImage}>&#10095;</button>
                  </>
                )}
              </div>

              <div className="ad-info-right">
                <h2 className="price">₹ {Number(ad.price).toLocaleString()}</h2>
                <h3>{ad.title}</h3>
                <p>{ad.description}</p>
                <p className="location">{ad.location}</p>
                <p className="date">Posted on: {new Date(ad.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="seller-info">
              <h3>Seller: {ad.user?.name || 'Not available'}</h3>
              <p><strong>Contact Details:</strong> {ad.phone || '+91 XXXXX XXXXX'}</p>
              <p><strong>Email:</strong> {ad.user?.email || 'Not available'}</p>
              <p><strong>Location:</strong> {ad.location}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AdDetails;