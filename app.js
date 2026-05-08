// 🔧 Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  databaseURL: "TU_DATABASE_URL",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

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

// 📊 Array de partidos (48 fase de grupos) → ya lo tenés cargado
// (lo dejo como está en tu código)

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
  if (!window.currentUserId) {
    alert("Debes iniciar sesión para guardar tu pronóstico.");
    return;
  }
  db.ref("pronosticos/" + window.currentUserId + "/" + matchId).set({ resultado });
  alert("Pronóstico guardado para " + matchId);
}

// 💾 Guardar resultado oficial con goles
function guardarResultado(matchId, equipoA, equipoB) {
  const golesA = parseInt(document.getElementById(matchId + "_golesA").value);
  const golesB = parseInt(document.getElementById(matchId + "_golesB").value);

  if (isNaN(golesA) || isNaN(golesB)) {
    alert("Debes ingresar los goles de ambos equipos.");
    return;
  }

  let resultado;
  if (golesA > golesB) resultado = "A";
  else if (golesA < golesB) resultado = "B";
  else resultado = "E";

  db.ref("resultados/" + matchId).set({
    equipoA, golesA,
    equipoB, golesB,
    resultado
  });

  calcularPuntos(matchId, resultado);
  alert("Resultado oficial guardado para " + matchId);
}

// 🏆 Calcular puntos de todos los usuarios
function calcularPuntos(matchId, resultadoOficial) {
  db.ref("pronosticos").once("value", snapshot => {
    snapshot.forEach(userSnap => {
      const userId = userSnap.key;
      const pronostico = userSnap.child(matchId).val();
      if (pronostico && pronostico.resultado === resultadoOficial) {
        // Sumar un punto
        db.ref("usuarios/" + userId + "/puntos").transaction(p => (p || 0) + 1);
      }
    });
    mostrarRanking();
  });
}

// 📊 Mostrar ranking
function mostrarRanking() {
  const rankingDiv = document.getElementById("ranking");
  rankingDiv.innerHTML = "<h2>Ranking</h2>";
  db.ref("usuarios").orderByChild("puntos").once("value", snapshot => {
    const usuarios = [];
    snapshot.forEach(userSnap => {
      usuarios.push(userSnap.val());
    });
    usuarios.sort((a, b) => b.puntos - a.puntos);
    usuarios.forEach(u => {
      rankingDiv.innerHTML += `
        <div class="usuario">
          ${u.foto ? `<img src="${u.foto}" style="width:40px;height:40px;border-radius:50%">` : ""}
          <strong>${u.nombre}</strong> - ${u.puntos} puntos
        </div>
      `;
    });
  });
}

// 👤 Login simple
function login() {
  const nombre = document.getElementById("nombre").value.trim();
  const fotoInput = document.getElementById("foto");
  const archivoFoto = fotoInput.files[0];

  if (!nombre) {
    alert("Por favor ingresa tu nombre");
    return;
  }

  const userId = Date.now().toString();
  window.currentUserId = userId;

  if (archivoFoto) {
    const storageRef = storage.ref("fotos/" + userId);
    storageRef.put(archivoFoto).then(() => {
      storageRef.getDownloadURL().then(url => {
        db.ref("usuarios/" + userId).set({
          nombre,
          foto: url,
          puntos: 0
        });
        alert("Usuario registrado con foto");
        mostrarRanking();
      });
    });
  } else {
    db.ref("usuarios/" + userId).set({
      nombre,
      foto: null,
      puntos: 0
    });
    alert("Usuario registrado sin foto");
    mostrarRanking();
  }
}

// 🚀 Inicializar
window.onload = mostrarFixture;