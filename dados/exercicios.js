// Biblioteca de exercícios do GymFlow: [id, nome, grupo muscular, equipamento]
// Você pode cadastrar os seus no app (Treino > Exercícios > Novo).
window.GRUPOS = ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 'Antebraço', 'Quadríceps', 'Posterior', 'Glúteos', 'Panturrilha', 'Abdômen', 'Cardio', 'Corpo inteiro'];

window.EXERCICIOS = [
  // Peito
  ['sup-reto-barra', 'Supino reto com barra', 'Peito', 'Barra'],
  ['sup-reto-halter', 'Supino reto com halteres', 'Peito', 'Halteres'],
  ['sup-incl-barra', 'Supino inclinado com barra', 'Peito', 'Barra'],
  ['sup-incl-halter', 'Supino inclinado com halteres', 'Peito', 'Halteres'],
  ['sup-decl-barra', 'Supino declinado com barra', 'Peito', 'Barra'],
  ['sup-maquina', 'Supino na máquina', 'Peito', 'Máquina'],
  ['sup-smith', 'Supino no Smith', 'Peito', 'Smith'],
  ['crucifixo-reto', 'Crucifixo reto com halteres', 'Peito', 'Halteres'],
  ['crucifixo-incl', 'Crucifixo inclinado com halteres', 'Peito', 'Halteres'],
  ['peck-deck', 'Peck deck (voador)', 'Peito', 'Máquina'],
  ['crossover-alto', 'Crossover polia alta', 'Peito', 'Polia'],
  ['crossover-baixo', 'Crossover polia baixa', 'Peito', 'Polia'],
  ['flexao', 'Flexão de braço', 'Peito', 'Peso corporal'],
  ['paralelas-peito', 'Mergulho nas paralelas (peito)', 'Peito', 'Peso corporal'],
  ['pullover', 'Pullover com halter', 'Peito', 'Halteres'],
  // Costas
  ['barra-fixa', 'Barra fixa pegada pronada', 'Costas', 'Peso corporal'],
  ['barra-fixa-sup', 'Barra fixa pegada supinada', 'Costas', 'Peso corporal'],
  ['puxada-frente', 'Puxada frontal aberta', 'Costas', 'Polia'],
  ['puxada-triang', 'Puxada com triângulo', 'Costas', 'Polia'],
  ['puxada-sup', 'Puxada pegada supinada', 'Costas', 'Polia'],
  ['remada-curvada', 'Remada curvada com barra', 'Costas', 'Barra'],
  ['remada-unil', 'Remada unilateral com halter (serrote)', 'Costas', 'Halteres'],
  ['remada-baixa', 'Remada baixa com triângulo', 'Costas', 'Polia'],
  ['remada-cavalinho', 'Remada cavalinho (barra T)', 'Costas', 'Barra'],
  ['remada-maquina', 'Remada articulada na máquina', 'Costas', 'Máquina'],
  ['pulldown', 'Pulldown com corda (braços estendidos)', 'Costas', 'Polia'],
  ['levantamento-terra', 'Levantamento terra', 'Costas', 'Barra'],
  ['hiperextensao', 'Hiperextensão lombar (banco romano)', 'Costas', 'Peso corporal'],
  ['encolhimento', 'Encolhimento com halteres (trapézio)', 'Costas', 'Halteres'],
  ['encolhimento-barra', 'Encolhimento com barra (trapézio)', 'Costas', 'Barra'],
  // Ombros
  ['desenv-halter', 'Desenvolvimento com halteres', 'Ombros', 'Halteres'],
  ['desenv-barra', 'Desenvolvimento militar com barra', 'Ombros', 'Barra'],
  ['desenv-maquina', 'Desenvolvimento na máquina', 'Ombros', 'Máquina'],
  ['arnold', 'Desenvolvimento Arnold', 'Ombros', 'Halteres'],
  ['elev-lateral', 'Elevação lateral com halteres', 'Ombros', 'Halteres'],
  ['elev-lateral-polia', 'Elevação lateral na polia', 'Ombros', 'Polia'],
  ['elev-frontal', 'Elevação frontal', 'Ombros', 'Halteres'],
  ['crucifixo-inv', 'Crucifixo invertido (posterior de ombro)', 'Ombros', 'Halteres'],
  ['peck-deck-inv', 'Peck deck invertido', 'Ombros', 'Máquina'],
  ['face-pull', 'Face pull na corda', 'Ombros', 'Polia'],
  ['remada-alta', 'Remada alta', 'Ombros', 'Barra'],
  // Bíceps
  ['rosca-direta', 'Rosca direta com barra', 'Bíceps', 'Barra'],
  ['rosca-w', 'Rosca direta barra W', 'Bíceps', 'Barra'],
  ['rosca-alternada', 'Rosca alternada com halteres', 'Bíceps', 'Halteres'],
  ['rosca-martelo', 'Rosca martelo', 'Bíceps', 'Halteres'],
  ['rosca-scott', 'Rosca Scott', 'Bíceps', 'Máquina'],
  ['rosca-concentrada', 'Rosca concentrada', 'Bíceps', 'Halteres'],
  ['rosca-polia', 'Rosca na polia baixa', 'Bíceps', 'Polia'],
  ['rosca-incl', 'Rosca no banco inclinado', 'Bíceps', 'Halteres'],
  // Tríceps
  ['triceps-polia', 'Tríceps na polia (barra)', 'Tríceps', 'Polia'],
  ['triceps-corda', 'Tríceps na corda', 'Tríceps', 'Polia'],
  ['triceps-testa', 'Tríceps testa', 'Tríceps', 'Barra'],
  ['triceps-frances', 'Tríceps francês', 'Tríceps', 'Halteres'],
  ['triceps-coice', 'Tríceps coice', 'Tríceps', 'Halteres'],
  ['mergulho-banco', 'Mergulho no banco', 'Tríceps', 'Peso corporal'],
  ['sup-fechado', 'Supino fechado', 'Tríceps', 'Barra'],
  ['triceps-unil', 'Tríceps unilateral na polia', 'Tríceps', 'Polia'],
  // Antebraço
  ['rosca-punho', 'Rosca de punho', 'Antebraço', 'Barra'],
  ['rosca-inversa', 'Rosca inversa', 'Antebraço', 'Barra'],
  ['farmer-walk', 'Caminhada do fazendeiro', 'Antebraço', 'Halteres'],
  // Quadríceps
  ['agachamento-livre', 'Agachamento livre', 'Quadríceps', 'Barra'],
  ['agachamento-smith', 'Agachamento no Smith', 'Quadríceps', 'Smith'],
  ['agachamento-frontal', 'Agachamento frontal', 'Quadríceps', 'Barra'],
  ['agachamento-goblet', 'Agachamento goblet', 'Quadríceps', 'Halteres'],
  ['hack', 'Agachamento hack', 'Quadríceps', 'Máquina'],
  ['leg-press-45', 'Leg press 45°', 'Quadríceps', 'Máquina'],
  ['leg-press-hor', 'Leg press horizontal', 'Quadríceps', 'Máquina'],
  ['cadeira-extensora', 'Cadeira extensora', 'Quadríceps', 'Máquina'],
  ['afundo', 'Afundo com halteres', 'Quadríceps', 'Halteres'],
  ['bulgaro', 'Agachamento búlgaro', 'Quadríceps', 'Halteres'],
  ['passada', 'Passada (avanço caminhando)', 'Quadríceps', 'Halteres'],
  ['sissy', 'Sissy squat', 'Quadríceps', 'Peso corporal'],
  // Posterior
  ['stiff', 'Stiff com barra', 'Posterior', 'Barra'],
  ['stiff-halter', 'Stiff com halteres', 'Posterior', 'Halteres'],
  ['terra-romeno', 'Levantamento terra romeno', 'Posterior', 'Barra'],
  ['mesa-flexora', 'Mesa flexora', 'Posterior', 'Máquina'],
  ['cadeira-flexora', 'Cadeira flexora', 'Posterior', 'Máquina'],
  ['flexora-em-pe', 'Flexora em pé unilateral', 'Posterior', 'Máquina'],
  ['good-morning', 'Bom dia (good morning)', 'Posterior', 'Barra'],
  // Glúteos
  ['elev-pelvica', 'Elevação pélvica com barra', 'Glúteos', 'Barra'],
  ['elev-pelvica-maq', 'Elevação pélvica na máquina', 'Glúteos', 'Máquina'],
  ['ponte-gluteo', 'Ponte de glúteo', 'Glúteos', 'Peso corporal'],
  ['abdutora', 'Cadeira abdutora', 'Glúteos', 'Máquina'],
  ['adutora', 'Cadeira adutora', 'Glúteos', 'Máquina'],
  ['coice-polia', 'Coice na polia (glúteo)', 'Glúteos', 'Polia'],
  ['gluteo-4-apoios', 'Glúteo 4 apoios com caneleira', 'Glúteos', 'Caneleira'],
  ['agach-sumo', 'Agachamento sumô', 'Glúteos', 'Halteres'],
  ['step-up', 'Subida no banco (step up)', 'Glúteos', 'Halteres'],
  // Panturrilha
  ['panturrilha-pe', 'Panturrilha em pé', 'Panturrilha', 'Máquina'],
  ['panturrilha-sentado', 'Panturrilha sentado', 'Panturrilha', 'Máquina'],
  ['panturrilha-leg', 'Panturrilha no leg press', 'Panturrilha', 'Máquina'],
  ['panturrilha-smith', 'Panturrilha no Smith', 'Panturrilha', 'Smith'],
  // Abdômen
  ['abd-supra', 'Abdominal supra', 'Abdômen', 'Peso corporal'],
  ['abd-alternado', 'Abdômen alternado (bicicleta)', 'Abdômen', 'Peso corporal'],
  ['abd-infra', 'Abdominal infra (elevação de pernas)', 'Abdômen', 'Peso corporal'],
  ['abd-pendurado', 'Elevação de pernas pendurado', 'Abdômen', 'Barra fixa'],
  ['prancha', 'Prancha isométrica', 'Abdômen', 'Peso corporal'],
  ['prancha-lateral', 'Prancha lateral', 'Abdômen', 'Peso corporal'],
  ['abd-polia', 'Abdominal na polia (crunch)', 'Abdômen', 'Polia'],
  ['abd-maquina', 'Abdominal na máquina', 'Abdômen', 'Máquina'],
  ['abd-roda', 'Roda abdominal', 'Abdômen', 'Roda'],
  ['russian-twist', 'Giro russo', 'Abdômen', 'Peso corporal'],
  ['vacuum', 'Vácuo abdominal', 'Abdômen', 'Peso corporal'],
  // Cardio
  ['esteira', 'Esteira', 'Cardio', 'Esteira'],
  ['bike', 'Bicicleta ergométrica', 'Cardio', 'Bicicleta'],
  ['eliptico', 'Elíptico (transport)', 'Cardio', 'Elíptico'],
  ['escada', 'Escada (simulador)', 'Cardio', 'Escada'],
  ['remo-erg', 'Remo ergômetro', 'Cardio', 'Remo'],
  ['corda', 'Pular corda', 'Cardio', 'Corda'],
  ['hiit', 'HIIT (tiros)', 'Cardio', 'Livre'],
  ['caminhada', 'Caminhada', 'Cardio', 'Livre'],
  ['corrida', 'Corrida', 'Cardio', 'Livre'],
  // Corpo inteiro
  ['burpee', 'Burpee', 'Corpo inteiro', 'Peso corporal'],
  ['kettlebell-swing', 'Kettlebell swing', 'Corpo inteiro', 'Kettlebell'],
  ['thruster', 'Thruster', 'Corpo inteiro', 'Barra'],
  ['clean', 'Clean (arremesso)', 'Corpo inteiro', 'Barra'],
  ['polichinelo', 'Polichinelo', 'Corpo inteiro', 'Peso corporal'],
  ['mountain-climber', 'Escalador (mountain climber)', 'Corpo inteiro', 'Peso corporal'],
];

// Modelos de ficha para começar rápido. Cada item: [idExercicio, séries, repetições, descanso em segundos]
// São pontos de partida: ajuste com seu professor de educação física.
window.MODELOS_FICHA = [
  {
    nome: 'ABC – Hipertrofia', nivel: 'Intermediário', fichas: [
      { nome: 'Treino A – Peito e Tríceps', itens: [['sup-reto-barra', 4, '8-10', 90], ['sup-incl-halter', 3, '10-12', 90], ['crucifixo-reto', 3, '12', 60], ['crossover-alto', 3, '12-15', 60], ['triceps-polia', 3, '10-12', 60], ['triceps-frances', 3, '10-12', 60], ['abd-alternado', 3, '20', 30]] },
      { nome: 'Treino B – Costas e Bíceps', itens: [['puxada-frente', 4, '8-10', 90], ['remada-curvada', 3, '8-10', 90], ['remada-unil', 3, '10-12', 60], ['pulldown', 3, '12-15', 60], ['rosca-direta', 3, '10-12', 60], ['rosca-martelo', 3, '10-12', 60], ['prancha', 3, '40s', 30]] },
      { nome: 'Treino C – Pernas e Ombros', itens: [['agachamento-livre', 4, '8-10', 120], ['leg-press-45', 3, '10-12', 90], ['cadeira-extensora', 3, '12-15', 60], ['mesa-flexora', 3, '10-12', 60], ['desenv-halter', 3, '10-12', 90], ['elev-lateral', 4, '12-15', 45], ['panturrilha-pe', 4, '15', 45]] },
    ]
  },
  {
    nome: 'Full body – Iniciante', nivel: 'Iniciante', fichas: [
      { nome: 'Treino A – Corpo inteiro', itens: [['leg-press-45', 3, '12', 90], ['sup-maquina', 3, '12', 90], ['puxada-frente', 3, '12', 90], ['desenv-maquina', 3, '12', 60], ['cadeira-flexora', 3, '12', 60], ['prancha', 3, '30s', 30]] },
      { nome: 'Treino B – Corpo inteiro', itens: [['agachamento-goblet', 3, '12', 90], ['sup-reto-halter', 3, '12', 90], ['remada-baixa', 3, '12', 90], ['elev-lateral', 3, '12', 60], ['elev-pelvica', 3, '12', 60], ['abd-supra', 3, '15', 30]] },
    ]
  },
  {
    nome: 'Superior / Inferior', nivel: 'Intermediário', fichas: [
      { nome: 'Superior', itens: [['sup-reto-barra', 4, '6-8', 120], ['remada-curvada', 4, '6-8', 120], ['desenv-halter', 3, '8-10', 90], ['puxada-frente', 3, '8-10', 90], ['rosca-alternada', 3, '10-12', 60], ['triceps-corda', 3, '10-12', 60]] },
      { nome: 'Inferior', itens: [['agachamento-livre', 4, '6-8', 150], ['terra-romeno', 3, '8-10', 120], ['leg-press-45', 3, '10-12', 90], ['mesa-flexora', 3, '10-12', 60], ['panturrilha-sentado', 4, '12-15', 45], ['abd-infra', 3, '15', 30]] },
    ]
  },
  {
    nome: 'Push / Pull / Legs', nivel: 'Avançado', fichas: [
      { nome: 'Push – Empurrar', itens: [['sup-reto-barra', 4, '6-8', 120], ['sup-incl-halter', 3, '8-10', 90], ['desenv-barra', 3, '8-10', 90], ['elev-lateral', 4, '12-15', 45], ['crossover-baixo', 3, '12-15', 60], ['triceps-testa', 3, '10-12', 60]] },
      { nome: 'Pull – Puxar', itens: [['levantamento-terra', 3, '5', 180], ['barra-fixa', 4, 'máx', 120], ['remada-cavalinho', 3, '8-10', 90], ['face-pull', 3, '15', 45], ['rosca-direta', 3, '8-10', 60], ['rosca-martelo', 3, '10-12', 60]] },
      { nome: 'Legs – Pernas', itens: [['agachamento-livre', 4, '6-8', 150], ['stiff', 3, '8-10', 120], ['bulgaro', 3, '10', 90], ['cadeira-extensora', 3, '12-15', 60], ['cadeira-flexora', 3, '12-15', 60], ['panturrilha-pe', 4, '12-15', 45]] },
    ]
  },
];
