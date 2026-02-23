/* ============================================
   MILENIUM CAR - Main App (Public Site)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    loadSettings();
    loadVehicles();
    initFilters();
    initModal();
});

// ============================================
// Navbar
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Move search into mobile menu if opening
            const navSearch = document.querySelector('.nav-search');
            if (navLinks.classList.contains('active')) {
                navLinks.appendChild(navSearch);
            } else {
                navbar.querySelector('.nav-container').insertBefore(navSearch, mobileToggle);
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                // Move search back
                const navSearch = document.querySelector('.nav-search');
                navbar.querySelector('.nav-container').insertBefore(navSearch, mobileToggle);
            });
        });
    }
}

// ============================================
// Load Settings into Page
// ============================================
function loadSettings() {
    const settings = getSettings();

    // Hero
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) heroTitle.innerHTML = settings.heroTitle;

    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle) heroSubtitle.textContent = settings.heroSubtitle;

    // Hero Banner Image
    const heroBg = document.querySelector('.hero-bg');
    const heroVideo = document.getElementById('heroVideo');
    const heroVideoYt = document.getElementById('heroVideoYt');

    // Check if there's a banner video
    if (settings.heroBannerVideo && settings.heroBannerVideo.trim() !== '') {
        const videoUrl = settings.heroBannerVideo.trim();
        const ytId = getYouTubeId(videoUrl);

        if (ytId) {
            // YouTube video background
            if (heroVideoYt) {
                heroVideoYt.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3&playsinline=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                heroVideoYt.style.display = 'block';
            }
            if (heroVideo) heroVideo.style.display = 'none';
            if (heroBg) heroBg.style.display = 'none';
        } else {
            // Direct video (MP4, WebM, base64)
            if (heroVideo) {
                heroVideo.src = videoUrl;
                heroVideo.style.display = 'block';
            }
            if (heroVideoYt) heroVideoYt.style.display = 'none';
            if (heroBg) heroBg.style.display = 'none';
        }
    } else {
        // No video, use image banner
        if (heroVideo) heroVideo.style.display = 'none';
        if (heroVideoYt) heroVideoYt.style.display = 'none';
        if (heroBg && settings.heroBanner) {
            heroBg.style.display = 'block';
            heroBg.style.backgroundImage = `url('${settings.heroBanner}')`;
            heroBg.style.backgroundSize = 'cover';
            heroBg.style.backgroundPosition = 'center';
        }
    }

    // Stats
    const statVeiculos = document.getElementById('statVeiculos');
    if (statVeiculos) statVeiculos.textContent = settings.statVeiculos;

    const statClientes = document.getElementById('statClientes');
    if (statClientes) statClientes.textContent = settings.statClientes;

    const statAnos = document.getElementById('statAnos');
    if (statAnos) statAnos.textContent = settings.statAnos;



    // Contact
    const contactWhatsapp = document.getElementById('contactWhatsapp');
    if (contactWhatsapp) contactWhatsapp.textContent = settings.whatsappDisplay;

    const contactWhatsappLink = document.getElementById('contactWhatsappLink');
    if (contactWhatsappLink) contactWhatsappLink.href = `https://wa.me/${settings.whatsapp}`;

    const contactTelefone = document.getElementById('contactTelefone');
    if (contactTelefone) contactTelefone.textContent = settings.telefone;

    const contactTelefoneLink = document.getElementById('contactTelefoneLink');
    if (contactTelefoneLink) contactTelefoneLink.href = `tel:${settings.telefoneLink}`;

    const contactEndereco = document.getElementById('contactEndereco');
    if (contactEndereco) contactEndereco.textContent = settings.endereco;

    const contactMapLink = document.getElementById('contactMapLink');
    if (contactMapLink) contactMapLink.href = settings.mapLink;

    const contactHorario = document.getElementById('contactHorario');
    if (contactHorario) contactHorario.textContent = settings.horario;

    // Top Bar contacts
    const topWhatsappDisplay = document.getElementById('topWhatsappDisplay');
    if (topWhatsappDisplay) topWhatsappDisplay.textContent = settings.whatsappDisplay;

    const topWhatsappLink = document.getElementById('topWhatsappLink');
    if (topWhatsappLink) topWhatsappLink.href = `https://wa.me/${settings.whatsapp}`;

    const topEndereco = document.getElementById('topEndereco');
    if (topEndereco) topEndereco.textContent = settings.endereco;

    const topTelefone = document.getElementById('topTelefone');
    if (topTelefone) topTelefone.textContent = settings.telefone;

    const topTelefoneLink = document.getElementById('topTelefoneLink');
    if (topTelefoneLink) topTelefoneLink.href = `tel:${settings.telefoneLink}`;

    const topHorario = document.getElementById('topHorario');
    if (topHorario) topHorario.textContent = settings.horario;

    // Social (top bar + footer)
    const socialInstagram = document.getElementById('socialInstagram');
    if (socialInstagram) socialInstagram.href = settings.instagram;

    const socialFacebook = document.getElementById('socialFacebook');
    if (socialFacebook) socialFacebook.href = settings.facebook;

    const footerInstagram = document.getElementById('footerInstagram');
    if (footerInstagram) footerInstagram.href = settings.instagram;

    const footerFacebook = document.getElementById('footerFacebook');
    if (footerFacebook) footerFacebook.href = settings.facebook;

    // WhatsApp float
    const whatsappFloat = document.getElementById('whatsappFloat');
    if (whatsappFloat) whatsappFloat.href = `https://wa.me/${settings.whatsapp}`;

    const heroWhatsapp = document.getElementById('heroWhatsapp');
    if (heroWhatsapp) heroWhatsapp.href = `https://wa.me/${settings.whatsapp}`;

    // Footer
    const footerText = document.getElementById('footerText');
    if (footerText) footerText.textContent = settings.footerText;

    // About image
    const aboutImg = document.querySelector('.about-section .about-image img');
    if (aboutImg && settings.aboutImage) {
        aboutImg.src = settings.aboutImage;
    }

    // Apply Colors (CSS Variables)
    document.documentElement.style.setProperty('--primary', settings.primaryColor || '#1a1a1a');
    document.documentElement.style.setProperty('--accent', settings.accentColor || '#d4a017');
    document.documentElement.style.setProperty('--bg-light', settings.bgLight || '#f5f7fa');
    document.documentElement.style.setProperty('--text-dark', settings.textDark || '#1a1a2e');

    // Logo Visuals
    const logoIcons = document.querySelectorAll('.logo i');
    logoIcons.forEach(icon => {
        icon.style.color = settings.logoIconColor || settings.accentColor || '#d4a017';
    });

    const logoAccents = document.querySelectorAll('.logo .accent');
    logoAccents.forEach(accent => {
        accent.style.color = settings.accentColor || '#d4a017';
    });

    // Apply Logo Image (from admin settings, overrides default)
    const logoImgs = document.querySelectorAll('.logo .logo-img');
    if (settings.logoImage) {
        logoImgs.forEach(img => {
            img.src = settings.logoImage;
            img.alt = 'Millenium Veículos';
        });
    }

    // Apply Logo Size
    const logoSize = settings.logoSize || '85';
    logoImgs.forEach(img => {
        img.style.maxHeight = logoSize + 'px';
        img.style.maxWidth = (parseInt(logoSize) * 3) + 'px';
        img.style.width = 'auto';
        img.style.height = 'auto';
    });

    // iOS/Browser fix for spaces in filenames and missing images
    logoImgs.forEach(img => {
        img.onerror = function () {
            if (this.src.includes(' ')) {
                this.src = this.src.replace(/ /g, '%20');
            } else if (!this.src.includes('data:image')) {
                console.log('Logo error, using fallback');
                this.src = 'imagens/logos%20millenium/1.png';
            }
            this.onerror = null; // prevents infinite loop
        };
    });

    // Apply Custom Background
    if (settings.customBg) {
        document.body.style.backgroundImage = `url("${settings.customBg}")`;
        document.body.classList.add('has-custom-bg');
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    } else {
        document.body.style.backgroundImage = 'none';
        document.body.classList.remove('has-custom-bg');
    }

    // Apply Favicon
    if (settings.favicon) {
        let favicon = document.querySelector('link[rel="shortcut icon"]');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'shortcut icon';
            document.head.appendChild(favicon);
        }
        favicon.href = settings.favicon;

        let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (!appleIcon) {
            appleIcon = document.createElement('link');
            appleIcon.rel = 'apple-touch-icon';
            document.head.appendChild(appleIcon);
        }
        appleIcon.href = settings.favicon;
    }

    // Apply SEO Settings
    if (settings.metaTitle) document.title = settings.metaTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && settings.metaDescription) metaDesc.content = settings.metaDescription;

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && settings.metaKeywords) metaKeywords.content = settings.metaKeywords;

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && settings.canonicalUrl) canonical.href = settings.canonicalUrl;

    // Apply OG SEO
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && settings.metaTitle) ogTitle.content = settings.metaTitle;

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && settings.metaDescription) ogDesc.content = settings.metaDescription;

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && settings.ogImage) ogImage.content = settings.ogImage;

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl && settings.canonicalUrl) ogUrl.content = settings.canonicalUrl;

    // Apply Twitter SEO
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle && settings.metaTitle) twTitle.content = settings.metaTitle;

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc && settings.metaDescription) twDesc.content = settings.metaDescription;

    const twImage = document.querySelector('meta[name="twitter:image"]');
    if (twImage && settings.ogImage) twImage.content = settings.ogImage;

    const twUrl = document.querySelector('meta[name="twitter:url"]');
    if (twUrl && settings.canonicalUrl) twUrl.content = settings.canonicalUrl;

    // Nav search functionality
    const navSearchInput = document.getElementById('navSearchInput');
    const navSearchBtn = document.getElementById('navSearchBtn');
    if (navSearchBtn && navSearchInput) {
        const handleSearch = () => {
            const query = navSearchInput.value.trim();
            if (!query) return;

            // Secret admin access
            if (query.toLowerCase() === 'admin') {
                navSearchInput.value = '';
                window.location.href = 'admin.html';
                return;
            }

            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = query;
                searchInput.dispatchEvent(new Event('input'));
                document.getElementById('veiculos').scrollIntoView({ behavior: 'smooth' });
            }
        };
        navSearchBtn.addEventListener('click', handleSearch);
        navSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
}

// ============================================
// Load & Render Vehicles
// ============================================
function loadVehicles() {
    const vehicles = getVehicles();
    renderVehicles(vehicles);
    populateFilters(vehicles);
}

function renderVehicles(vehicles) {
    const grid = document.getElementById('vehiclesGrid');
    const noResults = document.getElementById('noResults');
    if (!grid) return;

    if (vehicles.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    const settings = getSettings();
    const whatsapp = settings.whatsapp;

    grid.innerHTML = vehicles.map((v, index) => {
        const message = encodeURIComponent(`Olá, tenho interesse no veículo: ${v.marca} ${v.modelo} - ${formatPrice(v.preco)}`);
        const waLink = `https://wa.me/${whatsapp}?text=${message}`;
        const hasVideo = v.video && v.video.trim() !== '';
        const coverImg = (v.imagens && v.imagens.length > 0) ? v.imagens[0] : v.imagem;
        const imgCount = (v.imagens && v.imagens.length > 1) ? v.imagens.length : 0;

        return `
            <div class="vehicle-card" onclick="openVehicleModal(${v.id})">
                <div class="vehicle-card-image">
                    <img src="${coverImg}" alt="${v.marca} ${v.modelo}" loading="lazy">
                    ${hasVideo ? '<div class="vehicle-video-badge" title="Este veículo possui vídeo"><i class="fas fa-play-circle"></i></div>' : ''}
                    ${imgCount > 0 ? `<div class="vehicle-images-count"><i class="fas fa-camera"></i> ${imgCount}</div>` : ''}
                    <div class="vehicle-ribbon"></div>
                </div>
                <div class="vehicle-card-body">
                    <h3 class="vehicle-card-title">${v.marca} - ${v.modelo}</h3>
                    <p class="vehicle-card-subtitle">${v.descricao.substring(0, 60)}${v.descricao.length > 60 ? '...' : ''}</p>
                    <span class="vehicle-card-price">${formatPrice(v.preco)}</span>
                    
                    <div class="vehicle-card-specs">
                        <span><i class="fas fa-tachometer-alt"></i> ${formatKm(v.km)}</span>
                        <span><i class="fas fa-cog"></i> ${v.cambio}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${v.ano}</span>
                        <span><i class="fas fa-gas-pump"></i> ${v.combustivel}</span>
                    </div>
                </div>
                <a href="${waLink}" class="vehicle-card-whatsapp" onclick="event.stopPropagation()" target="_blank">
                    Whatsapp <i class="fab fa-whatsapp"></i>
                </a>
            </div>
        `;
    }).join('');
}

// ============================================
// Filters
// ============================================
function populateFilters(vehicles) {
    const filterMarca = document.getElementById('filterMarca');
    const filterAno = document.getElementById('filterAno');
    if (!filterMarca || !filterAno) return;

    // Get unique brands
    const marcas = [...new Set(vehicles.map(v => v.marca))].sort();
    filterMarca.innerHTML = '<option value="">Todas as Marcas</option>' +
        marcas.map(m => `<option value="${m}">${m}</option>`).join('');

    // Get unique years
    const anos = [...new Set(vehicles.map(v => v.ano))].sort((a, b) => b - a);
    filterAno.innerHTML = '<option value="">Todos os Anos</option>' +
        anos.map(a => `<option value="${a}">${a}</option>`).join('');
}

function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterMarca = document.getElementById('filterMarca');
    const filterAno = document.getElementById('filterAno');
    const filterPreco = document.getElementById('filterPreco');

    if (!searchInput) return;

    const applyFilters = () => {
        let vehicles = getVehicles();
        const search = searchInput.value.toLowerCase().trim();
        const marca = filterMarca.value;
        const ano = filterAno.value;
        const preco = filterPreco.value;

        if (search) {
            // Secret admin access via main search
            if (search === 'admin') {
                searchInput.value = '';
                window.location.href = 'admin.html';
                return;
            }

            vehicles = vehicles.filter(v =>
                `${v.marca} ${v.modelo}`.toLowerCase().includes(search) ||
                v.cor.toLowerCase().includes(search)
            );
        }

        if (marca) {
            vehicles = vehicles.filter(v => v.marca === marca);
        }

        if (ano) {
            vehicles = vehicles.filter(v => v.ano === parseInt(ano));
        }

        if (preco) {
            const [min, max] = preco.split('-').map(Number);
            vehicles = vehicles.filter(v => v.preco >= min && v.preco <= max);
        }

        renderVehicles(vehicles);
    };

    searchInput.addEventListener('input', applyFilters);
    filterMarca.addEventListener('change', applyFilters);
    filterAno.addEventListener('change', applyFilters);
    filterPreco.addEventListener('change', applyFilters);
}

// ============================================
// Vehicle Modal
// ============================================
function initModal() {
    const modal = document.getElementById('vehicleModal');
    const closeBtn = document.getElementById('modalClose');

    if (!modal || !closeBtn) return;

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

let modalGalleryImages = [];
let modalGalleryIndex = 0;

function openVehicleModal(id) {
    const vehicle = getVehicleById(id);
    if (!vehicle) return;

    const settings = getSettings();
    const modal = document.getElementById('vehicleModal');

    // Build images array (backward compat)
    if (vehicle.imagens && vehicle.imagens.length > 0) {
        modalGalleryImages = [...vehicle.imagens];
    } else {
        modalGalleryImages = [vehicle.imagem];
    }
    modalGalleryIndex = 0;

    // Set main image
    setModalGalleryImage(0);

    // Gallery arrows
    const prevBtn = document.getElementById('modalGalleryPrev');
    const nextBtn = document.getElementById('modalGalleryNext');
    const counter = document.getElementById('modalGalleryCounter');

    if (modalGalleryImages.length > 1) {
        if (prevBtn) { prevBtn.style.display = 'flex'; prevBtn.onclick = () => setModalGalleryImage(modalGalleryIndex - 1); }
        if (nextBtn) { nextBtn.style.display = 'flex'; nextBtn.onclick = () => setModalGalleryImage(modalGalleryIndex + 1); }
        if (counter) counter.style.display = 'block';
    } else {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (counter) counter.style.display = 'none';
    }

    // Render thumbnails
    const thumbsContainer = document.getElementById('modalThumbnails');
    if (thumbsContainer) {
        if (modalGalleryImages.length > 1) {
            thumbsContainer.innerHTML = modalGalleryImages.map((img, i) =>
                `<img src="${img}" alt="Foto ${i + 1}" class="modal-thumb ${i === 0 ? 'active' : ''}" onclick="setModalGalleryImage(${i})">`
            ).join('');
            thumbsContainer.style.display = 'flex';
        } else {
            thumbsContainer.innerHTML = '';
            thumbsContainer.style.display = 'none';
        }
    }

    document.getElementById('modalBadge').textContent = vehicle.tipo;
    document.getElementById('modalTitle').textContent = `${vehicle.marca} ${vehicle.modelo}`;
    document.getElementById('modalPrice').textContent = formatPrice(vehicle.preco);
    document.getElementById('modalAno').textContent = vehicle.ano;
    document.getElementById('modalKm').textContent = formatKm(vehicle.km);
    document.getElementById('modalCombustivel').textContent = vehicle.combustivel;
    document.getElementById('modalCambio').textContent = vehicle.cambio;
    document.getElementById('modalCor').textContent = vehicle.cor;
    document.getElementById('modalDescricao').textContent = vehicle.descricao;

    // Handle video in modal
    const videoContainer = document.getElementById('modalVideoContainer');
    if (videoContainer) {
        if (vehicle.video && vehicle.video.trim() !== '') {
            const ytId = getYouTubeId(vehicle.video);
            if (ytId) {
                videoContainer.innerHTML = `<iframe width="100%" height="320" src="https://www.youtube.com/embed/${ytId}" frameborder="0" allowfullscreen style="border-radius: 12px;"></iframe>`;
            } else {
                videoContainer.innerHTML = `<video width="100%" height="320" controls style="border-radius: 12px; background: #000;"><source src="${vehicle.video}">Seu navegador não suporta vídeos.</video>`;
            }
            videoContainer.style.display = 'block';
        } else {
            videoContainer.innerHTML = '';
            videoContainer.style.display = 'none';
        }
    }

    const whatsappMsg = encodeURIComponent(`Olá! Tenho interesse no ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} - ${formatPrice(vehicle.preco)}`);
    document.getElementById('modalWhatsapp').href = `https://wa.me/${settings.whatsapp}?text=${whatsappMsg}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function setModalGalleryImage(index) {
    if (index < 0) index = modalGalleryImages.length - 1;
    if (index >= modalGalleryImages.length) index = 0;
    modalGalleryIndex = index;

    const mainImg = document.getElementById('modalImage');
    if (mainImg) {
        mainImg.src = modalGalleryImages[index];
        mainImg.alt = `Imagem ${index + 1}`;
    }

    const counter = document.getElementById('modalGalleryCounter');
    if (counter) {
        counter.textContent = `${index + 1} / ${modalGalleryImages.length}`;
    }

    // Update thumbnail active state
    const thumbs = document.querySelectorAll('.modal-thumb');
    thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === index);
    });
}

// ============================================
// Secret Admin Shortcuts
// ============================================
let logoClicks = 0;
document.addEventListener('DOMContentLoaded', () => {
    const footerLogo = document.querySelector('.footer .logo');
    if (footerLogo) {
        footerLogo.addEventListener('click', (e) => {
            e.preventDefault();
            logoClicks++;
            if (logoClicks === 5) {
                window.location.href = 'admin.html';
                logoClicks = 0;
            }
            setTimeout(() => { logoClicks = 0; }, 5000); // Reset after 5s
        });
    }
});

// ============================================
// Utility Functions
// ============================================
function formatPrice(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function formatKm(km) {
    return new Intl.NumberFormat('pt-BR').format(km) + ' km';
}

// ============================================
// PWA Install Logic
// ============================================
let deferredPrompt;
const pwaPrompt = document.getElementById('pwaInstallPrompt');
const installBtn = document.getElementById('pwaInstallBtn');
const closeBtn = document.getElementById('pwaInstallClose');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;

    // Check if user has already dismissed it in this session
    if (sessionStorage.getItem('pwa_prompt_dismissed') !== 'true') {
        setTimeout(() => {
            if (pwaPrompt) pwaPrompt.classList.add('show');
        }, 5000); // Show after 5s
    }
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again
        deferredPrompt = null;
        // Hide our custom UI
        if (pwaPrompt) pwaPrompt.classList.remove('show');
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (pwaPrompt) pwaPrompt.classList.remove('show');
        sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    });
}

window.addEventListener('appinstalled', () => {
    // Clear the deferredPrompt so it can't be used twice
    deferredPrompt = null;
    // Hide our custom UI
    if (pwaPrompt) pwaPrompt.classList.remove('show');
    console.log('PWA was installed');
});
