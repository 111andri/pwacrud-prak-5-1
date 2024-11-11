// employe
document.getElementById("employeForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let transaction = db.transaction(["employe"], "readwrite");
    let objectStore = transaction.objectStore("employe");

    let request = objectStore.add({
        nik: document.getElementById("nik").value,
        name: document.getElementById("name").value,
        tempatLahir: document.getElementById("tempatLahir").value,
        statusKeluarga: document.getElementById("statusKeluarga").value,
        jmlhAnak: parseInt(document.getElementById("jmlhAnak").value),
        alamat: document.getElementById("alamat").value,
    });
    if (request) {
        alert("data berhasil di tambhakan");
    } else {
        alert("data gagal di tambahkan");
    }

    request.onsuccess = function (event) {
        console.log("Data berhasil ditambahkan");
        // Reset form
        document.getElementById("employeForm").reset();
    };

    request.onerror = function (event) {
        console.log("Error: " + event.target.error);
    };
});

// tampil data employe
document.getElementById("showEmployeData").addEventListener("click", function () {
    let transaction = db.transaction(["employe"], "readonly");
    let objectStore = transaction.objectStore("employe");
    let request = objectStore.openCursor();
    let tableBody = document.querySelector("#employeTable tbody");
    tableBody.innerHTML = "";

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let row = tableBody.insertRow();
            row.insertCell().textContent = cursor.value.id;
            row.insertCell().textContent = cursor.value.nik;
            row.insertCell().textContent = cursor.value.name;
            row.insertCell().textContent = cursor.value.tempatLahir;
            row.insertCell().textContent = cursor.value.statusKeluarga;
            row.insertCell().textContent = cursor.value.jmlhAnak;
            row.insertCell().textContent = cursor.value.alamat;
            cursor.continue();
        }
    };
});

// Event listener untuk form hapus
document.getElementById("deleteForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let id = parseInt(document.getElementById("deleteId").value);
    deleteEmploye(id);
});

// Fungsi untuk menghapus data
function deleteEmploye(id) {
    if (confirm("Apakah Anda yakin ingin menghapus data dengan ID " + id + "?")) {
        let transaction = db.transaction(["employe"], "readwrite");
        let objectStore = transaction.objectStore("employe");
        let request = objectStore.delete(id);

        request.onsuccess = function () {
            alert("Data dengan ID " + id + " berhasil dihapus");
            // Reset form
            document.getElementById("deleteForm").reset();
            // Refresh tampilan tabel
            document.getElementById("showEmployeData").click();
        };

        request.onerror = function (event) {
            alert("Gagal menghapus data: " + event.target.errorCode);
        };
    }
}

// Event listener untuk form update
document.getElementById("updateForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let id = parseInt(document.getElementById("updateId").value);
    updateEmploye(id);
});

// Event listener untuk mengisi form update ketika ID dimasukkan
document.getElementById("updateId").addEventListener("change", function () {
    let id = parseInt(this.value);
    getEmployeById(id)
        .then(fillUpdateForm)
        .catch((error) => alert(error));
});

// Fungsi untuk mengambil data berdasarkan ID
function getEmployeById(id) {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(["employe"], "readonly");
        let objectStore = transaction.objectStore("employe");
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
function fillUpdateForm(data) {
    document.getElementById("updateNik").value = data.nik;
    document.getElementById("updateName").value = data.name;
    document.getElementById("updateTempatLahir").value = data.tempatLahir;
    document.getElementById("updateStatusKeluarga").value = data.statusKeluarga;
    document.getElementById("updateJmlhAnak").value = data.jmlhAnak;
    document.getElementById("updateAlamat").value = data.alamat;
}

// Fungsi untuk melakukan update data
function updateEmploye(id) {
    let transaction = db.transaction(["employe"], "readwrite");
    let objectStore = transaction.objectStore("employe");

    let updatedData = {
        id: id,
        nik: document.getElementById("updateNik").value,
        name: document.getElementById("updateName").value,
        tempatLahir: document.getElementById("updateTempatLahir").value,
        statusKeluarga: document.getElementById("updateStatusKeluarga").value,
        jmlhAnak: parseInt(document.getElementById("updateJmlhAnak").value),
        alamat: document.getElementById("updateAlamat").value,
    };

    let request = objectStore.put(updatedData);

    request.onsuccess = function () {
        alert("Data berhasil diupdate");
        document.getElementById("updateForm").reset();
        // Refresh tampilan tabel
        document.getElementById("showEmployeData").click();
    };

    request.onerror = function (event) {
        alert("Gagal mengupdate data: " + event.target.errorCode);
    };
}
