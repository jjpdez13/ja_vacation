// frontend/src/components/SpotFormModal/SpotFormModal.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { spotActions } from "../../store";
import './SpotForm.css';

function SpotFormModal({ spot = {} }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [name, setName] = useState(spot.name || "");
  const [location, setLocation] = useState(spot.location || "");
  const [price, setPrice] = useState(spot.price || "");
  const [description, setDescription] = useState(spot.description || "");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const spotData = { name, location, price, description, previewImage: image };

    try {
      if (spot.id) {
        await dispatch(spotActions.updateSpot({ ...spotData, id: spot.id }));
      } else {
        await dispatch(spotActions.createSpot(spotData));
      }
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  return (
    <>
      <h1>{spot.id ? "Edit Spot" : "Create Spot"}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Preview Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required={!spot.id}
          />
        </label>
        {Object.values(errors).map((error, idx) => (
          <p key={idx} className="error">{error}</p>
        ))}
        <button type="submit">{spot.id ? "Update Spot" : "Create Spot"}</button>
      </form>
    </>
  );
}

export default SpotFormModal;