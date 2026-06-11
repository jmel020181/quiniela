
mport { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    setPlayers(users.sort((a, b) => b.score - a.score));
  };


  if (!logged) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold">Quiniela Mundial 2026</h1>
        <input
          className="border p-2 rounded mt-4"
          placeholder="Tu nombre"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="mt-4">
          <Button onClick={handleLogin}>Entrar</Button>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-3xl font-bold text-center">Quiniela Mundial 2026</h1>

      {/* Quiniela */}
      <Card>
        <CardContent className="p-4 grid gap-3">
          {data.map((m, i) => (
            <div key={i} className="grid md:grid-cols-4 gap-2">
              <span>{m.partido}</span>
              <input
                className="border p-2 rounded"
                placeholder="Tu ganador"
                value={m.user}
                onChange={(e) => handleChange(i, "user", e.target.value)}
              />
              <input
                className="border p-2 rounded"
                placeholder="Ganador real"
                value={m.real}
                onChange={(e) => handleChange(i, "real", e.target.value)}
              />
              <span className="text-center">{m.user && m.user === m.real ? "✅" : "-"}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Puntuación */}
      <Card>
        <CardContent className="p-4 text-center">
          <h2 className="font-bold">Tus puntos</h2>
          <p className="text-2xl">{score}</p>
          <Button className="mt-3" onClick={saveScore}>Guardar puntuación</Button>
        </CardContent>
      </Card>

      {/* Ranking */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold text-center">🏆 Clasificación</h2>
          {players.sort((a, b) => b.score - a.score).map((p, i) => (
            <div key={i} className="flex justify-between border-b py-1">
              <span>{i+1}. {p.name}</span>
              <span>{p.score} pts</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/*
✅ CÓMO PUBLICAR (hosting en 2 min):

1. Ve a https://vercel.com
2. Importa este proyecto (o súbelo a GitHub)
3. Framework: React
4. Deploy

👉 Tendrás un link tipo:
https://quiniela-mundial.vercel.app

Compártelo con tu oficina 🎉

NOTA:
Esto usa almacenamiento local (cada navegador).
Si quieres versión PRO real con datos compartidos:
- Firebase / Supabase (te lo configuro)
- Login real
- Ranking en vivo entre todos
*/
