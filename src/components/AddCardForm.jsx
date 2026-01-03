import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'

const AddCardForm = ({ onAdd, onCancel }) => {
    const [name, setName] = useState('')
    const [limit, setLimit] = useState('')
    const [hotelInput, setHotelInput] = useState('')
    const [hotels, setHotels] = useState([])
    const [loading, setLoading] = useState(false)

    const handleAddHotel = (e) => {
        e.preventDefault()
        if (hotelInput.trim()) {
            setHotels([...hotels, hotelInput.trim()])
            setHotelInput('')
        }
    }

    const removeHotel = (index) => {
        setHotels(hotels.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !limit) return

        setLoading(true)
        await onAdd({
            card_name: name,
            monthly_limit: parseInt(limit),
            remaining_count: parseInt(limit), // Default to full limit
            hotels: hotels
        })
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="neu-card fade-in" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.2rem' }}>Add New Card</h2>
                {onCancel && (
                    <button type="button" className="neu-btn" onClick={onCancel} style={{ padding: '8px' }}>
                        <X size={18} />
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Card Name</label>
                    <input
                        type="text"
                        className="neu-input"
                        placeholder="e.g. Shinhan The Best"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Monthly Limit</label>
                    <input
                        type="number"
                        className="neu-input"
                        placeholder="e.g. 5"
                        value={limit}
                        onChange={e => setLimit(e.target.value)}
                        min="1"
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Available Hotels</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            className="neu-input"
                            placeholder="Hotel Name"
                            value={hotelInput}
                            onChange={e => setHotelInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddHotel(e)}
                        />
                        <button type="button" className="neu-btn" onClick={handleAddHotel}>
                            <Plus size={20} />
                        </button>
                    </div>

                    {hotels.length > 0 && (
                        <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {hotels.map((h, i) => (
                                <span key={i} className="neu-flat" style={{
                                    fontSize: '0.85rem',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    {h}
                                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeHotel(i)} />
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <button type="submit" className="neu-btn" style={{ width: '100%', color: 'var(--primary-color)' }} disabled={loading}>
                {loading ? 'Saving...' : 'Save Card'}
            </button>
        </form>
    )
}

export default AddCardForm
