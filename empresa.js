// Perfil da empresa: identifica setor e nível (por CNPJ ou informado pelo cliente)
// e adapta o portal com um kit de produtos indicado.

const SETORES = [
  { id: "comercio", icone: "🛍️", nome: "Comércio e Varejo" },
  { id: "alimentacao", icone: "🍽️", nome: "Alimentação" },
  { id: "servicos", icone: "🤝", nome: "Serviços" },
  { id: "saude", icone: "💆", nome: "Saúde e Beleza" },
  { id: "industria", icone: "🏭", nome: "Indústria" },
  { id: "construcao", icone: "🏗️", nome: "Construção" },
  { id: "educacao", icone: "📚", nome: "Educação" },
  { id: "tecnologia", icone: "💻", nome: "Tecnologia" },
];

const NIVEIS = [
  { id: "iniciante", nome: "Iniciante", desc: "Começando: organizar, formalizar e vender os primeiros clientes." },
  { id: "crescente", nome: "Em crescimento", desc: "Vendendo: estruturar processos, equipe e tecnologia." },
  { id: "consolidada", nome: "Consolidada", desc: "Escalando: automação, gestão avançada e TI sob medida." },
];

// Kit base por nível + produtos extras por setor (ids de PRODUTOS em app.js).
const KIT_NIVEL = {
  iniciante: [9, 3, 4, 8, 10],
  crescente: [1, 5, 7, 14, 15, 6],
  consolidada: [18, 19, 13, 2, 12],
};
const KIT_SETOR = {
  comercio: [17, 16],
  alimentacao: [17, 2],
  servicos: [2, 4],
  saude: [2, 8],
  industria: [13, 18],
  construcao: [14, 4],
  educacao: [1, 8],
  tecnologia: [18, 15],
};

// Primeiros 2 dígitos do CNAE → setor.
function setorPorCnae(cnae) {
  const d = Number(String(cnae).slice(0, 2));
  if (d >= 45 && d <= 47) return "comercio";
  if (d === 56 || d === 10 || d === 11) return "alimentacao";
  if ((d >= 86 && d <= 88) || d === 96) return "saude";
  if (d >= 12 && d <= 33) return "industria";
  if (d >= 41 && d <= 43) return "construcao";
  if (d === 85) return "educacao";
  if (d >= 61 && d <= 63) return "tecnologia";
  return "servicos";
}

// Porte e idade da empresa → nível.
function nivelPorDados(porte, inicio, mei) {
  const anos = (Date.now() - new Date(inicio).getTime()) / 3.156e10;
  const p = String(porte || "").toUpperCase();
  if (mei || anos < 2) return "iniciante";
  if (p.includes("DEMAIS") || anos >= 8) return "consolidada";
  return "crescente";
}

const lerPerfil = () => { try { return JSON.parse(localStorage.getItem("doreiEmpresa")); } catch { return null; } };
const gravarPerfil = (p) => { try { localStorage.setItem("doreiEmpresa", JSON.stringify(p)); } catch {} };

// Usado por app.js para anexar a empresa aos pedidos no WhatsApp.
function resumoEmpresa() {
  const p = lerPerfil();
  if (!p) return "";
  const setor = SETORES.find((s) => s.id === p.setor).nome;
  const nivel = NIVEIS.find((n) => n.id === p.nivel).nome;
  return `\n\nEmpresa: ${p.nome}${p.cnpj ? ` (CNPJ ${p.cnpj})` : " (sem CNPJ)"}\nSetor: ${setor} · Nível: ${nivel}`;
}

function kitPara(p) {
  return [...new Set([...KIT_NIVEL[p.nivel], ...KIT_SETOR[p.setor]])];
}

function renderPerfil(p) {
  const setor = SETORES.find((s) => s.id === p.setor);
  const nivel = NIVEIS.find((n) => n.id === p.nivel);
  const kit = kitPara(p).map((id) => PRODUTOS.find((x) => x.id === id));
  const total = kit.reduce((s, x) => s + x.preco, 0);
  const temOrcamento = kit.some((x) => !x.preco);

  document.querySelectorAll(".setor-chip").forEach((b) => b.classList.toggle("ativo", b.dataset.setor === p.setor));

  const el = $("#perfilEmpresa");
  el.innerHTML = `
    <div class="perfil-topo">
      <div>
        <h3>${p.nome}</h3>
        <p>${setor.icone} ${setor.nome}${p.cnpj ? ` · CNPJ ${p.cnpj}` : " · Sem CNPJ — ajudamos a formalizar"}${p.cidade ? ` · ${p.cidade}` : ""}</p>
      </div>
      <div class="niveis">${NIVEIS.map((n) => `<span class="${n.id === p.nivel ? "ativo" : ""}">${n.nome}</span>`).join("")}</div>
    </div>
    <p><strong>Nível ${nivel.nome}:</strong> ${nivel.desc}</p>
    <h3>Kit indicado para sua empresa</h3>
    <ul class="kit">${kit.map((x) => `<li><span>${x.nome}</span><strong>${brl(x.preco)}</strong></li>`).join("")}</ul>
    <p>Total dos itens com preço: <strong>${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>${temOrcamento ? " + itens sob orçamento" : ""}</p>
    <div class="acoes">
      <button class="btn" id="addKit">Adicionar kit ao carrinho</button>
      <button class="btn btn-sec" id="trocarEmpresa">Trocar empresa</button>
    </div>`;
  el.classList.remove("oculto");
  $("#addKit").onclick = () => adicionarAoCarrinho(kitPara(p));
  $("#trocarEmpresa").onclick = () => {
    try { localStorage.removeItem("doreiEmpresa"); } catch {}
    el.classList.add("oculto");
    document.querySelectorAll(".setor-chip").forEach((b) => b.classList.remove("ativo"));
  };
}

function definirPerfil(p) {
  gravarPerfil(p);
  renderPerfil(p);
  $("#msgEmpresa").textContent = "";
}

function trocarAba(aba) {
  document.querySelectorAll(".abas button").forEach((b) => b.classList.toggle("ativo", b.dataset.aba === aba));
  $("#formCnpj").classList.toggle("oculto", aba !== "cnpj");
  $("#formManual").classList.toggle("oculto", aba !== "manual");
}

document.addEventListener("DOMContentLoaded", () => {
  $("#setoresTopo").innerHTML = SETORES.map((s) =>
    `<button class="setor-chip" data-setor="${s.id}">${s.icone} ${s.nome}</button>`).join("");
  $("#selSetor").innerHTML = SETORES.map((s) => `<option value="${s.id}">${s.nome}</option>`).join("");
  $("#selNivel").innerHTML = NIVEIS.map((n) => `<option value="${n.id}">${n.nome}</option>`).join("");

  const salvo = lerPerfil();
  if (salvo) renderPerfil(salvo);

  // Clique num setor do topo: leva ao formulário com o setor já escolhido.
  $("#setoresTopo").addEventListener("click", (e) => {
    const setor = e.target.closest(".setor-chip")?.dataset.setor;
    if (!setor) return;
    const atual = lerPerfil();
    if (atual) return definirPerfil({ ...atual, setor });
    trocarAba("manual");
    $("#selSetor").value = setor;
    $("#empresa").scrollIntoView({ behavior: "smooth" });
  });

  $(".abas").addEventListener("click", (e) => e.target.dataset.aba && trocarAba(e.target.dataset.aba));

  $("#formCnpj").addEventListener("submit", async (e) => {
    e.preventDefault();
    const cnpj = new FormData(e.target).get("cnpj").replace(/\D/g, "");
    if (cnpj.length !== 14) {
      $("#msgEmpresa").textContent = "O CNPJ precisa ter 14 dígitos.";
      return;
    }
    $("#msgEmpresa").textContent = "Consultando dados públicos da Receita Federal…";
    try {
      const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      definirPerfil({
        nome: d.nome_fantasia || d.razao_social,
        cnpj: cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"),
        cidade: d.municipio && `${d.municipio}/${d.uf}`,
        setor: setorPorCnae(d.cnae_fiscal),
        nivel: nivelPorDados(d.porte, d.data_inicio_atividade, d.opcao_pelo_mei),
      });
    } catch {
      $("#msgEmpresa").textContent = "Não encontramos esse CNPJ. Confira os números ou use “Não tenho CNPJ”.";
    }
  });

  $("#formManual").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    definirPerfil({ nome: d.get("nome"), cnpj: "", setor: d.get("setor"), nivel: d.get("nivel") });
  });
});
