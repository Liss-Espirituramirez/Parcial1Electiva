const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Separar el nombre en letras
const h1 = document.getElementById("nombre");
h1.innerHTML = [...h1.textContent].map(c =>
  c === " " ? '<span class="espacio"></span>' : `<span class="letra">${c}</span>`
).join("");

// Frases que se escriben solas
const frases = [ "Práctica de integración continua ", "Desplegado con GitHub Actions + Surge "];
const salida = document.getElementById("frase");
let f = 0, i = 0, borrando = false;
function escribir() {
  const actual = frases[f];
  salida.textContent = actual.slice(0, i);
  if (!borrando && i === actual.length) { borrando = true; return setTimeout(escribir, 1400); }
  if (borrando && i === 0) { borrando = false; f = (f + 1) % frases.length; }
  i += borrando ? -1 : 1;
  setTimeout(escribir, borrando ? 35 : 70);
}

if (reducir) {
  salida.textContent = frases[0];
} else {
  // Corazones y brillos que suben
  const emojis = ["💖", "🍜", "❤️", "✨", "🥢", "💗", "🌸", "💕"];

  // Pucca: flota suavemente y salta al hacer clic
  const mascota = document.getElementById("mascota");
  gsap.to(mascota, { y: -10, rotation: 4, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
  mascota.addEventListener("click", () =>
    gsap.fromTo(mascota, { scale: 1 }, { scale: 1.25, yoyo: true, repeat: 1, duration: 0.2, ease: "back.out(3)" })
  );
  const flota = document.getElementById("flota");
  for (let n = 0; n < 22; n++) {
    const s = document.createElement("span");
    s.textContent = emojis[n % emojis.length];
    s.style.left = gsap.utils.random(0, 96) + "%";
    s.style.fontSize = gsap.utils.random(16, 38) + "px";
    s.style.opacity = gsap.utils.random(0.5, 0.9);
    flota.appendChild(s);
    gsap.to(s, {
      y: -(innerHeight + 120), x: gsap.utils.random(-60, 60), rotation: gsap.utils.random(-40, 40),
      duration: gsap.utils.random(8, 16), delay: gsap.utils.random(0, 10),
      repeat: -1, ease: "none"
    });
  }

  // Entrada: el carnet aparece rebotando, las letras saltan
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from("#carnet", { scale: 0.6, opacity: 0, rotation: -8, duration: 0.9, ease: "back.out(1.7)" })
    .from(".letra", { y: -50, opacity: 0, scale: 0.3, stagger: 0.05, duration: 0.6, ease: "bounce.out" }, "-=0.3")
    .from(".escuela, .matricula", { opacity: 0, y: 14, stagger: 0.12, duration: 0.5 }, "-=0.2")
    .add(escribir);

  // Matrícula que "cuenta" hasta su valor
  const mat = document.getElementById("mat");
  const final = mat.textContent;
  const obj = { n: 0 };
  gsap.to(obj, {
    n: 1, duration: 1.4, delay: 1.2, ease: "power2.out",
    onUpdate() { mat.textContent = final.replace(/\d/g, d => Math.random() < obj.n ? d : Math.floor(Math.random() * 10)); },
    onComplete() { mat.textContent = final; }
  });

  // Inclinación 3D con el mouse
  const carnet = document.getElementById("carnet");
  window.addEventListener("pointermove", e => {
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    gsap.to(carnet, { rotationY: x * 12, rotationX: -y * 12, duration: 0.6, ease: "power2.out" });
  });

  // Clic en el nombre: las letras saltan, y salen corazones
  h1.addEventListener("click", () =>
    gsap.fromTo(".letra", { y: 0 }, { y: -18, stagger: { each: 0.04, yoyo: true, repeat: 1 }, duration: 0.2, ease: "power1.out" })
  );
}