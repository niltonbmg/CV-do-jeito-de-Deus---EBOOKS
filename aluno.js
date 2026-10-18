// ATENÇÃO: este login roda só no navegador e serve como protótipo.
// Para proteger os cursos de verdade, use uma plataforma com backend
// (ex.: Hotmart, Kiwify, Eduzz ou Firebase Auth + pagamento recorrente).
const CODIGO_ACESSO = "DOREI2026";

const CURSOS = [
  { id: "empreender", icone: "🚀", nome: "Empreender do Jeito de Deus", aulas: ["Propósito e chamado", "Validando sua ideia", "Primeiras vendas", "Integridade nos negócios"] },
  { id: "financas", icone: "📊", nome: "Finanças para Pequenos Negócios", aulas: ["Separando PF e PJ", "Fluxo de caixa", "Precificação lucrativa", "Planejamento anual"] },
  { id: "digital", icone: "💻", nome: "Negócio Digital do Zero", aulas: ["Seu site profissional", "WhatsApp Business", "Instagram que vende", "Automação de atendimento"] },
  { id: "escritorio", icone: "🗂️", nome: "Escritório Produtivo", aulas: ["Planilhas essenciais", "Modelos de documentos", "Organização e rotina", "Ferramentas gratuitas"] },
  { id: "mei", icone: "⚖️", nome: "MEI na Prática", aulas: ["Abrindo seu MEI", "Nota fiscal", "DAS e declaração anual", "Quando virar ME"] },
];

const $ = (s) => document.querySelector(s);
const ler = (k, padrao) => { try { return JSON.parse(localStorage.getItem(k)) ?? padrao; } catch { return padrao; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

let progresso = ler("doreiProgresso", {});

function concluidas(curso) {
  return (progresso[curso.id] || []).length;
}

function mostrar(id) {
  ["#formLogin", "#painel", "#curso"].forEach((s) => $(s).classList.toggle("oculto", s !== id));
  $("#sair").classList.toggle("oculto", id === "#formLogin");
}

function renderPainel() {
  $("#nomeAluno").textContent = ler("doreiAluno", "").split("@")[0];
  $("#gradeCursos").innerHTML = CURSOS.map((c) => {
    const pct = Math.round((concluidas(c) / c.aulas.length) * 100);
    return `
    <div class="card">
      <div class="icone">${c.icone}</div>
      <h3>${c.nome}</h3>
      <p>${c.aulas.length} aulas · ${pct}% concluído</p>
      <div class="progresso"><div style="width:${pct}%"></div></div>
      <button class="btn" data-curso="${c.id}">${pct ? "Continuar" : "Começar"}</button>
    </div>`;
  }).join("");
  mostrar("#painel");
}

function abrirCurso(id) {
  const c = CURSOS.find((x) => x.id === id);
  const feitas = progresso[id] || [];
  $("#tituloCurso").textContent = c.nome;
  $("#barraCurso").style.width = `${(feitas.length / c.aulas.length) * 100}%`;
  $("#listaAulas").innerHTML = c.aulas.map((a, i) => `
    <li><span>Aula ${i + 1} — ${a}</span>
    <input type="checkbox" data-curso="${id}" data-aula="${i}" ${feitas.includes(i) ? "checked" : ""} aria-label="Concluída"></li>`).join("");
  mostrar("#curso");
}

document.addEventListener("DOMContentLoaded", () => {
  if (ler("doreiAluno", null)) renderPainel();

  $("#formLogin").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    if (d.get("codigo").trim().toUpperCase() !== CODIGO_ACESSO) {
      $("#erroLogin").classList.remove("oculto");
      return;
    }
    gravar("doreiAluno", d.get("email"));
    renderPainel();
  });

  $("#gradeCursos").addEventListener("click", (e) => e.target.dataset.curso && abrirCurso(e.target.dataset.curso));
  $("#voltar").addEventListener("click", (e) => { e.preventDefault(); renderPainel(); });

  $("#listaAulas").addEventListener("change", (e) => {
    const { curso, aula } = e.target.dataset;
    const feitas = new Set(progresso[curso] || []);
    e.target.checked ? feitas.add(Number(aula)) : feitas.delete(Number(aula));
    progresso[curso] = [...feitas];
    gravar("doreiProgresso", progresso);
    abrirCurso(curso);
  });

  $("#sair").addEventListener("click", () => {
    try { localStorage.removeItem("doreiAluno"); } catch {}
    mostrar("#formLogin");
  });
});
