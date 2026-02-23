/* ============================================
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

const DEFAULT_VEHICLES = [
    {
        id: 1,
        marca: 'Toyota',
        modelo: 'Corolla Cross XRX',
        ano: 2024,
        preco: 189900,
        km: 12000,
        combustivel: 'Flex',
        cambio: 'Automático',
        cor: 'Branco Pérola',
        tipo: 'Seminovo',
        descricao: 'Toyota Corolla Cross XRX 2024, completo, único dono, revisões na concessionária, bancos em couro, teto solar, multimídia com Android Auto e Apple CarPlay.',
        imagem: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop',
        destaque: true,
    },
    {
        id: 2,
        marca: 'Honda',
        modelo: 'Civic Touring',
        ano: 2023,
        preco: 159900,
        km: 25000,
        combustivel: 'Flex',
        cambio: 'Automático (CVT)',
        cor: 'Cinza Grafite',
        tipo: 'Seminovo',
        descricao: 'Honda Civic Touring 2023, motor 1.5 turbo, 173cv, completo com teto solar, bancos em couro, câmera de ré, sensores de estacionamento.',
        imagem: 'https://images.unsplash.com/photo-1606611013004-1e0e97de7ec4?w=600&h=400&fit=crop',
        destaque: true,
    },
    {
        id: 3,
        marca: 'Volkswagen',
        modelo: 'T-Cross Highline',
        ano: 2024,
        preco: 139900,
        km: 8000,
        combustivel: 'Flex',
        cambio: 'Automático',
        cor: 'Azul Biscay',
        tipo: 'Seminovo',
        descricao: 'VW T-Cross Highline 2024, motor 1.4 TSI, 150cv, completo, pacote de LED, multimídia VW Play, câmera de ré, ar digital.',
        imagem: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop',
        destaque: false,
    },
    {
        id: 4,
        marca: 'Hyundai',
        modelo: 'HB20S Diamond Plus',
        ano: 2023,
        preco: 98900,
        km: 18000,
        combustivel: 'Flex',
        cambio: 'Automático',
        cor: 'Vermelho',
        tipo: 'Seminovo',
        descricao: 'Hyundai HB20S Diamond Plus 2023, motor 1.0 turbo, completo, couro, multimídia com tela de 8", carregamento wireless, piloto automático.',
        imagem: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop',
        destaque: false,
    },
    {
        id: 5,
        marca: 'Chevrolet',
        modelo: 'Tracker Premier',
        ano: 2024,
        preco: 149900,
        km: 5000,
        combustivel: 'Flex',
        cambio: 'Automático',
        cor: 'Preto Ouro Negro',
        tipo: 'Seminovo',
        descricao: 'Chevrolet Tracker Premier 2024, motor 1.2 turbo, completo, teto solar, Wi-Fi nativo, OnStar, câmera 360°, alerta de ponto cego.',
        imagem: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=400&fit=crop',
        destaque: true,
    },
    {
        id: 6,
        marca: 'Fiat',
        modelo: 'Pulse Impetus',
        ano: 2023,
        preco: 109900,
        km: 22000,
        combustivel: 'Flex',
        cambio: 'Automático (CVT)',
        cor: 'Branco Alaska',
        tipo: 'Seminovo',
        descricao: 'Fiat Pulse Impetus 2023, motor 1.0 turbo 130cv, completo, multimídia com tela de 10.1", carregamento wireless, câmera de ré.',
        imagem: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop',
        destaque: false,
    },
    {
        id: 7,
        marca: 'BMW',
        modelo: '320i M Sport',
        ano: 2022,
        preco: 259900,
        km: 30000,
        combustivel: 'Gasolina',
        cambio: 'Automático',
        cor: 'Cinza Mineral',
        tipo: 'Seminovo',
        descricao: 'BMW 320i M Sport 2022, motor 2.0 turbo 184cv, pacote M, interior em couro vermelho, Live Cockpit Professional, head-up display.',
        imagem: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop',
        destaque: true,
    },
    {
        id: 8,
        marca: 'Mercedes-Benz',
        modelo: 'GLA 200 AMG Line',
        ano: 2023,
        preco: 289900,
        km: 15000,
        combustivel: 'Gasolina',
        cambio: 'Automático',
        cor: 'Preto',
        tipo: 'Seminovo',
        descricao: 'Mercedes-Benz GLA 200 AMG Line 2023, motor 1.3 turbo 163cv, interior AMG, MBUX, câmera 360°, teto panorâmico, multibeam LED.',
        imagem: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop',
        destaque: false,
    },
];

const DEFAULT_SETTINGS = {
    heroBanner: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=1080&fit=crop',
    heroTitle: 'Milenium Car: Os Melhores <span class="gradient-text">Seminovos</span> de São Paulo',
    heroSubtitle: 'Encontre seu próximo carro com garantia de procedência, financiamento facilitado em até 60x e as melhores taxas do mercado. Atendimento personalizado e veículos revisados.',

    whatsapp: '5511999999999',
    whatsappDisplay: '(11) 99999-9999',
    telefone: '(11) 3333-4444',
    telefoneLink: '1133334444',
    endereco: 'Av. Exemplo, 1234 - São Paulo, SP',
    mapLink: 'https://maps.google.com',
    horario: 'Seg-Sex: 8h-18h | Sáb: 8h-13h',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    statVeiculos: '150+',
    statClientes: '2.000+',
    statAnos: '10+',
    footerText: 'Os melhores veículos com as melhores condições.',
    // Colors
    primaryColor: '#1a1a1a',
    accentColor: '#d4a017',
    bgLight: '#f5f7fa',
    textDark: '#1a1a2e',
    // Images
    logoIconColor: '#d4a017',
    aboutImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop',
    ogImage: 'https://mileniumcar.com.br/imagens/og-image.jpg',
    // SEO Meta Tags
    metaTitle: 'Milenium Car | Veículos Seminovos e Novos em São Paulo',
    metaDescription: 'Encontre os melhores veículos seminovos e novos na Milenium Car. Financiamento facilitado, garantia de procedência e as melhores taxas do mercado em São Paulo.',
    metaKeywords: 'Milenium Car, carros seminovos, veículos novos, comprar carro São Paulo, financiamento de veículos, seminovos de qualidade',
    canonicalUrl: 'https://mileniumcar.com.br/',
    // Visual Assets
    logoImage: '', // Base64 or URL
    customBg: 'https://images.unsplash.com/photo-1562141982-c5a79acdb55a?w=1920&q=80', // Default luxury showroom
    favicon: '', // Base64 or URL
    // GitHub Integration
    ghToken: '',
    ghUser: 'MineHostng',
    ghRepo: 'MilleniumVeiculos',
    ghBranch: 'main',
};

const DEFAULT_ADMIN = {
    name: 'Administrador',
    username: 'admin',
    password: 'admin123',
};

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
        // Merge defaults with saved data
        const merged = { ...DEFAULT_SETTINGS, ...parsed };

        // Force update GH settings if they are empty in localStorage but exist in defaults
        if (!parsed.ghToken && DEFAULT_SETTINGS.ghToken) merged.ghToken = DEFAULT_SETTINGS.ghToken;
        if (!parsed.ghUser && DEFAULT_SETTINGS.ghUser) merged.ghUser = DEFAULT_SETTINGS.ghUser;
        if (!parsed.ghRepo && DEFAULT_SETTINGS.ghRepo) merged.ghRepo = DEFAULT_SETTINGS.ghRepo;

        return merged;
    } catch (e) {
        return DEFAULT_SETTINGS;
    }
}

function setSettings(settings) {
    try {
        localStorage.setItem(DATA_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
        console.error('Erro ao salvar settings no localStorage:', e);
        throw e; // Re-throw so the caller can handle it
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
