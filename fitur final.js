// ============================================================
// FITUR TAMBAHAN WASIBU
// 1. Jumlah item di keranjang
// 2. Toast setelah menambah pesanan
// 3. Struk setelah pembayaran selesai
// ============================================================

(function () {

    // =============================
    // CSS FITUR TAMBAHAN
    // =============================
    const style = document.createElement("style");
    style.innerHTML = `
        .jumlah-keranjang {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 28px;
            height: 28px;
            padding: 0 8px;
            margin-left: 8px;
            border-radius: 50px;
            background: #6b4226;
            color: white;
            font-size: 14px;
            font-weight: bold;
            vertical-align: middle;
            box-shadow: 0 3px 8px rgba(59, 38, 24, 0.20);
        }

        #toastWASIBU {
            position: fixed;
            right: 25px;
            bottom: 25px;
            z-index: 9999;
            padding: 13px 18px;
            border-radius: 12px;
            background: #3b2618;
            color: white;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
            transition: opacity 0.25s ease, transform 0.25s ease;
        }

        #toastWASIBU.show {
            opacity: 1;
            transform: translateY(0);
        }

        #strukWASIBU {
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(35, 22, 14, 0.72);
            backdrop-filter: blur(6px);
        }

        .struk-box-wasibu {
            width: min(430px, 92vw);
            max-height: 85vh;
            overflow-y: auto;
            padding: 28px;
            border-radius: 20px;
            background: #fffdf9;
            color: #3b2618;
            box-shadow: 0 25px 70px rgba(0,0,0,0.35);
            border-top: 5px solid #c18a5a;
            animation: strukMasukWASIBU 0.3s ease;
        }

        .struk-header-wasibu {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 1px dashed #cdbba8;
        }

        .struk-header-wasibu h2 {
            margin: 0 0 6px;
        }

        .struk-header-wasibu p {
            margin: 0;
            color: #806b59;
            font-size: 13px;
        }

        .struk-item-wasibu {
            padding: 12px 0;
            border-bottom: 1px solid #eee3d7;
        }

        .struk-item-wasibu strong {
            display: block;
            margin-bottom: 4px;
        }

        .struk-detail-wasibu {
            color: #806b59;
            font-size: 12px;
            line-height: 1.5;
        }

        .struk-total-wasibu {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #6b4226;
        }

        .struk-baris-wasibu {
            display: flex;
            justify-content: space-between;
            margin: 7px 0;
            gap: 20px;
        }

        .struk-baris-wasibu.total {
            font-size: 18px;
            font-weight: bold;
            color: #5a351f;
        }

        .tutup-struk-wasibu {
            display: block;
            width: 100%;
            margin-top: 20px;
            padding: 12px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #5a351f, #8a5732);
            color: white;
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
        }

        @keyframes strukMasukWASIBU {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.96);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @media (max-width: 600px) {
            #toastWASIBU {
                left: 20px;
                right: 20px;
                bottom: 20px;
                text-align: center;
            }
        }
    `;

    document.head.appendChild(style);

    // =============================
    // TOAST
    // =============================
    const toast = document.createElement("div");
    toast.id = "toastWASIBU";
    document.body.appendChild(toast);

    let toastTimer;

    function tampilkanToast(pesan) {
        toast.innerText = "✓ " + pesan;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 1800);
    }
    // =============================
    // JUMLAH KERANJANG
    // =============================
    function updateJumlahKeranjang() {
        const judul = document.querySelector(".keranjang h2");

        if (!judul) return;

        let jumlah = 0;

        keranjang.forEach(function (item) {
            jumlah += Number(item.jumlah) || 0;
        });

        judul.innerHTML =
            "🛒 Keranjang" +
            (jumlah > 0
                ? ' <span class="jumlah-keranjang">' + jumlah + "</span>"
                : "");
    }

    // Bungkus fungsi keranjang supaya jumlah otomatis diperbarui.
    const tampilkanKeranjangAsli = tampilkanKeranjang;

    tampilkanKeranjang = function () {
        tampilkanKeranjangAsli();
        updateJumlahKeranjang();
    };

    // =============================
    // TOAST SAAT TAMBAH PESANAN
    // =============================
    const tambahKeKeranjangAsli = tambahKeKeranjang;

    tambahKeKeranjang = function () {
        const nama = arguments[0];

        tambahKeKeranjangAsli.apply(this, arguments);

        tampilkanToast(nama + " ditambahkan ke keranjang");
    };

    // =============================
    // SIMPAN METODE PEMBAYARAN
    // =============================
    let metodePembayaranTerakhir = "Tunai";

    // =============================
    // PILIHAN DINE IN / TAKE AWAY
    // =============================

    let jenisPesananTerakhir = "";
    let namaPelangganTerakhir = "";

    let bayarAsli = bayar;

    let pilihanPembayaranAsliHTML = null;

    bayar = function () {

        // Jalankan fungsi bayar asli
        bayarAsli();

        const pilihan = document.getElementById("pilihanPembayaran");

        if (!pilihan) return;

        // Simpan tampilan pilihan pembayaran asli
        if (pilihanPembayaranAsliHTML === null) {
            pilihanPembayaranAsliHTML = pilihan.innerHTML;
        }

        // Tampilkan pilihan Dine In / Take Away
        pilihan.innerHTML = `
        <div style="margin-bottom: 20px;">
    <h2>Nama Pemesan</h2>
    <input
        type="text"
        id="namaPelangganWASIBU"
        placeholder="Masukkan nama"
        style="width: 100%; padding: 10px; box-sizing: border-box; border-radius: 8px; border: 1px solid #ccc;"
    >
</div>
        <div class="pilihan-jenis-pesanan-wasibu">

            <h2>
                Pilih Jenis Pesanan
            </h2>

            <p>
                Pesanan ini untuk makan di tempat atau dibawa pulang?
            </p>

            <div class="tombol-jenis-pesanan-wasibu">

                <button
                    type="button"
                    onclick="pilihJenisPesanan('Dine In')"
                >
                    🍽️ Dine In
                </button>

                <button
                    type="button"
                    onclick="pilihJenisPesanan('Take Away')"
                >
                    🥡 Take Away
                </button>

            </div>

        </div>
    `;
    };

    const pilihPembayaranAsli = pilihPembayaran;

    // =============================
    // PILIH JENIS PESANAN
    // =============================

    window.pilihJenisPesanan = function (jenis) {

        jenisPesananTerakhir = jenis;
        const inputNama = document.getElementById("namaPelangganWASIBU");

        if (!inputNama || inputNama.value.trim() === "") {
            alert("Silakan masukkan nama terlebih dahulu.");
            return;
        }

        namaPelangganTerakhir = inputNama.value.trim();

        const pilihan = document.getElementById("pilihanPembayaran");

        if (!pilihan) return;

        // Kembalikan pilihan pembayaran
        pilihan.innerHTML = pilihanPembayaranAsliHTML;

    };

    pilihPembayaran = function (metode) {
        metodePembayaranTerakhir = metode;
        pilihPembayaranAsli.apply(this, arguments);
    };

    // =============================
    // BUAT STRUK
    // =============================
    function buatStruk(pesanan, subtotal, diskon, total, metode) {
        const strukLama = document.getElementById("strukWASIBU");

        if (strukLama) {
            strukLama.remove();
        }

        const struk = document.createElement("div");
        struk.id = "strukWASIBU";

        let daftarItem = "";

        pesanan.forEach(function (item) {
            const hargaDasar =
                item.harga * item.jumlah * (item.porsi || 1);

            const hargaTelur =
                item.bisaExtraTelur && item.extraTelur
                    ? HARGA_EXTRA_TELUR * item.jumlah
                    : 0;

            const hargaItem = hargaDasar + hargaTelur;

            let detail = item.jumlah + "x";

            if (item.bisaDouble) {
                detail += " · Porsi " +
                    (Number(item.porsi) === 2 ? "Double" : "Normal");
            }

            if (item.bisaExtraTelur) {
                detail += " · Extra telur " +
                    (item.extraTelur ? "Ya" : "Tidak");
            }

            if (item.punyaSuhu) {
                detail += " · " + item.suhu;
            }

            if (item.teh) {
                detail += " · " + item.rasaTeh;
            }
            if (item.catatan && item.catatan.trim() !== "") {
                detail += " · Catatan: " + item.catatan;
            }

            daftarItem += `
                <div class="struk-item-wasibu">
                    <strong>${item.nama}</strong>
                    <div class="struk-detail-wasibu">
                        ${detail}<br>
                        Rp${hargaItem.toLocaleString("id-ID")}
                    </div>
                </div>
            `;
        });

                 struk.innerHTML = `
                 <div class="struk-box-wasibu">
                <div class="struk-header-wasibu">
                    <h2>☕ WASIBU</h2>
                    <p>Struk Pembelian</p>
                </div>

                ${daftarItem}

                                <div class="struk-total-wasibu">
                    <div class="struk-baris-wasibu">
                        <span>Subtotal</span>
                        <strong>Rp${subtotal.toLocaleString("id-ID")}</strong>
                    </div>

                    <div class="struk-baris-wasibu">
                        <span>Diskon 10%</span>
                        <strong>-Rp${diskon.toLocaleString("id-ID")}</strong>
                    </div>

                    <div class="struk-baris-wasibu total">
                        <span>Total</span>
                        <strong>Rp${total.toLocaleString("id-ID")}</strong>
                    </div>

                    <div class="struk-baris-wasibu">
                         <span>Nama</span>
                        <strong>${namaPelangganTerakhir}</strong>
                    </div>

                    <div class="struk-baris-wasibu">
                        <span>Pembayaran</span>
                        <strong>${metode}</strong>
                    </div>

                    <div class="struk-baris-wasibu">
                    <span>Jenis Pesanan</span>
                    <strong>${jenisPesananTerakhir}</strong>

                    </div>
                </div>

                <button
                    type="button"
                    class="tutup-struk-wasibu"
                    onclick="document.getElementById('strukWASIBU').remove()"
                >
                    Tutup Struk
                </button>
            </div>
        `;

        document.body.appendChild(struk);
    }

    // =============================
    // STRUK SETELAH PEMBAYARAN
    // =============================
    const tutupPembayaranAsli = tutupPembayaran;

    tutupPembayaran = function () {
        if (keranjang.length === 0) {
            tutupPembayaranAsli.apply(this, arguments);
            return;
        }

        const pesanan = JSON.parse(JSON.stringify(keranjang));

        let subtotal = 0;

        pesanan.forEach(function (item) {
            const hargaDasar =
                item.harga * item.jumlah * (item.porsi || 1);

            const hargaTelur =
                item.bisaExtraTelur && item.extraTelur
                    ? HARGA_EXTRA_TELUR * item.jumlah
                    : 0;

            subtotal += hargaDasar + hargaTelur;
        });

        const diskon = Math.round(subtotal * DISKON / 100);
        const total = subtotal - diskon;

        // Tutup popup dan kosongkan keranjang.
        tutupPembayaranAsli.apply(this, arguments);

        // Tampilkan struk setelah pembayaran selesai.
        buatStruk(
            pesanan,
            subtotal,
            diskon,
            total,
            metodePembayaranTerakhir
        );
    };

    // Badge langsung tampil kalau sudah ada isi keranjang.
    updateJumlahKeranjang();
    // =============================
    // TOAST SAAT HAPUS PESANAN
    // =============================

    const hapusItemAsli = hapusItem;

    hapusItem = function (index) {
        const nama = keranjang[index].nama;
        const jumlahSebelum = keranjang[index].jumlah;

        hapusItemAsli.apply(this, arguments);

        if (jumlahSebelum > 1) {
            tampilkanToast("1 " + nama + " dihapus dari keranjang");
        } else {
            tampilkanToast(nama + " dihapus dari keranjang");
        }
    };

})();
