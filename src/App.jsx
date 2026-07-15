import { useEffect, useState } from 'react'
import axios from 'axios'
import { Canvas } from '@react-three/fiber'
import PerfumeBottle from './PerfumeBottle'
import ReactPixel from 'react-facebook-pixel'
import Admin from './Admin'
import toast, { Toaster } from 'react-hot-toast'

const getImageUrl = (image) => {
  const imageParDefaut = "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop";
  if (!image) return imageParDefaut;
  if (image.startsWith('http') || image.startsWith('/')) return image;
  return '/' + image;
}

// =================================================================
// 1. MODAL DYAL T-TAFASSIL
// =================================================================
const PerfumeDetailsModal = ({ perfume, allPerfumes, ajouterAuPanier, onClose, onOpenDetails }) => {
  const [selectedVariant, setSelectedVariant] = useState(perfume.variants[0]);

  useEffect(() => {
    setSelectedVariant(perfume.variants[0]);
  }, [perfume]);

  const relatedPerfumes = allPerfumes
    .filter(p => p.id !== perfume.id && (p.category === perfume.category || p.inspiration === perfume.inspiration))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] flex justify-center items-end md:items-center p-0 md:p-4" onClick={onClose} dir="rtl">
      <div className="bg-white rounded-t-[2rem] md:rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-[slideUp_0.3s_ease-out] relative pb-6 md:pb-0" onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-3 left-3 md:top-4 md:left-4 bg-gray-100/80 backdrop-blur-md text-gray-600 hover:bg-red-500 hover:text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold transition-colors z-20 shadow-sm">
          &times;
        </button>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gray-50 p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-amber-100/30 to-transparent"></div>
            <img 
              src={getImageUrl(perfume.image)} 
              alt={perfume.name} 
              className="h-48 w-auto md:h-auto md:w-full md:max-w-sm object-cover rounded-xl md:rounded-2xl shadow-lg z-10" 
            />
          </div>
          
          <div className="md:w-1/2 p-5 md:p-8 flex flex-col">
            <div className="uppercase tracking-widest text-[10px] md:text-xs font-bold text-amber-600 mb-1">
              {perfume.category || 'للجنسين 🚻'}
            </div>
            
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-1 md:mb-2 leading-tight text-left w-full" dir="ltr">
              {perfume.name}
            </h2>
            
            <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-6 font-medium">
              مستوحى من: <span className="text-gray-900 border-b border-amber-300 pb-0.5">{perfume.inspiration}</span>
            </p>
            
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-5 md:mb-8 line-clamp-3 md:line-clamp-none">
              {perfume.description}
            </p>
            
            <div className="mt-auto">
              <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">اختر الحجم الذي يناسبك:</h3>
              
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5 md:mb-6">
                {perfume.variants.map(variant => (
                  <button 
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`py-2 px-1 md:py-3 md:px-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${selectedVariant?.id === variant.id ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    <span className="font-extrabold text-xs md:text-sm block">{variant.size}</span>
                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wide mt-0.5 mb-0.5 md:mt-1 md:mb-1 px-1.5 md:px-2 py-0.5 rounded ${selectedVariant?.id === variant.id ? 'bg-amber-200/50 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
                      {variant.type}
                    </span>
                    <span className="text-[10px] md:text-xs font-medium opacity-80 block">{variant.price} درهم</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  ajouterAuPanier(perfume, selectedVariant);
                  onClose(); 
                }}
                className="w-full bg-black text-white py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold text-sm md:text-lg hover:bg-amber-600 transition-all flex justify-between items-center shadow-md active:scale-95"
              >
                <span>🛒 أضف إلى السلة</span>
                <span className="bg-white/20 px-2 py-0.5 md:px-3 md:py-1 rounded-lg mr-auto">
                  {selectedVariant?.price} درهم
                </span>
              </button>
            </div>
          </div>
        </div>

        {relatedPerfumes.length > 0 && (
          <div className="p-5 md:p-8 bg-gray-50 border-t border-gray-100">
            <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <span>🛍️</span> قد يعجبك أيضاً...
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {relatedPerfumes.map(relPerfume => (
                <div 
                  key={relPerfume.id} 
                  onClick={() => onOpenDetails(relPerfume)}
                  className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-400 cursor-pointer transition-all flex items-center gap-3 group"
                >
                  <img src={getImageUrl(relPerfume.image)} alt={relPerfume.name} className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors text-xs md:text-sm text-left w-full" dir="ltr">{relPerfume.name}</h4>
                    <p className="text-[10px] md:text-xs text-gray-500">{relPerfume.variants[0]?.price} درهم</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =================================================================
// 2. L-CARTAT DYAL RWAY7
// =================================================================
const PerfumeCard = ({ perfume, ajouterAuPanier, onOpenDetails }) => {
  const [selectedVariant, setSelectedVariant] = useState(perfume.variants[0]);

  useEffect(() => {
    setSelectedVariant(perfume.variants[0]);
  }, [perfume]);

  if (!perfume.variants || perfume.variants.length === 0) return null;

  return (
    <div id={`perfume-${perfume.id}`} className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col group scroll-mt-24">
      <div 
        className="h-40 md:h-64 w-full overflow-hidden bg-gray-100 relative cursor-pointer"
        onClick={() => onOpenDetails(perfume)}
        title="عرض التفاصيل"
      >
        <img 
          src={getImageUrl(perfume.image)} 
          alt={perfume.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
        />
      </div>

      <div className="p-3 md:p-6 flex-1 flex flex-col">
        <h2 
          className="text-sm md:text-xl font-bold text-gray-900 mb-1 md:mb-2 cursor-pointer hover:text-amber-600 transition-colors text-left w-full truncate"
          dir="ltr"
          onClick={() => onOpenDetails(perfume)}
        >
          {perfume.name}
        </h2>
        
        <p className="text-gray-600 text-[10px] md:text-sm mb-2 md:mb-4 line-clamp-1 md:line-clamp-2">{perfume.description}</p>
        
        <div className="border-t border-gray-100 pt-2 md:pt-5 mt-auto">
          <h3 className="text-[10px] md:text-sm font-bold text-gray-800 mb-1 md:mb-3">اختر الحجم:</h3>
          <select 
            value={selectedVariant?.id}
            onChange={(e) => {
              const variant = perfume.variants.find(v => v.id.toString() === e.target.value);
              setSelectedVariant(variant);
            }}
            className="w-full p-2 md:p-3 rounded-lg md:rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50 font-bold text-xs md:text-base"
          >
            {perfume.variants.map(variant => (
              <option key={variant.id} value={variant.id}>
                {variant.price} درهم - {variant.size} 
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => ajouterAuPanier(perfume, selectedVariant)}
          className="mt-3 md:mt-6 w-full bg-black text-white py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl font-bold hover:bg-amber-600 transition-all flex justify-center md:justify-between items-center gap-1 md:gap-0"
        >
          <span className="text-xs md:text-base">🛒 إضافة</span>
          <span className="hidden md:inline-block bg-white text-black px-2 py-0.5 rounded-lg text-sm mr-auto">
            {selectedVariant?.price} درهم
          </span>
        </button>
      </div>
    </div>
  )
}

// =================================================================
// 3. L-APPLICATION KAMLA
// =================================================================
function App() {
  const [perfumes, setPerfumes] = useState([])
  const [isLoading, setIsLoading] = useState(true) 
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('akroud_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  
  const [selectedPerfumeDetails, setSelectedPerfumeDetails] = useState(null)

  const [clientInfo, setClientInfo] = useState({ nom: '', telephone: '', ville: '' })
  const [paymentMethod, setPaymentMethod] = useState('livraison');
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  
  const [activeCategory, setActiveCategory] = useState('الكل')
  const categoriesList = ['الكل', 'رجال 🧔', 'نساء 👩', 'للجنسين 🚻', 'خشبي 🪵', 'باقات 🎁']

  const poolOfReviews = [
    { id: 'r1', name: 'طارق', rating: 5, comment: 'عطر مركز ويدوم طويلاً. توصيل سريع، تبارك الله عليكم! 🔥', date: 'اليوم' },
    { id: 'r2', name: 'مريم', rating: 5, comment: 'أخذت من عندكم Sauvage، بصراحة مثل الأصلي تماماً، سأبقى دائماً أشتري منكم.', date: 'البارحة' },
    { id: 'r3', name: 'يوسف', rating: 4, comment: 'عطور نقية جداً، تأخرتم علي في التوصيل بيوم ولكن الجودة حاضرة.', date: 'قبل يومين' },
    { id: 'r4', name: 'خديجة', rating: 5, comment: 'تبارك الله عليكم، الرائحة تبقى في الملابس ولا تتغير. سأعيد الشراء أكيد.', date: 'البارحة' },
    { id: 'r5', name: 'أمين', rating: 5, comment: 'وصلتني في الوقت والتغليف جميل جداً. شكراً عكرود للعطور!', date: 'قبل 3 أيام' },
    { id: 'r6', name: 'سارة', rating: 4, comment: 'رائعة جداً، جربت Baccarat rouge ولم تخيبوا ظني.', date: 'هذا الأسبوع' },
    { id: 'r7', name: 'عثمان', rating: 5, comment: 'أحسن جودة! سأقوم بطلب آخر قريباً إن شاء الله.', date: 'اليوم' },
    { id: 'r8', name: 'هدى', rating: 5, comment: 'رائحة ممتازة جداً وثمن مناسب. بالتوفيق!', date: 'قبل يومين' }
  ];

  const [reviews, setReviews] = useState(() => {
    const savedUserReviews = localStorage.getItem('akroud_my_reviews');
    const userReviews = savedUserReviews ? JSON.parse(savedUserReviews) : [];
    const shuffledPool = [...poolOfReviews].sort(() => Math.random() - 0.5);
    const randomDefaults = shuffledPool.slice(0, 3);
    return [...userReviews, ...randomDefaults];
  });
  
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 })

  useEffect(() => {
    localStorage.setItem('akroud_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchPerfumes = () => {
    setIsLoading(true);
    // ⚠️ هنا فين بدلنا الرابط الأول ⚠️
    axios.get('https://orca-app-ziqwp.ondigitalocean.app/api/perfumes')
      .then(response => { 
        setPerfumes(response.data.data);
        setIsLoading(false);
      })
      .catch(error => { 
        console.error("خطأ في جلب العطور:", error);
        setIsLoading(false);
      })
  }

  useEffect(() => { 
    fetchPerfumes();

    // --- إعداد Meta Pixel ---
    const options = {
      autoConfig: true,
      debug: false, 
    };
    ReactPixel.init('1038470972449495', options); // الـ ID ديالك
    ReactPixel.pageView(); // كيسجل أي واحد دخل للسيت
    // ------------------------
  }, [])

  const ajouterAuPanier = (perfume, variant) => {
    const existingItemIndex = cart.findIndex(
      item => item.perfume.id === perfume.id && item.variant.id === variant.id
    )
    if (existingItemIndex > -1) {
      const newCart = [...cart]
      newCart[existingItemIndex].quantite += 1
      setCart(newCart)
    } else {
      setCart([...cart, { perfume, variant, quantite: 1 }])
    }
    toast.success(`تمت إضافة ${perfume.name} إلى السلة! 🛍️`, {
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
      iconTheme: { primary: '#f59e0b', secondary: '#fff' },
    });

    // --- إرسال بيانات السلة لفيسبوك ---
    ReactPixel.track('AddToCart', {
      content_name: perfume.name,
      value: Number(variant.price),
      currency: 'MAD'
    });
  }

  const changerQuantite = (index, action) => {
    const newCart = [...cart]
    if (action === 'plus') {
      newCart[index].quantite += 1
    } else if (action === 'moins') {
      newCart[index].quantite -= 1
      if (newCart[index].quantite === 0) {
        supprimerDuPanier(index)
        return
      }
    }
    setCart(newCart)
  }

  const supprimerDuPanier = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;
    
    const reviewToAdd = { id: Date.now(), name: newReview.name, rating: newReview.rating, comment: newReview.comment, date: 'الآن' };
    
    const savedUserReviews = localStorage.getItem('akroud_my_reviews');
    const oldUserReviews = savedUserReviews ? JSON.parse(savedUserReviews) : [];
    const updatedUserReviews = [reviewToAdd, ...oldUserReviews];
    
    localStorage.setItem('akroud_my_reviews', JSON.stringify(updatedUserReviews));
    setReviews(prevReviews => [reviewToAdd, ...prevReviews]);
    setNewReview({ name: '', comment: '', rating: 5 });
  }

  const prixTotal = cart.reduce((total, item) => total + (Number(item.variant.price) * item.quantite), 0);
  const totalArticles = cart.reduce((total, item) => total + item.quantite, 0);

  const ouvrirAdmin = () => {
    const password = prompt("أدخل كلمة مرور الإدارة 🔒:");
    if (password === "Mnio2009@") { 
      setIsAdminOpen(true);
    } else if (password !== null) {
      alert("كلمة المرور خاطئة! ❌");
    }
  }

  const validerCommande = (e) => {
    e.preventDefault();
    
    const numeroWhatsApp = "212668889156"; 
    const listeRway7 = cart.map(item => `- ${item.perfume.name} [${item.variant.size}] (x${item.quantite}) : ${Number(item.variant.price) * item.quantite} درهم`).join('\n');
    const paiementText = paymentMethod === 'livraison' ? '💵 نقداً (الدفع عند الاستلام)' : '🏦 تحويل بنكي';
    const message = `مرحباً عكرود للعطور! 💎\n\nأود تأكيد طلبي 🛒:\n\n👤 *الاسم:* ${clientInfo.nom}\n📱 *الهاتف:* ${clientInfo.telephone}\n📍 *المدينة:* ${clientInfo.ville}\n💳 *طريقة الدفع:* ${paiementText}\n\n🛍️ *الطلبية:*\n${listeRway7}\n\n💰 *المجموع:* ${prixTotal} درهم\n\nشكراً!`;
    
    const lienWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(message)}`;

    const commandeData = {
      nom: clientInfo.nom, 
      telephone: clientInfo.telephone, 
      ville: clientInfo.ville,
      payment_method: paymentMethod,
      perfumes: cart.map(item => item.perfume.id) 
    };

    const toastId = toast.loading("نأخذك إلى الواتساب الآن... 🚀");

    // طلب واحد لـ API كيجمع كلشي
    axios.post('https://orca-app-ziqwp.ondigitalocean.app/api/commandes', commandeData)
      .then(response => {
        toast.dismiss(toastId);

        // --- إرسال المبيعة (Purchase) لفيسبوك بالثمن الإجمالي ---
        ReactPixel.track('Purchase', {
          value: prixTotal,
          currency: 'MAD'
        });
        // -----------------------------------------------------

        // تنظيف السلة والمعلومات
        setCart([]); 
        setIsCartOpen(false); 
        setClientInfo({ nom: '', telephone: '', ville: '' }); 
        setPaymentMethod('livraison');
        
        // التوجيه للواتساب
        window.location.assign(lienWhatsApp); 
      })
      .catch(error => {
        console.error("Erreur commande:", error);
        toast.dismiss(toastId);
        
        // واخا يوقع مشكل فالسيرفر، كندوزو الكليان للواتساب باش ما تضيعش المبيعة
        setCart([]); 
        setIsCartOpen(false);
        window.location.assign(lienWhatsApp); 
      });
  }
  const filteredPerfumes = perfumes.filter(perfume => {
    const matchSearch = perfume.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        perfume.inspiration.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchQuery.trim().length > 0) {
      return matchSearch;
    }

    const categoryDyalRi7a = (perfume.category || 'Mixtes 🚻').trim().toLowerCase();
    
    let isCategoryMatch = false;
    if (activeCategory === 'الكل') {
      isCategoryMatch = true;
    } else if (activeCategory.includes('رجال') && categoryDyalRi7a.includes('rjal')) {
      isCategoryMatch = true;
    } else if (activeCategory.includes('نساء') && categoryDyalRi7a.includes('3yalat')) {
      isCategoryMatch = true;
    } else if (activeCategory.includes('للجنسين') && categoryDyalRi7a.includes('mixtes')) {
      isCategoryMatch = true;
    } else if (activeCategory.includes('خشبي') && categoryDyalRi7a.includes('khachabi')) {
      isCategoryMatch = true;
    } else if (activeCategory.includes('باقات') && (categoryDyalRi7a.includes('pack') || categoryDyalRi7a.includes('baqa') || categoryDyalRi7a.includes('باقات'))) {
      isCategoryMatch = true;
    }

    return isCategoryMatch;
  })

  const SearchDropdown = () => {
    if (!isSearchFocused || searchQuery.length === 0) return null;
    
    return (
      <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-72 overflow-y-auto animate-[slideDown_0.2s_ease-out]">
        {filteredPerfumes.length === 0 && !isLoading ? (
          <div className="p-4 text-center text-sm text-gray-500">لم نجد أي عطر بهذا الاسم 😔</div>
        ) : (
          filteredPerfumes.slice(0, 5).map(perfume => (
            <div 
              key={perfume.id} 
              onMouseDown={(e) => {
                e.preventDefault(); 
                setSearchQuery(''); 
                setIsSearchFocused(false); 
                
                setSelectedPerfumeDetails(perfume);

                const cat = (perfume.category || '').toLowerCase();
                if (cat.includes('rjal')) setActiveCategory('رجال 🧔');
                else if (cat.includes('3yalat')) setActiveCategory('نساء 👩');
                else if (cat.includes('khachabi')) setActiveCategory('خشبي 🪵');
                else if (cat.includes('pack') || cat.includes('baqa') || cat.includes('باقات')) setActiveCategory('باقات 🎁');
                else setActiveCategory('للجنسين 🚻');
              }}
              className="flex items-center p-3 hover:bg-amber-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
            >
              <img src={getImageUrl(perfume.image)} alt={perfume.name} className="w-12 h-12 rounded-lg object-cover shadow-sm ml-4" />
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm text-left w-full" dir="ltr">{perfume.name}</p>
                <p className="text-xs text-gray-500">مستوحى من: {perfume.inspiration}</p>
              </div>
              <div className="text-left">
                <span className="font-bold text-amber-600 text-sm">{perfume.variants[0]?.price} درهم</span>
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative pb-20 md:pb-0" dir="rtl">
      
      <Toaster position="top-center" reverseOrder={false} />

      {selectedPerfumeDetails && (
        <PerfumeDetailsModal 
          perfume={selectedPerfumeDetails} 
          allPerfumes={perfumes} 
          ajouterAuPanier={ajouterAuPanier} 
          onClose={() => setSelectedPerfumeDetails(null)} 
          onOpenDetails={setSelectedPerfumeDetails} 
        />
      )}
      
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 px-4 py-3 md:py-4" dir="ltr">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-between">
          
          <div 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="text-2xl md:text-3xl font-extrabold text-amber-600 flex items-center cursor-pointer hover:opacity-80 transition-opacity font-sans tracking-tight"
            title="الرئيسية"
          >
            Akroud Parfum
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8 relative" dir="rtl">
            <input 
              type="text" 
              placeholder="🔍 ابحث عن عطرك المفضل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full px-5 py-2.5 rounded-full border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none shadow-sm text-gray-700 font-medium bg-gray-50 hover:bg-white transition-all relative z-50"
            />
            <SearchDropdown />
          </div>

          <div className="hidden md:block" dir="rtl">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-black text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-md"
            >
              <span>🛒 السلة</span>
              {totalArticles > 0 && (
                <span className="bg-amber-500 text-black px-2 py-0.5 rounded-full text-sm font-extrabold">
                  {totalArticles}
                </span>
              )}
            </button>
          </div>
          
        </div>
      </nav>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8 w-full pb-12">
        <div className="w-full h-[280px] md:h-[400px] bg-gradient-to-b from-gray-50 to-gray-200 rounded-3xl mb-8 md:mb-12 shadow-inner border border-gray-200 overflow-hidden cursor-grab active:cursor-grabbing relative">
          <div className="absolute top-4 right-4 z-10 text-[10px] md:text-xs font-bold text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            يمكنك تدوير الزجاجة 👆
          </div>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <PerfumeBottle category={activeCategory} />
          </Canvas>
        </div>

        <div className="mb-6 md:mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-3 min-w-max justify-center md:justify-start">
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-amber-600 text-white shadow-md scale-105' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-400 hover:text-amber-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="md:hidden mb-8 flex justify-center relative z-30">
          <div className="relative w-full max-w-xl">
            <input 
              id="mobile-search"
              type="text" 
              placeholder="🔍 ابحث عن عطرك..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full px-5 py-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none shadow-sm text-gray-700 font-medium bg-white relative z-50"
            />
            <SearchDropdown />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 relative z-0 mb-16">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">💎</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 animate-pulse">يرجى الانتظار...</h3>
              <p className="text-gray-500 mt-2">نحضر أحسن العطور من المتجر 🚚</p>
            </div>
          ) : filteredPerfumes.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <span className="text-5xl block mb-4 opacity-50">👀</span>
              <h3 className="text-xl font-bold text-gray-900">لا يوجد أي عطر حالياً</h3>
              <p className="text-gray-500 mt-2">حاول تغيير الفئة أو التحقق من اسم العطر.</p>
            </div>
          ) : (
            <>
              {filteredPerfumes.slice(0, 6).map(perfume => (
                <PerfumeCard 
                  key={perfume.id} 
                  perfume={perfume} 
                  ajouterAuPanier={ajouterAuPanier} 
                  onOpenDetails={setSelectedPerfumeDetails} 
                />
              ))}

              {filteredPerfumes.length > 0 && (
                <div className="col-span-full bg-white border border-gray-100 py-10 my-4 md:my-8 rounded-3xl shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
                    <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
                      <div className="bg-amber-100 text-amber-600 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">🚚</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">توصيل سريع</h4>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">توصيل سريع حتى باب منزلك في جميع مدن المغرب.</p>
                    </div>
                    <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
                      <div className="bg-amber-100 text-amber-600 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">💵</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">الدفع عند الاستلام</h4>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">ادفع نقداً أو عبر تحويل بنكي عند استلام طلبك براحة تامة.</p>
                    </div>
                    <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
                      <div className="bg-amber-100 text-amber-600 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">⭐</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">جودة مضمونة</h4>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">عطور بجودة عالية، مركزة وتدوم طويلاً.</p>
                    </div>
                  </div>
                </div>
              )}

              {filteredPerfumes.slice(6).map(perfume => (
                <PerfumeCard 
                  key={perfume.id} 
                  perfume={perfume} 
                  ajouterAuPanier={ajouterAuPanier} 
                  onOpenDetails={setSelectedPerfumeDetails} 
                />
              ))}
            </>
          )}
        </div>

        <div className="max-w-4xl mx-auto mt-20 mb-10 px-2 md:px-0 border-t border-gray-200 pt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">تقييمات عملائنا ⭐</h2>
            <p className="text-gray-500">ماذا يقول زبناؤنا عن عكرود للعطور</p>
          </div>

          <form onSubmit={handleSubmitReview} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 mb-12">
            <h3 className="font-bold text-lg mb-6 text-amber-600">✍️ اترك رأيك:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="اسمك الكريم" required value={newReview.name} onChange={(e) => setNewReview({...newReview, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-amber-500" />
              <select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-amber-500">
                <option value="5">⭐⭐⭐⭐⭐ (ممتاز)</option>
                <option value="4">⭐⭐⭐⭐ (جيد جداً)</option>
                <option value="3">⭐⭐⭐ (جيد)</option>
                <option value="2">⭐⭐ (مقبول)</option>
                <option value="1">⭐ (ضعيف)</option>
              </select>
            </div>
            <textarea placeholder="كيف وجدت العطر وخدمتنا؟" required value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-amber-500 mb-4" rows="3"></textarea>
            <button type="submit" className="bg-black text-white font-bold py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors w-full md:w-auto shadow-md">إرسال التقييم</button>
          </form>

          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-start hover:shadow-md transition-shadow">
                <div className="bg-amber-100 text-amber-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{review.date}</span>
                  </div>
                  <div className="text-amber-400 text-sm mb-3">{'⭐'.repeat(review.rating)}</div>
                  <p className="text-gray-700 text-sm leading-relaxed">"{review.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 py-12 mt-auto border-t-4 border-amber-600 pb-28 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
            <div>
              <h3 className="text-2xl font-extrabold text-amber-500 mb-4 font-sans tracking-tight" dir="ltr">Akroud Parfum <span onClick={(e) => { e.stopPropagation(); ouvrirAdmin(); }} className="text-lg md:text-xl cursor-pointer ml-1 relative -top-1 md:-top-2" title="دخول الإدارة">💎</span></h3>
              <p className="text-sm text-gray-400 leading-relaxed">أفضل العطور بجودة عالية وأثمنة مناسبة. اختر عطرك المفضل وسنوصله حتى باب منزلك أينما كنت.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">تواصل معنا</h4>
              <ul className="space-y-3 text-sm flex flex-col items-center md:items-start">
                <li className="flex items-center gap-3"><span className="text-lg">📱</span> <a href="https://wa.me/212668889156" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors font-sans" dir="ltr">+212 6 68 88 91 56</a></li>
                <li className="flex items-center gap-3"><span className="text-lg">📸</span> <a href="https://www.instagram.com/akroud_parfum/" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors font-sans">@akroud_parfum</a></li>
                <li className="flex items-center gap-3"><span className="text-lg">📍</span> أكادير، المغرب</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} عكرود للعطور. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {isCartOpen && (
        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-md z-[70] flex justify-center items-end md:items-center p-0 md:p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-[slideUp_0.3s_ease-out]">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">سلة مشترياتك 🛍️</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-red-500 text-3xl transition-colors">&times;</button>
              </div>
              {cart.length === 0 ? <p className="text-center text-gray-500 py-8">السلة فارغة حالياً.</p> : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-200 gap-4 sm:gap-0">
                        <div className="flex justify-between items-start w-full sm:w-auto">
                          <div>
                            <p className="font-bold text-gray-800 text-sm md:text-base">{item.perfume.name}</p>
                            <p className="text-xs text-gray-500">{item.variant.size} ({item.variant.type})</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-4 border-t sm:border-0 border-gray-200 pt-3 sm:pt-0 mt-1 sm:mt-0">
                          <div className="flex items-center bg-white border rounded-lg overflow-hidden shadow-sm" dir="ltr">
                            <button type="button" onClick={() => changerQuantite(index, 'moins')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition-colors">-</button>
                            <span className="px-3 font-bold text-gray-800 text-sm">{item.quantite}</span>
                            <button type="button" onClick={() => changerQuantite(index, 'plus')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition-colors">+</button>
                          </div>
                          <span className="text-amber-600 font-bold min-w-[70px] text-left text-sm md:text-base mr-auto">{Number(item.variant.price) * item.quantite} درهم</span>
                          <button type="button" onClick={() => supprimerDuPanier(index)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors mr-1">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mb-6">
                    {prixTotal < 100 ? (
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center shadow-sm">
                        <p className="text-amber-800 text-sm font-bold">🎁 أضف <span className="text-amber-600 font-extrabold">{100 - prixTotal} درهم</span> للحصول على <span className="font-extrabold">توصيل مجاني!</span></p>
                        <div className="w-full bg-amber-200 h-2 rounded-full mt-3 overflow-hidden"><div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${(prixTotal / 100) * 100}%` }}></div></div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center shadow-sm"><p className="text-green-800 text-sm font-bold">🎉 مبروك! لقد حصلت على توصيل مجاني!</p></div>
                    )}
                  </div>
                  <div className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-xl mb-6 shadow-md">
                    <span className="font-bold uppercase tracking-wider text-xs md:text-sm">المجموع للدفع:</span>
                    <span className="font-bold text-lg md:text-xl text-amber-400">{prixTotal} درهم</span>
                  </div>
                  <form onSubmit={validerCommande} className="space-y-4 border-t border-gray-100 pt-5">
                    <h3 className="font-bold text-gray-900 mb-3 text-sm md:text-base">معلومات التوصيل:</h3>
                    <div><label className="block text-xs font-medium text-gray-700 mb-1">الاسم الكامل</label><input required type="text" value={clientInfo.nom} onChange={(e) => setClientInfo({...clientInfo, nom: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm" placeholder="مثال: أسامة عكرود"/></div>
                    <div><label className="block text-xs font-medium text-gray-700 mb-1">رقم الهاتف</label><input required type="tel" value={clientInfo.telephone} onChange={(e) => setClientInfo({...clientInfo, telephone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm text-left" placeholder="مثال: 06 00 00 00 00" dir="ltr"/></div>
                    <div><label className="block text-xs font-medium text-gray-700 mb-1">المدينة</label><input required type="text" value={clientInfo.ville} onChange={(e) => setClientInfo({...clientInfo, ville: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm" placeholder="مثال: أكادير"/></div>
                    <div className="mt-5 border-t border-gray-100 pt-5">
                      <h3 className="font-bold text-gray-900 mb-3 text-sm md:text-base">طريقة الدفع:</h3>
                      <div className="space-y-3">
                        <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'livraison' ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <input type="radio" name="payment" value="livraison" checked={paymentMethod === 'livraison'} onChange={() => setPaymentMethod('livraison')} className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300" />
                          <span className="mr-3 font-bold text-sm text-gray-800">💵 نقداً (الدفع عند الاستلام)</span>
                        </label>
                        <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'virement' ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <input type="radio" name="payment" value="virement" checked={paymentMethod === 'virement'} onChange={() => setPaymentMethod('virement')} className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300" />
                          <span className="mr-3 font-bold text-sm text-gray-800">🏦 تحويل بنكي (CIH / Attijari...)</span>
                        </label>
                      </div>
                      {paymentMethod === 'virement' && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 p-4 rounded-xl text-sm animate-[slideDown_0.2s_ease-out]">
                          <p className="font-bold text-blue-900 mb-2">معلومات الحساب (CIH Bank):</p>
                          <p className="text-blue-800">الاسم: <span className="font-bold">Oussama Akroud</span></p>
                          <p className="text-blue-800 mt-1">الـ RIB: <span className="font-bold bg-white px-2 py-1 rounded select-all border border-blue-100 inline-block font-sans" dir="ltr">230 028 4002931211013900 62</span></p>
                          <p className="text-xs text-blue-600 mt-3 flex items-center gap-1"><span>⚠️</span> المرجو إرسال وصل التحويل في الواتساب عند الانتهاء.</p>
                        </div>
                      )}
                    </div>
                    <button type="submit" className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-base hover:bg-amber-700 hover:shadow-lg transition-all mt-4 flex justify-between px-6">
                      <span>تأكيد الطلب</span><span>{prixTotal} درهم</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isAdminOpen && <Admin onClose={() => setIsAdminOpen(false)} onProductAdded={fetchPerfumes} />}

      <div className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75"></div>
        <a href="https://wa.me/212668889156?text=مرحباً%20عكرود%20للعطور،%20لدي%20استفسار..." target="_blank" rel="noreferrer" className="relative bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center group" title="تواصل معنا عبر الواتساب">
          <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
        </a>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 px-6 pt-3 pb-5 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.06)]" dir="rtl">
         <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex flex-col items-center text-gray-500 hover:text-amber-600 transition-colors">
           <span className="text-2xl mb-1">🏠</span>
           <span className="text-[10px] font-bold uppercase tracking-wider">الرئيسية</span>
         </button>
         <button onClick={() => {
             const searchInput = document.getElementById('mobile-search');
             searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
             setTimeout(() => searchInput.focus(), 500);
           }}
           className="flex flex-col items-center text-gray-500 hover:text-amber-600 transition-colors"
         >
           <span className="text-2xl mb-1">🔍</span>
           <span className="text-[10px] font-bold uppercase tracking-wider">بحث</span>
         </button>
         <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center text-amber-600 hover:text-amber-700 transition-colors relative">
           <span className="text-2xl mb-1">🛍️</span>
           <span className="text-[10px] font-bold uppercase tracking-wider">السلة</span>
           {totalArticles > 0 && (
             <span className="absolute -top-1 -left-3 bg-amber-500 text-black px-1.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm">
               {totalArticles}
             </span>
           )}
         </button>
      </div>

    </div>
  )
}

export default App