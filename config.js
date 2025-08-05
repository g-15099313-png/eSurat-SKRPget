// Konfigurasi Aplikasi Sistem Pengurusan Surat
// Sila ubah nilai-nilai ini mengikut keperluan anda

const CONFIG = {
    // Google Apps Script URL
    // Ganti dengan URL deployment Google Apps Script anda
    GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwUdKkyEOHHUjKLJ9pmDc7oi3rTv8R0Ppr1M7kSQMKCLqmvS6xAUHPjfxLOEodAz3h0/exec',
    
    // Google Sheets ID
    // Ganti dengan ID spreadsheet Google Sheets anda
    SPREADSHEET_ID: '1wVBuM7wP3HPzqskSDlgBiT2r0f4Wq8',
    
    // Nama Sheet
    SHEET_NAMES: {
        SURAT_MASUK: 'Surat_Masuk',
        SURAT_KELUAR: 'Surat_Keluar'
    },
    
    // Konfigurasi Aplikasi
    APP: {
        NAME: 'Sistem Pengurusan Surat - Daftar',
        VERSION: '1.0.0',
        DEBUG_MODE: false,
        AUTO_SAVE: true,
        AUTO_REFRESH: true,
        REFRESH_INTERVAL: 30000 // 30 saat
    },
    
    // Konfigurasi Status
    STATUS: {
        SURAT_MASUK: [
            'Baru',
            'Dalam Proses',
            'Selesai',
            'Tidak Berkenaan'
        ],
        SURAT_KELUAR: [
            'Draf',
            'Telah Dihantar',
            'Telah Diterima',
            'Batal'
        ]
    },
    
    // Konfigurasi Penomboran
    REFERENCE_NUMBER: {
        SURAT_MASUK_PREFIX: 'SM',
        SURAT_KELUAR_PREFIX: 'SK',
        YEAR_FORMAT: 'YYYY',
        NUMBER_FORMAT: '000'
    },
    
    // Konfigurasi Email
    EMAIL: {
        ENABLED: true,
        RECIPIENT: 'admin@example.com',
        SUBJECT_PREFIX: '[Sistem Surat]',
        NOTIFICATION_TYPES: ['new_record', 'status_update', 'daily_summary']
    },
    
    // Konfigurasi File Upload
    FILE_UPLOAD: {
        MAX_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_TYPES: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
        AUTO_RENAME: true,
        STORAGE_TYPE: 'google_drive' // 'google_drive' atau 'local'
    },
    
    // Konfigurasi UI
    UI: {
        THEME: 'default', // 'default', 'dark', 'light'
        LANGUAGE: 'ms', // 'ms', 'en'
        ANIMATIONS: true,
        SOUND_NOTIFICATIONS: false,
        AUTO_COMPLETE: true
    },
    
    // Konfigurasi Pencarian
    SEARCH: {
        MIN_CHARACTERS: 2,
        SEARCH_DELAY: 500, // ms
        HIGHLIGHT_RESULTS: true,
        SEARCH_FIELDS: ['noRujukan', 'subjek', 'pengirim', 'penerima', 'tindakanSiapa']
    },
    
    // Konfigurasi Export
    EXPORT: {
        PDF_ENABLED: true,
        EXCEL_ENABLED: true,
        CSV_ENABLED: true,
        DEFAULT_FORMAT: 'pdf'
    },
    
    // Konfigurasi Backup
    BACKUP: {
        AUTO_BACKUP: true,
        BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 jam
        KEEP_BACKUPS: 30, // hari
        BACKUP_LOCATION: 'google_drive'
    },
    
    // Konfigurasi Keselamatan
    SECURITY: {
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minit
        MAX_LOGIN_ATTEMPTS: 5,
        PASSWORD_REQUIREMENTS: {
            MIN_LENGTH: 8,
            REQUIRE_UPPERCASE: true,
            REQUIRE_LOWERCASE: true,
            REQUIRE_NUMBERS: true,
            REQUIRE_SPECIAL_CHARS: true
        }
    },
    
    // Konfigurasi Laporan
    REPORTS: {
        DAILY_SUMMARY: true,
        WEEKLY_REPORT: true,
        MONTHLY_REPORT: true,
        AUTO_GENERATE: true,
        EMAIL_REPORTS: true
    },
    
    // Konfigurasi Notifikasi
    NOTIFICATIONS: {
        BROWSER_NOTIFICATIONS: true,
        SOUND_NOTIFICATIONS: false,
        EMAIL_NOTIFICATIONS: true,
        PUSH_NOTIFICATIONS: false
    },
    
    // Konfigurasi Performance
    PERFORMANCE: {
        CACHE_ENABLED: true,
        CACHE_DURATION: 5 * 60 * 1000, // 5 minit
        LAZY_LOADING: true,
        IMAGE_OPTIMIZATION: true
    }
};

// Fungsi untuk mendapatkan konfigurasi
function getConfig(key) {
    const keys = key.split('.');
    let value = CONFIG;
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return null;
        }
    }
    
    return value;
}

// Fungsi untuk mengemas kini konfigurasi
function updateConfig(key, value) {
    const keys = key.split('.');
    let config = CONFIG;
    
    for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in config)) {
            config[keys[i]] = {};
        }
        config = config[keys[i]];
    }
    
    config[keys[keys.length - 1]] = value;
    
    // Simpan ke localStorage
    localStorage.setItem('surat_config', JSON.stringify(CONFIG));
}

// Fungsi untuk memuat konfigurasi dari localStorage
function loadConfig() {
    const savedConfig = localStorage.getItem('surat_config');
    if (savedConfig) {
        try {
            const parsed = JSON.parse(savedConfig);
            Object.assign(CONFIG, parsed);
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }
}

// Fungsi untuk reset konfigurasi
function resetConfig() {
    localStorage.removeItem('surat_config');
    location.reload();
}

// Fungsi untuk export konfigurasi
function exportConfig() {
    const configBlob = new Blob([JSON.stringify(CONFIG, null, 2)], {
        type: 'application/json'
    });
    
    const url = URL.createObjectURL(configBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'surat_config.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Fungsi untuk import konfigurasi
function importConfig(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const config = JSON.parse(e.target.result);
                Object.assign(CONFIG, config);
                localStorage.setItem('surat_config', JSON.stringify(CONFIG));
                resolve(config);
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsText(file);
    });
}

// Muat konfigurasi pada startup
loadConfig();

// Export untuk kegunaan global
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.getConfig = getConfig;
    window.updateConfig = updateConfig;
    window.resetConfig = resetConfig;
    window.exportConfig = exportConfig;
    window.importConfig = importConfig;
}

// Export untuk Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        getConfig,
        updateConfig,
        resetConfig,
        exportConfig,
        importConfig
    };
} 