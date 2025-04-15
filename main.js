function hitung() {
    const angka1 = parseFloat(document.getElementById('angka1').value);
    const angka2 = parseFloat(document.getElementById('angka2').value);
    const operator = document.getElementById('operator').value;
    let hasil;

    if (isNaN(angka1) || isNaN(angka2)) {
        hasil = "Masukkan angka yang valid";
    } else {
        switch (operator) {
            case '+':
                hasil = angka1 + angka2;
                break;
            case '-':
                hasil = angka1 - angka2;
                break;
            case '*':
                hasil = angka1 * angka2;
                break;
            case '/':
                hasil = angka2 !== 0 ? angka1 / angka2 : "Tidak bisa dibagi 0";
                break;
        }
    }

    document.getElementById('hasil').textContent = hasil.toFixed(2);
}