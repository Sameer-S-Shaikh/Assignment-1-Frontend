import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/design';

function Temp() {
    const [designs, setDesigns] = useState([]);
    const [newDesign, setNewDesign] = useState({ title: '', description: '' });
    const [editDesign, setEditDesign] = useState(null);

    // Fetch all designs
    const fetchDesigns = async () => {
        try {
            const response = await axios.get(API_URL);
            setDesigns(response.data);
        } catch (err) {
            console.error('Error fetching designs:', err);
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    // Create a new design
    const addDesign = async () => {
        try {
            await axios.post(API_URL, newDesign);
            setNewDesign({ title: '', description: '' });
            fetchDesigns();
        } catch (err) {
            console.error('Error adding design:', err);
        }
    };

    // Update a design
    const updateDesign = async () => {
        try {
            await axios.put(`${API_URL}/${editDesign._id}`, editDesign);
            setEditDesign(null);
            fetchDesigns();
        } catch (err) {
            console.error('Error updating design:', err);
        }
    };

    // Delete a design
    const deleteDesign = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchDesigns();
        } catch (err) {
            console.error('Error deleting design:', err);
        }
    };

    return (
        <div>
            <h1>Designs</h1>
            
            <h2>Add New Design</h2>
            <input
                type="text"
                placeholder="Title"
                value={newDesign.title}
                onChange={(e) => setNewDesign({ ...newDesign, title: e.target.value })}
            />
            <input
                type="text"
                placeholder="Description"
                value={newDesign.description}
                onChange={(e) => setNewDesign({ ...newDesign, description: e.target.value })}
            />
            <button onClick={addDesign}>Add Design</button>

            <h2>Edit Design</h2>
            {editDesign && (
                <div>
                    <input
                        type="text"
                        value={editDesign.title}
                        onChange={(e) => setEditDesign({ ...editDesign, title: e.target.value })}
                    />
                    <input
                        type="text"
                        value={editDesign.description}
                        onChange={(e) => setEditDesign({ ...editDesign, description: e.target.value })}
                    />
                    <button onClick={updateDesign}>Update Design</button>
                    <button onClick={() => setEditDesign(null)}>Cancel</button>
                </div>
            )}

            <h2>All Designs</h2>
            <ul>
                {designs.map((design) => (
                    <li key={design._id}>
                        <strong>{design.title}</strong>: {design.description}
                        <button onClick={() => setEditDesign(design)}>Edit</button>
                        <button onClick={() => deleteDesign(design._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Temp;
