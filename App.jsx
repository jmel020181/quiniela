import { useState, useEffect } from "react";

// ✅ Componentes simples (reemplazan los imports que fallaban)
const Card = ({ children }) => (
  <div style={{ border: "1px solid #ccc", padding: 15, borderRadius: 10 }}>
    {children}
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;

const Button = ({ children, onClick }) => (
  <button 
    onClick={onClick} 
    style={{ padding: 10, marginTop: 10, cursor: "pointer" }}
  >
    {children}
  </button>
);

// --- Simulación de base de datos con localStorage ---
const USERS_KEY = "quiniela_users_v1";

function loadUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export default function QuinielaApp() {
  const matches = [
    "Octavos 1","Octavos 2","Octavos 3","Octavos 4",
    "Octavos 5","Octavos 6","Octavos 7","Octavos 8",
    "Cuartos 1","Cuartos 2","Cuartos 3","Cuartos 4",
    "Semifinal 1","Semifinal 2","Tercer puesto","Final"
  ];

  const emptyPredictions = matches.map(m => ({ partido: m, user: "", real: "" }));

  const [username, setUsername] = useState("");
  const [logged, setLogged] = useState(false);
  const [data, setData] = useState(emptyPredictions);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setPlayers(loadUsers());
  }, []);

  const handleLogin = () => {
    if (!username) return;
    setLogged(true);

    const users = loadUsers();
    if (!users.find(u => u.name === username)) {
      const newUser = { name: username, score: 0 };
      const updated = [...users, newUser];
      saveUsers(updated);
      setPlayers(updated);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const score = data.reduce((acc, m) => acc + (m.user && m.user === m.real ? 1 : 0), 0);

  const saveScore = () => {
    const users = loadUsers().map(u =>
      u.name === username ? { ...u, score } : u
    );

    saveUsers(users);
    setPlayers([...users].sort((a, b) => b.score - a.score));
  };

  if (!logged) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1>Quiniela Mundial 2026</h1>
        <input
          style={{ padding: 10, marginTop: 10 }}
          placeholder="Tu nombre"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <Button onClick={handleLogin}>Entrar</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>Quiniela Mundial 2026</h1>

      <Card>
        <CardContent>
          {data.map((m, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <b>{m.partido}</b>
              <br />
              <input
                style={{ marginRight: 5 }}
                placeholder="Tu ganador"
                value={m.user}
                onChange={(e) => handleChange(i, "user", e.target.value)}
              />
              <input
                placeholder="Ganador real"
                value={m.real}
                onChange={(e) => handleChange(i, "real", e.target.value)}
              />
              <span style={{ marginLeft: 10 }}>
                {m.user && m.user === m.real ? "✅" : "-"}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2>Tus puntos: {score}</h2>
          <Button onClick={saveScore}>Guardar puntuación</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2>🏆 Clasificación</h2>
          {players.map((p, i) => (
            <div key={i}>
              {i + 1}. {p.name} - {p.score} pts
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
