// Receitas do cardápio do GymFlow.
// Ingredientes: [id na TACO, gramas, classe de troca (opcional)]. Calorias e macros NÃO ficam aqui:
// o app calcula tudo pela Tabela TACO (dados/taco.js) e ajusta as porções para a meta de cada refeição.
// Pesos são do alimento pronto (cozido, grelhado...), como na TACO. Modo de preparo escrito pelo GymFlow.
// tipo: 'cafe' (café da manhã), 'principal' (almoço e jantar), 'lanche' (lanches e ceia)

// Classes de troca: quem não come ou não gosta de um ingrediente recebe o próximo da lista
// (mesma classe, mesmas calorias). A ordem é a preferência de troca.
window.CLASSES_TROCA = {
  prot: [410, 377, 301, 432, 488, 584],                 // frango, patinho, peixe, lombo, ovo, tofu
  protMoida: [326, 410, 584],                           // carne moída, frango, tofu
  ovo: [489, 410, 584],                                 // ovo (preparo) → frango, tofu
  peixeLata: [277, 410, 488, 584],                      // atum → frango, ovo, tofu
  carbo: [3, 1, 91, 129, 86],                           // arroz, arroz integral, batata, mandioca, batata-baroa
  feijao: [561, 567, 577, 563],                         // feijão carioca, preto, lentilha, fradinho
  pao: [53, 52, 48, 533, 124],                          // pão francês, integral, de aveia, cuscuz, goma de tapioca
  fruta: [182, 222, 225, 239, 214, 164, 236, 235, 231, 256, 200, 179],
  lacteo: [448, 449, 582],                              // iogurte natural, desnatado, bebida de soja
  queijo: [461, 469, 463, 584],                         // minas frescal, ricota, mozarela, tofu
  pasta: [468, 469, 461, 584],                          // requeijão, ricota, minas, tofu
  oleag: [557, 589, 588, 593],                          // amendoim, castanha-do-pará, caju, gergelim
  verdura: [78, 115, 149, 119],                         // alface, couve, repolho, espinafre
  legume: [109, 100, 70, 112, 97, 64, 118, 162, 95],
  cereal: [7, 533, 124],                                // aveia, cuscuz, goma de tapioca
  gordura: [260, 272, 261],                             // azeite, óleo, manteiga
};

// Cozido/pronto → cru, para a lista de compras (convertido pela energia de cada um na TACO)
window.CRU_DE = { 3: 4, 1: 2, 561: 562, 567: 568, 577: 578, 563: 564, 410: 409, 408: 409, 398: 399, 377: 376, 326: 327, 371: 372, 301: 302, 318: 321, 432: 433, 488: 489, 91: 92, 129: 130, 86: 87, 109: 110, 100: 101, 70: 71, 112: 113, 97: 98, 64: 65, 118: 117, 95: 96 };

window.RECEITAS = [
  // ================= CAFÉ DA MANHÃ =================
  { id: 'c01', nome: 'Pão francês com ovo mexido e fruta', tipo: 'cafe', min: 10, ing: [[53, 50, 'pao'], [489, 100, 'ovo'], [272, 3, 'gordura'], [182, 80, 'fruta']],
    prep: ['Bata os ovos com uma pitada de sal.', 'Mexa em frigideira com o óleo, em fogo baixo, até firmar.', 'Sirva no pão com a fruta ao lado.'] },
  { id: 'c02', nome: 'Mingau de aveia com banana', tipo: 'cafe', min: 8, ing: [[7, 40, 'cereal'], [448, 170, 'lacteo'], [182, 90, 'fruta'], [507, 10]],
    prep: ['Aqueça o iogurte (ou a bebida de soja) com a aveia, mexendo, por 3 a 4 minutos.', 'Desligue e junte a banana amassada.', 'Finalize com o mel.'] },
  { id: 'c03', nome: 'Tapioca de queijo branco com tomate', tipo: 'cafe', min: 10, ing: [[124, 50, 'pao'], [461, 40, 'queijo'], [157, 40], [214, 120, 'fruta']],
    prep: ['Espalhe a goma numa frigideira antiaderente fria e leve ao fogo médio até soltar.', 'Recheie com o queijo e o tomate em rodelas e dobre.', 'A laranja vai de sobremesa.'] },
  { id: 'c04', nome: 'Cuscuz nordestino com ovo', tipo: 'cafe', min: 15, ing: [[533, 150, 'pao'], [488, 50, 'ovo'], [261, 5, 'gordura']],
    prep: ['Prepare o cuscuz no vapor (cuscuzeira) e tempere com uma pitada de sal.', 'Cozinhe o ovo por 10 minutos.', 'Sirva o cuscuz com a manteiga e o ovo em rodelas.'] },
  { id: 'c05', nome: 'Iogurte com granola caseira de aveia e frutas', tipo: 'cafe', min: 5, ing: [[448, 170, 'lacteo'], [7, 30, 'cereal'], [239, 100, 'fruta'], [557, 10, 'oleag']],
    prep: ['Coloque o iogurte numa tigela.', 'Cubra com a aveia, as frutas picadas e o amendoim picado.'] },
  { id: 'c06', nome: 'Pão integral com requeijão e mamão', tipo: 'cafe', min: 5, ing: [[52, 50, 'pao'], [468, 20, 'pasta'], [225, 170, 'fruta']],
    prep: ['Passe o requeijão no pão (pode tostar antes).', 'Sirva com o mamão em cubos.'] },
  { id: 'c07', nome: 'Omelete de legumes com pão', tipo: 'cafe', min: 12, ing: [[489, 100, 'ovo'], [157, 30], [107, 15], [144, 15], [272, 3, 'gordura'], [53, 25, 'pao']],
    prep: ['Pique tomate, cebola e pimentão bem miúdos.', 'Bata os ovos com sal, junte os legumes.', 'Doure dos dois lados em frigideira untada, em fogo baixo e com tampa.'] },
  { id: 'c08', nome: 'Panqueca de banana e aveia', tipo: 'cafe', min: 12, ing: [[182, 90, 'fruta'], [489, 50, 'ovo'], [7, 30, 'cereal'], [272, 3, 'gordura']],
    prep: ['Amasse a banana e misture com o ovo e a aveia.', 'Despeje em frigideira untada e doure dos dois lados em fogo baixo.'] },
  { id: 'c09', nome: 'Sanduíche de queijo branco e tomate', tipo: 'cafe', min: 5, ing: [[52, 50, 'pao'], [461, 30, 'queijo'], [157, 40], [78, 10, 'verdura'], [222, 130, 'fruta']],
    prep: ['Monte o sanduíche com queijo, tomate e alface.', 'A maçã acompanha.'] },
  { id: 'c10', nome: 'Cuscuz com queijo e café', tipo: 'cafe', min: 15, ing: [[533, 150, 'pao'], [461, 30, 'queijo'], [471, 150]],
    prep: ['Prepare o cuscuz no vapor.', 'Ainda quente, coloque o queijo em cubos por cima para derreter.', 'Acompanhe com café sem açúcar ou pouco adoçado.'] },
  { id: 'c11', nome: 'Vitamina de banana com aveia', tipo: 'cafe', min: 5, ing: [[448, 200, 'lacteo'], [182, 90, 'fruta'], [7, 20, 'cereal'], [589, 10, 'oleag']],
    prep: ['Bata tudo no liquidificador com gelo.', 'Beba logo em seguida.'] },
  { id: 'c12', nome: 'Tapioca de frango com requeijão', tipo: 'cafe', min: 12, ing: [[124, 50, 'pao'], [408, 50, 'prot'], [468, 15, 'pasta']],
    prep: ['Desfie o frango cozido e misture com o requeijão.', 'Faça a tapioca na frigideira fria, recheie e dobre.'] },
  { id: 'c13', nome: 'Ovos cozidos com batata-baroa e abacaxi', tipo: 'cafe', min: 20, ing: [[488, 100, 'ovo'], [86, 100, 'carbo'], [164, 100, 'fruta']],
    prep: ['Cozinhe a batata-baroa até ficar macia.', 'Cozinhe os ovos por 10 minutos.', 'Sirva com o abacaxi.'] },
  { id: 'c14', nome: 'Pão com pasta de atum', tipo: 'cafe', min: 8, ing: [[53, 50, 'pao'], [277, 40, 'peixeLata'], [468, 10, 'pasta'], [110, 20, 'legume'], [214, 120, 'fruta']],
    prep: ['Escorra bem o atum e misture com o requeijão e a cenoura ralada.', 'Recheie o pão.', 'A laranja vai de sobremesa.'] },
  { id: 'c15', nome: 'Iogurte com mamão e aveia', tipo: 'cafe', min: 5, ing: [[449, 170, 'lacteo'], [225, 150, 'fruta'], [7, 30, 'cereal'], [507, 8]],
    prep: ['Coloque o mamão picado na tigela.', 'Cubra com o iogurte, a aveia e o mel.'] },
  { id: 'c16', nome: 'Pão de aveia com ricota e morango', tipo: 'cafe', min: 5, ing: [[48, 50, 'pao'], [469, 40, 'pasta'], [239, 120, 'fruta']],
    prep: ['Tempere a ricota amassada com uma pitada de sal (ou com o mel, se preferir doce).', 'Passe no pão.', 'Sirva com os morangos.'] },

  // ================= ALMOÇO E JANTAR =================
  { id: 'p01', nome: 'Prato feito: arroz, feijão, frango grelhado e salada', tipo: 'principal', min: 25, ing: [[3, 120, 'carbo'], [561, 100, 'feijao'], [410, 100, 'prot'], [78, 40, 'verdura'], [157, 60], [260, 5, 'gordura']],
    prep: ['Tempere o frango com alho, limão e sal e grelhe em frigideira quente.', 'Monte o prato com arroz, feijão e o frango.', 'Salada de alface e tomate com o azeite.'] },
  { id: 'p02', nome: 'Patinho grelhado com arroz, feijão e legumes', tipo: 'principal', min: 25, ing: [[3, 110, 'carbo'], [567, 100, 'feijao'], [377, 100, 'prot'], [109, 60, 'legume'], [100, 60, 'legume']],
    prep: ['Grelhe os bifes de patinho temperados com sal e alho.', 'Cozinhe cenoura e brócolis no vapor.', 'Sirva com arroz e feijão.'] },
  { id: 'p03', nome: 'Peixe assado com batata e brócolis', tipo: 'principal', min: 35, ing: [[301, 150, 'prot'], [91, 200, 'carbo'], [100, 80, 'legume'], [260, 8, 'gordura'], [220, 10]],
    prep: ['Tempere o peixe com limão, alho e sal.', 'Asse em forno a 200 °C com as batatas em rodelas por 25 minutos.', 'Junte o brócolis nos últimos 5 minutos e regue com o azeite.'] },
  { id: 'p04', nome: 'Carne moída com abobrinha, arroz e feijão', tipo: 'principal', min: 25, ing: [[326, 90, 'protMoida'], [70, 80, 'legume'], [107, 20], [157, 30], [3, 110, 'carbo'], [561, 90, 'feijao']],
    prep: ['Refogue a cebola, junte a carne moída e deixe dourar.', 'Acrescente tomate e abobrinha em cubos e cozinhe até amaciar.', 'Sirva com arroz e feijão.'] },
  { id: 'p05', nome: 'Frango ao molho de tomate com purê de batata', tipo: 'principal', min: 30, ing: [[408, 110, 'prot'], [160, 60], [107, 20], [91, 200, 'carbo'], [261, 5, 'gordura'], [78, 40, 'verdura']],
    prep: ['Cozinhe o frango em cubos com cebola e o purê de tomate.', 'Amasse a batata cozida com a manteiga e sal.', 'Sirva com alface.'] },
  { id: 'p06', nome: 'Escondidinho de mandioca com carne moída', tipo: 'principal', min: 40, ing: [[129, 180, 'carbo'], [326, 90, 'protMoida'], [107, 20], [461, 20, 'queijo'], [149, 50, 'verdura']],
    prep: ['Amasse a mandioca cozida com um pouco da água do cozimento e sal.', 'Refogue a carne com a cebola.', 'Monte em camadas (carne embaixo, purê em cima), cubra com o queijo e leve ao forno até dourar.', 'Acompanhe com salada de repolho.'] },
  { id: 'p07', nome: 'Lombo assado com arroz, feijão e couve', tipo: 'principal', min: 40, ing: [[432, 100, 'prot'], [3, 110, 'carbo'], [567, 100, 'feijao'], [115, 50, 'verdura'], [260, 5, 'gordura']],
    prep: ['Tempere o lombo com alho, limão e sal e asse coberto a 200 °C até cozinhar; descubra para dourar.', 'Refogue a couve fatiada fininha no azeite com alho.', 'Sirva com arroz e feijão.'] },
  { id: 'p08', nome: 'Omelete recheada com salada e arroz', tipo: 'principal', min: 15, ing: [[489, 150, 'ovo'], [461, 30, 'queijo'], [157, 40], [272, 4, 'gordura'], [3, 100, 'carbo'], [78, 50, 'verdura']],
    prep: ['Bata os ovos com sal, despeje na frigideira untada.', 'Quando firmar embaixo, recheie com o queijo e o tomate e dobre.', 'Sirva com arroz e salada.'] },
  { id: 'p09', nome: 'Strogonoff leve de frango com arroz', tipo: 'principal', min: 25, ing: [[408, 110, 'prot'], [449, 60, 'lacteo'], [160, 40], [107, 20], [3, 120, 'carbo'], [78, 40, 'verdura']],
    prep: ['Doure o frango em cubos com a cebola.', 'Junte o purê de tomate e cozinhe 5 minutos.', 'Desligue o fogo e misture o iogurte (no lugar do creme de leite).', 'Sirva com arroz e salada.'] },
  { id: 'p10', nome: 'Lentilha com arroz integral e legumes', tipo: 'principal', min: 30, ing: [[577, 150, 'feijao'], [1, 120, 'carbo'], [109, 60, 'legume'], [70, 60, 'legume'], [260, 8, 'gordura']],
    prep: ['Cozinhe a lentilha (sem deixar desmanchar) e tempere com alho e sal.', 'Refogue cenoura e abobrinha no azeite.', 'Sirva com o arroz integral.'] },
  { id: 'p11', nome: 'Carne de panela com batata e cenoura', tipo: 'principal', min: 60, ing: [[371, 100, 'prot'], [91, 150, 'carbo'], [109, 70, 'legume'], [107, 20], [3, 60, 'carbo']],
    prep: ['Doure o músculo em cubos, junte cebola e água e cozinhe na pressão por 30 minutos.', 'Acrescente batata e cenoura e cozinhe mais 10 minutos.', 'Sirva com um pouco de arroz.'] },
  { id: 'p12', nome: 'Sardinha assada com arroz e salada de tomate', tipo: 'principal', min: 30, ing: [[318, 100, 'prot'], [3, 120, 'carbo'], [567, 80, 'feijao'], [157, 80], [107, 15], [260, 5, 'gordura']],
    prep: ['Tempere as sardinhas limpas com limão e sal e asse até dourar.', 'Salada de tomate e cebola com azeite.', 'Sirva com arroz e feijão.'] },
  { id: 'p13', nome: 'Frango desfiado com abóbora e arroz', tipo: 'principal', min: 30, ing: [[408, 100, 'prot'], [64, 120, 'legume'], [3, 110, 'carbo'], [561, 80, 'feijao'], [272, 4, 'gordura']],
    prep: ['Cozinhe e desfie o frango.', 'Refogue a abóbora em cubos com alho até ficar macia e junte o frango.', 'Sirva com arroz e feijão.'] },
  { id: 'p14', nome: 'Baião de dois caseiro', tipo: 'principal', min: 35, ing: [[3, 100, 'carbo'], [563, 100, 'feijao'], [461, 30, 'queijo'], [377, 60, 'prot'], [107, 20], [109, 50, 'legume']],
    prep: ['Refogue a cebola, junte o arroz e o feijão-fradinho cozidos.', 'Acrescente a carne em tiras já grelhada e o queijo em cubos.', 'Sirva com cenoura cozida.'] },
  { id: 'p15', nome: 'Tofu grelhado com arroz e legumes salteados', tipo: 'principal', min: 20, ing: [[584, 150, 'prot'], [3, 120, 'carbo'], [100, 70, 'legume'], [109, 50, 'legume'], [260, 8, 'gordura']],
    prep: ['Corte o tofu em fatias, seque e grelhe com um fio de azeite até dourar.', 'Salteie brócolis e cenoura no restante do azeite.', 'Sirva com o arroz.'] },
  { id: 'p16', nome: 'Picadinho de carne com legumes e arroz', tipo: 'principal', min: 35, ing: [[371, 90, 'prot'], [112, 70, 'legume'], [109, 50, 'legume'], [107, 20], [3, 120, 'carbo'], [567, 70, 'feijao']],
    prep: ['Doure a carne em cubinhos com a cebola.', 'Junte chuchu e cenoura em cubos e um pouco de água; cozinhe até amaciar.', 'Sirva com arroz e feijão.'] },
  { id: 'p17', nome: 'Salada completa com frango e arroz integral', tipo: 'principal', min: 15, ing: [[410, 110, 'prot'], [1, 100, 'carbo'], [78, 50, 'verdura'], [157, 60], [142, 50], [110, 30, 'legume'], [260, 10, 'gordura']],
    prep: ['Corte o frango grelhado em tiras.', 'Monte a salada com folhas, tomate, pepino, cenoura ralada e o arroz integral frio.', 'Tempere com azeite, limão e sal.'] },
  { id: 'p18', nome: 'Peixe ao molho com purê de mandioca', tipo: 'principal', min: 35, ing: [[301, 130, 'prot'], [160, 50], [144, 20], [107, 20], [129, 150, 'carbo'], [78, 40, 'verdura']],
    prep: ['Cozinhe o peixe com o purê de tomate, cebola e pimentão em fogo baixo, tampado.', 'Amasse a mandioca cozida com sal.', 'Sirva com folhas.'] },
  { id: 'p19', nome: 'Arroz, feijão, ovo cozido e couve', tipo: 'principal', min: 20, ing: [[3, 120, 'carbo'], [561, 110, 'feijao'], [488, 100, 'ovo'], [115, 50, 'verdura'], [272, 4, 'gordura']],
    prep: ['Cozinhe os ovos por 10 minutos.', 'Refogue a couve fatiada com alho.', 'Monte o prato com arroz, feijão, couve e ovos.'] },
  { id: 'p20', nome: 'Almôndegas caseiras de patinho com batata', tipo: 'principal', min: 40, ing: [[326, 100, 'protMoida'], [160, 60], [91, 180, 'carbo'], [100, 60, 'legume']],
    prep: ['Tempere a carne moída com sal, alho e cebola e faça bolinhas.', 'Cozinhe as almôndegas no purê de tomate, tampado, por 15 minutos.', 'Sirva com batata cozida e brócolis.'] },
  { id: 'p21', nome: 'Frango assado com mandioca e salada', tipo: 'principal', min: 45, ing: [[398, 120, 'prot'], [129, 150, 'carbo'], [149, 60, 'verdura'], [110, 30, 'legume'], [260, 5, 'gordura']],
    prep: ['Tempere a coxa com limão, alho e sal e asse a 200 °C por 35 minutos.', 'Sirva com mandioca cozida.', 'Salada de repolho com cenoura ralada e azeite.'] },
  { id: 'p22', nome: 'Feijoada leve (feijão preto com carnes magras)', tipo: 'principal', min: 60, ing: [[567, 150, 'feijao'], [371, 60, 'prot'], [432, 30, 'prot'], [3, 100, 'carbo'], [115, 50, 'verdura'], [214, 100, 'fruta']],
    prep: ['Cozinhe o feijão preto com o músculo e o lombo em cubos, alho e cebola, até a carne ficar macia.', 'Sirva com arroz, couve refogada e laranja.'] },
  { id: 'p23', nome: 'Arroz integral refogado com carne moída e legumes', tipo: 'principal', min: 30, ing: [[1, 130, 'carbo'], [326, 80, 'protMoida'], [70, 60, 'legume'], [109, 50, 'legume'], [160, 40]],
    prep: ['Refogue a carne moída até dourar.', 'Junte abobrinha e cenoura em cubos e o purê de tomate; cozinhe 10 minutos.', 'Misture o arroz integral cozido e sirva.'] },
  { id: 'p24', nome: 'Hambúrguer caseiro no prato com salada', tipo: 'principal', min: 25, ing: [[326, 110, 'protMoida'], [91, 150, 'carbo'], [78, 50, 'verdura'], [157, 60], [142, 40], [260, 5, 'gordura']],
    prep: ['Modele hambúrgueres com a carne temperada com sal e cebola e grelhe.', 'Asse as batatas cozidas em rodelas até dourar.', 'Salada de alface, tomate e pepino com azeite.'] },
  { id: 'p25', nome: 'Frango xadrez caseiro com arroz', tipo: 'principal', min: 25, ing: [[410, 100, 'prot'], [144, 40], [143, 40], [107, 30], [557, 10, 'oleag'], [272, 5, 'gordura'], [3, 110, 'carbo']],
    prep: ['Doure o frango em cubos no óleo.', 'Junte pimentões e cebola em cubos e salteie em fogo alto por 3 minutos.', 'Finalize com o amendoim e sirva com arroz.'] },
  { id: 'p26', nome: 'Sopa de legumes com frango', tipo: 'principal', min: 35, ing: [[408, 90, 'prot'], [91, 150, 'carbo'], [109, 70, 'legume'], [112, 70, 'legume'], [64, 70, 'legume'], [107, 20]],
    prep: ['Cozinhe o frango em cubos com cebola e água.', 'Junte batata, cenoura, chuchu e abóbora em cubos e cozinhe até amaciar.', 'Acerte o sal e sirva quente.'] },
  { id: 'p27', nome: 'Caldo de feijão com carne e torrada', tipo: 'principal', min: 40, ing: [[561, 200, 'feijao'], [371, 60, 'prot'], [107, 20], [63, 30, 'pao']],
    prep: ['Bata o feijão cozido com o caldo.', 'Volte à panela com a carne cozida desfiada e a cebola refogada.', 'Sirva com torradas.'] },
  { id: 'p28', nome: 'Berinjela recheada com carne moída', tipo: 'principal', min: 40, ing: [[96, 200, 'legume'], [326, 90, 'protMoida'], [160, 40], [461, 20, 'queijo'], [3, 100, 'carbo']],
    prep: ['Corte a berinjela ao meio, retire parte da polpa e pique.', 'Refogue a carne com a polpa picada e o purê de tomate.', 'Recheie, cubra com o queijo e asse por 20 minutos.', 'Sirva com arroz.'] },
  { id: 'p29', nome: 'Arroz com lentilha e cebola (mujadara)', tipo: 'principal', min: 35, ing: [[3, 120, 'carbo'], [577, 130, 'feijao'], [107, 50], [260, 10, 'gordura'], [448, 80, 'lacteo'], [157, 60]],
    prep: ['Doure a cebola fatiada no azeite até ficar bem escura (sem queimar).', 'Misture com o arroz e a lentilha cozidos.', 'Sirva com iogurte natural temperado com sal e com tomate picado.'] },
  { id: 'p30', nome: 'Cuscuz com carne de panela e salada', tipo: 'principal', min: 20, ing: [[533, 180, 'pao'], [371, 90, 'prot'], [149, 60, 'verdura'], [157, 50], [260, 5, 'gordura']],
    prep: ['Prepare o cuscuz no vapor.', 'Sirva com a carne de panela desfiada.', 'Salada de repolho e tomate com azeite.'] },

  // ================= LANCHES E CEIA =================
  { id: 'l01', nome: 'Banana com amendoim', tipo: 'lanche', min: 2, ing: [[182, 90, 'fruta'], [557, 15, 'oleag']], prep: ['Corte a banana e sirva com o amendoim (sem sal, de preferência).'] },
  { id: 'l02', nome: 'Iogurte natural com morango', tipo: 'lanche', min: 3, ing: [[448, 170, 'lacteo'], [239, 100, 'fruta']], prep: ['Pique os morangos sobre o iogurte.'] },
  { id: 'l03', nome: 'Maçã com castanha-do-pará', tipo: 'lanche', min: 2, ing: [[222, 130, 'fruta'], [589, 10, 'oleag']], prep: ['Lave a maçã e coma com a casca. Duas castanhas acompanham.'] },
  { id: 'l04', nome: 'Pão integral com queijo branco', tipo: 'lanche', min: 3, ing: [[52, 50, 'pao'], [461, 30, 'queijo']], prep: ['Monte o sanduíche (pode aquecer na frigideira).'] },
  { id: 'l05', nome: 'Mamão com aveia', tipo: 'lanche', min: 3, ing: [[225, 200, 'fruta'], [7, 15, 'cereal']], prep: ['Corte o mamão e polvilhe a aveia.'] },
  { id: 'l06', nome: 'Ovos cozidos com tomate', tipo: 'lanche', min: 12, ing: [[488, 100, 'ovo'], [157, 80]], prep: ['Cozinhe os ovos por 10 minutos.', 'Sirva com tomate e uma pitada de sal.'] },
  { id: 'l07', nome: 'Vitamina de mamão', tipo: 'lanche', min: 5, ing: [[449, 200, 'lacteo'], [225, 150, 'fruta']], prep: ['Bata no liquidificador com gelo.'] },
  { id: 'l08', nome: 'Tapioca com queijo', tipo: 'lanche', min: 8, ing: [[124, 30, 'pao'], [461, 25, 'queijo']], prep: ['Faça a tapioca na frigideira fria, recheie com o queijo e dobre.'] },
  { id: 'l09', nome: 'Salada de frutas', tipo: 'lanche', min: 8, ing: [[182, 60, 'fruta'], [222, 60, 'fruta'], [225, 80, 'fruta'], [214, 60, 'fruta']], prep: ['Pique as frutas e misture com o suco de meia laranja.'] },
  { id: 'l10', nome: 'Cenoura e pepino em palitos com pasta de ricota', tipo: 'lanche', min: 8, ing: [[110, 80, 'legume'], [142, 80], [469, 50, 'pasta']], prep: ['Corte cenoura e pepino em palitos.', 'Tempere a ricota com sal, limão e salsa para mergulhar.'] },
  { id: 'l11', nome: 'Iogurte com banana e aveia', tipo: 'lanche', min: 3, ing: [[449, 170, 'lacteo'], [182, 60, 'fruta'], [7, 15, 'cereal']], prep: ['Misture tudo numa tigela.'] },
  { id: 'l12', nome: 'Cuscuz com ovo', tipo: 'lanche', min: 12, ing: [[533, 80, 'pao'], [488, 50, 'ovo']], prep: ['Prepare o cuscuz no vapor e sirva com o ovo cozido.'] },
  { id: 'l13', nome: 'Pão com pasta de frango', tipo: 'lanche', min: 8, ing: [[53, 50, 'pao'], [408, 40, 'prot'], [469, 20, 'pasta']], prep: ['Desfie o frango e misture com a ricota e sal.', 'Recheie o pão.'] },
  { id: 'l14', nome: 'Abacaxi com castanha de caju', tipo: 'lanche', min: 3, ing: [[164, 150, 'fruta'], [588, 10, 'oleag']], prep: ['Corte o abacaxi e sirva com as castanhas.'] },
  { id: 'l15', nome: 'Fruta da estação', tipo: 'lanche', min: 1, ing: [[214, 150, 'fruta']], prep: ['Uma porção de fruta. Prefira a fruta inteira ao suco.'] },
  { id: 'l16', nome: 'Melão com iogurte', tipo: 'lanche', min: 3, ing: [[236, 150, 'fruta'], [449, 100, 'lacteo']], prep: ['Corte o melão em cubos e cubra com o iogurte.'] },
  { id: 'l17', nome: 'Goiaba com queijo branco (Romeu e Julieta natural)', tipo: 'lanche', min: 3, ing: [[200, 120, 'fruta'], [461, 25, 'queijo']], prep: ['Corte a goiaba e o queijo em fatias e coma juntos.'] },
  { id: 'l18', nome: 'Uva com amendoim', tipo: 'lanche', min: 2, ing: [[256, 120, 'fruta'], [557, 10, 'oleag']], prep: ['Lave as uvas e sirva com o amendoim.'] },
];
