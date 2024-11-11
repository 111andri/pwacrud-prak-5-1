document.getElementById("studentForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Membuat transaksi dengan object store "student"
    let transaction = db.transaction(["student"], "readwrite");
    let objectStore = transaction.objectStore("student");

    // Membuat object dengan data dari form
    let request = objectStore.add({
        nim: document.getElementById("nim").value,
        name: document.getElementById("name").value,
        alamat: document.getElementById("alamat").value,
        asalSLTA: document.getElementById("asalSLTA").value,
        programStudi: document.getElementById("programStudi").value,
    });

    // Handler ketika berhasil menambah data
    request.onsuccess = function (event) {
        alert("Data berhasil ditambahkan");
        // Reset form setelah data berhasil ditambahkan
        document.getElementById("studentForm").reset();
    };

    // Handler ketika gagal menambah data
    request.onerror = function (event) {
        alert("Gagal menambahkan data");
    };
});

// tampil data student
document.getElementById("showStudentData").addEventListener("click", function () {
    let transaction = db.transaction(["student"], "readonly");
    let objectStore = transaction.objectStore("student");
    let request = objectStore.openCursor();
    let tableBody = document.querySelector("#studentTable tbody");
    tableBody.innerHTML = "";

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let row = tableBody.insertRow();
            row.insertCell().textContent = cursor.value.id;
            row.insertCell().textContent = cursor.value.nim;
            row.insertCell().textContent = cursor.value.name;
            row.insertCell().textContent = cursor.value.alamat;
            row.insertCell().textContent = cursor.value.asalSLTA;
            row.insertCell().textContent = cursor.value.programStudi;
            cursor.continue();
        }
    };
});

// Event listener untuk form hapus student
document.getElementById("deleteFormStudent").addEventListener("submit", function (e) {
    e.preventDefault();
    let id = parseInt(document.getElementById("deleteIdStudent").value);
    deleteStudent(id);
});

// Fungsi untuk menghapus data
function deleteStudent(id) {
    if (confirm("Apakah Anda yakin ingin menghapus data dengan ID " + id + "?")) {
        let transaction = db.transaction(["student"], "readwrite");
        let objectStore = transaction.objectStore("student");
        let request = objectStore.delete(id);

        request.onsuccess = function () {
            alert("Data dengan ID " + id + " berhasil dihapus");
            // Reset form
            document.getElementById("deleteFormStudent").reset();
            // Refresh tampilan tabel
            document.getElementById("showStudentData").click();
        };

        request.onerror = function (event) {
            alert("Gagal menghapus data: " + event.target.errorCode);
        };
    }
}

// Event listener untuk form update student
document.getElementById("updateFormStudent").addEventListener("submit", function (e) {
    e.preventDefault();
    let id = parseInt(document.getElementById("updateId").value);
    updateStudent(id);
});

// Event listener untuk mengisi form update ketika ID dimasukkan
document.getElementById("updateId").addEventListener("change", function () {
    let id = parseInt(this.value);
    getStudentById(id)
        .then(fillUpdateFormStudent)
        .catch((error) => alert(error));
});

// Fungsi untuk mengambil data berdasarkan ID
function getStudentById(id) {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(["student"], "readonly");
        let objectStore = transaction.objectStore("student");
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
function fillUpdateFormStudent(data) {
    document.getElementById("updateNim").value = data.nim;
    document.getElementById("updateName").value = data.name;
    document.getElementById("updateAlamat").value = data.alamat;
    document.getElementById("updateAsalSLTA").value = data.asalSLTA;
    document.getElementById("updateProgramStudi").value = data.programStudi;
}

// Fungsi untuk melakukan update data
function updateStudent(id) {
    let transaction = db.transaction(["student"], "readwrite");
    let objectStore = transaction.objectStore("student");

    let updatedData = {
        id: id,
        nim: document.getElementById("updateNim").value,
        name: document.getElementById("updateName").value,
        alamat: document.getElementById("updateAlamat").value,
        asalSLTA: document.getElementById("updateAsalSLTA").value,
        programStudi: document.getElementById("updateProgramStudi").value,
    };

    let request = objectStore.put(updatedData);

    request.onsuccess = function () {
        alert("Data berhasil diupdate");
        document.getElementById("updateFormStudent").reset();
        // Refresh tampilan tabel
        document.getElementById("showStudentData").click();
    };

    request.onerror = function (event) {
        alert("Gagal mengupdate data: " + event.target.errorCode);
    };
}

// end student
