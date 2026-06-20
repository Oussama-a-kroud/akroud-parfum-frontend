

import React, { useState } from 'react'
import axios from 'axios'

export default function Admin({ onClose, onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '', inspiration: '', description: '', 
    price30: '', price50: '', price100: '', 
    image: '', category: 'Mixtes 🚻'
  })

  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    axios.post('/api/perfumes', formData)
      .then(response => {
        setMessage('✅ L\'produit tzad bnaja7 b 3 d-l-3barat!')
        setFormData({ name: '', inspiration: '', description: '', price30: '', price50: '', price100: '', image: '', category: 'Mixtes 🚻' })
        if (onProductAdded) onProductAdded()
      })
      .catch(error => {
        console.error("Erreur:", error)
        setMessage('❌ W9e3 mouchkil f l-ajout.')
      })
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold">&times;</button>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">Ajouter un Parfum 💎</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="Smiya dyal Ri7a" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <input required type="text" placeholder="Inspiration" value={formData.inspiration} onChange={(e) => setFormData({...formData, inspiration: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="Lien dyal Tswira" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white">
            <option value="Rjal 🧔">Rjal 🧔</option>
            <option value="3yalat 👩">3yalat 👩</option>
            <option value="Mixtes 🚻">Mixtes 🚻</option>
            <option value="Khachabi 🪵">Khachabi 🪵</option>
          </select>

          <textarea required placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="2" />

          {/* HNA FIN KHAS TKON L-KHEDMA D 3 D'LES PRIX */}
          <div className="grid grid-cols-3 gap-2">
            <input type="number" placeholder="Prix 30ml" onChange={(e) => setFormData({...formData, price30: e.target.value})} className="border p-2 rounded" />
            <input type="number" placeholder="Prix 50ml" onChange={(e) => setFormData({...formData, price50: e.target.value})} className="border p-2 rounded" />
            <input type="number" placeholder="Prix 100ml" onChange={(e) => setFormData({...formData, price100: e.target.value})} className="border p-2 rounded" />
          </div>

          <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg mt-6 hover:bg-gray-800 transition-colors">
            ➕ Zid L'Produit b 3 d'l'3barat
          </button>
        </form>
      </div>
    </div>
  )
}