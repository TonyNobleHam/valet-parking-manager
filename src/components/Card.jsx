import React from 'react'
import { Trash2, CreditCard } from 'lucide-react'

const Card = ({ card, onUse, onUndo, onDelete, onShowHotels }) => {
    return (
        <div className="neu-card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>

            {/* Header */}
            <div
                onClick={() => onShowHotels(card)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
                <div className="neu-btn" style={{ padding: '10px', borderRadius: '50%' }}>
                    <CreditCard size={20} color="var(--primary-color)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{card.card_name}</h3>
            </div>

            {/* Counter - The "Undo" trigger */}
            <div
                onClick={() => onUndo(card)}
                title="Click to restore 1 use"
                className="neu-pressed"
                style={{
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none'
                }}
            >
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Remaining</span>
                <span style={{ fontSize: '3rem', fontWeight: '700', color: card.remaining_count > 0 ? 'var(--primary-color)' : 'var(--danger-color)' }}>
                    {card.remaining_count}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ {card.monthly_limit}</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '16px' }}>
                <button
                    className="neu-btn"
                    onClick={() => onUse(card)}
                    style={{ flex: 1, color: 'var(--primary-color)' }}
                    disabled={card.remaining_count <= 0}
                >
                    Use 1 Ticket
                </button>

                <button
                    className="neu-btn neu-btn-danger"
                    onClick={() => onDelete(card.id)}
                    title="Delete Card"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    )
}

export default Card
