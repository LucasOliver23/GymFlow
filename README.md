# GymFlow · Dieta, Treino e Evolução

App PWA (instalável no celular) que junta **dieta, treino e evolução** em um só lugar. Tema escuro, feito para usar na academia com uma mão.

## O que tem

| Área | Recursos |
|---|---|
| **Hoje** | Semana com ✓ nos dias treinados, sequência 🔥, anel de calorias restantes, barras de macros, treino do dia, água com botões configuráveis (padrão 250 ml, 500 ml, 600 ml e 1 L), "Outro" valor e desfazer o último registro, atividade do dia com barra da meta semanal de km, suplementos com controle de estoque e aviso de "hora de repor", refeições com meta própria, peso atual |
| **Dieta** | 597 alimentos da **tabela TACO (UNICAMP)**, busca sem acento, filtro por categoria, recentes, alimentos do rótulo, **leitor de código de barras** (Open Food Facts), refeições favoritas, copiar refeição/dia anterior, distribuição P/C/G, fibras e sódio. Quando a fonte não tem o dado, o app mostra **"não encontrado"** (nada é inventado) |
| **Treino** | 118 exercícios em 13 grupos, 4 modelos prontos (ABC, Full body, Superior/Inferior, Push/Pull/Legs), editor de fichas, rodízio automático do próximo treino, modo treino com série/peso/reps, carga da última vez preenchida, cronômetro de descanso (som + vibração), **recordes automáticos** (1RM de Epley), link para vídeo de execução, histórico e gráfico por exercício |
| **Ar livre** | Caminhada, corrida e bike: registro manual de tempo e distância, ritmo (min/km) ou velocidade (km/h na bike), calorias estimadas (Compendium of Physical Activities), meta semanal de km. Quem escolhe o estilo "Ar livre" no cadastro vê o app sem fichas de academia; "Os dois" alterna Academia e Ar livre na aba Treino |
| **Evolução** | Peso com gráfico, meta, IMC, tendência semanal e previsão de quando chega na meta; atividades com totais da semana e do mês, km por semana, gráfico de ritmo e recordes (5 km, 10 km, maior distância, maior pedalada); 12 medidas corporais com Top 3 mudanças e **% de gordura estimado** (Marinha dos EUA); evolução de carga e volume por grupo muscular; fotos de progresso com **antes × depois**; conquistas de academia, dieta e ar livre |
| **Perfil** | Metas automáticas (Mifflin-St Jeor) ou manuais (plano do nutricionista), refeições configuráveis, preferências de treino, **exportar Excel**, backup/restauração em JSON, botão de olho para ocultar peso e medidas |

As metas sempre fecham: calorias = proteína × 4 + carboidrato × 4 + gordura × 9.

## Arquivos

```
index.html           App completo (HTML + CSS + JS)
firebase-config.js   Chaves do Firebase (vazio = modo local)
dados/taco.js        Tabela TACO 4ª ed. (gerada do CSV oficial, não editar à mão)
dados/exercicios.js  Biblioteca de exercícios e modelos de ficha
manifest.json, sw.js, icons/   PWA instalável e offline
firestore.rules      Regras de segurança do Firestore
vercel.json          Cabeçalhos para o deploy
Abrir_GymFlow.bat    Abre o app no Windows com dois cliques
package.json, scripts/preparar-android.mjs, android-recursos/   Geração do APK (Capacitor)
.github/workflows/apk.yml   APK automático no GitHub Actions
```

## Rodar no Windows

Dê dois cliques em **`Abrir_GymFlow.bat`**. Se tiver Python, ele sobe um servidor em `http://localhost:5500`; se não tiver, abre o `index.html` direto (modo local).

Sem Firebase configurado, o app roda em **modo local**: tudo fica salvo só naquele navegador. Use *Perfil → Baixar backup* de vez em quando.

## Ativar login e sincronização (Firebase)

1. Em [console.firebase.google.com](https://console.firebase.google.com), crie um projeto.
2. **Authentication → Método de login →** ative **E-mail/senha**.
3. **Firestore Database →** crie o banco (modo produção). Na aba **Regras**, cole o conteúdo de `firestore.rules` e publique.
4. **Configurações do projeto → Seus apps → Web (</>)** → registre o app e copie os valores para `firebase-config.js`.
5. Em **Authentication → Configurações → Domínios autorizados**, adicione o domínio do Vercel (ex.: `gymflow.vercel.app`). `localhost` já vem autorizado (é o endereço interno do APK no modo embutido).

Os dados de cada usuário ficam em `users/{uid}` (perfil, metas, fichas, pesos, medidas, alimentos e exercícios próprios) com as subcoleções `dias` (diário alimentar e água), `sessoes` (treinos), `atividades` (caminhada, corrida e bike) e `fotos`. O navegador guarda só uma cópia de cache, e o Firestore funciona offline e sincroniza quando a internet volta.

## APK Android automático (GitHub Actions)

O APK **não** é feito à mão: o workflow `.github/workflows/apk.yml` gera tudo sozinho com Capacitor.

| Quando | O que acontece |
|---|---|
| Pull request | Compila o APK e anexa na execução (aba **Actions → APK Android → Artifacts**) para testar antes de juntar |
| Push na `main` | Compila e publica uma versão nova em **Releases** (`v1.0.N`, arquivo `GymFlow.apk`) |
| App instalado | Mostra "Nova versão do app" na tela Hoje e baixa a atualização com um toque |

Link fixo da última versão: `https://github.com/LucasOliver23/GymFlow/releases/latest/download/GymFlow.apk`
(também aparece em *Perfil → Baixar app Android* na versão web).

### Configuração única

1. **Chave fixa de assinatura** (sem ela, o Android não aceita instalar uma versão por cima da outra):
   em *Settings → Secrets and variables → Actions → Secrets*, crie `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_SENHA`,
   `ANDROID_KEY_ALIAS` e `ANDROID_KEY_SENHA`. Guarde o arquivo `.jks` num lugar seguro: se perder a chave, as próximas versões só instalam depois de desinstalar a antiga.
2. **Atualização instantânea (recomendado):** publique no Vercel ([vercel.com/new](https://vercel.com/new), importe o repositório, Framework **Other**, sem build)
   e crie a *Variable* `APP_URL` com o endereço (ex.: `https://gymflow.vercel.app`). A partir do próximo APK, o app abre o site:
   cada deploy do Vercel atualiza o app na hora, sem reinstalar. Sem `APP_URL`, os arquivos vão dentro do APK e cada atualização é um APK novo.

### Recursos só do app Android
Botão voltar fecha janelas e volta para Hoje, notificação de fim do descanso com a tela desligada, Excel e backup abrem o menu de compartilhar (WhatsApp, Drive, Arquivos).

Para gerar o projeto Android no PC (precisa do Android Studio): `npm install` e depois `npm run android`; o projeto fica em `android/`.

## Fontes e fórmulas

- Alimentos: *Tabela Brasileira de Composição de Alimentos – TACO*, 4ª ed. revisada e ampliada, NEPA/UNICAMP, 2011 (CSV de [raulfdm/taco-api](https://github.com/raulfdm/taco-api)).
- Código de barras: [Open Food Facts](https://world.openfoodfacts.org), base colaborativa. O app pede para conferir com o rótulo antes de salvar.
- Metabolismo basal: Mifflin-St Jeor. Força máxima: 1RM de Epley. Calorias das atividades: MET por velocidade do *Compendium of Physical Activities* (Ainsworth et al., 2011) × peso × tempo. % de gordura: método da Marinha dos EUA (Hodgdon & Beckett). IMC: classificação da OMS.

As estimativas não substituem nutricionista, médico ou educador físico.
