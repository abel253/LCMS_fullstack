<!-- app/pages/index.vue -->
<script setup lang="ts">
<<<<<<< HEAD
import { ref, onMounted, onUnmounted } from 'vue'

// Assets Imports
import img11 from '~/assets/images/library11.jpg'
import img12 from '~/assets/images/library12.jpg'
import img1 from '~/assets/images/library1.avif'
import img2 from '~/assets/images/library2.avif'
import img4 from '~/assets/images/library4.avif'
import missionImg from '~/assets/images/librarymis.png'
import visionImg from '~/assets/images/libraryvisi.png'

useHead({
  title: 'Home | Mekdela Amba University Library',
  meta: [
    {
      name: 'description',
      content: 'Official Portal of Mekdela Amba University Library Circulation & Research System',
    },
  ],
})

interface Stats {
  students: number
  books: number
  research: number
}

const stats = ref<Stats>({
  students: 0,
  books: 0,
  research: 0,
})

const loading = ref(false)

// Hero Quick Search
const searchQuery = ref('')
const searchFilter = ref('title')

const handleHeroSearch = () => {
  if (!searchQuery.value.trim()) return
  navigateTo({
    path: '/search',
    query: { q: searchQuery.value, filter: searchFilter.value },
  })
}

// Background Carousel Images (100% Clear)
const slides = [
  {
    image: img11,
    subtitle: 'The official heart of academic excellence at Mekdela Amba University.',
  },
  {
    image: img12,
    subtitle: 'High-speed digital research terminals and global database connectivity.',
  },
  {
    image: img1,
    subtitle: 'Naturally lit, spacious reading halls designed for focused research.',
  },
  {
    image: img2,
    subtitle: 'Extensive reference books, local research papers, and graduation theses.',
  },
  {
    image: img4,
    subtitle: 'Technology-equipped academic center empowering knowledge 24/7.',
  },
]

const currentSlide = ref(0)
let slideTimer: any = null

const startTimer = () => {
  slideTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 4500)
}

// Featured / Trending Books
const featuredBooks = [
  {
    title: 'Fundamentals of Software Engineering',
    author: 'Ian Sommerville',
    category: 'Computer Science',
    shelf: 'CS-302',
    status: 'Available',
    color: 'bg-blue-600',
  },
  {
    title: 'Principles of Internal Medicine',
    author: 'Harrison',
    category: 'Health Sciences',
    shelf: 'MED-110',
    status: 'Available',
    color: 'bg-emerald-600',
  },
  {
    title: 'Structural Analysis & Design',
    author: 'R.C. Hibbeler',
    category: 'Civil Engineering',
    shelf: 'ENG-204',
    status: 'Available',
    color: 'bg-amber-600',
  },
  {
    title: 'Research Methodology & Analytics',
    author: 'C.R. Kothari',
    category: 'General Research',
    shelf: 'RES-015',
    status: 'Reference Only',
    color: 'bg-indigo-600',
  },
]

// Announcements / Notices
const notices = [
  {
    tag: 'Notice',
    date: 'Current Term',
    title: 'Extended Evening Hours for Final Exam Study',
    desc: 'The Central Library main hall is open until 10:00 PM on weekdays.',
  },
  {
    tag: 'E-Resources',
    date: 'New Access',
    title: 'Free Campus Access to IEEE & JSTOR Databases',
    desc: 'Connect to campus Wi-Fi for free full-text download of scientific journals.',
  },
  {
    tag: 'Workshop',
    date: 'Upcoming',
    title: 'Digital Reference & Citation Training for Students',
    desc: 'Hands-on session on Mendeley and APA citations in the ICT room.',
  },
]

onMounted(async () => {
  startTimer()
  loading.value = true
  try {
    const res: any = await $fetch('/api/stats')
    if (res.success) {
      stats.value = {
        students: res.data?.students || 1250,
        books: res.data?.books || 4500,
        research: res.data?.research || 320,
      }
    }
  } catch (error) {
    stats.value = {
      students: 1250,
      books: 4500,
      research: 320,
    }
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (slideTimer) clearInterval(slideTimer)
})
</script>

<template>
  <div class="home-main-container">
    
    <!-- ══════════════════════════════════════════════════════
         1. HERO SECTION WITH INSTANT SEARCH & STATUS
         ══════════════════════════════════════════════════════ -->
    <section class="hero-clean-section">
      
      <!-- Pure Clear Carousel (NO Overlay/Filter) -->
      <div class="slider-backgrounds">
        <div 
          v-for="(slide, index) in slides" 
          :key="index"
          class="slide-bg-item"
          :class="{ 'active-slide': currentSlide === index }"
          :style="{ backgroundImage: `url(${slide.image})` }"
        ></div>
      </div>

      <!-- Hero Body -->
      <div class="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[78vh] lg:min-h-[85vh] text-center py-12">
        
        <!-- Live Operating Status Pill -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-5 shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Library Open Now</span>
          <span class="text-white/40">|</span>
          <span class="text-amber-300 font-normal">Mon - Sat: 8:00 AM – 10:00 PM</span>
        </div>

        <!-- Main Title -->
        <h1 class="hero-heading">
          Knowledge is the <br />
          <span class="text-amber-400">Gateway to the Future</span>
        </h1>

        <!-- Subtitle -->
        <transition name="fade" mode="out-in">
          <p :key="currentSlide" class="hero-subtext">
            {{ slides[currentSlide].subtitle }}
          </p>
        </transition>

        <!-- Embedded Interactive Search Bar -->
        <div class="hero-search-wrapper w-full max-w-3xl">
          <form @submit.prevent="handleHeroSearch" class="hero-search-bar">
            <!-- Filter Dropdown -->
            <select v-model="searchFilter" class="search-select">
              <option value="title">By Title</option>
              <option value="author">By Author</option>
              <option value="subject">By Subject</option>
              <option value="isbn">By ISBN</option>
            </select>

            <!-- Text Input -->
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search thousands of books, theses, shelf numbers..." 
              class="search-input"
            />

            <!-- Search Button -->
            <button type="submit" class="search-submit-btn">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search Catalog</span>
            </button>
          </form>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         2. LIVE STATS STRIP
         ══════════════════════════════════════════════════════ -->
    <section class="stats-outer-container container mx-auto px-4 lg:px-8">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        
        <div class="stat-card border-b-4 border-b-[#01ACF2]">
          <div class="stat-icon-wrap bg-sky-50 text-[#01ACF2]">📚</div>
          <div>
            <h3 class="stat-num">{{ stats.books }}+</h3>
            <p class="stat-label">Academic Books</p>
          </div>
        </div>

        <div class="stat-card border-b-4 border-b-indigo-500">
          <div class="stat-icon-wrap bg-indigo-50 text-indigo-600">📁</div>
          <div>
            <h3 class="stat-num">{{ stats.research }}+</h3>
            <p class="stat-label">Research Papers</p>
          </div>
        </div>

        <div class="stat-card border-b-4 border-b-amber-500">
          <div class="stat-icon-wrap bg-amber-50 text-amber-600">🎓</div>
          <div>
            <h3 class="stat-num">{{ stats.students }}+</h3>
            <p class="stat-label">Active Students</p>
          </div>
        </div>

        <div class="stat-card border-b-4 border-b-emerald-500">
          <div class="stat-icon-wrap bg-emerald-50 text-emerald-600">🌐</div>
          <div>
            <h3 class="stat-num">24/7</h3>
            <p class="stat-label">Digital Access</p>
          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         3. QUICK E-SERVICES GRID (አዳዲስ ፈጣን አገልግሎቶች)
         ══════════════════════════════════════════════════════ -->
    <section class="container mx-auto px-4 lg:px-8 py-16">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <span class="text-xs uppercase tracking-widest font-bold text-[#01ACF2]">Student & Staff Hub</span>
          <h2 class="text-2xl lg:text-3xl font-serif font-bold text-slate-800 mt-1">Core Library E-Services</h2>
        </div>
        <p class="text-slate-500 text-sm max-w-md mt-2 md:mt-0">Direct access to online tools, academic repositories, and study room facilities.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <NuxtLink to="/search" class="service-box group">
          <div class="service-icon-circle bg-sky-50 text-[#01ACF2] group-hover:bg-[#01ACF2] group-hover:text-white transition-all">
            🔍
          </div>
          <h3 class="service-title">OPAC Catalog</h3>
          <p class="service-desc">Find book titles, shelf call numbers, and real-time physical availability.</p>
          <span class="service-action-link">Search Books →</span>
        </NuxtLink>

        <NuxtLink to="/research" class="service-box group">
          <div class="service-icon-circle bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
            📑
          </div>
          <h3 class="service-title">Thesis Repository</h3>
          <p class="service-desc">Access graduation research papers submitted by MAU faculty & senior students.</p>
          <span class="service-action-link">Browse Theses →</span>
        </NuxtLink>

        <div class="service-box group">
          <div class="service-icon-circle bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
            🌐
          </div>
          <h3 class="service-title">E-Journals & JSTOR</h3>
          <p class="service-desc">Download international peer-reviewed journals via the university network.</p>
          <span class="service-action-link">Open Databases →</span>
        </div>

        <NuxtLink to="/auth" class="service-box group">
          <div class="service-icon-circle bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            🔄
          </div>
          <h3 class="service-title">Book Renewal</h3>
          <p class="service-desc">Log into the Student Portal to check your due dates and request loan renewals.</p>
          <span class="service-action-link">My Portal →</span>
        </NuxtLink>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         4. FEATURED & TRENDING ACADEMIC BOOKS
         ══════════════════════════════════════════════════════ -->
    <section class="bg-slate-50 border-y border-slate-200/80 py-16">
      <div class="container mx-auto px-4 lg:px-8">
        
        <div class="flex items-center justify-between mb-10">
          <div>
            <span class="text-xs uppercase tracking-widest font-bold text-amber-600">Fresh Stacks</span>
            <h2 class="text-2xl lg:text-3xl font-serif font-bold text-slate-800 mt-1">Featured Academic Books</h2>
          </div>
          <NuxtLink to="/search" class="text-xs font-bold text-[#01ACF2] hover:underline hidden sm:inline-block">
            View All Catalog →
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="book in featuredBooks" :key="book.title" class="book-card group">
            
            <!-- Book Spine Accent -->
            <div :class="['h-2 w-full rounded-t-xl', book.color]"></div>
            
            <div class="p-5 flex flex-col justify-between h-[calc(100%-8px)]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ book.category }}</span>
                <h4 class="font-bold text-slate-800 text-sm mt-1 leading-snug group-hover:text-[#01ACF2] transition-colors">
                  {{ book.title }}
                </h4>
                <p class="text-xs text-slate-500 mt-1 italic">By {{ book.author }}</p>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  📍 Shelf {{ book.shelf }}
                </span>
                <span class="text-[11px] font-bold text-emerald-600">
                  {{ book.status }}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         5. MISSION & VISION (የተልዕኮና ራዕይ ምስሎችን ያካተተ ክፍል)
         ══════════════════════════════════════════════════════ -->
    <section class="container mx-auto px-4 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        <!-- Mission Card -->
        <div class="mission-vision-card">
          <div class="flex items-center gap-4 mb-4">
            <img :src="missionImg" alt="Library Mission" class="w-14 h-14 object-contain rounded-xl p-2 bg-blue-50 border border-blue-100" />
            <div>
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#01ACF2]">Our Purpose</span>
              <h3 class="text-xl font-serif font-bold text-slate-800">Library Mission</h3>
            </div>
          </div>
          <p class="text-slate-600 text-sm leading-relaxed">
            To provide high-quality information resources, dynamic research support, and accessible physical and digital spaces that empower students, faculty, and researchers to achieve academic excellence and community impact.
          </p>
        </div>

        <!-- Vision Card -->
        <div class="mission-vision-card">
          <div class="flex items-center gap-4 mb-4">
            <img :src="visionImg" alt="Library Vision" class="w-14 h-14 object-contain rounded-xl p-2 bg-amber-50 border border-amber-100" />
            <div>
              <span class="text-[10px] font-bold uppercase tracking-widest text-amber-600">Our Future</span>
              <h3 class="text-xl font-serif font-bold text-slate-800">Library Vision</h3>
            </div>
          </div>
          <p class="text-slate-600 text-sm leading-relaxed">
            To be a leading center of intellectual discovery and innovation in Ethiopia, recognized for its comprehensive digital repository, modern automation, and inspiring learning environment.
          </p>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         6. THE BORROWING JOURNEY (3-Step Physical Flow)
         ══════════════════════════════════════════════════════ -->
    <section class="container mx-auto px-4 lg:px-8 py-12">
      <div class="text-center max-w-xl mx-auto mb-12">
        <span class="text-xs uppercase tracking-widest font-bold text-[#01ACF2]">Simple Process</span>
        <h2 class="text-2xl lg:text-3xl font-serif font-bold text-slate-800 mt-1">The Borrowing Journey</h2>
        <p class="text-slate-500 text-sm mt-1">From finding the shelf to finalizing at the circulation desk.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        
        <div class="journey-card group">
          <div class="j-step-num">01</div>
          <div class="j-icon">📍</div>
          <h4 class="font-bold text-slate-800 text-base group-hover:text-[#01ACF2] transition-colors">Locate on Shelf</h4>
          <p class="text-xs text-slate-500 mt-2 leading-relaxed">Search the OPAC catalog, note the Call and Shelf number, and retrieve your book from the stacks.</p>
        </div>

        <div class="journey-card group">
          <div class="j-step-num">02</div>
          <div class="j-icon">🪪</div>
          <h4 class="font-bold text-slate-800 text-base group-hover:text-[#01ACF2] transition-colors">Present MAU ID</h4>
          <p class="text-xs text-slate-500 mt-2 leading-relaxed">Bring your chosen book to the Circulation Desk along with your valid Student ID.</p>
        </div>

        <div class="journey-card group">
          <div class="j-step-num">03</div>
          <div class="j-icon">✍️</div>
          <h4 class="font-bold text-slate-800 text-base group-hover:text-[#01ACF2] transition-colors">Physical Signature</h4>
          <p class="text-xs text-slate-500 mt-2 leading-relaxed">Sign the circulation book log and finalize checkout into the university database.</p>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         7. NOTICES & DIGITAL REPOSITORY DUAL SECTION
         ══════════════════════════════════════════════════════ -->
    <section class="container mx-auto px-4 lg:px-8 pb-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Announcements & Notices -->
        <div class="lg:col-span-6 bg-white p-6 lg:p-8 rounded-2xl border border-slate-200">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
              <span>📢</span> Campus Library Notices
            </h3>
            <span class="text-xs text-slate-400 font-semibold">Updates</span>
          </div>

          <div class="space-y-4">
            <div v-for="(n, idx) in notices" :key="idx" class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-sky-300 transition-colors">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-[#0072b2] uppercase">{{ n.tag }}</span>
                <span class="text-[11px] text-slate-400">{{ n.date }}</span>
              </div>
              <h5 class="text-xs font-bold text-slate-800">{{ n.title }}</h5>
              <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">{{ n.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Right: Digital Research Repository Box -->
        <div class="lg:col-span-6 research-highlight-box flex flex-col justify-between">
          <div>
            <span class="inline-block px-3 py-1 bg-white/20 text-white rounded text-xs font-semibold uppercase tracking-wider mb-3">
              Institutional Repository
            </span>
            <h3 class="text-2xl font-serif font-bold text-white mb-2">
              Digital Student & Faculty Research
            </h3>
            <p class="text-blue-100 text-sm leading-relaxed mb-6">
              Currently, over <strong class="text-amber-300 font-bold">{{ stats.research }} research papers</strong>, senior projects, and academic journals are cataloged. Read abstracts and full references to enrich your research.
            </p>
          </div>

          <div class="flex items-center justify-between pt-6 border-t border-white/20">
            <div>
              <div class="text-4xl font-extrabold text-amber-300">{{ stats.research }}+</div>
              <span class="text-xs text-blue-100 uppercase tracking-wider font-medium">Digital Papers</span>
            </div>
            <NuxtLink to="/research" class="research-cta-link">
              Explore Repository →
            </NuxtLink>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
.home-main-container {
  background-color: #fafbfc;
  color: #1e293b;
  overflow-x: hidden;
}

/* ═══════════════════════════════════════════
   1. HERO CLEAN SLIDER & SEARCH BAR
   ═══════════════════════════════════════════ */
.hero-clean-section {
  position: relative;
  overflow: hidden;
  background-color: #0b2545;
}

.slider-backgrounds {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.slide-bg-item {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1);
  transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 6s ease-out;
}

.slide-bg-item.active-slide {
  opacity: 1;
  transform: scale(1.05);
}

.hero-heading {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 3.5rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.75), 0 1px 3px rgba(0, 0, 0, 0.9);
}

.hero-subtext {
  font-size: 1.2rem;
  font-weight: 500;
  color: #ffffff;
  max-width: 650px;
  margin: 0 auto 2.25rem;
  line-height: 1.6;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.9);
}

/* Glassmorphism Interactive Search Bar */
.hero-search-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  padding: 0.4rem 0.5rem 0.4rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.search-select {
  background: transparent;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0b2545;
  outline: none;
  cursor: pointer;
  padding-right: 0.5rem;
  border-right: 1px solid #cbd5e1;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.9rem;
  color: #0f172a;
  padding: 0.5rem 0.75rem;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-submit-btn {
  background-color: #01acf2;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.search-submit-btn:hover {
  background-color: #008ecc;
  transform: translateY(-1px);
}

/* ═══════════════════════════════════════════
   2. STATS STRIP
   ═══════════════════════════════════════════ */
.stats-outer-container {
  margin-top: -3rem;
  position: relative;
  z-index: 20;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-num {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0b2545;
  line-height: 1.1;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  margin-top: 0.25rem;
}

/* ═══════════════════════════════════════════
   3. CORE E-SERVICES GRID
   ═══════════════════════════════════════════ */
.service-box {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  padding: 1.75rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.service-box:hover {
  transform: translateY(-4px);
  border-color: #01acf2;
}

.service-icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
}

.service-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0b2545;
  margin-bottom: 0.4rem;
}

.service-desc {
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.service-action-link {
  font-size: 0.75rem;
  font-weight: 700;
  color: #01acf2;
}

/* ═══════════════════════════════════════════
   4. FEATURED BOOKS
   ═══════════════════════════════════════════ */
.book-card {
  background: #ffffff;
  border-radius: 0.85rem;
  border: 1px solid #e2e8f0;
  height: 180px;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.book-card:hover {
  transform: translateY(-3px);
  border-color: #01acf2;
}

/* ═══════════════════════════════════════════
   5. MISSION & VISION CARDS
   ═══════════════════════════════════════════ */
.mission-vision-card {
  background-color: #ffffff;
  border-radius: 1.25rem;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  transition: border-color 0.3s ease;
}

.mission-vision-card:hover {
  border-color: #cbd5e1;
}

/* ═══════════════════════════════════════════
   6. BORROWING JOURNEY CARDS
   ═══════════════════════════════════════════ */
.journey-card {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  padding: 2rem 1.75rem;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.journey-card:hover {
  transform: translateY(-4px);
  border-color: #01acf2;
}

.j-step-num {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  font-size: 2.5rem;
  font-weight: 800;
  color: #f1f5f9;
  line-height: 1;
}

.j-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

/* ═══════════════════════════════════════════
   7. RESEARCH HIGHLIGHT BOX
   ═══════════════════════════════════════════ */
.research-highlight-box {
  background: linear-gradient(135deg, #006ea6 0%, #0194d3 50%, #01acf2 100%);
  border-radius: 1.25rem;
  padding: 2.5rem;
  border: 1px solid #0284c7;
  min-height: 340px;
}

.research-cta-link {
  display: inline-block;
  background-color: #ffffff;
  color: #0072b2;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.75rem 1.75rem;
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.25s ease;
}

.research-cta-link:hover {
  background-color: #fef3c7;
  color: #b45309;
  transform: translateY(-2px);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .hero-heading {
    font-size: 2.35rem;
  }
  .hero-subtext {
    font-size: 1rem;
  }
  .stats-outer-container {
    margin-top: 1.5rem;
  }
  .hero-search-bar {
    flex-direction: column;
    border-radius: 1.25rem;
    padding: 0.75rem;
  }
  .search-select {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    width: 100%;
    padding-bottom: 0.4rem;
  }
  .search-submit-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
=======
// ✅ ወዲያውኑ ወደ /search ቀይር
await navigateTo('/search')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
    <div class="text-center">
      <div class="text-6xl mb-4">📚</div>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">MAU Library System</h1>
      <p class="text-gray-600">Redirecting to search...</p>
    </div>
  </div>
</template>
>>>>>>> 446808d0c07d20c161d39a68e37dbdc45c63dad9
