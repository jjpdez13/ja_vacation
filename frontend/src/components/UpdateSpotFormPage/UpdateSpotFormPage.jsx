// frontend/src/components/UpdateSpotFormPage/UpdateSpotFormPage.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { spotActions } from "../../store";
import "./UpdateSpotForm.css";
import { useNavigate, useParams } from "react-router-dom";

function UpdateSpotFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  console.log("spotId from useParams:", spotId);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState(["", "", "", "", ""]);
  const [errors, setErrors] = useState({});

  const spot = useSelector((state) => state.spots.singleSpot.details);

  useEffect(() => {
    if (spotId) {
      dispatch(spotActions.getSpotDetails(spotId));
    }
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spot) {
      setName(spot.name || "");
      setAddress(spot.address || "");
      setCity(spot.city || "");
      setState(spot.state || "");
      setCountry(spot.country || "");
      setPrice(spot.price || "");
      setDescription(spot.description || "");
      setImages(
        spot.spotImages?.map((img) => {
          img.url;
        }) || ["", "", "", "", ""]
      );
    }
  }, [spot]);

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
    if (!price || price <= 0)
      newErrors.price = "Price is required and must be greater than 0.";
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
      newErrors.previewImage =
        "Preview image must end in .png, .jpg, or .jpeg.";
    }

    // Validate Optional Additional Images
    images.slice(1).forEach((url, index) => {
      if (
        url &&
        !url.endsWith(".jpg") &&
        !url.endsWith(".jpeg") &&
        !url.endsWith(".png")
      ) {
        newErrors[`image${index + 1}`] =
          "Image URL must end in .png, .jpg, or .jpeg.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAllFields()) return;

    const spotData = {
      id: spotId,
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
      const updatedSpot = await dispatch(spotActions.updateSpot(spotData));
      if (updatedSpot) {
        navigate(`/spots/${updatedSpot.id}`);
      }
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  return (
    <>
      <h1>Edit Spot</h1>
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
        <button type="submit" disabled={!isAnyFieldFilled()}>
          Update Spot
        </button>
      </form>
    </>
  );
}

export default UpdateSpotFormPage;
