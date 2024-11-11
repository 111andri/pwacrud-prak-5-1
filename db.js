let db;
window.onload = function () {
    let request = indexedDB.open("USTI", 1);
    request.onupgradeneeded = function (event) {
        db = event.target.result;

        // buat employe store
        let employeStore = db.createObjectStore("employe", {
            keyPath: "id",
            autoIncrement: true,
        });

        employeStore.createIndex("nik", "nik", { unique: false });
        employeStore.createIndex("name", "name", { unique: false });
        employeStore.createIndex("tempatLahir", "tempatLahir", { unique: false });
        employeStore.createIndex("statusKeluarga", "statusKeluarga", { unique: false });
        employeStore.createIndex("jmlhAnak", "jmlhAnak", { unique: false });
        employeStore.createIndex("alamat", "alamat", { unique: false });

        // buat studenstore
        let studentStore = db.createObjectStore("student", {
            keyPath: "id",
            autoIncrement: true,
        });

        studentStore.createIndex("nim", "nim", { unique: false });
        studentStore.createIndex("name", "name", { unique: false });
        studentStore.createIndex("alamat", "alamat", { unique: false });
        studentStore.createIndex("asalSLTA", "asalSLTA", { unique: false });
        studentStore.createIndex("programStudi", "programStudi", { unique: false });

        // buat room store
        let roomtStore = db.createObjectStore("room", {
            keyPath: "id",
            autoIncrement: true,
        });

        roomtStore.createIndex("kodeRoom", "kodeRoom", { unique: false });
        roomtStore.createIndex("fasilitas", "fasilitas", { unique: false });
        roomtStore.createIndex("dayaTampung", "dayaTampung", { unique: false });
        roomtStore.createIndex("gedung", "gedung", { unique: false });
    };
    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("Database opened successfully");
    };
    request.onerror = function (event) {
        console.log("Error opening database: " + event.target.errorCode);
    };
};
