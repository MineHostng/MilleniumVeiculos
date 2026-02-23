/* ============================================
   MILENIUM CAR - Admin Panel Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initLogin();
    initNavigation();
    initVehicleForm();
    initSettingsForms();
    initAccountForm();
    initVehicleImageUploads();
    initVideoPreview();
    initBannerPreview();
    initAboutPreview();
    initOgPreview();
});

// Global array to hold current vehicle images
let vehicleImages = [];

// ============================================
// Authentication
// ============================================
function checkAuth() {
    if (isAdminLoggedIn()) {
        showAdminPanel();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
    loadDashboard();
    loadVehiclesTable();
    loadSettingsForm();
    loadAccountForm();
}

function initLogin() {
    const form = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUser').value.trim();
        const password = document.getElementById('loginPass').value;

        if (loginAdmin(username, password)) {
            errorEl.style.display = 'none';
            showAdminPanel();
        } else {
            errorEl.style.display = 'flex';
            form.querySelector('input[type="password"]').value = '';
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logoutAdmin();
        showLoginScreen();
        showToast('Você saiu do painel.', 'success');
    });
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav a[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            switchSection(section);
        });
    });
}

function switchSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));

    // Show target section
    const target = document.getElementById(`section-${sectionId}`);
    if (target) target.classList.add('active');

    // Update nav active state
    document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
    const activeLink = document.querySelector(`.admin-nav a[data-section="${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Refresh data if needed
    if (sectionId === 'dashboard') loadDashboard();
    if (sectionId === 'vehicles') loadVehiclesTable();
}

// ============================================
// Dashboard
// ============================================
function loadDashboard() {
    const vehicles = getVehicles();

    document.getElementById('dashTotalVeiculos').textContent = vehicles.length;
    document.getElementById('dashDestaques').textContent = vehicles.filter(v => v.destaque).length;
    document.getElementById('dashMarcas').textContent = new Set(vehicles.map(v => v.marca)).size;

    if (vehicles.length > 0) {
        const avg = vehicles.reduce((sum, v) => sum + v.preco, 0) / vehicles.length;
        document.getElementById('dashPrecoMedio').textContent = formatPrice(avg);
    }

    // Recent vehicles table
    const recentTable = document.getElementById('dashRecentTable');
    const recent = vehicles.slice(-5).reverse();
    recentTable.innerHTML = recent.map(v => `
        <tr>
            <td>
                <div class="car-info">
                    <img class="car-thumb" src="${v.imagem}" alt="${v.marca} ${v.modelo}">
                    <div>
                        <div class="car-name">${v.marca} ${v.modelo}</div>
                    </div>
                </div>
            </td>
            <td>${v.ano}</td>
            <td>${formatPrice(v.preco)}</td>
            <td><span class="vehicle-card-badge" style="position:static;">${v.tipo}</span></td>
            <td>
                <div class="table-actions">
                    <button onclick="editVehicle(${v.id})" title="Editar"><i class="fas fa-pen"></i></button>
                    <button class="delete" onclick="confirmDelete(${v.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ============================================
// Vehicles Table
// ============================================
function loadVehiclesTable() {
    const vehicles = getVehicles();
    const tbody = document.getElementById('vehiclesTableBody');
    const countEl = document.getElementById('vehicleCount');
    if (countEl) countEl.textContent = vehicles.length;

    tbody.innerHTML = vehicles.map(v => `
        <tr>
            <td>
                <div class="car-info">
                    <img class="car-thumb" src="${v.imagem}" alt="${v.marca} ${v.modelo}">
                    <div>
                        <div class="car-name">${v.marca} ${v.modelo}</div>
                        <div style="font-size:0.78rem;color:var(--text-muted)">${v.cor}</div>
                    </div>
                </div>
            </td>
            <td>${v.ano}</td>
            <td>${formatKm(v.km)}</td>
            <td>${formatPrice(v.preco)}</td>
            <td><span class="vehicle-card-badge" style="position:static;">${v.tipo}</span></td>
            <td>
                <div class="table-actions">
                    <button onclick="editVehicle(${v.id})" title="Editar"><i class="fas fa-pen"></i></button>
                    <button class="delete" onclick="confirmDelete(${v.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ============================================
// Vehicle Form (Add / Edit)
// ============================================
function initVehicleForm() {
    const form = document.getElementById('vehicleForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (vehicleImages.length === 0) {
            showToast('Adicione pelo menos uma imagem!', 'error');
            return;
        }

        const vehicleData = {
            marca: document.getElementById('vMarca').value.trim(),
            modelo: document.getElementById('vModelo').value.trim(),
            slug: document.getElementById('vSlug').value.trim(),
            ano: parseInt(document.getElementById('vAno').value),
            preco: parseFloat(document.getElementById('vPreco').value),
            km: parseInt(document.getElementById('vKm').value) || 0,
            combustivel: document.getElementById('vCombustivel').value,
            cambio: document.getElementById('vCambio').value,
            cor: document.getElementById('vCor').value.trim() || 'Não informada',
            tipo: document.getElementById('vTipo').value,
            destaque: document.getElementById('vDestaque').value === 'true',
            imagem: vehicleImages[0],
            imagens: [...vehicleImages],
            video: document.getElementById('vVideo').value.trim(),
            descricao: document.getElementById('vDescricao').value.trim(),
        };

        const vehicleId = document.getElementById('vehicleId').value;

        if (vehicleId) {
            updateVehicle(parseInt(vehicleId), vehicleData);
            showToast('Veículo atualizado com sucesso!', 'success');
        } else {
            addVehicle(vehicleData);
            showToast('Veículo adicionado com sucesso!', 'success');
        }

        resetVehicleForm();
        loadVehiclesTable();
        loadDashboard();
        switchSection('vehicles');
        syncToGithub();
    });
}

function editVehicle(id) {
    const vehicle = getVehicleById(id);
    if (!vehicle) return;

    document.getElementById('formVehicleTitle').textContent = 'Editar Veículo';
    document.getElementById('vehicleId').value = vehicle.id;
    document.getElementById('vMarca').value = vehicle.marca;
    document.getElementById('vModelo').value = vehicle.modelo;
    document.getElementById('vSlug').value = vehicle.slug || '';
    document.getElementById('vAno').value = vehicle.ano;
    document.getElementById('vPreco').value = vehicle.preco;
    document.getElementById('vKm').value = vehicle.km;
    document.getElementById('vCombustivel').value = vehicle.combustivel;
    document.getElementById('vCambio').value = vehicle.cambio;
    document.getElementById('vCor').value = vehicle.cor;
    document.getElementById('vTipo').value = vehicle.tipo;
    document.getElementById('vDestaque').value = vehicle.destaque ? 'true' : 'false';
    document.getElementById('vVideo').value = vehicle.video || '';
    document.getElementById('vDescricao').value = vehicle.descricao;

    // Load images - backward compat with old single image
    if (vehicle.imagens && vehicle.imagens.length > 0) {
        vehicleImages = [...vehicle.imagens];
    } else if (vehicle.imagem) {
        vehicleImages = [vehicle.imagem];
    } else {
        vehicleImages = [];
    }
    renderVehicleImagesGrid();

    // Update video preview
    updateVideoPreview(vehicle.video || '');

    switchSection('add-vehicle');
}

function resetVehicleForm() {
    document.getElementById('vehicleForm').reset();
    document.getElementById('vehicleId').value = '';
    document.getElementById('formVehicleTitle').textContent = 'Adicionar Veículo';
    vehicleImages = [];
    renderVehicleImagesGrid();
    document.getElementById('videoPreview').innerHTML = `
        <div class="placeholder">
            <i class="fas fa-film"></i>
            Cole a URL ou faça upload de um vídeo para visualizar
        </div>
    `;
}

// ============================================
// Vehicle Images (Multi Upload)
// ============================================
function initVehicleImageUploads() {
    const fileInput = document.getElementById('fVehicleImages');
    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        let loaded = 0;
        files.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                showToast(`Imagem "${file.name}" muito grande (máx 10MB). Ignorada.`, 'error');
                loaded++;
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                vehicleImages.push(event.target.result);
                loaded++;
                if (loaded === files.length) {
                    renderVehicleImagesGrid();
                    showToast(`${vehicleImages.length} imagem(ns) no total!`, 'success');
                }
            };
            reader.readAsDataURL(file);
        });
        fileInput.value = '';
    });
}

function addImageFromUrl() {
    const input = document.getElementById('vImagemUrl');
    const url = input.value.trim();
    if (!url) {
        showToast('Cole uma URL de imagem primeiro!', 'error');
        return;
    }
    vehicleImages.push(url);
    input.value = '';
    renderVehicleImagesGrid();
    showToast('Imagem adicionada!', 'success');
}

function removeVehicleImage(index) {
    vehicleImages.splice(index, 1);
    renderVehicleImagesGrid();
}

function renderVehicleImagesGrid() {
    const grid = document.getElementById('vehicleImagesGrid');
    if (!grid) return;

    if (vehicleImages.length === 0) {
        grid.innerHTML = `
            <div class="placeholder" style="grid-column: 1 / -1; text-align: center; padding: 30px; color: #aaa;">
                <i class="fas fa-images" style="font-size: 2rem; margin-bottom: 8px; display: block;"></i>
                Adicione imagens por URL ou upload
            </div>
        `;
        return;
    }

    grid.innerHTML = vehicleImages.map((img, index) => `
        <div class="vehicle-image-item ${index === 0 ? 'is-cover' : ''}">
            <img src="${img}" alt="Imagem ${index + 1}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23aaa%22 font-size=%2212%22>Erro</text></svg>'">
            ${index === 0 ? '<span class="cover-badge">CAPA</span>' : ''}
            <button type="button" class="remove-image-btn" onclick="removeVehicleImage(${index})" title="Remover">
                <i class="fas fa-times"></i>
            </button>
            <span class="image-number">${index + 1}</span>
        </div>
    `).join('');
}

function confirmDelete(id) {
    const vehicle = getVehicleById(id);
    if (!vehicle) return;

    if (confirm(`Tem certeza que deseja excluir "${vehicle.marca} ${vehicle.modelo}"?`)) {
        deleteVehicle(id);
        loadVehiclesTable();
        loadDashboard();
        showToast('Veículo excluído com sucesso!', 'success');
        syncToGithub();
    }
}

// (Image preview - removed, replaced by multi-image grid above)


// ============================================
// Video Preview
// ============================================
function initVideoPreview() {
    const input = document.getElementById('vVideo');
    if (!input) return;

    let timeout;
    input.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            updateVideoPreview(input.value.trim());
        }, 500);
    });

    // File upload for video - preview only
    const fileInput = document.getElementById('fVideo');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Check file size (max 50MB)
            if (file.size > 50 * 1024 * 1024) {
                showToast('Vídeo muito grande! Máximo 50MB.', 'error');
                fileInput.value = '';
                return;
            }

            // Create Object URL for preview only
            const objectUrl = URL.createObjectURL(file);
            updateVideoPreview(objectUrl);
            showToast('⚠️ O upload serve apenas para preview. Para salvar, use um link do YouTube ou URL hospedada.', 'error');
            // Do NOT save base64 to the input - it's too large for localStorage
            document.getElementById('vVideo').value = '';
        });
    }
}

function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function updateVideoPreview(url) {
    const preview = document.getElementById('videoPreview');
    if (!preview) return;

    if (!url) {
        preview.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-film"></i>
                Cole a URL ou faça upload de um vídeo para visualizar
            </div>
        `;
        return;
    }

    // Check if YouTube
    const ytId = getYouTubeId(url);
    if (ytId) {
        preview.innerHTML = `<iframe width="100%" height="280" src="https://www.youtube.com/embed/${ytId}" frameborder="0" allowfullscreen style="border-radius: 10px;"></iframe>`;
        return;
    }

    // Otherwise treat as direct video (URL or base64)
    preview.innerHTML = `<video width="100%" height="280" controls style="border-radius: 10px; background: #000;"><source src="${url}">Seu navegador não suporta vídeos.</video>`;
}

// ============================================
// Settings Forms
// ============================================
function initSettingsForms() {
    // Hero & Images (Merged)
    document.getElementById('settingsFormImages').addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = getSettings();

        // Hero
        settings.heroBanner = document.getElementById('sHeroBanner').value;
        const bannerVideoValue = document.getElementById('sHeroBannerVideo').value;
        // Block base64 videos - they are too large for localStorage
        if (bannerVideoValue && bannerVideoValue.startsWith('data:')) {
            showToast('Vídeos por upload não podem ser salvos. Use um link do YouTube ou URL direta.', 'error');
            return;
        }
        settings.heroBannerVideo = bannerVideoValue;
        settings.heroTitle = document.getElementById('sHeroTitle').value;
        settings.heroSubtitle = document.getElementById('sHeroSubtitle').value;

        // Identity
        settings.logoImage = document.getElementById('sLogoImage').value;
        settings.logoSize = document.getElementById('sLogoSize').value;
        settings.favicon = document.getElementById('sFavicon').value;

        try {
            setSettings(settings);
            showToast('Identidade visual e Banner atualizados!', 'success');
            syncToGithub();
        } catch (err) {
            console.error('Erro ao salvar:', err);
            showToast('Erro ao salvar! Os dados são muito grandes para o armazenamento local.', 'error');
        }
    });
    document.getElementById('settingsFormStats').addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = getSettings();
        settings.statVeiculos = document.getElementById('sStatVeiculos').value;
        settings.statClientes = document.getElementById('sStatClientes').value;
        settings.statAnos = document.getElementById('sStatAnos').value;
        setSettings(settings);
        showToast('Estatísticas atualizadas com sucesso!', 'success');
        syncToGithub();
    });



    // Contact
    document.getElementById('settingsFormContact').addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = getSettings();
        settings.whatsapp = document.getElementById('sWhatsapp').value;
        settings.whatsappDisplay = document.getElementById('sWhatsappDisplay').value;
        settings.telefone = document.getElementById('sTelefone').value;
        settings.telefoneLink = document.getElementById('sTelefoneLink').value;
        settings.endereco = document.getElementById('sEndereco').value;
        settings.mapLink = document.getElementById('sMapLink').value;
        settings.horario = document.getElementById('sHorario').value;
        settings.instagram = document.getElementById('sInstagram').value;
        settings.facebook = document.getElementById('sFacebook').value;
        settings.footerText = document.getElementById('sFooterText').value;
        setSettings(settings);
        showToast('Contato atualizado com sucesso!', 'success');
        syncToGithub();
    });

    // Colors
    document.getElementById('settingsFormColors').addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = getSettings();
        settings.primaryColor = document.getElementById('sPrimaryColor').value;
        settings.accentColor = document.getElementById('sAccentColor').value;
        settings.bgLight = document.getElementById('sBgLight').value;
        settings.textDark = document.getElementById('sTextDark').value;
        settings.logoIconColor = document.getElementById('sLogoIconColor').value;
        setSettings(settings);
        showToast('Cores atualizadas! Recarregue o site para ver.', 'success');
        syncToGithub();
    });



    // Handle File Uploads (Base64)
    initFileUpload('fLogoImage', 'sLogoImage', 'logoPreview');
    initFileUpload('fFavicon', 'sFavicon', 'faviconPreview');
    initFileUpload('fHeroBanner', 'sHeroBanner', 'bannerPreview');

    // Logo Size Slider - update label in real time
    const logoSizeSlider = document.getElementById('sLogoSize');
    const logoSizeValue = document.getElementById('logoSizeValue');
    if (logoSizeSlider && logoSizeValue) {
        logoSizeSlider.addEventListener('input', () => {
            logoSizeValue.textContent = logoSizeSlider.value + 'px';
        });
    }

    // Banner Video URL preview
    const heroBannerVideoInput = document.getElementById('sHeroBannerVideo');
    if (heroBannerVideoInput) {
        let timeout;
        heroBannerVideoInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                updateHeroBannerVideoPreview(heroBannerVideoInput.value.trim());
            }, 500);
        });
    }

    // Banner Video File Upload - preview only, cannot save base64 video to localStorage
    const fHeroBannerVideo = document.getElementById('fHeroBannerVideo');
    if (fHeroBannerVideo) {
        fHeroBannerVideo.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 50 * 1024 * 1024) {
                showToast('Vídeo muito grande! Máximo 50MB.', 'error');
                fHeroBannerVideo.value = '';
                return;
            }
            // Create a temporary Object URL for preview only
            const objectUrl = URL.createObjectURL(file);
            updateHeroBannerVideoPreview(objectUrl);
            showToast('⚠️ O upload de vídeo serve apenas para preview. Para salvar, use um link do YouTube ou URL hospedada.', 'error');
            // Do NOT set the value in the hidden input - it would be too large to save
            // Clear the hidden input to avoid saving base64
            document.getElementById('sHeroBannerVideo').value = '';
        });
    }

    // Remove Banner Video button
    const btnRemoveBannerVideo = document.getElementById('btnRemoveBannerVideo');
    if (btnRemoveBannerVideo) {
        btnRemoveBannerVideo.addEventListener('click', () => {
            document.getElementById('sHeroBannerVideo').value = '';
            if (fHeroBannerVideo) fHeroBannerVideo.value = '';
            updateHeroBannerVideoPreview('');
            showToast('Vídeo do banner removido. Salve para aplicar.', 'success');
        });
    }

    // Adapt Colors to Logo
    const btnAdaptColors = document.getElementById('btnAdaptColors');
    if (btnAdaptColors) {
        btnAdaptColors.addEventListener('click', () => {
            const logoBase64 = document.getElementById('sLogoImage').value;
            if (!logoBase64) {
                showToast('Faça upload de uma logo primeiro!', 'error');
                return;
            }
            extractDominantColor(logoBase64);
        });
    }
    // SEO
    document.getElementById('settingsFormSEO').addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = getSettings();
        settings.metaTitle = document.getElementById('sMetaTitle').value;
        settings.metaDescription = document.getElementById('sMetaDescription').value;
        settings.metaKeywords = document.getElementById('sMetaKeywords').value;
        settings.canonicalUrl = document.getElementById('sCanonicalUrl').value;
        setSettings(settings);
        showToast('Configurações de SEO salvas!', 'success');
        syncToGithub();
    });

    // Github Integration
    document.getElementById('settingsFormGithub').addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = getSettings();
        settings.ghToken = document.getElementById('ghToken').value.trim();
        settings.ghUser = document.getElementById('ghUser').value.trim();
        settings.ghRepo = document.getElementById('ghRepo').value.trim();
        settings.ghBranch = document.getElementById('ghBranch').value.trim() || 'main';
        setSettings(settings);
        showToast('Configurações do GitHub salvas!', 'success');
    });
}

function initFileUpload(fileId, hiddenId, previewId) {
    const fileInput = document.getElementById(fileId);
    const hiddenInput = document.getElementById(hiddenId);

    if (!fileInput || !hiddenInput) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target.result;
            hiddenInput.value = base64;
            updateCustomPreview(previewId, base64);
        };
        reader.readAsDataURL(file);
    });
}

function updateCustomPreview(previewId, url) {
    const preview = document.getElementById(previewId);
    if (!preview) return;
    if (!url) {
        preview.innerHTML = '<div class="placeholder"><i class="fas fa-image"></i> Visualize aqui</div>';
        return;
    }
    preview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'><i class=\\'fas fa-exclamation-triangle\\'></i>Erro</div>'">`;
}

function extractDominantColor(base64) {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;

        // Sample pixels (skip transparent ones)
        for (let i = 0; i < imageData.length; i += 40) { // Sample every 10th pixel
            if (imageData[i + 3] > 128) { // Only non-transparent
                r += imageData[i];
                g += imageData[i + 1];
                b += imageData[i + 2];
                count++;
            }
        }

        if (count > 0) {
            const avgR = Math.round(r / count);
            const avgG = Math.round(g / count);
            const avgB = Math.round(b / count);

            const hexColor = rgbToHex(avgR, avgG, avgB);

            // Apply to color inputs
            document.getElementById('sPrimaryColor').value = hexColor;
            document.getElementById('sAccentColor').value = hexColor; // Use as accent too or modify
            document.getElementById('sLogoIconColor').value = hexColor;

            showToast('Cores sugeridas com base na logo! Salve para aplicar.', 'info');

            // Trigger color form update if needed
            // (The user still needs to click "Salvar Cores" or we can do it automatically)
        }
    };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function loadSettingsForm() {
    const settings = getSettings();

    document.getElementById('sHeroBanner').value = settings.heroBanner || '';
    updateBannerPreview(settings.heroBanner || '');
    document.getElementById('sHeroBannerVideo').value = settings.heroBannerVideo || '';
    updateHeroBannerVideoPreview(settings.heroBannerVideo || '');
    document.getElementById('sHeroTitle').value = settings.heroTitle;
    document.getElementById('sHeroSubtitle').value = settings.heroSubtitle;
    document.getElementById('sStatVeiculos').value = settings.statVeiculos;
    document.getElementById('sStatClientes').value = settings.statClientes;
    document.getElementById('sStatAnos').value = settings.statAnos;
    document.getElementById('sWhatsapp').value = settings.whatsapp;
    document.getElementById('sWhatsappDisplay').value = settings.whatsappDisplay;
    document.getElementById('sTelefone').value = settings.telefone;
    document.getElementById('sTelefoneLink').value = settings.telefoneLink;
    document.getElementById('sEndereco').value = settings.endereco;
    document.getElementById('sMapLink').value = settings.mapLink;
    document.getElementById('sHorario').value = settings.horario;
    document.getElementById('sInstagram').value = settings.instagram;
    document.getElementById('sFacebook').value = settings.facebook;
    document.getElementById('sFooterText').value = settings.footerText;

    // Load Colors
    document.getElementById('sPrimaryColor').value = settings.primaryColor || '#1a1a1a';
    document.getElementById('sAccentColor').value = settings.accentColor || '#d4a017';
    document.getElementById('sBgLight').value = settings.bgLight || '#f5f7fa';
    document.getElementById('sTextDark').value = settings.textDark || '#1a1a2e';
    document.getElementById('sLogoIconColor').value = settings.logoIconColor || '#d4a017';

    // Load Images
    document.getElementById('sLogoImage').value = settings.logoImage || '';
    updateCustomPreview('logoPreview', settings.logoImage || '');

    document.getElementById('sFavicon').value = settings.favicon || '';
    updateCustomPreview('faviconPreview', settings.favicon || '');

    // Load Logo Size
    const logoSizeVal = settings.logoSize || '85';
    document.getElementById('sLogoSize').value = logoSizeVal;
    document.getElementById('logoSizeValue').textContent = logoSizeVal + 'px';

    // Load SEO
    document.getElementById('sMetaTitle').value = settings.metaTitle || '';
    document.getElementById('sMetaDescription').value = settings.metaDescription || '';
    document.getElementById('sMetaKeywords').value = settings.metaKeywords || '';
    document.getElementById('sCanonicalUrl').value = settings.canonicalUrl || '';

    // Load Github Settings
    document.getElementById('ghToken').value = settings.ghToken || '';
    document.getElementById('ghUser').value = settings.ghUser || '';
    document.getElementById('ghRepo').value = settings.ghRepo || '';
    document.getElementById('ghBranch').value = settings.ghBranch || 'main';
}

// ============================================
// Extra Previews
// ============================================
function initAboutPreview() {
    const input = document.getElementById('sAboutImage');
    if (!input) return;
    input.addEventListener('input', () => updateAboutPreview(input.value.trim()));
}

function updateAboutPreview(url) {
    const preview = document.getElementById('aboutPreview');
    if (!preview) return;
    if (!url) {
        preview.innerHTML = '<div class="placeholder"><i class="fas fa-image"></i> Visualize aqui</div>';
        return;
    }
    preview.innerHTML = `<img src="${url}" alt="About Preview" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'><i class=\\'fas fa-exclamation-triangle\\'></i>Erro</div>'">`;
}

function initOgPreview() {
    const input = document.getElementById('sOgImage');
    if (!input) return;
    input.addEventListener('input', () => updateOgPreview(input.value.trim()));
}

function updateOgPreview(url) {
    const preview = document.getElementById('ogPreview');
    if (!preview) return;
    if (!url) {
        preview.innerHTML = '<div class="placeholder"><i class="fas fa-share-alt"></i> Visualize aqui</div>';
        return;
    }
    preview.innerHTML = `<img src="${url}" alt="OG Preview" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'><i class=\\'fas fa-exclamation-triangle\\'></i>Erro</div>'">`;
}

// ============================================
// Banner Preview
// ============================================
function initBannerPreview() {
    const input = document.getElementById('sHeroBanner');
    if (!input) return;

    let timeout;
    input.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            updateBannerPreview(input.value.trim());
        }, 500);
    });
}

function updateBannerPreview(url) {
    const preview = document.getElementById('bannerPreview');
    if (!preview) return;
    if (!url) {
        preview.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-panorama"></i>
                Cole a URL da imagem do banner para visualizar
            </div>
        `;
        return;
    }
    preview.innerHTML = `<img src="${url}" alt="Banner Preview" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'><i class=\\'fas fa-exclamation-triangle\\'></i>Imagem não encontrada</div>'">`;
}

function updateHeroBannerVideoPreview(url) {
    const preview = document.getElementById('heroBannerVideoPreview');
    const removeBtn = document.getElementById('btnRemoveBannerVideo');
    if (!preview) return;

    if (!url) {
        preview.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-film"></i>
                Cole a URL ou faça upload de um vídeo para o banner
            </div>
        `;
        if (removeBtn) removeBtn.style.display = 'none';
        return;
    }

    if (removeBtn) removeBtn.style.display = 'inline-flex';

    // Check if YouTube
    const ytId = getYouTubeId(url);
    if (ytId) {
        preview.innerHTML = `<iframe width="100%" height="280" src="https://www.youtube.com/embed/${ytId}" frameborder="0" allowfullscreen style="border-radius: 10px;"></iframe>`;
        return;
    }

    // Direct video
    preview.innerHTML = `<video width="100%" height="280" controls style="border-radius: 10px; background: #000;"><source src="${url}">Seu navegador não suporta vídeos.</video>`;
}

// ============================================
// Account Form
// ============================================
function initAccountForm() {
    const form = document.getElementById('accountForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('aName').value.trim();
        const username = document.getElementById('aUsername').value.trim();
        const password = document.getElementById('aPassword').value;
        const confirm = document.getElementById('aPasswordConfirm').value;

        if (password !== confirm) {
            showToast('As senhas não coincidem!', 'error');
            return;
        }

        if (name.length < 2) {
            showToast('Nome deve ter pelo menos 2 caracteres!', 'error');
            return;
        }

        if (username.length < 3) {
            showToast('Usuário deve ter pelo menos 3 caracteres!', 'error');
            return;
        }

        setAdminCredentials({ name, username, password });
        showToast('Credenciais atualizadas com sucesso!', 'success');

        // Clear password fields
        document.getElementById('aPassword').value = '';
        document.getElementById('aPasswordConfirm').value = '';
    });
}

function loadAccountForm() {
    const creds = getAdminCredentials();
    const nameEl = document.getElementById('aName');
    const userEl = document.getElementById('aUsername');

    if (nameEl) nameEl.value = creds.name || '';
    if (userEl) userEl.value = creds.username;
}

// ============================================
// Toast Notification
// ============================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');

    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// ============================================
// Utility (shared with data.js)
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
// Export data.js with current data
// ============================================
// Store the file handle for reuse (save to same location)
let savedFileHandle = null;

function generateDataJSContent() {
    const vehicles = getVehicles();
    const settings = getSettings();
    const admin = getAdminCredentials();

    return `/* ============================================
   MILENIUM CAR - Data Layer
   Manages all data in localStorage
   ============================================ */

const DATA_KEYS = {
    VEHICLES: 'mileniumcar_vehicles',
    SETTINGS: 'mileniumcar_settings',
    ADMIN: 'mileniumcar_admin',
};

// ============================================
// Default Data
// ============================================

const DEFAULT_VEHICLES = ${JSON.stringify(vehicles, null, 4)};

const DEFAULT_SETTINGS = ${JSON.stringify(settings, null, 4)};

const DEFAULT_ADMIN = ${JSON.stringify(admin, null, 4)};

// ============================================
// Data Access Functions
// ============================================

function getVehicles() {
    const data = localStorage.getItem(DATA_KEYS.VEHICLES);
    if (!data) {
        setVehicles(DEFAULT_VEHICLES);
        return DEFAULT_VEHICLES;
    }
    return JSON.parse(data);
}

function setVehicles(vehicles) {
    localStorage.setItem(DATA_KEYS.VEHICLES, JSON.stringify(vehicles));
}

function addVehicle(vehicle) {
    const vehicles = getVehicles();
    vehicle.id = Date.now();
    vehicles.push(vehicle);
    setVehicles(vehicles);
    return vehicle;
}

function updateVehicle(id, updatedData) {
    const vehicles = getVehicles();
    const index = vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
        vehicles[index] = { ...vehicles[index], ...updatedData };
        setVehicles(vehicles);
        return vehicles[index];
    }
    return null;
}

function deleteVehicle(id) {
    const vehicles = getVehicles();
    const filtered = vehicles.filter(v => v.id !== id);
    setVehicles(filtered);
}

function getVehicleById(id) {
    const vehicles = getVehicles();
    return vehicles.find(v => v.id === id);
}

function getSettings() {
    const data = localStorage.getItem(DATA_KEYS.SETTINGS);
    if (!data) {
        setSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
    }
    try {
        const parsed = JSON.parse(data);
        return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
        return DEFAULT_SETTINGS;
    }
}

function setSettings(settings) {
    try {
        localStorage.setItem(DATA_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
        console.error('Erro ao salvar settings no localStorage:', e);
        throw e;
    }
}

function getAdminCredentials() {
    const data = localStorage.getItem(DATA_KEYS.ADMIN);
    if (!data) {
        setAdminCredentials(DEFAULT_ADMIN);
        return DEFAULT_ADMIN;
    }
    return JSON.parse(data);
}

function setAdminCredentials(creds) {
    localStorage.setItem(DATA_KEYS.ADMIN, JSON.stringify(creds));
}

function isAdminLoggedIn() {
    return sessionStorage.getItem('mileniumcar_admin_logged') === 'true';
}

function loginAdmin(username, password) {
    const creds = getAdminCredentials();
    if (username === creds.username && password === creds.password) {
        sessionStorage.setItem('mileniumcar_admin_logged', 'true');
        return true;
    }
    return false;
}

function logoutAdmin() {
    sessionStorage.removeItem('mileniumcar_admin_logged');
}
`;
}

async function exportDataJS() {
    const fileContent = generateDataJSContent();

    // Try using File System Access API (Chrome/Edge)
    if ('showSaveFilePicker' in window) {
        try {
            // If we already have a file handle, reuse it
            if (savedFileHandle) {
                const writable = await savedFileHandle.createWritable();
                await writable.write(fileContent);
                await writable.close();
                showToast('✅ data.js salvo na pasta do projeto!', 'success');
                return;
            }

            // First time: ask user to pick the location
            const handle = await window.showSaveFilePicker({
                suggestedName: 'data.js',
                types: [{
                    description: 'JavaScript',
                    accept: { 'application/javascript': ['.js'] }
                }]
            });

            savedFileHandle = handle;

            const writable = await handle.createWritable();
            await writable.write(fileContent);
            await writable.close();

            showToast('✅ data.js salvo! Próximas vezes salvará automaticamente.', 'success');
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Erro ao salvar:', err);
                showToast('Erro ao salvar o arquivo.', 'error');
            }
        }
    } else {
        // Fallback: download the file
        const blob = new Blob([fileContent], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('📥 data.js baixado! Mova para a pasta do projeto.', 'success');
    }
}

// ============================================
// GitHub Sync Logic
// ============================================

async function syncToGithub() {
    const settings = getSettings();
    if (!settings.ghToken || !settings.ghUser || !settings.ghRepo) {
        console.log('GitHub integration not configured.');
        return;
    }

    const toast = showToast('☁️ Sincronizando com GitHub...', 'info');

    const fileContent = generateDataJSContent();
    const filePath = 'data.js'; // Caminho no repositório

    try {
        // 1. Get current file SHA
        const cleanToken = settings.ghToken.trim();
        const url = `https://api.github.com/repos/${settings.ghUser.trim()}/${settings.ghRepo.trim()}/contents/${filePath}?ref=${settings.ghBranch.trim() || 'main'}`;

        const getRes = await fetch(url, {
            headers: {
                'Authorization': `token ${cleanToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Cache-Control': 'no-cache'
            }
        });

        let sha = null;
        if (getRes.status === 200) {
            const data = await getRes.json();
            sha = data.sha;
        } else if (getRes.status === 401) {
            throw new Error('Bad credentials (Token inválido ou expirado)');
        }

        // 2. Update/Create file
        const putRes = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${cleanToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update data.js from Admin Panel',
                content: btoa(unescape(encodeURIComponent(fileContent))),
                sha: sha,
                branch: settings.ghBranch.trim() || 'main'
            })
        });

        if (putRes.status === 200 || putRes.status === 201) {
            showToast('✅ Sincronizado com GitHub! O Vercel iniciará o deploy.', 'success');
        } else {
            const err = await putRes.json();
            console.error('GitHub API Error:', err);
            showToast('❌ Erro ao sincronizar com GitHub: ' + (err.message || putRes.status), 'error');
        }
    } catch (err) {
        console.error('Fetch Error:', err);
        showToast('❌ Erro de conexão ao sincronizar com GitHub.', 'error');
    }
}
