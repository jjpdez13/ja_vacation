// frontend/src/components/SpotFormPage/SpotFormPage.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { spotActions } from "../../store";
import "./SpotForm.css";
import { useNavigate } from "react-router-dom";

function SpotFormPage({ spot = {} }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(spot.name || "");
  const [address, setAddress] = useState(spot.address || "");
  const [city, setCity] = useState(spot.city || "");
  const [state, setState] = useState(spot.state || "");
  const [country, setCountry] = useState(spot.country || "");
  const [price, setPrice] = useState(spot.price || "");
  const [description, setDescription] = useState(spot.description || "");
  const [images, setImages] = useState(["", "", "", "", ""]);
  const [errors, setErrors] = useState({});

   // Check if any field is filled
   const isAnyFieldFilled = () => {
    return (
      name.trim() ||
      address.trim() ||
      city.trim() ||
      state.trim() ||
      country.trim() ||
      price > 0 ||
      description.trim() ||
      images.some((img) => img.trim())
    );
   };
  
  const validateAllFields = () => {
    const newErrors = {};
  
    // General validations
    if (!name) newErrors.name = "Name is required.";
    if (!country) newErrors.country = "Country is required.";
    if (!address) newErrors.address = "Street address is required.";
    if (!city) newErrors.city = "City is required.";
    if (!state) newErrors.state = "State is required.";
    if (!price || price <= 0) newErrors.price = "Price is required and must be greater than 0.";
    if (!description || description.length < 30) {
      newErrors.description = "Description needs a minimum of 30 characters.";
    }
  
    // Validate Preview Image URL (Required)
    if (!images[0]) {
      newErrors.previewImage = "Preview image is required.";
    } else if (
      !images[0].endsWith(".jpg") &&
      !images[0].endsWith(".jpeg") &&
      !images[0].endsWith(".png")
    ) {
      newErrors.previewImage = "Preview image must end in .png, .jpg, or .jpeg.";
    }
  
    // Validate Optional Additional Images
    images.slice(1).forEach((url, index) => {
      if (url && !url.endsWith(".jpg") && !url.endsWith(".jpeg") && !url.endsWith(".png")) {
        newErrors[`image${index + 1}`] = "Image URL must end in .png, .jpg, or .jpeg.";
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAllFields()) return;

    const spotData = {
      name,
      address,
      city,
      state,
      country,
      price,
      description,
      previewImage: images[0],
      images: images.slice(1),
    };

    try {
      if (spot.id) {
        await dispatch(spotActions.updateSpot({ ...spotData, id: spot.id }));
      } else {
        const createdSpot = await dispatch(spotActions.createSpot(spotData));
        if (createdSpot) {
          navigate(`/spots/${createdSpot.id}`);
        }
      }
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  return (
    <>
      <h1>{spot.id ? "Edit Spot" : "Create a new Spot"}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {/* Location Section */}
        <section>
          <h2>Where is your place located?</h2>
          <p>
            Guests will only get your exact address once they book a
            reservation.
          </p>
          <label>
            Country
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            {errors.country && <p className="error">{errors.country}</p>}
          </label>
          <label>
            Street Address
            <input
              type="text"
              placeholder="Street Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </label>
          <label>
            City
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && <p className="error">{errors.city}</p>}
          </label>
          <label>
            State
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            {errors.state && <p className="error">{errors.state}</p>}
          </label>
        </section>

        {/* Description Section */}
        <section>
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <label>
            Description
            <textarea
              placeholder="Please write at least 30 characters"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p className="error">{errors.description}</p>
            )}
          </label>
        </section>

        {/* Title Section */}
        <section>
          <h2>Create a title for your spot</h2>
          <p>
            Catch attention with a spot title that highlights what makes your
            place special.
          </p>
          <label>
            Name
            <input
              type="text"
              placeholder="Name of your spot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </label>
        </section>

        {/* Price Section */}
        <section>
          <h2>Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <label>
            Price
            <input
              type="number"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && <p className="error">{errors.price}</p>}
          </label>
        </section>

        {/* Photos Section */}
        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          {/* Preview Image Input */}
          <label>
            Preview Image URL
            <input
              type="text"
              placeholder="Preview Image URL"
              value={images[0]}
              onChange={(e) => {
                const updatedImages = [...images];
                updatedImages[0] = e.target.value;
                setImages(updatedImages);
              }}
            />
            {errors.previewImage && (
              <p className="error">{errors.previewImage}</p>
            )}
          </label>
          {/* Additional Optional Image Inputs */}
          {images.slice(1).map((image, index) => (
            <label key={index}>
              Image URL {index + 1} (Optional)
              <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => {
                  const updatedImages = [...images];
                  updatedImages[index + 1] = e.target.value;
                  setImages(updatedImages);
                }}
              />
              {errors[`image${index + 1}`] && (
                <p className="error">{errors[`image${index + 1}`]}</p>
              )}
            </label>
          ))}
        </section>
        <button type="submit" disabled={!isAnyFieldFilled()}>Create Spot</button>
      </form>
    </>
  );
}

export default SpotFormPage;
