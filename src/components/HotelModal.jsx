import React, { useEffect } from 'react'
import { X, MapPin } from 'lucide-react'

const HotelModal = ({ card, onClose }) => {
    if (!card) return null

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    const hotels = card.hotels || []

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(224, 229, 236, 0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={onClose}>
            <div
                className="neu-card"
                style={{ width: '90%', maxWidth: '400px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.4rem' }}>{card.card_name} Hotels</h2>
                    <button className="neu-btn" onClick={onClose} style={{ padding: '8px' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="neu-pressed" style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
                    {hotels.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hotels listed.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {hotels.map((hotel, index) => (
                                <li key={index} style={{
                                    padding: '12px',
                                    borderBottom: index < hotels.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <MapPin size={16} color="var(--primary-color)" />
                                    {hotel}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HotelModal
