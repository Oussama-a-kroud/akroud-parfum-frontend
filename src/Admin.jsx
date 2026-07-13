import React, { useState } from 'react'
import axios from 'axios'

export default function Admin({ onClose, onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '', inspiration: '', description: '', 
    price30: '', price50: '', price100: '', 
    image: '', category: 'للجنسين 🚻'
  })

  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // ⚠️ هنا فين حطينا الرابط الجديد ديال الباكاند فـ DigitalOcean ⚠️
    axios.post('https://orca-app-ziqwp.ondigitalocean.app/api/perfumes', formData)
      .then(response => {
        setMessage('✅ تم إضافة المنتج بنجاح!')
        setFormData({ name: '', inspiration: '', description: '', price30: '', price50: '', price100: '', image: '', category: 'للجنسين 🚻' })
        if (onProductAdded) onProductAdded()
      })
      .catch(error => {
        console.error("Erreur:", error)
        setMessage('❌ وقع مشكل أثناء الإضافة.')
      })
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-500 hover:text-red-600 text-2xl font-bold">&times;</button>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">إضافة منتج جديد 💎</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="اسم العطر" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <input required type="text" placeholder="مستوحى من" value={formData.inspiration} onChange={(e) => setFormData({...formData, inspiration: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="رابط الصورة" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white">
            <option value="رجال 🧔">رجال 🧔</option>
            <option value="نساء 👩">نساء 👩</option>
            <option value="للجنسين 🚻">للجنسين 🚻</option>
            <option value="خشبي 🪵">خشبي 🪵</option>
            <option value="باقات 🎁">باقات 🎁</option>
          </select>

          <textarea required placeholder="وصف المنتج" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="2" />

          <div className="grid grid-cols-3 gap-2">
            <input type="number" placeholder="ثمن 30ml" onChange={(e) => setFormData({...formData, price30: e.target.value})} className="border p-2 rounded" />
            <input type="number" placeholder="ثمن 50ml" onChange={(e) => setFormData({...formData, price50: e.target.value})} className="border p-2 rounded" />
            <input type="number" placeholder="ثمن 100ml" onChange={(e) => setFormData({...formData, price100: e.target.value})} className="border p-2 rounded" />
          </div>

          <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg mt-6 hover:bg-gray-800 transition-colors">
            ➕ إضافة المنتج
          </button>
          
          {message && <p className={`text-center font-bold mt-4 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        </form>
      </div>
    </div>
  )
}