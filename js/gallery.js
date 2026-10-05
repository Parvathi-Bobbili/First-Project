/**
 * ===================================================================
 * 🌸 PHOTO MEMORIES GALLERY FOR LEELA SURYA KUMARI
 * 📸 One-By-One Polaroid Spotlight, Slideshow, Lightbox & Auto-Save
 * ===================================================================
 */

// 1. Photo Collection Configuration with unique emotional captions
const DEFAULT_PHOTOS = [
  {
    id: 1,
    src: 'assets/photos/photo1.jpg',
    defaultCaption: 'Akka\'s radiant smile & traditional grace — bringing pure sunshine into our family 💖',
    date: '08-Aug-2025 • Pure Elegance'
  },
  {
    id: 2,
    src: 'assets/photos/photo2.jpg',
    defaultCaption: 'Sweet sisterhood moments & laughter that no distance or time can ever change 👭',
    date: 'Forever Bond • Pure Joy'
  },
  {
    id: 3,
    src: 'assets/photos/photo3.jpg',
    defaultCaption: 'That gentle, calming glow and warm kindness that makes everyone feel loved ✨',
    date: 'Akka\'s Charm • Golden Days'
  },
  {
    id: 4,
    src: 'assets/photos/photo4.jpg',
    defaultCaption: 'Intricate mehndi, festive beauty, and the best elder sister and mentor in the world 🌸',
    date: 'Special Celebration • Love'
  },
  {
    id: 5,
    src: 'assets/photos/photo5.jpg',
    defaultCaption: 'Cherished family celebrations together — our greatest moments are always by your side 💐',
    date: 'Beautiful Memories • Festive'
  },
  {
    id: 6,
    src: 'assets/photos/photo6.jpg',
    defaultCaption: 'Looking majestic in vibrant lehenga — forever our graceful, inspiring princess Akka 👑',
    date: 'Princess Akka • Radiant'
  }
];

// LocalStorage Keys
const STORAGE_CAPTIONS_KEY = 'leela_bday_gallery_captions_v3';
const STORAGE_CUSTOM_PHOTOS_KEY = 'leela_bday_custom_photos';

class PolaroidGallery {
  constructor() {
    this.photos = [];
    this.currentMemoryIndex = 0; // 0..photos.length-1 for photos, photos.length for finale message
    this.currentLightboxIndex = 0;
    
    // Slideshow state
    this.isAutoPlaying = false;
    this.slideshowTimer = null;
    this.progressInterval = null;
    this.slideshowDuration = 4500; // 4.5 seconds per memory
    this.progressTime = 0;

    // DOM Elements - Stage Spotlight
    this.stageWrapper = document.getElementById('memoryStage');
    this.stagePhoto = document.getElementById('stageRealPhoto');
    this.stageCaption = document.getElementById('stageCaption');
    this.stageDate = document.getElementById('stageDate');
    this.stageCounter = document.getElementById('stageCounter');
    this.stageViewport = document.getElementById('stageViewport');
    this.stageFooter = document.getElementById('stageFooter');
    this.stageFinaleCard = document.getElementById('stageFinaleCard');
    this.stagePrevBtn = document.getElementById('stagePrevBtn');
    this.stageNextBtn = document.getElementById('stageNextBtn');
    this.stagePlayBtn = document.getElementById('stagePlayBtn');
    this.stageProgressBar = document.getElementById('stageProgressBar');
    this.stageDotsContainer = document.getElementById('stageDots');
    this.finaleReplayBtn = document.getElementById('finaleReplayBtn');

    // DOM Elements - Lightbox
    this.lightboxModal = document.getElementById('lightboxModal');
    this.lightboxImg = document.getElementById('lightboxImg');
    this.lightboxCaption = document.getElementById('lightboxCaption');
    this.lightboxCounter = document.getElementById('lightboxCounter');
    this.lightboxClose = document.getElementById('lightboxClose');
    this.lightboxPrev = document.getElementById('lightboxPrev');
    this.lightboxNext = document.getElementById('lightboxNext');

    // DOM Elements - Grid & Add Photo
    this.gridContainer = document.getElementById('polaroidGrid');
    this.addPhotoInput = document.getElementById('addPhotoInput');

    this.init();
  }

  init() {
    this.loadPhotos();
    this.renderStageDots();
    this.renderMemoryStage('fade');
    this.renderGrid();
    this.bindEvents();
  }

  // Load photos combined with custom additions and saved captions
  loadPhotos() {
    const savedCaptions = JSON.parse(localStorage.getItem(STORAGE_CAPTIONS_KEY) || '{}');
    const customPhotos = JSON.parse(localStorage.getItem(STORAGE_CUSTOM_PHOTOS_KEY) || '[]');
    
    const allPhotos = [...DEFAULT_PHOTOS, ...customPhotos];

    this.photos = allPhotos.map(photo => ({
      ...photo,
      caption: savedCaptions[photo.id] || photo.defaultCaption
    }));
  }

  // Save caption for a photo to localStorage
  saveCaption(id, newCaption) {
    const savedCaptions = JSON.parse(localStorage.getItem(STORAGE_CAPTIONS_KEY) || '{}');
    savedCaptions[id] = newCaption.trim();
    localStorage.setItem(STORAGE_CAPTIONS_KEY, JSON.stringify(savedCaptions));

    const photo = this.photos.find(p => p.id === id);
    if (photo) photo.caption = newCaption.trim();

    // Show temporary saved indicator
    const savedElem = document.getElementById(`stageSavedIndicator`);
    if (savedElem) {
      savedElem.style.display = 'inline-block';
      setTimeout(() => { savedElem.style.display = 'none'; }, 2000);
    }
  }

  // Render One-by-One Memory Stage
  renderMemoryStage(direction = 'next') {
    if (!this.stageWrapper) return;

    const isFinale = this.currentMemoryIndex >= this.photos.length;

    // Reset animation classes
    this.stageViewport.classList.remove('anim-slide-next', 'anim-slide-prev', 'anim-fade-zoom');
    void this.stageViewport.offsetWidth; // Trigger reflow

    if (isFinale) {
      // Show Finale Card after 6th photo
      if (this.stageViewport) this.stageViewport.style.display = 'none';
      if (this.stageFooter) this.stageFooter.style.display = 'none';
      if (this.stageFinaleCard) this.stageFinaleCard.classList.add('active');

      if (this.stageCounter) {
        this.stageCounter.innerHTML = 'Special Message for Akka ❤️';
      }

      // Stop slideshow on finale
      this.pauseSlideshow();

      // Trigger celebratory love burst
      if (typeof window.triggerSurpriseCelebration === 'function') {
        window.triggerSurpriseCelebration();
      }
    } else {
      // Show Real Photograph inside Polaroid Frame
      const currentPhoto = this.photos[this.currentMemoryIndex];

      if (this.stageFinaleCard) this.stageFinaleCard.classList.remove('active');
      if (this.stageViewport) this.stageViewport.style.display = 'flex';
      if (this.stageFooter) this.stageFooter.style.display = 'block';

      // Load real photo
      this.stagePhoto.src = currentPhoto.src;
      this.stagePhoto.alt = currentPhoto.caption;

      // Handle image error retry
      this.stagePhoto.onerror = () => {
        window.handlePhotoError(this.stagePhoto, currentPhoto.src);
      };

      // Set caption and metadata
      this.stageCaption.innerText = currentPhoto.caption;
      this.stageCaption.dataset.id = currentPhoto.id;
      this.stageDate.innerHTML = `<span>📅 ${this.escapeHtml(currentPhoto.date || 'Cherished Memory')}</span> <span id="stageSavedIndicator" style="display:none; color:#10b981; font-weight:700;">✓ Saved</span>`;

      // Memory counter: "Memory 1 of 6"
      if (this.stageCounter) {
        this.stageCounter.innerHTML = `Memory ${this.currentMemoryIndex + 1} of ${this.photos.length} 💗`;
      }

      // Add smooth transition animation
      if (direction === 'next') {
        this.stageViewport.classList.add('anim-slide-next');
      } else if (direction === 'prev') {
        this.stageViewport.classList.add('anim-slide-prev');
      } else {
        this.stageViewport.classList.add('anim-fade-zoom');
      }
    }

    this.updateActiveDot();
  }

  // Render navigation dots for direct memory jumping
  renderStageDots() {
    if (!this.stageDotsContainer) return;
    this.stageDotsContainer.innerHTML = '';

    // Dots for each photo
    this.photos.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'stage-dot';
      dot.title = `Jump to Memory ${i + 1}`;
      dot.type = 'button';
      dot.addEventListener('click', () => {
        this.goToMemory(i);
      });
      this.stageDotsContainer.appendChild(dot);
    });

    // Special dot for the Finale message card
    const finaleDot = document.createElement('button');
    finaleDot.className = 'stage-dot finale-dot';
    finaleDot.title = 'Special Message for Akka ❤️';
    finaleDot.type = 'button';
    finaleDot.addEventListener('click', () => {
      this.goToMemory(this.photos.length);
    });
    this.stageDotsContainer.appendChild(finaleDot);
  }

  updateActiveDot() {
    if (!this.stageDotsContainer) return;
    const dots = this.stageDotsContainer.querySelectorAll('.stage-dot');
    dots.forEach((dot, idx) => {
      if (idx === this.currentMemoryIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Next Memory
  nextMemory() {
    if (this.currentMemoryIndex < this.photos.length) {
      this.currentMemoryIndex++;
    } else {
      this.currentMemoryIndex = 0; // loop back to first photo
    }
    this.renderMemoryStage('next');
    this.resetProgress();
  }

  // Previous Memory
  prevMemory() {
    if (this.currentMemoryIndex > 0) {
      this.currentMemoryIndex--;
    } else {
      this.currentMemoryIndex = this.photos.length; // jump to finale
    }
    this.renderMemoryStage('prev');
    this.resetProgress();
  }

  // Direct Jump
  goToMemory(index) {
    const dir = index >= this.currentMemoryIndex ? 'next' : 'prev';
    this.currentMemoryIndex = index;
    this.renderMemoryStage(dir);
    this.resetProgress();
  }

  // Automatic Slideshow Controls
  toggleSlideshow() {
    if (this.isAutoPlaying) {
      this.pauseSlideshow();
    } else {
      this.startSlideshow();
    }
  }

  startSlideshow() {
    this.isAutoPlaying = true;
    if (this.stagePlayBtn) {
      this.stagePlayBtn.innerHTML = '<span>⏸</span> Pause Slideshow';
      this.stagePlayBtn.classList.add('primary');
    }
    this.runProgress();
  }

  pauseSlideshow() {
    this.isAutoPlaying = false;
    clearInterval(this.progressInterval);
    if (this.stagePlayBtn) {
      this.stagePlayBtn.innerHTML = '<span>▶</span> Play Slideshow';
      this.stagePlayBtn.classList.remove('primary');
    }
    if (this.stageProgressBar) {
      this.stageProgressBar.style.width = '0%';
    }
  }

  resetProgress() {
    this.progressTime = 0;
    if (this.stageProgressBar) {
      this.stageProgressBar.style.width = '0%';
    }
    if (this.isAutoPlaying) {
      clearInterval(this.progressInterval);
      this.runProgress();
    }
  }

  runProgress() {
    clearInterval(this.progressInterval);
    const step = 50;
    this.progressInterval = setInterval(() => {
      if (!this.isAutoPlaying) {
        clearInterval(this.progressInterval);
        return;
      }
      this.progressTime += step;
      const pct = Math.min((this.progressTime / this.slideshowDuration) * 100, 100);
      if (this.stageProgressBar) {
        this.stageProgressBar.style.width = `${pct}%`;
      }

      if (this.progressTime >= this.slideshowDuration) {
        this.progressTime = 0;
        this.nextMemory();
      }
    }, step);
  }

  // Optional Full Grid View
  renderGrid() {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = '';

    this.photos.forEach((photo, index) => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.dataset.index = index;

      card.innerHTML = `
        <div class="polaroid-tape"></div>
        <div class="polaroid-photo-wrapper">
          <img 
            src="${photo.src}" 
            alt="Leela Surya Kumari Photo ${photo.id}" 
            loading="lazy"
            onerror="window.handlePhotoError(this, '${photo.src}')"
          />
          <div class="polaroid-view-overlay">
            <span class="polaroid-view-badge">🔍 Click to Enlarge</span>
          </div>
        </div>
        <div class="polaroid-footer">
          <div class="polaroid-caption-wrapper">
            <div 
              class="polaroid-caption" 
              contenteditable="true" 
              spellcheck="false"
              title="Click to edit caption"
              data-id="${photo.id}"
            >${this.escapeHtml(photo.caption)}</div>
            <span class="caption-edit-indicator" title="Editable caption">✏️</span>
          </div>
          <div class="polaroid-meta">
            <span>${this.escapeHtml(photo.date || 'Memories')}</span>
            <span class="saved-indicator" id="saved-indicator-${photo.id}">✓ Saved</span>
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.polaroid-caption') || e.target.closest('.caption-edit-indicator')) {
          return;
        }
        this.openLightbox(index);
      });

      const captionElem = card.querySelector('.polaroid-caption');
      captionElem.addEventListener('blur', () => {
        this.saveCaption(photo.id, captionElem.innerText);
        if (this.currentMemoryIndex === index) {
          this.stageCaption.innerText = captionElem.innerText;
        }
      });
      captionElem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          captionElem.blur();
        }
      });

      this.gridContainer.appendChild(card);
    });
  }

  // Lightbox Modal for Enlarge View
  openLightbox(index) {
    if (!this.photos[index]) return;
    this.currentLightboxIndex = index;
    const photo = this.photos[index];

    this.lightboxImg.src = photo.src;
    this.lightboxImg.alt = photo.caption;
    this.lightboxCaption.innerText = photo.caption;
    this.lightboxCaption.dataset.id = photo.id;
    this.lightboxCounter.innerText = `Memory ${index + 1} of ${this.photos.length}`;

    this.lightboxImg.onerror = () => {
      window.handlePhotoError(this.lightboxImg, photo.src);
    };

    this.lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  prevLightboxPhoto() {
    let nextIndex = this.currentLightboxIndex - 1;
    if (nextIndex < 0) nextIndex = this.photos.length - 1;
    this.openLightbox(nextIndex);
  }

  nextLightboxPhoto() {
    let nextIndex = this.currentLightboxIndex + 1;
    if (nextIndex >= this.photos.length) nextIndex = 0;
    this.openLightbox(nextIndex);
  }

  // Bind All Event Listeners
  bindEvents() {
    // Stage navigation
    if (this.stagePrevBtn) {
      this.stagePrevBtn.addEventListener('click', () => this.prevMemory());
    }
    if (this.stageNextBtn) {
      this.stageNextBtn.addEventListener('click', () => this.nextMemory());
    }
    if (this.stagePlayBtn) {
      this.stagePlayBtn.addEventListener('click', () => this.toggleSlideshow());
    }
    if (this.finaleReplayBtn) {
      this.finaleReplayBtn.addEventListener('click', () => this.goToMemory(0));
    }

    // Click photo in stage to enlarge
    if (this.stageViewport) {
      this.stageViewport.addEventListener('click', (e) => {
        if (this.currentMemoryIndex < this.photos.length) {
          this.openLightbox(this.currentMemoryIndex);
        }
      });
    }

    // Editable caption on stage
    if (this.stageCaption) {
      this.stageCaption.addEventListener('blur', () => {
        const id = parseInt(this.stageCaption.dataset.id, 10);
        this.saveCaption(id, this.stageCaption.innerText);
        this.renderGrid();
      });
      this.stageCaption.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.stageCaption.blur();
        }
      });
    }

    // Lightbox events
    if (this.lightboxClose) {
      this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    }
    if (this.lightboxPrev) {
      this.lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prevLightboxPhoto();
      });
    }
    if (this.lightboxNext) {
      this.lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextLightboxPhoto();
      });
    }
    if (this.lightboxModal) {
      this.lightboxModal.addEventListener('click', (e) => {
        if (e.target === this.lightboxModal) this.closeLightbox();
      });
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (this.lightboxModal.classList.contains('active')) {
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.prevLightboxPhoto();
        if (e.key === 'ArrowRight') this.nextLightboxPhoto();
      } else {
        if (e.key === 'ArrowLeft') this.prevMemory();
        if (e.key === 'ArrowRight') this.nextMemory();
      }
    });

    // File input for adding photos
    if (this.addPhotoInput) {
      this.addPhotoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const customPhotos = JSON.parse(localStorage.getItem(STORAGE_CUSTOM_PHOTOS_KEY) || '[]');
          const newPhoto = {
            id: Date.now(),
            src: event.target.result,
            defaultCaption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            date: 'Added Today'
          };
          customPhotos.push(newPhoto);
          localStorage.setItem(STORAGE_CUSTOM_PHOTOS_KEY, JSON.stringify(customPhotos));
          
          this.loadPhotos();
          this.renderStageDots();
          this.goToMemory(this.photos.length - 1);
          this.renderGrid();
          alert('Photo added to memories! You can also copy files into assets/photos/.');
        };
        reader.readAsDataURL(file);
      });
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Global Photo Error Handler with smart alias retry
window.handlePhotoError = function(imgElement, originalSrc) {
  const altMap = {
    'photo1.jpg': 'First photo.jpeg',
    'photo2.jpg': 'Second photo.jpeg',
    'photo3.jpg': 'Third photo.jpeg',
    'photo4.jpg': 'Fourth photo.jpeg',
    'photo5.jpg': 'Fifth photo.jpeg',
    'photo6.jpg': 'Sixth photo.jpeg',
    'First photo.jpeg': 'photo1.jpg',
    'Second photo.jpeg': 'photo2.jpg',
    'Third photo.jpeg': 'photo3.jpg',
    'Fourth photo.jpeg': 'photo4.jpg',
    'Fifth photo.jpeg': 'photo5.jpg',
    'Sixth photo.jpeg': 'photo6.jpg'
  };

  const fileName = decodeURIComponent(originalSrc.split('/').pop());
  if (altMap[fileName] && !imgElement.dataset.retried) {
    imgElement.dataset.retried = 'true';
    imgElement.src = 'assets/photos/' + altMap[fileName];
    return;
  }

  const wrapper = imgElement.parentElement;
  if (!wrapper) return;

  wrapper.innerHTML = `
    <div class="polaroid-placeholder">
      <span class="placeholder-icon">📸</span>
      <div class="placeholder-filename">${fileName}</div>
      <p class="placeholder-hint">Copy this photo to<br><code>assets/photos/${fileName}</code></p>
    </div>
  `;
};

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.birthdayGallery = new PolaroidGallery();
});
