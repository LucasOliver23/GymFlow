// Gera o projeto Android do GymFlow com Capacitor e aplica ícone, tela de abertura,
// permissões e versão. Usado pelo GitHub Actions (.github/workflows/apk.yml);
// também roda no PC com:  npm install  e depois  npm run android
//
// Variáveis de ambiente (todas opcionais):
//   APP_URL       URL publicada no Vercel. Com ela o APK abre o site, e cada deploy
//                 atualiza o app na hora, sem reinstalar. Sem ela, os arquivos vão dentro do APK.
//   VERSAO        versionName exibido no Android (ex.: 1.0.42)
//   VERSION_CODE  número inteiro que precisa crescer a cada APK (ex.: 42)
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP_ID = 'br.com.lucasoliver.gymflow';
const APP_URL = (process.env.APP_URL || '').trim().replace(/\/+$/, '');
const VERSAO = (process.env.VERSAO || '1.0.0').trim();
const VERSION_CODE = parseInt(process.env.VERSION_CODE || '1', 10);
const ARQUIVOS_WEB = ['index.html', 'manifest.json', 'sw.js', 'firebase-config.js', 'dados', 'icons'];

const p = (...x) => path.join(RAIZ, ...x);
const rodar = cmd => { console.log(`\n> ${cmd}`); execSync(cmd, { stdio: 'inherit', cwd: RAIZ }); };
function trocar(arquivo, de, para, descricao) {
  const txt = fs.readFileSync(arquivo, 'utf8');
  if (!de.test(txt)) throw new Error(`Não encontrei ${descricao} em ${path.relative(RAIZ, arquivo)}`);
  fs.writeFileSync(arquivo, txt.replace(de, para));
  console.log(`  ✓ ${descricao}`);
}

console.log(`GymFlow Android ${VERSAO} (código ${VERSION_CODE})`);
console.log(APP_URL ? `Modo online: o APK abre ${APP_URL} (atualiza sozinho a cada deploy)` : 'Modo embutido: arquivos do app dentro do APK');
if (!Number.isInteger(VERSION_CODE) || VERSION_CODE < 1) throw new Error('VERSION_CODE inválido');
if (APP_URL && !/^https:\/\//.test(APP_URL)) throw new Error('APP_URL precisa começar com https://');

// 1) Copia o app web para www/
fs.rmSync(p('www'), { recursive: true, force: true });
fs.mkdirSync(p('www'));
for (const f of ARQUIVOS_WEB) fs.cpSync(p(f), p('www', f), { recursive: true });

// 2) Configuração do Capacitor
const cfg = {
  appId: APP_ID,
  appName: 'GymFlow',
  webDir: 'www',
  backgroundColor: '#000000',
  android: { adjustMarginsForEdgeToEdge: 'force' },
  plugins: { LocalNotifications: { smallIcon: 'ic_stat_gymflow', iconColor: '#00D084' } },
};
if (APP_URL) cfg.server = { url: APP_URL };
fs.writeFileSync(p('capacitor.config.json'), JSON.stringify(cfg, null, 2) + '\n');

// 3) Projeto Android
if (!fs.existsSync(p('android'))) rodar('npx cap add android');
rodar('npx cap sync android');

// 4) Personalização
console.log('\nPersonalizando o projeto Android:');
const RES = p('android', 'app', 'src', 'main', 'res');
// Remove as imagens de abertura padrão do Capacitor (substituídas por drawable/splash.xml)
for (const pasta of fs.readdirSync(RES)) {
  const f = path.join(RES, pasta, 'splash.png');
  if (fs.existsSync(f)) fs.rmSync(f);
}
fs.cpSync(p('android-recursos', 'res'), RES, { recursive: true, force: true });
console.log('  ✓ ícones, tela de abertura e ícone de notificação');

trocar(p('android', 'app', 'build.gradle'), /versionCode \d+/, `versionCode ${VERSION_CODE}`, 'versionCode');
trocar(p('android', 'app', 'build.gradle'), /versionName "[^"]*"/, `versionName "${VERSAO}"`, 'versionName');

const PERMISSOES = [
  '<uses-permission android:name="android.permission.CAMERA" />',
  '<uses-permission android:name="android.permission.VIBRATE" />',
  '<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />',
  '<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" android:maxSdkVersion="32" />',
  '<uses-permission android:name="android.permission.USE_EXACT_ALARM" />',
  '<uses-feature android:name="android.hardware.camera" android:required="false" />',
];
const manifesto = p('android', 'app', 'src', 'main', 'AndroidManifest.xml');
const faltando = PERMISSOES.filter(l => !fs.readFileSync(manifesto, 'utf8').includes(l));
if (faltando.length) trocar(manifesto, /<\/manifest>\s*$/, `    ${faltando.join('\n    ')}\n</manifest>\n`, 'permissões (câmera, vibração, notificação do descanso)');

// Barras do sistema pretas, combinando com o app
const estilos = path.join(RES, 'values', 'styles.xml');
if (!fs.readFileSync(estilos, 'utf8').includes('gymflow-barras')) {
  trocar(estilos, /(<style name="AppTheme\.NoActionBar"[^>]*>)/, `$1
        <!-- gymflow-barras -->
        <item name="android:windowBackground">@android:color/black</item>
        <item name="android:statusBarColor">@android:color/black</item>
        <item name="android:navigationBarColor">@android:color/black</item>
        <item name="android:windowLightStatusBar">false</item>`, 'cores das barras do sistema');
}
if (!fs.readFileSync(estilos, 'utf8').includes('windowSplashScreenBackground')) {
  trocar(estilos, /(<style name="AppTheme\.NoActionBarLaunch"[^>]*>)/, `$1
        <item name="windowSplashScreenBackground">@android:color/black</item>`, 'fundo preto da abertura (Android 12+)');
}
console.log('\nProjeto Android pronto em android/');
