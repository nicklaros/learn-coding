let skorPemain = 0;
let skorKomputer = 0;
let opsi = ["batu", "gunting", "kertas"];

while (skorPemain < 2 && skorKomputer < 2) {
  let angkaAcak = Math.random();
  let angkaAcak3 = angkaAcak * 3;
  let indeks = Math.floor(angkaAcak3);
  let pilihanKomputer = opsi[indeks];

  let pilihanPemain = prompt(
    "Pilih: batu, gunting, atau kertas?"
  ).toLowerCase();

  let pilihanPemainValid = opsi.includes(pilihanPemain);
  if (pilihanPemainValid == false) {
    alert("Input tidak valid! Pilih batu/gunting/kertas.");
    continue;
  }

  let apakahSeri = pilihanPemain === pilihanKomputer;

  let apakahPemainMenang =
    (pilihanPemain === "batu" && pilihanKomputer === "gunting") ||
    (pilihanPemain === "gunting" && pilihanKomputer === "kertas") ||
    (pilihanPemain === "kertas" && pilihanKomputer === "batu");

  let pemenang;
  if (apakahSeri) {
    alert("Seri! Komputer memilih: " + pilihanKomputer);
  } else if (apakahPemainMenang) {
    alert("Kamu MENANG! Komputer memilih: " + pilihanKomputer);
    pemenang = "pemain";
  } else {
    alert("Yah kamu KALAH! Komputer memilih: " + pilihanKomputer);
    pemenang = "komputer";
  }

  if (pemenang === "pemain") {
    skorPemain++;
  } else if (pemenang === "komputer") {
    skorKomputer++;
  }

  alert("Skor: Kamu " + skorPemain + " - " + skorKomputer + " Komputer");
}
