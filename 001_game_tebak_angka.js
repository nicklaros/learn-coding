let random10 = Math.random() * 10;
let angkaRahasia = Math.floor(random10) + 1;

let nyawa = 3;
while (nyawa > 0) {
  let tebakan = parseInt(prompt(`Tebak angka 1-10 (nyawa: ${nyawa})!`) ?? "");

  if (tebakan === angkaRahasia) {
    alert("Benar! 🎉");
    break;
  } else {
    alert("Salah! 😅");
    nyawa--;
  }
}
