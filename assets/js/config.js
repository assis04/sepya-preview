/* =========================================================================
   ÓPTICA SÉPYA — CONFIGURAÇÃO DO SITE
   -------------------------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser editado para publicar a página.

   FONTES DOS DADOS
   · Bio e publicações do @opticasepya
   · Fichas do Google Meu Negócio das duas lojas (consultadas em 29/08/2026)

   O que ainda estiver vazio ("") continua aparecendo na página como
   "a confirmar com a loja". Nada foi inventado.

   ⚠ PENDÊNCIA ABERTA — ANO DE FUNDAÇÃO
   A fachada da loja da Rua Antônio de Barros diz "DESDE 1980".
   A bio do Instagram diz "Desde 1983".
   A página está usando 1983. Confirmar com o dono qual é o correto —
   muda a headline da seção "A loja" e o campo foundingDate do JSON-LD.
   ========================================================================= */

window.SEPYA = {

  /* --- WhatsApp -----------------------------------------------------------
     Os dois números do Google são celulares (11 9xxxx-xxxx), então quase
     certamente têm WhatsApp — mas isso NÃO foi verificado.
     ⚠ TESTE O BOTÃO UMA VEZ antes de apresentar.
     Se algum não tiver WhatsApp, apague o número daqui e o botão volta a
     apenas rolar até a seção de endereços.                                  */
  whatsapp: {
    numero: "5511944422685",                      // loja Antônio de Barros (a principal)
    mensagem: "Olá! Vim pelo site da Óptica Sépya e gostaria de mais informações."
  },

  /* --- Lojas -------------------------------------------------------------- */
  lojas: [
    {
      id: "loja-1",
      nome: "Loja Antônio de Barros",
      endereco: "Rua Antônio de Barros, 1396",
      bairro: "Tatuapé, São Paulo — SP",          // Google registra como Vila Carrão
      cep: "03401-001",
      telefone: "(11) 94442-2685",                // confirmado no Google
      whatsapp: "5511944422685",                  // ⚠ testar antes de apresentar
      horario: "",                                // A CONFIRMAR — o Google só mostrou
                                                  // "fecha 15:00" no sábado desta loja
      maps: ""                                    // opcional: link da ficha do Google
    },
    {
      id: "loja-2",
      nome: "Loja Francisco Marengo",
      endereco: "Rua Francisco Marengo, 697",
      bairro: "Tatuapé, São Paulo — SP",
      cep: "03313-000",
      telefone: "(11) 95056-4445",                // confirmado no Google
      whatsapp: "5511950564445",                  // ⚠ testar antes de apresentar
      horario: "Seg a Sex, 9h às 18h · Sáb, 9h às 15h · Dom fechado",  // confirmado
      maps: ""
    }
  ],

  /* --- Redes e contato ----------------------------------------------------
     A loja NÃO tem site. O campo "Site" da ficha do Google aponta para o
     Instagram — é exatamente o buraco que esta página preenche.             */
  instagram: "https://www.instagram.com/opticasepya/",
  instagramHandle: "@opticasepya",
  email: "",                                      // não divulgado

  /* --- Publicação --------------------------------------------------------- */
  urlCanonica: "https://www.opticasepya.com.br/"  // PREENCHER com o domínio final
};
