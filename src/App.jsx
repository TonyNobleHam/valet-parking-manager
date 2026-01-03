import React, { useEffect, useState } from 'react'
import { Plus, LayoutGrid, Settings, LogOut } from 'lucide-react'
import { supabase, isSupabaseConfigured } from './supabaseClient'
import Card from './components/Card'
import AddCardForm from './components/AddCardForm'
import HotelModal from './components/HotelModal'
import Auth from './components/Auth'

function App() {
  const [session, setSession] = useState(null)
  const [cards, setCards] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchCards()
      else setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchCards()
      else setCards([])
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchCards = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('valet_cards')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCards(data)
    } catch (err) {
      console.error('Error fetching cards:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setCards([])
    setSession(null)
  }

  const handleAddCard = async (newCard) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase.from('valet_cards').insert([{
        ...newCard,
        user_id: user.id
      }])

      if (error) throw error
      setShowAddForm(false)
      fetchCards()
    } catch (err) {
      alert('Error adding card: ' + err.message)
    }
  }

  const handleUseCard = async (card) => {
    if (card.remaining_count <= 0) return
    try {
      const { error } = await supabase
        .from('valet_cards')
        .update({ remaining_count: card.remaining_count - 1 })
        .eq('id', card.id)
      if (error) throw error
      fetchCards()
    } catch (err) {
      alert('Error updating card: ' + err.message)
    }
  }

  const handleUndoUse = async (card) => {
    try {
      const { error } = await supabase
        .from('valet_cards')
        .update({ remaining_count: card.remaining_count + 1 })
        .eq('id', card.id)
      if (error) throw error
      fetchCards()
    } catch (err) {
      alert('Error updating card: ' + err.message)
    }
  }

  const handleDeleteCard = async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return
    try {
      const { error } = await supabase.from('valet_cards').delete().eq('id', id)
      if (error) throw error
      fetchCards()
    } catch (err) {
      alert('Error deleting card: ' + err.message)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '20px' }}>
        <div className="neu-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <Settings size={48} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
          <h2>Supabase Not Configured</h2>
          <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
            Please see the README to set up your keys.
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Valet Manager</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!showAddForm && (
            <button className="neu-btn" onClick={() => setShowAddForm(true)}>
              <Plus size={20} /> Add
            </button>
          )}
          <button className="neu-btn" onClick={handleSignOut} title="Sign Out">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {showAddForm && (
        <AddCardForm onAdd={handleAddCard} onCancel={() => setShowAddForm(false)} />
      )}

      {loading && <div className="flex-center" style={{ padding: '40px' }}>Loading...</div>}

      {error && (
        <div className="neu-card" style={{ color: 'var(--danger-color)', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      {!loading && cards.length === 0 && !showAddForm && !error && (
        <div className="flex-center" style={{ flexDirection: 'column', padding: '60px', color: 'var(--text-muted)' }}>
          <LayoutGrid size={48} style={{ opacity: 0.3, marginBottom: '20px' }} />
          <p>No cards found.</p>
          <p style={{ fontSize: '0.8rem' }}>Add a card to get started!</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onUse={handleUseCard}
            onUndo={handleUndoUse}
            onDelete={handleDeleteCard}
            onShowHotels={setSelectedCard}
          />
        ))}
      </div>

      {selectedCard && (
        <HotelModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  )
}

export default App
