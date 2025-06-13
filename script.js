const btn = document.getElementById("analyzeBtn");
const dreamInput = document.getElementById("dreamInput");
const resultBox = document.getElementById("result");
const symbolic = document.getElementById("symbolic");
const emotional = document.getElementById("emotional");
const advice = document.getElementById("advice");

btn.addEventListener("click", async () => {
  const dreamText = dreamInput.value.trim();
  if (!dreamText) return alert("Por favor, escribí tu sueño.");

  btn.disabled = true;
  btn.textContent = "Interpretando...";
  resultBox.classList.add("hidden");

  try {
    const res = await fetch('/.netlify/functions/interpretar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sueño: dreamText }),
    });

    if (!res.ok) throw new Error('Error en la respuesta del servidor.');

    const data = await res.json();
    const output = data.respuesta;

    const parts = output.split(/\d+\.\s/).filter(x => x.trim() !== "");

    symbolic.textContent = parts[0] || "No se pudo analizar.";
    emotional.textContent = parts[1] || "No se pudo analizar.";
    advice.textContent = parts[2] || "No se pudo analizar.";
    resultBox.classList.remove("hidden");

  } catch (err) {
    alert("Error al interpretar el sueño.");
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = "Interpretar sueño";
  }
});
