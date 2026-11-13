const form = document.querySelector("#form-nama");
const inputNama = document.querySelector("#nama");
const daftar = document.querySelector("#daftar-nama");
const pesan = document.querySelector("#pesan");
const tombolSimpan = document.querySelector("#tombol-simpan");
const tombolBatal = document.querySelector("#tombol-batal");
let idYangDiedit = null;

// GET /hello: baca data nama mahasiswa, lalu tampilkan pada tabel.
async function muatNama() {
  const response = await fetch("/hello");
  if (!response.ok) throw new Error("Data gagal dimuat.");
  const hasil = await response.json();
  daftar.replaceChildren();
  hasil.data.forEach((mahasiswa) => {
    const baris = daftar.insertRow();
    baris.insertCell().textContent = mahasiswa.id;
    baris.insertCell().textContent = mahasiswa.nama;
    const aksi = baris.insertCell();

    const tombolEdit = document.createElement("button");
    tombolEdit.type = "button";
    tombolEdit.className = "btn-edit";
    tombolEdit.dataset.id = mahasiswa.id;
    tombolEdit.dataset.aksi = "edit";
    tombolEdit.textContent = "Edit";

    const tombolHapus = document.createElement("button");
    tombolHapus.type = "button";
    tombolHapus.className = "btn-hapus";
    tombolHapus.dataset.id = mahasiswa.id;
    tombolHapus.dataset.aksi = "hapus";
    tombolHapus.textContent = "Hapus";

    aksi.append(tombolEdit, tombolHapus);
  });
}

function masukModeTambah() {
  idYangDiedit = null;
  form.reset();
  tombolSimpan.textContent = "Tambah nama";
  tombolBatal.hidden = true;
}

function masukModeEdit(id, nama) {
  idYangDiedit = id;
  inputNama.value = nama;
  tombolSimpan.textContent = "Simpan perubahan";
  tombolBatal.hidden = false;
  inputNama.focus();
}

async function kirimNama(method, url) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama: inputNama.value }),
  });
  const hasil = await response.json();
  if (!response.ok) throw new Error(hasil.message || "Permintaan gagal.");
  return hasil;
}

// POST atau PUT: simpan nama, lalu ambil ulang daftar.
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  tombolSimpan.disabled = true;
  pesan.textContent = "";
  try {
    const sedangEdit = idYangDiedit !== null;
    const url = sedangEdit ? `/hello/${idYangDiedit}` : "/hello";
    const hasil = await kirimNama(sedangEdit ? "PUT" : "POST", url);
    pesan.textContent = hasil.message;
    masukModeTambah();
    await muatNama();
  } catch (error) {
    pesan.textContent = error instanceof Error ? error.message : "Server tidak dapat dihubungi.";
  } finally {
    tombolSimpan.disabled = false;
  }
});

tombolBatal.addEventListener("click", masukModeTambah);

daftar.addEventListener("click", async (event) => {
  const tombol = event.target.closest("button[data-aksi]");
  if (!tombol) return;

  const id = Number(tombol.dataset.id);
  const baris = tombol.closest("tr");
  const nama = baris.cells[1].textContent;

  if (tombol.dataset.aksi === "edit") {
    masukModeEdit(id, nama);
    pesan.textContent = "Silakan ubah nama, lalu simpan.";
    return;
  }

  if (!confirm(`Hapus nama ${nama}?`)) return;

  tombol.disabled = true;
  pesan.textContent = "";
  try {
    const response = await fetch(`/hello/${id}`, { method: "DELETE" });
    const hasil = await response.json();
    if (!response.ok) throw new Error(hasil.message || "Data gagal dihapus.");
    pesan.textContent = hasil.message;
    await muatNama();
  } catch (error) {
    pesan.textContent = error instanceof Error ? error.message : "Server tidak dapat dihubungi.";
    tombol.disabled = false;
  }
});

muatNama().catch((error) => {
  pesan.textContent = error instanceof Error ? error.message : "Server tidak dapat dihubungi.";
});
