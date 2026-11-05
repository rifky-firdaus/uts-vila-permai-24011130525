const dataVila = [
  {
    id: "v1",
    nama: "Vila Pinus Mawar",
    tipe: "3 Kamar Tidur",
    lokasi: "Cisarua, Puncak",
    harga: 1500000,
    fasilitas: ["Kolam Renang", "WiFi", "Dapur Lengkap", "BBQ Area"],
    tersedia: true
  },
  {
    id: "v2",
    nama: "Vila Cemara Asri",
    tipe: "2 Kamar Tidur",
    lokasi: "Megamendung, Puncak",
    harga: 1000000,
    fasilitas: ["Taman Luas", "WiFi", "Balkon View Gunung"],
    tersedia: true
  },
  {
    id: "v3",
    nama: "Vila Bamboo Haven",
    tipe: "4 Kamar Tidur",
    lokasi: "Ciloto, Puncak",
    harga: 2200000,
    fasilitas: ["Kolam Renang Heated", "Karaoke", "Billiard", "Gazebo"],
    tersedia: false
  }
];

const containerVila = document.getElementById("containerVila");
const pilihanVilaSelect = document.getElementById("pilihanVila");
const inputCari = document.getElementById("inputCari");

const formPemesanan = document.getElementById("formPemesanan");
const inputNamaTamu = document.getElementById("namaTamu");
const inputCheckIn = document.getElementById("checkIn");
const inputCheckOut = document.getElementById("checkOut");
const inputJumlahTamu = document.getElementById("jumlahTamu");

const pesanError = document.getElementById("pesanError");
const outputMalam = document.getElementById("outputMalam");
const outputTotal = document.getElementById("outputTotal");
const btnCekHarga = document.getElementById("btnCekHarga");

const areaHasil = document.getElementById("areaHasil");
const detailHasil = document.getElementById("detailHasil");

function renderKatalogVila(daftar) {
  try {
    containerVila.innerHTML = "";

    if (daftar.length === 0) {
      const pesanKosong = document.createElement("p");
      pesanKosong.textContent = "Vila yang Anda cari tidak ditemukan.";
      containerVila.appendChild(pesanKosong);
      return;
    }

    daftar.forEach(vila => {
      const article = document.createElement("article");
      article.className = "villa-card";

      const h3 = document.createElement("h3");
      h3.className = "villa-card__title";
      h3.textContent = vila.nama;

      const pHarga = document.createElement("p");
      pHarga.className = "villa-card__price";
      pHarga.textContent = `Rp ${vila.harga.toLocaleString("id-ID")} / malam`;

      const pInfo = document.createElement("p");
      pInfo.innerHTML = `<strong>Tipe:</strong> ${vila.tipe} | <strong>Lokasi:</strong> ${vila.lokasi}`;

      const pFasilitas = document.createElement("p");
      pFasilitas.textContent = `Fasilitas: ${vila.fasilitas.join(", ")}`;

      const spanStatus = document.createElement("span");
      spanStatus.className = `villa-card__status ${vila.tersedia ? 'villa-card__status--tersedia' : 'villa-card__status--penuh'}`;
      spanStatus.textContent = vila.tersedia ? "Tersedia" : "Sudah Dipesan";

      article.appendChild(h3);
      article.appendChild(pHarga);
      article.appendChild(pInfo);
      article.appendChild(pFasilitas);
      article.appendChild(spanStatus);

      containerVila.appendChild(article);
    });
  } catch (err) {
    console.error("Gagal merender katalog vila:", err);
  }
}

function isiDropdownVila() {
  pilihanVilaSelect.innerHTML = "";
  dataVila.forEach(vila => {
    const option = document.createElement("option");
    option.value = vila.id;
    option.textContent = `${vila.nama} - Rp ${vila.harga.toLocaleString("id-ID")}/malam`;
    if (!vila.tersedia) option.disabled = true;
    pilihanVilaSelect.appendChild(option);
  });
}

inputCari.addEventListener("input", function () {
  const kataKunci = inputCari.value.toLowerCase().trim();
  const hasilFilter = dataVila.filter(vila => 
    vila.nama.toLowerCase().includes(kataKunci) || 
    vila.lokasi.toLowerCase().includes(kataKunci)
  );
  renderKatalogVila(hasilFilter);
});

function hitungTotalHarga() {
  const checkIn = new Date(inputCheckIn.value);
  const checkOut = new Date(inputCheckOut.value);
  const selectedVilaId = pilihanVilaSelect.value;
  const vilaDipilih = dataVila.find(v => v.id === selectedVilaId);

  if (isNaN(checkIn) || isNaN(checkOut) || checkOut <= checkIn) {
    outputMalam.textContent = "0";
    outputTotal.textContent = "Rp 0";
    return 0;
  }

  const selisihWaktu = checkOut.getTime() - checkIn.getTime();
  const jumlahMalam = Math.ceil(selisihWaktu / (1000 * 3600 * 24));
  
  const totalBiaya = jumlahMalam * vilaDipilih.harga;

  outputMalam.textContent = jumlahMalam;
  outputTotal.textContent = `Rp ${totalBiaya.toLocaleString("id-ID")}`;

  return totalBiaya;
}

function validasiForm() {
  const nama = inputNamaTamu.value.trim();
  const checkInStr = inputCheckIn.value;
  const checkOutStr = inputCheckOut.value;
  const jumlahTamu = parseInt(inputJumlahTamu.value);
  const checkInDate = new Date(checkInStr);
  const checkOutDate = new Date(checkOutStr);

  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  if (!nama) {
    return "Nama lengkap tamu wajib diisi.";
  }
  if (!checkInStr || !checkOutStr) {
    return "Tanggal check-in dan check-out wajib diisi.";
  }
  if (checkInDate < hariIni) {
    return "Tanggal check-in tidak boleh di masa lalu.";
  }
  if (checkOutDate <= checkInDate) {
    return "Tanggal check-out harus setelah tanggal check-in.";
  }
  if (isNaN(jumlahTamu) || jumlahTamu < 1 || jumlahTamu > 10) {
    return "Jumlah tamu harus antara 1 sampai 10 orang.";
  }

  return ""; 
}

btnCekHarga.addEventListener("click", function () {
  const pesanPeringatan = validasiForm();
  if (pesanPeringatan) {
    tampilkanError(pesanPeringatan);
  } else {
    sembunyikanError();
    hitungTotalHarga();
  }
});

inputCheckIn.addEventListener("change", hitungTotalHarga);
inputCheckOut.addEventListener("change", hitungTotalHarga);
pilihanVilaSelect.addEventListener("change", hitungTotalHarga);

function tampilkanError(pesan) {
  pesanError.textContent = pesan;
  pesanError.style.display = "block";
}

function sembunyikanError() {
  pesanError.style.display = "none";
  pesanError.textContent = "";
}

formPemesanan.addEventListener("submit", function (e) {
  e.preventDefault();

  const pesanPeringatan = validasiForm();
  if (pesanPeringatan) {
    tampilkanError(pesanPeringatan);
    areaHasil.style.display = "none";
    return;
  }

  sembunyikanError();
  const totalBiaya = hitungTotalHarga();
  const vilaDipilih = dataVila.find(v => v.id === pilihanVilaSelect.value);

  const pesananTerakhir = {
    nama: inputNamaTamu.value.trim(),
    vila: vilaDipilih.nama,
    checkIn: inputCheckIn.value,
    checkOut: inputCheckOut.value,
    total: totalBiaya
  };

  try {
    localStorage.setItem("namaTamuTerakhir", pesananTerakhir.nama);
    localStorage.setItem("pesananTerakhir", JSON.stringify(pesananTerakhir));
  } catch (err) {
    console.warn("Gagal menyimpan ke LocalStorage:", err);
  }

  detailHasil.innerHTML = `
    Terima kasih <strong>${pesananTerakhir.nama}</strong>!<br>
    Pemesanan untuk <strong>${pesananTerakhir.vila}</strong> (${outputMalam.textContent} malam) telah berhasil dikirim.<br>
    Total yang harus dibayar: <strong>Rp ${totalBiaya.toLocaleString("id-ID")}</strong>.<br>
    <em>Pak Hendra akan menghubungi Anda via WhatsApp untuk konfirmasi selanjutnya.</em>
  `;
  areaHasil.style.display = "block";
});

window.addEventListener("DOMContentLoaded", function () {
  renderKatalogVila(dataVila);
  isiDropdownVila();

  try {
    const namaTersimpan = localStorage.getItem("namaTamuTerakhir");
    if (namaTersimpan) {
      inputNamaTamu.value = namaTersimpan;
    }
  } catch (err) {
    console.warn("Gagal membaca LocalStorage:", err);
  }
});
