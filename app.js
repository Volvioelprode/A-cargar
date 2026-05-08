// 🔧 Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  databaseURL: "TU_DATABASE_URL",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🌍 Diccionario de equipos → archivo (48 banderas)
const equipos = {
  Algeria: "algeria.png",
  Argentina: "argentina.png",
  Australia: "australia.png",
  Austria: "austria.png",
  Belgica: "belgica.png",
  Bosnia: "bosnia.png",
  Brasil: "brazil.png",
  Caboverde: "caboverde.png",
  Canada: "canada.png",
  Colombia: "colombia.png",
  Congo: "congo.png",
  Costademarfil: "costademarfil.png",
  Croacia: "croacia.png",
  Curazao: "curazao.png",
  Ecuador: "ecuador.png",
  Egipto: "egipto.png",
  Escocia: "escocia.png",
  Espana: "espana.png",
  Francia: "francia.png",
  Alemania: "germania.png",
  Ghana: "ghana.png",
  Haiti: "haiti.png",
  Inglaterra: "inglaterra.png",
  Irak: "irak.png",
  Iran: "iran.png",
  Japon: "japon.png",
  Jordania: "jordania.png",
  Marruecos: "marruecos.png",
  Mexico: "mexico.png",
  Noruega: "noruega.png",
  NuevaZelanda: "nuevazelanda.png",
  PaisesBajos: "paisesbajos.png",
  Panama: "panama.png",
  Paraguay: "paraguay.png",
  Portugal: "portugal.png",
  Qatar: "qatar.png",
  RepCheca: "repcheca.png",
  ArabiaSaudita: "saudiarabia.png",
  Senegal: "senegal.png",
  Sudafrica: "sudafrica.png",
  Suecia: "suecia.png",
  Suiza: "suiza.png",
  CoreaSur: "surkorea.png",
  Tunez: "tunez.png",
  Turquia: "turquia.png",
  Uruguay: "uruguay.png",
  USA: "usa.png",
  Uzbekistan: "uzbekistan.png"
};

// 🖼️ Mostrar bandera
function mostrarBandera(equipo) {
  return `<img src="flags/${equipos[equipo]}" alt="${equipo}" style="width:40px;height:25px">`;
}

// 📊 Array de partidos (48 fase de grupos)
const partidos = [
  {id:"match1", equipoA:"Argentina", equipoB:"Canada"},
  {id:"match2", equipoA:"Mexico", equipoB:"Uruguay"},
  {id:"match3", equipoA:"Argentina", equipoB:"Mexico"},
  {id:"match4", equipoA:"Canada", equipoB:"Uruguay"},
  {id:"match5", equipoA:"Argentina", equipoB:"Uruguay"},
  {id:"match6", equipoA:"Canada", equipoB:"Mexico"},
  {id:"match7", equipoA:"Brasil", equipoB:"Suiza"},
  {id:"match8", equipoA:"Espana", equipoB:"Japon"},
  {id:"match9", equipoA:"Brasil", equipoB:"Espana"},
  {id:"match10", equipoA:"Suiza", equipoB:"Japon"},
  {id:"match11", equipoA:"Brasil", equipoB:"Japon"},
  {id:"match12", equipoA:"Suiza", equipoB:"Espana"},
  {id:"match13", equipoA:"Francia", equipoB:"Alemania"},
  {id:"match14", equipoA:"Italia", equipoB:"Portugal"},
  {id:"match15", equipoA:"Francia", equipoB:"Italia"},
  {id:"match16", equipoA:"Alemania", equipoB:"Portugal"},
  {id:"match17", equipoA:"Francia", equipoB:"Portugal"},
  {id:"match18", equipoA:"Alemania", equipoB:"Italia"},
  {id:"match19", equipoA:"Inglaterra", equipoB:"PaisesBajos"},
  {id:"match20", equipoA:"Croacia", equipoB:"Polonia"},
  {id:"match21", equipoA:"Inglaterra", equipoB:"Croacia"},
  {id:"match22", equipoA:"PaisesBajos", equipoB:"Polonia"},
  {id:"match23", equipoA:"Inglaterra", equipoB:"Polonia"},
  {id:"match24", equipoA:"PaisesBajos", equipoB:"Croacia"},
  {id:"match25", equipoA:"Senegal", equipoB:"Ghana"},
  {id:"match26", equipoA:"Nigeria", equipoB:"Marruecos"},
  {id:"match27", equipoA:"Senegal", equipoB:"Nigeria"},
  {id:"match28", equipoA:"Ghana", equipoB:"Marruecos"},
  {id:"match29", equipoA:"Senegal", equipoB:"Marruecos"},
  {id:"match30", equipoA:"Ghana", equipoB:"Nigeria"},
  {id:"match31", equipoA:"USA", equipoB:"ArabiaSaudita"},
  {id:"match32", equipoA:"Iran", equipoB:"CoreaSur"},
  {id:"match33", equipoA:"USA", equipoB:"Iran"},
  {id:"match34", equipoA:"ArabiaSaudita", equipoB:"CoreaSur"},
  {id:"match35", equipoA:"USA", equipoB:"CoreaSur"},
  {id:"match36", equipoA:"ArabiaSaudita", equipoB:"Iran"},
  {id:"match37", equipoA:"Australia", equipoB:"NuevaZelanda"},
  {id:"match38", equipoA:"Qatar", equipoB:"Egipto"},
  {id:"match39", equipoA:"Australia", equipoB:"Qatar"},
  {id:"match40", equipoA:"NuevaZelanda", equipoB:"Egipto"},
  {id:"match41", equipoA:"Australia", equipoB:"Egipto"},
  {id:"match42", equipoA:"NuevaZelanda", equipoB:"Qatar"},
  {id:"match43", equipoA:"Turquia", equipoB:"Suiza"},
  {id:"match44", equipoA:"Escocia", equipoB:"Suecia"},
  {id:"match45", equipoA:"Turquia", equipoB:"Escocia"},
  {id:"match46", equipoA:"Suiza", equipoB:"Suecia"},
  {id:"match47", equipoA:"Turquia", equipoB:"Suecia"},
  {id:"match48", equipoA:"Suiza", equipoB:"Escocia"}
];

// 📝 Mostrar fixture
function mostrarFixture() {
  const fixture = document.getElementById("fixture");
  fixture.innerHTML = "";
  partidos.forEach(p => {
    const div = document.createElement("div");
    div.className = "partido";
    div.innerHTML = `
      ${mostrarBandera(p.equipoA)} 
      <button onclick="guardarPronostico('${p.id}','A')">${p.equipoA}</button>
      <button onclick="guardarPronostico('${p.id}','E')">Empate</button>
      <button onclick="guardarPronostico('${p.id}','B')">${p.equipoB}</button>
      ${mostrarBandera(p.equipoB)}
      <br>
      <input type="number" id="${p.id}_golesA" placeholder="Goles ${p.equipoA}" style="width:60px">
      <input type="number" id="${p.id}_golesB" placeholder="Goles ${p.equipoB}" style="width:60px">
      <button onclick="guardarResultado('${p.id}','${p.equipoA}','${p.equipoB}')">Guardar Resultado</button>
    `;
    fixture.appendChild(div);
  });
}

// 💾 Guardar pronóstico
function guardarPronostico(matchId, resultado) {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Debes iniciar sesión para guardar tu pronóstico.");
    return;
  }
  const userId = user.uid;
  db.ref("pronosticos/" + userId + "/" + matchId).set({ resultado });
  alert("Pronóstico guardado para " + matchId);
}

// 💾 Guardar resultado oficial con goles
function guardarResultado(matchId, equipoA, equipoB) {
  const golesA = parseInt(document.getElementById(matchId + "_golesA").value);
  const goles