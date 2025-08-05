// Global variables
let currentRecords = [];
let currentTab = 'surat-masuk';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadRecords();
});

// Initialize application
function initializeApp() {
    // Set current date for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tarikh-terima').value = today;
    document.getElementById('tarikh-hantar').value = today;
    
    // Add form event listeners
    document.getElementById('form-surat-masuk').addEventListener('submit', handleSuratMasukSubmit);
    document.getElementById('form-surat-keluar').addEventListener('submit', handleSuratKeluarSubmit);
    
    // Add modal event listeners
    const modal = document.getElementById('record-modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// Tab switching function
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    currentTab = tabName;
}

// Handle Surat Masuk form submission
async function handleSuratMasukSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        type: 'surat-masuk',
        noRujukan: formData.get('noRujukan'),
        tarikhTerima: formData.get('tarikhTerima'),
        pengirim: formData.get('pengirim'),
        subjek: formData.get('subjek'),
        status: formData.get('status'),
        tindakanSiapa: formData.get('tindakanSiapa'),
        tindakan: formData.get('tindakan'),
        muatNaikSurat: formData.get('muatNaikSurat')
    };
    
    try {
        showLoading('Menyimpan surat masuk...');
        
        // Simulate Google Apps Script call
        await saveToGoogleSheets(data);
        
        showMessage('Surat masuk berjaya disimpan!', 'success');
        event.target.reset();
        document.getElementById('tarikh-terima').value = new Date().toISOString().split('T')[0];
        
        // Reload records
        await loadRecords();
        
    } catch (error) {
        showMessage('Ralat: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Handle Surat Keluar form submission
async function handleSuratKeluarSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        type: 'surat-keluar',
        noRujukan: formData.get('noRujukan'),
        tarikhHantar: formData.get('tarikhHantar'),
        penerima: formData.get('penerima'),
        subjek: formData.get('subjek'),
        status: formData.get('status'),
        tindakanSiapa: formData.get('tindakanSiapa'),
        tindakan: formData.get('tindakan'),
        muatNaikSurat: formData.get('muatNaikSurat')
    };
    
    try {
        showLoading('Menyimpan surat keluar...');
        
        // Simulate Google Apps Script call
        await saveToGoogleSheets(data);
        
        showMessage('Surat keluar berjaya disimpan!', 'success');
        event.target.reset();
        document.getElementById('tarikh-hantar').value = new Date().toISOString().split('T')[0];
        
        // Reload records
        await loadRecords();
        
    } catch (error) {
        showMessage('Ralat: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Save data to Google Sheets (simulated)
async function saveToGoogleSheets(data) {
    // In a real implementation, this would call Google Apps Script
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success
            if (Math.random() > 0.1) { // 90% success rate
                resolve();
            } else {
                reject(new Error('Gagal menyimpan ke Google Sheets'));
            }
        }, 1000);
    });
}

// Load records from Google Sheets
async function loadRecords() {
    try {
        showLoading('Memuatkan senarai surat...');
        
        // Simulate loading from Google Sheets
        const records = await getRecordsFromGoogleSheets();
        currentRecords = records;
        
        displayRecords(records);
        
    } catch (error) {
        showMessage('Ralat memuatkan senarai: ' + error.message, 'error');
        displayRecords([]);
    } finally {
        hideLoading();
    }
}

// Get records from Google Sheets (simulated)
async function getRecordsFromGoogleSheets() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate sample data
            const sampleRecords = [
                {
                    id: 1,
                    type: 'surat-masuk',
                    noRujukan: 'SM/2024/001',
                    tarikhTerima: '2024-01-15',
                    pengirim: 'Jabatan Pendidikan Negeri',
                    subjek: 'Permohonan Maklumat Pelajar',
                    status: 'Baru',
                    tindakanSiapa: 'En. Ahmad',
                    tindakan: 'Surat telah dihantar kepada Unit Hal Ehwal Pelajar',
                    muatNaikSurat: 'surat_001.pdf'
                },
                {
                    id: 2,
                    type: 'surat-keluar',
                    noRujukan: 'SK/2024/001',
                    tarikhHantar: '2024-01-10',
                    penerima: 'Pejabat Daerah',
                    subjek: 'Laporan Aktiviti Bulanan',
                    status: 'Telah Dihantar',
                    tindakanSiapa: 'Pn. Siti',
                    tindakan: 'Surat telah dihantar melalui pos',
                    muatNaikSurat: 'laporan_001.pdf'
                },
                {
                    id: 3,
                    type: 'surat-masuk',
                    noRujukan: 'SM/2024/002',
                    tarikhTerima: '2024-01-12',
                    pengirim: 'Kementerian Kesihatan',
                    subjek: 'Arahan Keselamatan COVID-19',
                    status: 'Dalam Proses',
                    tindakanSiapa: 'Dr. Kamal',
                    tindakan: 'Sedang menyediakan jawapan',
                    muatNaikSurat: 'arahan_covid.pdf'
                }
            ];
            resolve(sampleRecords);
        }, 800);
    });
}

// Display records in the UI
function displayRecords(records) {
    const container = document.getElementById('records-container');
    
    if (records.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>Tiada rekod surat</h3>
                <p>Belum ada surat yang direkodkan</p>
            </div>
        `;
        return;
    }
    
    const recordsHTML = records.map(record => createRecordCard(record)).join('');
    container.innerHTML = recordsHTML;
    
    // Add click listeners to record cards
    document.querySelectorAll('.record-card').forEach(card => {
        card.addEventListener('click', () => showRecordDetails(card.dataset.id));
    });
}

// Create a record card HTML
function createRecordCard(record) {
    const isSuratMasuk = record.type === 'surat-masuk';
    const icon = isSuratMasuk ? 'fas fa-inbox' : 'fas fa-paper-plane';
    const typeText = isSuratMasuk ? 'Surat Masuk' : 'Surat Keluar';
    const contact = isSuratMasuk ? record.pengirim : record.penerima;
    const date = isSuratMasuk ? record.tarikhTerima : record.tarikhHantar;
    
    const statusClass = record.status.toLowerCase().replace(' ', '-');
    
    return `
        <div class="record-card" data-id="${record.id}">
            <div class="record-header">
                <div class="record-title">
                    <i class="${icon}"></i>
                    ${record.noRujukan} - ${typeText}
                </div>
                <span class="record-status status-${statusClass}">${record.status}</span>
            </div>
            <div class="record-details">
                <div class="record-detail">
                    <strong>Subjek:</strong>
                    ${record.subjek}
                </div>
                <div class="record-detail">
                    <strong>${isSuratMasuk ? 'Pengirim' : 'Penerima'}:</strong>
                    ${contact}
                </div>
                <div class="record-detail">
                    <strong>Tarikh:</strong>
                    ${formatDate(date)}
                </div>
                <div class="record-detail">
                    <strong>Tindakan:</strong>
                    ${record.tindakanSiapa}
                </div>
            </div>
        </div>
    `;
}

// Show record details in modal
function showRecordDetails(recordId) {
    const record = currentRecords.find(r => r.id == recordId);
    if (!record) return;
    
    const isSuratMasuk = record.type === 'surat-masuk';
    const contact = isSuratMasuk ? record.pengirim : record.penerima;
    const date = isSuratMasuk ? record.tarikhTerima : record.tarikhHantar;
    const dateLabel = isSuratMasuk ? 'Tarikh Terima' : 'Tarikh Hantar';
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2><i class="fas ${isSuratMasuk ? 'fa-inbox' : 'fa-paper-plane'}"></i> 
            ${record.noRujukan} - ${isSuratMasuk ? 'Surat Masuk' : 'Surat Keluar'}
        </h2>
        
        <div style="display: grid; gap: 15px; margin-top: 20px;">
            <div>
                <strong>Subjek:</strong>
                <p>${record.subjek}</p>
            </div>
            
            <div>
                <strong>${isSuratMasuk ? 'Pengirim' : 'Penerima'}:</strong>
                <p>${contact}</p>
            </div>
            
            <div>
                <strong>${dateLabel}:</strong>
                <p>${formatDate(date)}</p>
            </div>
            
            <div>
                <strong>Status:</strong>
                <p><span class="record-status status-${record.status.toLowerCase().replace(' ', '-')}">${record.status}</span></p>
            </div>
            
            <div>
                <strong>Tindakan Siapa:</strong>
                <p>${record.tindakanSiapa}</p>
            </div>
            
            ${record.muatNaikSurat ? `
            <div>
                <strong>Fail Lampiran:</strong>
                <p><i class="fas fa-file"></i> ${record.muatNaikSurat}</p>
            </div>
            ` : ''}
            
            ${record.tindakan ? `
            <div>
                <strong>Catatan Tindakan:</strong>
                <p>${record.tindakan}</p>
            </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('record-modal').style.display = 'block';
}

// Filter records based on search and status
function filterRecords() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    
    const filteredRecords = currentRecords.filter(record => {
        const matchesSearch = 
            record.noRujukan.toLowerCase().includes(searchTerm) ||
            record.subjek.toLowerCase().includes(searchTerm) ||
            (record.pengirim && record.pengirim.toLowerCase().includes(searchTerm)) ||
            (record.penerima && record.penerima.toLowerCase().includes(searchTerm));
        
        const matchesStatus = !statusFilter || record.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    displayRecords(filteredRecords);
}

// Reset form
function resetForm(formId) {
    document.getElementById(formId).reset();
    
    // Reset date to today
    if (formId === 'form-surat-masuk') {
        document.getElementById('tarikh-terima').value = new Date().toISOString().split('T')[0];
    } else if (formId === 'form-surat-keluar') {
        document.getElementById('tarikh-hantar').value = new Date().toISOString().split('T')[0];
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ms-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showLoading(message = 'Memproses...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-overlay';
    loadingDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
            ">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #667eea;"></i>
                <p style="margin-top: 15px; color: #666;">${message}</p>
            </div>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading-overlay');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Google Apps Script Integration Functions
// These functions would be called by Google Apps Script

function saveSuratMasuk(data) {
    // This function would be called by Google Apps Script
    console.log('Saving surat masuk:', data);
    return true;
}

function saveSuratKeluar(data) {
    // This function would be called by Google Apps Script
    console.log('Saving surat keluar:', data);
    return true;
}

function getSuratRecords() {
    // This function would return records from Google Sheets
    return currentRecords;
}

// Export functions for Google Apps Script
if (typeof google !== 'undefined' && google.script) {
    google.script.run = {
        saveSuratMasuk: saveSuratMasuk,
        saveSuratKeluar: saveSuratKeluar,
        getSuratRecords: getSuratRecords
    };
} 