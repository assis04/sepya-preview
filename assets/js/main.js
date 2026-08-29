/* =========================================================================
   ÓPTICA SÉPYA — COMPORTAMENTO
   -------------------------------------------------------------------------
   Sem dependências. Progressivo: se este arquivo não carregar, a página
   continua legível, navegável e com todo o conteúdo visível.
   ========================================================================= */
(function () {
  "use strict";

  var cfg = window.SEPYA || {};
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
     1. WHATSAPP — um número, um lugar
     Enquanto config.js estiver sem número, os botões permanecem
     desativados e apontam para a seção de endereços.
     --------------------------------------------------------------------- */
  function linkZap(numero, mensagem) {
    var limpo = String(numero || "").replace(/\D/g, "");
    if (limpo.length < 12) return null; // 55 + DDD + número
    return "https://wa.me/" + limpo + (mensagem ? "?text=" + encodeURIComponent(mensagem) : "");
  }

  /* "5511944422685" ou "(11) 94442-2685" → "(11) 94442-2685" */
  function formatarTelefone(valor) {
    var d = String(valor || "").replace(/\D/g, "").replace(/^55/, "");
    if (d.length === 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    if (d.length === 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return String(valor);
  }

  function ativarBotao(el, href) {
    el.setAttribute("href", href);
    el.removeAttribute("aria-disabled");
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  }

  var zapGeral = linkZap(cfg.whatsapp && cfg.whatsapp.numero, cfg.whatsapp && cfg.whatsapp.mensagem);

  if (zapGeral) {
    document.querySelectorAll("[data-zap]").forEach(function (el) {
      ativarBotao(el, zapGeral);
    });
  }

  /* -----------------------------------------------------------------------
     2. DADOS DAS LOJAS
     Preenche telefone, WhatsApp, horário e Maps a partir de config.js.
     Campo vazio mantém o texto "a confirmar com a loja" já no HTML.
     --------------------------------------------------------------------- */
  function preencher(dd, conteudo) {
    if (!dd || !conteudo) return;
    dd.textContent = "";
    dd.appendChild(conteudo);
  }

  (cfg.lojas || []).forEach(function (loja) {
    var bloco = document.querySelector('[data-loja="' + loja.id + '"]');
    if (!bloco) return;

    if (loja.telefone) {
      var tel = document.createElement("a");
      tel.href = "tel:+55" + loja.telefone.replace(/\D/g, "");
      tel.textContent = loja.telefone;
      preencher(bloco.querySelector('[data-campo="telefone"]'), tel);
    }

    var zapLoja = linkZap(loja.whatsapp || (cfg.whatsapp && cfg.whatsapp.numero), cfg.whatsapp && cfg.whatsapp.mensagem);

    if (loja.whatsapp) {
      var wa = document.createElement("a");
      wa.href = linkZap(loja.whatsapp, cfg.whatsapp && cfg.whatsapp.mensagem) || "#";
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.textContent = formatarTelefone(loja.whatsapp);
      preencher(bloco.querySelector('[data-campo="whatsapp"]'), wa);
    }

    if (loja.horario) {
      var h = document.createElement("span");
      h.textContent = loja.horario;
      preencher(bloco.querySelector('[data-campo="horario"]'), h);
    }

    /* O botão de WhatsApp da loja só existe se houver número. */
    var botaoZap = bloco.querySelector("[data-zap-loja]");
    if (botaoZap && zapLoja) {
      ativarBotao(botaoZap, zapLoja);
      botaoZap.removeAttribute("hidden");
    }

    /* "Como chegar" já funciona com busca por endereço; se a loja informar
       o link da própria ficha no Google, ele tem prioridade. */
    var botaoMaps = bloco.querySelector("[data-maps]");
    if (botaoMaps && loja.maps) botaoMaps.setAttribute("href", loja.maps);
  });

  /* Telefone geral no rodapé — usa o da primeira loja que tiver telefone. */
  var primeiroTel = (cfg.lojas || []).find(function (l) { return l.telefone; });
  var rodapeTel = document.querySelector('[data-campo="telefone-geral"]');
  if (primeiroTel && rodapeTel) {
    rodapeTel.classList.remove("a-preencher");
    rodapeTel.innerHTML = "";
    var a = document.createElement("a");
    a.href = "tel:+55" + primeiroTel.telefone.replace(/\D/g, "");
    a.textContent = primeiroTel.telefone;
    rodapeTel.appendChild(a);
  }

  /* Ano corrente no rodapé */
  var ano = document.querySelector("[data-ano]");
  if (ano) ano.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------------------
     3. MENU MOBILE
     --------------------------------------------------------------------- */
  var sanduiche = document.getElementById("sanduiche");
  var menu = document.getElementById("menu");

  function fecharMenu() {
    if (!menu) return;
    menu.classList.remove("esta-aberto");
    menu.setAttribute("inert", "");
    sanduiche.setAttribute("aria-expanded", "false");
    sanduiche.querySelector(".so-leitor").textContent = "Abrir menu";
    document.body.classList.remove("trava-scroll");
  }

  function abrirMenu() {
    menu.classList.add("esta-aberto");
    menu.removeAttribute("inert");
    sanduiche.setAttribute("aria-expanded", "true");
    sanduiche.querySelector(".so-leitor").textContent = "Fechar menu";
    document.body.classList.add("trava-scroll");
  }

  if (sanduiche && menu) {
    sanduiche.addEventListener("click", function () {
      if (sanduiche.getAttribute("aria-expanded") === "true") fecharMenu();
      else abrirMenu();
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) fecharMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sanduiche.getAttribute("aria-expanded") === "true") {
        fecharMenu();
        sanduiche.focus();
      }
    });
  }

  /* -----------------------------------------------------------------------
     4. CABEÇALHO, WHATSAPP FLUTUANTE E BARRA MOBILE
     Um único observador no topo da página evita listener de scroll.
     --------------------------------------------------------------------- */
  var cabecalho = document.getElementById("cabecalho");
  var flutuante = document.querySelector(".zap-flutuante");
  var barra = document.querySelector(".barra-mobile");
  var hero = document.getElementById("topo");

  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(function (entradas) {
      var passouDoHero = !entradas[0].isIntersecting;
      if (cabecalho) cabecalho.classList.toggle("esta-preso", passouDoHero);
      if (flutuante) flutuante.classList.toggle("esta-visivel", passouDoHero);
      if (barra) barra.classList.toggle("esta-visivel", passouDoHero);
    }, { rootMargin: "-70% 0px 0px 0px", threshold: 0 }).observe(hero);
  } else {
    if (cabecalho) cabecalho.classList.add("esta-preso");
    if (flutuante) flutuante.classList.add("esta-visivel");
    if (barra) barra.classList.add("esta-visivel");
  }

  /* -----------------------------------------------------------------------
     5. REVELAÇÃO NO SCROLL
     Entrada discreta, uma vez só. Desligada em prefers-reduced-motion.
     --------------------------------------------------------------------- */
  var aRevelar = document.querySelectorAll(".revela");

  if (reduzMovimento || !("IntersectionObserver" in window)) {
    aRevelar.forEach(function (el) { el.classList.add("revelou"); });
  } else {
    var observador = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("revelou");
        obs.unobserve(entrada.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    aRevelar.forEach(function (el) { observador.observe(el); });
  }

  /* -----------------------------------------------------------------------
     6. SEÇÃO ATIVA NA NAVEGAÇÃO
     --------------------------------------------------------------------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var alvos = links
    .map(function (l) { return document.querySelector(l.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && alvos.length) {
    var ativo = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        links.forEach(function (l) {
          if (l.getAttribute("href") === "#" + entrada.target.id) l.setAttribute("aria-current", "true");
          else l.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    alvos.forEach(function (alvo) { ativo.observe(alvo); });
  }
})();
