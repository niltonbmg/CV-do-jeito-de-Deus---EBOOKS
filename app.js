// Número do WhatsApp para receber pedidos e contatos (formato internacional, só dígitos).
const WHATSAPP = "5500000000000";

const AREAS = [
  { id: "tecnologia", icone: "💻", nome: "Tecnologia", desc: "Sites, sistemas, automações, suporte de TI e transformação digital." },
  { id: "escritorio", icone: "🗂️", nome: "Escritório", desc: "Planilhas, modelos de documentos, organização e produtividade." },
  { id: "gestao", icone: "📊", nome: "Gestão e Finanças", desc: "Fluxo de caixa, precificação, planejamento e controle financeiro." },
  { id: "marketing", icone: "📣", nome: "Marketing e Vendas", desc: "Redes sociais, identidade visual, funis de venda e atendimento." },
  { id: "juridico", icone: "⚖️", nome: "Legal e Formalização", desc: "Abertura de MEI/empresa, contratos e regularização." },
  { id: "educacao", icone: "🎓", nome: "Conhecimento", desc: "E-books, cursos e mentorias para empreendedores." },
];

const PRODUTOS = [
  { id: 1, area: "tecnologia", nome: "Site Profissional para Pequenos Negócios", desc: "Site responsivo com WhatsApp, Google Maps e domínio.", preco: 497 },
  { id: 2, area: "tecnologia", nome: "Automação de Atendimento", desc: "Respostas automáticas e catálogo no WhatsApp Business.", preco: 297 },
  { id: 3, area: "escritorio", nome: "Kit Planilhas do Empreendedor", desc: "Controle de estoque, vendas, clientes e agenda.", preco: 67 },
  { id: 4, area: "escritorio", nome: "Pacote de Modelos de Documentos", desc: "Propostas, recibos, orçamentos e contratos editáveis.", preco: 47 },
  { id: 5, area: "gestao", nome: "Planilha de Fluxo de Caixa Inteligente", desc: "Dashboard financeiro com projeções mensais.", preco: 57 },
  { id: 6, area: "gestao", nome: "Consultoria de Precificação", desc: "Sessão de 1h para definir preços lucrativos.", preco: 197 },
  { id: 7, area: "marketing", nome: "Identidade Visual Essencial", desc: "Logo, paleta de cores e kit para redes sociais.", preco: 347 },
  { id: 8, area: "marketing", nome: "30 Dias de Conteúdo", desc: "Calendário e artes prontas para Instagram.", preco: 127 },
  { id: 9, area: "juridico", nome: "Guia Completo do MEI", desc: "Passo a passo para abrir, manter e crescer como MEI.", preco: 37 },
  { id: 10, area: "educacao", nome: "E-book: Empreender do Jeito de Deus", desc: "Princípios de fé, propósito e excelência nos negócios.", preco: 29.9 },
  { id: 11, area: "educacao", nome: "E-book: Currículo do Jeito de Deus", desc: "Como montar um currículo que abre portas.", preco: 19.9 },
  { id: 12, area: "educacao", nome: "Mentoria Empreendedor Real", desc: "4 encontros individuais para destravar seu negócio.", preco: 597 },
];

const ARTIGOS = [
  { icone: "🚀", titulo: "Como validar sua ideia de negócio em 7 dias", resumo: "Teste a demanda antes de investir: pesquisa, protótipo e primeiras vendas." },
  { icone: "💰", titulo: "Separando dinheiro pessoal e da empresa", resumo: "O primeiro passo para a saúde financeira de qualquer negócio." },
  { icone: "📱", titulo: "Vendendo pelo WhatsApp com profissionalismo", resumo: "Catálogo, etiquetas, mensagens rápidas e pós-venda." },
  { icone: "🙏", titulo: "Propósito e fé no empreendedorismo", resumo: "Integridade, mordomia e serviço como base de um negócio duradouro." },
];

const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const $ = (s) => document.querySelector(s);
const nomeArea = (id) => AREAS.find((a) => a.id === id).nome;

let carrinho = [];
try { carrinho = JSON.parse(localStorage.getItem("doreiCarrinho")) || []; } catch {}

function salvar() {
  try { localStorage.setItem("doreiCarrinho", JSON.stringify(carrinho)); } catch {}
}

function renderAreas() {
  $("#gradeAreas").innerHTML = AREAS.map((a) => `
    <div class="card">
      <div class="icone">${a.icone}</div>
      <h3>${a.nome}</h3>
      <p>${a.desc}</p>
      <a class="btn" href="#loja" data-area="${a.id}">Ver soluções</a>
    </div>`).join("");
  $("#gradeAreas").addEventListener("click", (e) => {
    const area = e.target.dataset.area;
    if (area) filtrar(area);
  });
}

function renderFiltros(ativa) {
  const botoes = [{ id: "todas", nome: "Todas" }, ...AREAS];
  $("#filtros").innerHTML = botoes.map((a) =>
    `<button data-area="${a.id}" class="${a.id === ativa ? "ativo" : ""}">${a.nome}</button>`).join("");
}

function filtrar(area) {
  renderFiltros(area);
  const lista = area === "todas" ? PRODUTOS : PRODUTOS.filter((p) => p.area === area);
  $("#gradeProdutos").innerHTML = lista.map((p) => `
    <div class="card">
      <span class="tag">${nomeArea(p.area)}</span>
      <h3>${p.nome}</h3>
      <p>${p.desc}</p>
      <div class="preco">${brl(p.preco)}</div>
      <button class="btn" data-add="${p.id}">Adicionar ao carrinho</button>
    </div>`).join("");
}

function renderArtigos() {
  $("#gradeArtigos").innerHTML = ARTIGOS.map((a) => `
    <div class="card">
      <div class="icone">${a.icone}</div>
      <h3>${a.titulo}</h3>
      <p>${a.resumo}</p>
    </div>`).join("");
}

function renderCarrinho() {
  $("#qtdCarrinho").textContent = carrinho.length;
  $("#itensCarrinho").innerHTML = carrinho.length
    ? carrinho.map((id, i) => {
        const p = PRODUTOS.find((x) => x.id === id);
        return `<li><span>${p.nome}<br><strong>${brl(p.preco)}</strong></span><button data-rm="${i}">Remover</button></li>`;
      }).join("")
    : "<li>Seu carrinho está vazio.</li>";
  const total = carrinho.reduce((s, id) => s + PRODUTOS.find((x) => x.id === id).preco, 0);
  $("#totalCarrinho").textContent = brl(total);
}

function abrirWhatsApp(texto) {
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  $("#ano").textContent = new Date().getFullYear();
  $("#selArea").innerHTML = AREAS.map((a) => `<option value="${a.nome}">${a.nome}</option>`).join("");
  renderAreas();
  filtrar("todas");
  renderArtigos();
  renderCarrinho();

  $("#filtros").addEventListener("click", (e) => e.target.dataset.area && filtrar(e.target.dataset.area));

  $("#gradeProdutos").addEventListener("click", (e) => {
    const id = Number(e.target.dataset.add);
    if (!id) return;
    carrinho.push(id);
    salvar();
    renderCarrinho();
    $("#carrinho").classList.add("aberto");
  });

  $("#itensCarrinho").addEventListener("click", (e) => {
    if (e.target.dataset.rm === undefined) return;
    carrinho.splice(Number(e.target.dataset.rm), 1);
    salvar();
    renderCarrinho();
  });

  $("#abrirCarrinho").addEventListener("click", () => $("#carrinho").classList.add("aberto"));
  $("#fecharCarrinho").addEventListener("click", () => $("#carrinho").classList.remove("aberto"));

  $("#finalizar").addEventListener("click", () => {
    if (!carrinho.length) return;
    const linhas = carrinho.map((id) => {
      const p = PRODUTOS.find((x) => x.id === id);
      return `• ${p.nome} — ${brl(p.preco)}`;
    });
    abrirWhatsApp(`Olá, Do Rei Soluções! Quero comprar:\n${linhas.join("\n")}\nTotal: ${$("#totalCarrinho").textContent}`);
  });

  $("#assinar").addEventListener("click", () =>
    abrirWhatsApp("Olá, Do Rei Soluções! Quero assinar o plano mensal de R$ 79,90 com acesso a todos os cursos."));

  $("#formContato").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    abrirWhatsApp(`Olá, sou ${d.get("nome")} (${d.get("email")}).\nÁrea: ${d.get("area")}\n${d.get("mensagem")}`);
  });
});
