document.getElementById("roomForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Membuat transaksi dengan object store "student"
    let transaction = db.transaction(["room"], "readwrite");
    let objectStore = transaction.objectStore("room");

    // Membuat object dengan data dari form
    let request = objectStore.add({
        kodeRuangan: document.getElementById("kodeRuangan").value,
        fasilitas: document.getElementById("fasilitas").value,
        dayaTampung: document.getElementById("dayaTampung").value,
        gedung: document.getElementById("gedung").value,
    });

    // Handler ketika berhasil menambah data
    request.onsuccess = function (event) {
        alert("Data berhasil ditambahkan");
        // Reset form setelah data berhasil ditambahkan
        document.getElementById("roomForm").reset();
    };

    // Handler ketika gagal menambah data
    request.onerror = function (event) {
        alert("Gagal menambahkan data");
    };
});

// tampil data employe
document.getElementById("showRoomData").addEventListener("click", function () {
    let transaction = db.transaction(["room"], "readonly");
    let objectStore = transaction.objectStore("room");
    let request = objectStore.openCursor();
    let tableBody = document.querySelector("#roomTable tbody");
    tableBody.innerHTML = "";

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let row = tableBody.insertRow();
            row.insertCell().textContent = cursor.value.id;
            row.insertCell().textContent = cursor.value.kodeRuangan;
            row.insertCell().textContent = cursor.value.fasilitas;
            row.insertCell().textContent = cursor.value.dayaTampung;
            row.insertCell().textContent = cursor.value.gedung;
            cursor.continue();
        }
    };
});

// Event listener untuk form hapus room
document.getElementById("deleteFormRoom").addEventListener("submit", function (e) {
    e.preventDefault();
    let id = parseInt(document.getElementById("deleteIdRoom").value);
    deleteRoom(id);
});

// Fungsi untuk menghapus data
function deleteRoom(id) {
    if (confirm("Apakah Anda yakin ingin menghapus data dengan ID " + id + "?")) {
        let transaction = db.transaction(["room"], "readwrite");
        let objectStore = transaction.objectStore("room");
        let request = objectStore.delete(id);

        request.onsuccess = function () {
            alert("Data dengan ID " + id + " berhasil dihapus");
            // Reset form
            document.getElementById("deleteFormRoom").reset();
            // Refresh tampilan tabel
            document.getElementById("showRoomData").click();
        };

        request.onerror = function (event) {
            alert("Gagal menghapus data: " + event.target.errorCode);
        };
    }
}

// Event listener untuk form update room
document.getElementById("updateFormRoom").addEventListener("submit", function (e) {
    e.preventDefault();
    let id = parseInt(document.getElementById("updateId").value);
    updateRoom(id);
});

// Event listener untuk mengisi form update ketika ID dimasukkan
document.getElementById("updateId").addEventListener("change", function () {
    let id = parseInt(this.value);
    getRoomById(id)
        .then(fillUpdateFormRoom)
        .catch((error) => alert(error));
});

// Fungsi untuk mengambil data berdasarkan ID
function getRoomById(id) {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(["room"], "readonly");
        let objectStore = transaction.objectStore("room");
        let request = objectStore.get(id);

        request.onsuccess = function (event) {
            if (request.result) {
                resolve(request.result);
            } else {
                reject("Data tidak ditemukan");
            }
        };

        request.onerror = function (event) {
            reject("Error mengambil data");
        };
    });
}

// Fungsi untuk mengisi form update dengan data yang ada
function fillUpdateFormRoom(data) {
    document.getElementById("updateKodeRuangan").value = data.kodeRuangan;
    document.getElementById("updateFasilitas").value = data.fasilitas;
    document.getElementById("updateDayaTampung").value = data.dayaTampung;
    document.getElementById("updateGedung").value = data.gedung;
}

// Fungsi untuk melakukan update data
function updateRoom(id) {
    let transaction = db.transaction(["room"], "readwrite");
    let objectStore = transaction.objectStore("room");

    let updatedData = {
        id: id,
        kodeRuangan: document.getElementById("updateKodeRuangan").value,
        fasilitas: document.getElementById("updateFasilitas").value,
        dayaTampung: document.getElementById("updateDayaTampung").value,
        gedung: document.getElementById("updateGedung").value,
    };

    let request = objectStore.put(updatedData);

    request.onsuccess = function () {
        alert("Data berhasil diupdate");
        document.getElementById("updateFormRoom").reset();
        // Refresh tampilan tabel
        document.getElementById("showRoomData").click();
    };

    request.onerror = function (event) {
        alert("Gagal mengupdate data: " + event.target.errorCode);
    };
}
