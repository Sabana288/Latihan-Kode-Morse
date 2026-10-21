const morse = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
    F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
    K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
    P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
    U: "..-", V: "...-", W: ".--", X: "-..-",
    Y: "-.--", Z: "--.."
};

let mode = "huruf";
let soal = [];
let posisi = 0;
let skor = 0;
let jenisSoal = "huruf";
let sudahJawab = false;

function acak(arr) {
    const hasil = [...arr];

    for (let i = hasil.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
    }

    return hasil;
}

function mulai(pilihanMode) {
    mode = pilihanMode;
    soal = acak(Object.keys(morse));
    posisi = 0;
    skor = 0;

    document.querySelector("#menu").hidden = true;
    document.querySelector("#selesai").hidden = true;
    document.querySelector("#latihan").hidden = false;

    document.querySelector("#modeLabel").textContent =
        mode === "huruf" ? "JAWAB HURUF" :
        mode === "kode" ? "JAWAB KODE" : "GABUNGAN";

    tampilkanSoal();
    window.scrollTo(0, 0);
}

function tampilkanSoal() {
    sudahJawab = false;
    const huruf = soal[posisi];

    jenisSoal = mode === "gabungan"
        ? (Math.random() < 0.5 ? "huruf" : "kode")
        : mode;

    document.querySelector("#progres").textContent =
        `${posisi + 1} dari ${soal.length}`;
    document.querySelector("#skor").textContent = `SKOR ${skor}`;

    document.querySelector("#progressBar").style.width =
        `${(posisi / soal.length) * 100}%`;

    document.querySelector("#petunjuk").textContent =
        jenisSoal === "huruf" ? "TERJEMAHKAN KODE MORSE INI" : "TERJEMAHKAN HURUF INI";

    document.querySelector("#pertanyaan").textContent =
        jenisSoal === "huruf" ? morse[huruf] : huruf;

    document.querySelector("#arahan").textContent =
        jenisSoal === "huruf"
            ? "Ketik satu huruf yang sesuai dengan kode Morse."
            : "Ketik kode Morse menggunakan titik (.) dan garis (-).";

    const input = document.querySelector("#jawaban");
    input.value = "";
    input.placeholder = jenisSoal === "huruf"
        ? "Masukkan huruf..."
        : "Contoh: .-";

    input.disabled = false;
    document.querySelector("#tombolJawab").disabled = false;
    document.querySelector("#tombolJawab").textContent = "Jawab";

    const hasil = document.querySelector("#hasil");
    hasil.textContent = "";
    hasil.className = "";

    document.querySelector("#lanjut").hidden = true;
    input.focus();
}

function normalisasiKode(teks) {
    return teks.trim()
        .replace(/[•·]/g, ".")
        .replace(/[–—−]/g, "-")
        .replace(/\s+/g, "");
}

document.querySelector("#formJawaban").addEventListener("submit", function(event) {
    event.preventDefault();

    if (sudahJawab) return;

    const huruf = soal[posisi];
    const input = document.querySelector("#jawaban").value.trim();

    if (!input) return;

    const jawabanPengguna = jenisSoal === "huruf"
        ? input.toUpperCase()
        : normalisasiKode(input);

    const jawabanBenar = jenisSoal === "huruf"
        ? huruf
        : morse[huruf];

    sudahJawab = true;
    const benar = jawabanPengguna === jawabanBenar;

    if (benar) skor++;

    const hasil = document.querySelector("#hasil");
    hasil.className = benar ? "benar" : "salah";
    hasil.innerHTML = benar
        ? '<span class="feedback-success">✓</span>'
        : '<span class="feedback-wrong">✗</span><span class="feedback-answer">✓ : ' +
          jawabanBenar.replaceAll(".", "•").replaceAll("-", "–") + '</span>';

    document.querySelector("#jawaban").disabled = true;
    document.querySelector("#tombolJawab").disabled = true;
    document.querySelector("#skor").textContent = `SKOR ${skor}`;

    document.querySelector("#lanjut").textContent =
        posisi === soal.length - 1 ? "Selesai" : "Soal Berikutnya →";

    document.querySelector("#lanjut").hidden = false;
});

function berikutnya() {
    if (!sudahJawab) return;

    if (posisi < soal.length - 1) {
        posisi++;
        tampilkanSoal();
    } else {
        document.querySelector("#latihan").hidden = true;
        document.querySelector("#selesai").hidden = false;

        document.querySelector("#nilai").textContent = `${skor} / ${soal.length}`;
        document.querySelector("#jumlahBenar").textContent = skor;
        document.querySelector("#jumlahSalah").textContent = soal.length - skor;
        document.querySelector("#hasilBar").style.width =
            `${(skor / soal.length) * 100}%`;

        document.querySelector("#pesanAkhir").textContent =
            skor === 26 ? "Sempurna! Semua jawaban benar." :
            skor >= 20 ? "Bagus sekali! Terus pertahankan." :
            skor >= 13 ? "Bagus. Terus berlatih agar makin hafal." :
            "Terus berlatih. Kamu akan makin mahir.";

        window.scrollTo(0, 0);
    }
}

function kembali() {
    document.querySelector("#menu").hidden = false;
    document.querySelector("#latihan").hidden = true;
    document.querySelector("#selesai").hidden = true;
    window.scrollTo(0, 0);
}







// ===== TABEL RIWAYAT TIGA KOLOM =====
const historyPages = {
    huruf: 0,
    gabungan: 0,
    kode: 0
};

function renderRiwayat() {
    const body = document.querySelector("#historyBody");
    const arrows = document.querySelector("#historyArrows");
    if (!body || !arrows) return;

    const allRecords = JSON.parse(
        localStorage.getItem("morseHistory") || "[]"
    );

    const categories = [
        { key: "huruf", label: "Huruf" },
        { key: "gabungan", label: "Gabungan" },
        { key: "kode", label: "Kode" }
    ];

    const pageSize = 10;
    const recordsByCategory = {};

    categories.forEach(category => {
        recordsByCategory[category.key] = allRecords.filter(
            record => record.mode === category.key
        );

        const maxPage = Math.max(
            0,
            Math.ceil(recordsByCategory[category.key].length / pageSize) - 1
        );

        historyPages[category.key] = Math.min(
            historyPages[category.key],
            maxPage
        );
    });

    body.replaceChildren();
    arrows.replaceChildren();

    for (let i = 0; i < pageSize; i++) {
        const tr = document.createElement("tr");

        categories.forEach(category => {
            const records = recordsByCategory[category.key];
            const start = historyPages[category.key] * pageSize;
            const record = records[start + i];

            const numberCell = document.createElement("td");
            numberCell.className = "history-number";

            const actionCell = document.createElement("td");
            actionCell.className = "history-action";

            if (record) {
                const icon = document.createElement("span");
                icon.className = "history-icon";
                icon.textContent = "◷";

                const number = document.createElement("span");
                number.textContent = String(start + i + 1);

                numberCell.append(icon, number);

                const button = document.createElement("button");
                button.className = "history-view-button";
                button.textContent = "Lihat";
                button.addEventListener("click", () => {
                    const date = new Date(record.date).toLocaleString("id-ID");
                    alert(
                        `Jenis: ${category.label}\n` +
                        `Skor: ${record.score}/${record.total}\n` +
                        `Waktu: ${date}`
                    );
                });

                actionCell.appendChild(button);
            }

            tr.append(numberCell, actionCell);
        });

        body.appendChild(tr);
    }

    categories.forEach(category => {
        const td = document.createElement("td");
        td.colSpan = 2;
        td.className = "history-arrow-cell";

        const records = recordsByCategory[category.key];
        const currentPage = historyPages[category.key];
        const totalPages = Math.ceil(records.length / pageSize);

        if (currentPage > 0) {
            const previous = document.createElement("button");
            previous.className = "history-arrow";
            previous.textContent = "←";
            previous.setAttribute("aria-label", `Halaman sebelumnya: ${category.label}`);
            previous.addEventListener("click", () => {
                historyPages[category.key]--;
                renderRiwayat();
            });
            td.appendChild(previous);
        }

        if (currentPage < totalPages - 1) {
            const next = document.createElement("button");
            next.className = "history-arrow";
            next.textContent = "→";
            next.setAttribute("aria-label", `Halaman berikutnya: ${category.label}`);
            next.addEventListener("click", () => {
                historyPages[category.key]++;
                renderRiwayat();
            });
            td.appendChild(next);
        }

        arrows.appendChild(td);
    });
}

renderRiwayat();

