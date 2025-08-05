// Google Apps Script untuk Sistem Pengurusan Surat
// Pastikan untuk menggantikan SPREADSHEET_ID dengan ID Google Sheets anda

const SPREADSHEET_ID = '1wVBuM7wP3HPzqskSDlgBiT2r0f4Wq8'; // 
const SURAT_MASUK_SHEET = 'Surat_Masuk';
const SURAT_KELUAR_SHEET = 'Surat_Keluar';

/**
 * Fungsi untuk menyimpan surat masuk ke Google Sheets
 */
function saveSuratMasuk(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById('1wVBuM7wP3HPzqskSDlgBiT2r0f4Wq8');
    const sheet = spreadsheet.getSheetByName(SURAT_MASUK_SHEET);
    
    if (!sheet) {
      throw new Error('Sheet Surat_Masuk tidak ditemui');
    }
    
    // Dapatkan baris seterusnya
    const lastRow = sheet.getLastRow();
    const nextRow = lastRow + 1;
    
    // Sediakan data untuk dimasukkan
    const rowData = [
      new Date(), // Timestamp
      data.noRujukan,
      data.tarikhTerima,
      data.pengirim,
      data.subjek,
      data.status,
      data.tindakanSiapa,
      data.muatNaikSurat || '',
      data.tindakan || ''
    ];
    
    // Masukkan data ke sheet
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Format header jika ini adalah baris pertama
    if (nextRow === 2) {
      formatHeader(sheet);
    }
    
    return {
      success: true,
      message: 'Surat masuk berjaya disimpan',
      id: nextRow
    };
    
  } catch (error) {
    console.error('Error saving surat masuk:', error);
    return {
      success: false,
      message: 'Ralat menyimpan surat masuk: ' + error.message
    };
  }
}

/**
 * Fungsi untuk menyimpan surat keluar ke Google Sheets
 */
function saveSuratKeluar(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById('1wVBuM7wP3HPzqskSDlgBiT2r0f4Wq8');
    const sheet = spreadsheet.getSheetByName(SURAT_KELUAR_SHEET);
    
    if (!sheet) {
      throw new Error('Sheet Surat_Keluar tidak ditemui');
    }
    
    // Dapatkan baris seterusnya
    const lastRow = sheet.getLastRow();
    const nextRow = lastRow + 1;
    
    // Sediakan data untuk dimasukkan
    const rowData = [
      new Date(), // Timestamp
      data.noRujukan,
      data.tarikhHantar,
      data.penerima,
      data.subjek,
      data.status,
      data.tindakanSiapa,
      data.muatNaikSurat || '',
      data.tindakan || ''
    ];
    
    // Masukkan data ke sheet
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Format header jika ini adalah baris pertama
    if (nextRow === 2) {
      formatHeader(sheet);
    }
    
    return {
      success: true,
      message: 'Surat keluar berjaya disimpan',
      id: nextRow
    };
    
  } catch (error) {
    console.error('Error saving surat keluar:', error);
    return {
      success: false,
      message: 'Ralat menyimpan surat keluar: ' + error.message
    };
  }
}

/**
 * Fungsi untuk memuat semua rekod surat
 */
function getAllSuratRecords() {
  try {
    const spreadsheet = SpreadsheetApp.openById('1wVBuM7wP3HPzqskSDlgBiT2r0f4Wq8');
    const suratMasukSheet = spreadsheet.getSheetByName(SURAT_MASUK_SHEET);
    const suratKeluarSheet = spreadsheet.getSheetByName(SURAT_KELUAR_SHEET);
    
    const records = [];
    let id = 1;
    
    // Muat surat masuk
    if (suratMasukSheet && suratMasukSheet.getLastRow() > 1) {
      const suratMasukData = suratMasukSheet.getRange(2, 1, suratMasukSheet.getLastRow() - 1, 9).getValues();
      
      suratMasukData.forEach(row => {
        records.push({
          id: id++,
          type: 'surat-masuk',
          timestamp: row[0],
          noRujukan: row[1],
          tarikhTerima: formatDate(row[2]),
          pengirim: row[3],
          subjek: row[4],
          status: row[5],
          tindakanSiapa: row[6],
          muatNaikSurat: row[7],
          tindakan: row[8]
        });
      });
    }
    
    // Muat surat keluar
    if (suratKeluarSheet && suratKeluarSheet.getLastRow() > 1) {
      const suratKeluarData = suratKeluarSheet.getRange(2, 1, suratKeluarSheet.getLastRow() - 1, 9).getValues();
      
      suratKeluarData.forEach(row => {
        records.push({
          id: id++,
          type: 'surat-keluar',
          timestamp: row[0],
          noRujukan: row[1],
          tarikhHantar: formatDate(row[2]),
          penerima: row[3],
          subjek: row[4],
          status: row[5],
          tindakanSiapa: row[6],
          muatNaikSurat: row[7],
          tindakan: row[8]
        });
      });
    }
    
    return {
      success: true,
      records: records
    };
    
  } catch (error) {
    console.error('Error loading records:', error);
    return {
      success: false,
      message: 'Ralat memuat rekod: ' + error.message,
      records: []
    };
  }
}

/**
 * Fungsi untuk mencari surat berdasarkan kriteria
 */
function searchSurat(searchTerm, statusFilter, typeFilter) {
  try {
    const allRecords = getAllSuratRecords();
    
    if (!allRecords.success) {
      return allRecords;
    }
    
    let filteredRecords = allRecords.records;
    
    // Filter berdasarkan jenis surat
    if (typeFilter && typeFilter !== 'all') {
      filteredRecords = filteredRecords.filter(record => record.type === typeFilter);
    }
    
    // Filter berdasarkan status
    if (statusFilter && statusFilter !== '') {
      filteredRecords = filteredRecords.filter(record => record.status === statusFilter);
    }
    
    // Filter berdasarkan carian
    if (searchTerm && searchTerm !== '') {
      const searchLower = searchTerm.toLowerCase();
      filteredRecords = filteredRecords.filter(record => {
        return record.noRujukan.toLowerCase().includes(searchLower) ||
               record.subjek.toLowerCase().includes(searchLower) ||
               (record.pengirim && record.pengirim.toLowerCase().includes(searchLower)) ||
               (record.penerima && record.penerima.toLowerCase().includes(searchLower));
      });
    }
    
    return {
      success: true,
      records: filteredRecords
    };
    
  } catch (error) {
    console.error('Error searching records:', error);
    return {
      success: false,
      message: 'Ralat mencari rekod: ' + error.message,
      records: []
    };
  }
}

/**
 * Fungsi untuk mengemas kini status surat
 */
function updateSuratStatus(recordId, newStatus, type) {
  try {
    const spreadsheet = SpreadsheetApp.openById('1wVBuM7wP3HPzqskSDlgBiT2r0f4Wq8');
    const sheetName = type === 'surat-masuk' ? SURAT_MASUK_SHEET : SURAT_KELUAR_SHEET;
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet ${sheetName} tidak ditemui`);
    }
    
    // Cari baris berdasarkan ID (column 2 - No. Rujukan)
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === recordId) { // No. Rujukan berada di column 2 (index 1)
        rowIndex = i + 1; // +1 kerana getRange menggunakan 1-based index
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('Rekod tidak ditemui');
    }
    
    // Kemas kini status (column 6)
    sheet.getRange(rowIndex, 6).setValue(newStatus);
    
    return {
      success: true,
      message: 'Status berjaya dikemas kini'
    };
    
  } catch (error) {
    console.error('Error updating status:', error);
    return {
      success: false,
      message: 'Ralat mengemas kini status: ' + error.message
    };
  }
}

/**
 * Fungsi untuk memadam rekod surat
 */
function deleteSuratRecord(recordId, type) {
  try {
    const spreadsheet = SpreadsheetApp.openById('1wVBuM7wP3HPzqskSDlgBiT2r0f4Wq8');
    const sheetName = type === 'surat-masuk' ? SURAT_MASUK_SHEET : SURAT_KELUAR_SHEET;
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet ${sheetName} tidak ditemui`);
    }
    
    // Cari baris berdasarkan ID
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === recordId) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('Rekod tidak ditemui');
    }
    
    // Padam baris
    sheet.deleteRow(rowIndex);
    
    return {
      success: true,
      message: 'Rekod berjaya dipadam'
    };
    
  } catch (error) {
    console.error('Error deleting record:', error);
    return {
      success: false,
      message: 'Ralat memadam rekod: ' + error.message
    };
  }
}

/**
 * Fungsi untuk mencipta template Google Sheets
 */
function createSuratTemplate() {
  try {
    const spreadsheet = SpreadsheetApp.create('Sistem Pengurusan Surat - ' + new Date().toLocaleDateString());
    
    // Cipta sheet untuk Surat Masuk
    const suratMasukSheet = spreadsheet.insertSheet(SURAT_MASUK_SHEET);
    const suratMasukHeaders = [
      'Timestamp',
      'No. Rujukan',
      'Tarikh Terima',
      'Pengirim',
      'Subjek',
      'Status',
      'Tindakan Siapa',
      'Muat Naik Surat',
      'Tindakan'
    ];
    suratMasukSheet.getRange(1, 1, 1, suratMasukHeaders.length).setValues([suratMasukHeaders]);
    formatHeader(suratMasukSheet);
    
    // Cipta sheet untuk Surat Keluar
    const suratKeluarSheet = spreadsheet.insertSheet(SURAT_KELUAR_SHEET);
    const suratKeluarHeaders = [
      'Timestamp',
      'No. Rujukan',
      'Tarikh Hantar',
      'Penerima',
      'Subjek',
      'Status',
      'Tindakan Siapa',
      'Muat Naik Surat',
      'Tindakan'
    ];
    suratKeluarSheet.getRange(1, 1, 1, suratKeluarHeaders.length).setValues([suratKeluarHeaders]);
    formatHeader(suratKeluarSheet);
    
    // Padam sheet default
    spreadsheet.deleteSheet(spreadsheet.getSheetByName('Sheet1'));
    
    return {
      success: true,
      spreadsheetId: spreadsheet.getId(),
      spreadsheetUrl: spreadsheet.getUrl(),
      message: 'Template Google Sheets berjaya dicipta'
    };
    
  } catch (error) {
    console.error('Error creating template:', error);
    return {
      success: false,
      message: 'Ralat mencipta template: ' + error.message
    };
  }
}

/**
 * Fungsi untuk memformat header sheet
 */
function formatHeader(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setBackground('#667eea');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Auto-resize columns
  for (let i = 1; i <= sheet.getLastColumn(); i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * Fungsi untuk memformat tarikh
 */
function formatDate(date) {
  if (!date) return '';
  
  if (typeof date === 'string') {
    return date;
  }
  
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

/**
 * Fungsi untuk menjana nombor rujukan automatik
 */
function generateReferenceNumber(type) {
  try {
    const spreadsheet = SpreadsheetApp.openById('1wVBuM7wP3HPzqskSDlgBiT2r0f4Wq8');
    const sheetName = type === 'surat-masuk' ? SURAT_MASUK_SHEET : SURAT_KELUAR_SHEET;
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet ${sheetName} tidak ditemui`);
    }
    
    const lastRow = sheet.getLastRow();
    const currentYear = new Date().getFullYear();
    const prefix = type === 'surat-masuk' ? 'SM' : 'SK';
    
    if (lastRow <= 1) {
      return `${prefix}/${currentYear}/001`;
    }
    
    // Dapatkan nombor rujukan terakhir
    const lastRefNumber = sheet.getRange(lastRow, 2).getValue();
    const match = lastRefNumber.match(new RegExp(`${prefix}/${currentYear}/(\\d+)`));
    
    if (match) {
      const lastNumber = parseInt(match[1]);
      const nextNumber = lastNumber + 1;
      return `${prefix}/${currentYear}/${nextNumber.toString().padStart(3, '0')}`;
    } else {
      return `${prefix}/${currentYear}/001`;
    }
    
  } catch (error) {
    console.error('Error generating reference number:', error);
    const currentYear = new Date().getFullYear();
    const prefix = type === 'surat-masuk' ? 'SM' : 'SK';
    return `${prefix}/${currentYear}/001`;
  }
}

/**
 * Fungsi untuk eksport data ke PDF
 */
function exportToPDF(type, recordId) {
  try {
    const spreadsheet = SpreadsheetApp.openById('1wVBuM7wP3HPzqskSDlgBiT2r0f4Wq8');
    const sheetName = type === 'surat-masuk' ? SURAT_MASUK_SHEET : SURAT_KELUAR_SHEET;
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet ${sheetName} tidak ditemui`);
    }
    
    // Cari baris berdasarkan ID
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === recordId) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('Rekod tidak ditemui');
    }
    
    // Cipta PDF
    const pdf = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues();
    const pdfBlob = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getAs('application/pdf');
    
    return {
      success: true,
      pdfBlob: pdfBlob,
      message: 'PDF berjaya dijana'
    };
    
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return {
      success: false,
      message: 'Ralat menjana PDF: ' + error.message
    };
  }
}

/**
 * Fungsi untuk menghantar notifikasi email
 */
function sendEmailNotification(recordData, type) {
  try {
    const subject = type === 'surat-masuk' ? 
      `Surat Masuk Baru: ${recordData.noRujukan}` : 
      `Surat Keluar Baru: ${recordData.noRujukan}`;
    
    const body = `
      <h2>${type === 'surat-masuk' ? 'Surat Masuk' : 'Surat Keluar'} Baru</h2>
      <p><strong>No. Rujukan:</strong> ${recordData.noRujukan}</p>
      <p><strong>Subjek:</strong> ${recordData.subjek}</p>
      <p><strong>Status:</strong> ${recordData.status}</p>
      <p><strong>Tindakan:</strong> ${recordData.tindakanSiapa}</p>
      <p><strong>Tarikh:</strong> ${type === 'surat-masuk' ? recordData.tarikhTerima : recordData.tarikhHantar}</p>
      ${recordData.tindakan ? `<p><strong>Catatan:</strong> ${recordData.tindakan}</p>` : ''}
    `;
    
    // Ganti dengan email penerima yang sesuai
    const recipientEmail = 'admin@example.com';
    
    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      htmlBody: body
    });
    
    return {
      success: true,
      message: 'Notifikasi email berjaya dihantar'
    };
    
  } catch (error) {
    console.error('Error sending email notification:', error);
    return {
      success: false,
      message: 'Ralat menghantar notifikasi: ' + error.message
    };
  }
}

// Fungsi untuk testing
function testConnection() {
  return {
    success: true,
    message: 'Sambungan Google Apps Script berjaya',
    timestamp: new Date().toISOString()
  };
} 