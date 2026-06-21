import { useState } from "react";

const COLUMNS = ["Backlog", "In Progress", "Review", "Done"];

const INITIAL_CARDS = [
  { id: 1, title: "Setup OpenClaw agent", col: "Done", priority: "high" },
  { id: 2, title: "Setup Hermes brain", col: "Done", priority: "high" },
  { id: 3, title: "Wire Slack channels", col: "In Progress", priority: "high" },
  { id: 4, title: "Build Kanban UI", col: "In Progress", priority: "med" },
  { id: 5, title: "Deploy live URL", col: "Backlog", priority: "med" },
  { id: 6, title: "Submit qualifier", col: "Backlog", priority: "high" },
];

const PRIORITY_COLOR = { high: "#ff4d4d", med: "#ffa500", low: "#4caf50" };

export default function App() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("med");
  const [dragId, setDragId] = useState(null);

  const addCard = () => {
    if (!newTitle.trim()) return;
    setCards([...cards, { id: Date.now(), title: newTitle, col: "Backlog", priority: newPriority }]);
    setNewTitle("");
  };

  const deleteCard = (id) => setCards(cards.filter((c) => c.id !== id));

  const onDragStart = (id) => setDragId(id);
  const onDrop = (col) => {
    setCards(cards.map((c) => (c.id === dragId ? { ...c, col } : c)));
    setDragId(null);
  };

  const doneCount = cards.filter((c) => c.col === "Done").length;
  const heat = Math.round((doneCount / cards.length) * 100);

  return (
    <div style={{ fontFamily: "monospace", minHeight: "100vh", background: "#1a1a1a", color: "#f0f0f0", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, color: "#ff6b00", fontSize: "2rem", letterSpacing: "4px" }}>⚒ FORGE BOARD</h1>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.8rem", color: "#888" }}>HEAT GAUGE</div>
          <div style={{ width: "200px", background: "#333", borderRadius: "4px", height: "12px", marginTop: "4px" }}>
            <div style={{ width: `${heat}%`, background: "linear-gradient(90deg, #ff6b00, #ff0000)", height: "100%", borderRadius: "4px", transition: "width 0.5s" }} />
          </div>
          <div style={{ fontSize: "0.8rem", color: "#ff6b00", marginTop: "2px" }}>{heat}% shipped</div>
        </div>
      </div>

      {/* Add Card */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCard()}
          placeholder="New task..."
          style={{ flex: 1, padding: "8px 12px", background: "#2a2a2a", border: "1px solid #444", color: "#f0f0f0", borderRadius: "4px", fontFamily: "monospace" }}
        />
        <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}
          style={{ padding: "8px", background: "#2a2a2a", border: "1px solid #444", color: "#f0f0f0", borderRadius: "4px" }}>
          <option value="high">🔴 High</option>
          <option value="med">🟡 Med</option>
          <option value="low">🟢 Low</option>
        </select>
        <button onClick={addCard}
          style={{ padding: "8px 16px", background: "#ff6b00", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "monospace", fontWeight: "bold" }}>
          + ADD
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px", fontSize: "0.8rem", color: "#888" }}>
        <span>📋 Total: {cards.length}</span>
        <span>✅ Shipped: {doneCount}</span>
        <span>🔴 High Priority: {cards.filter(c => c.priority === "high" && c.col !== "Done").length} pending</span>
      </div>

      {/* Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {COLUMNS.map((col) => (
          <div key={col}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(col)}
            style={{ background: "#242424", borderRadius: "8px", padding: "12px", minHeight: "400px", border: "1px solid #333" }}>
            <div style={{ fontWeight: "bold", color: "#ff6b00", marginBottom: "12px", fontSize: "0.85rem", letterSpacing: "2px", borderBottom: "1px solid #333", paddingBottom: "8px" }}>
              {col.toUpperCase()} ({cards.filter(c => c.col === col).length})
            </div>
            {cards.filter((c) => c.col === col).map((card) => (
              <div key={card.id} draggable
                onDragStart={() => onDragStart(card.id)}
                style={{ background: "#2e2e2e", borderRadius: "6px", padding: "10px", marginBottom: "8px", borderLeft: `3px solid ${PRIORITY_COLOR[card.priority]}`, cursor: "grab", position: "relative" }}>
                <div style={{ fontSize: "0.85rem", marginBottom: "6px" }}>{card.title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", color: PRIORITY_COLOR[card.priority] }}>{card.priority.toUpperCase()}</span>
                  <button onClick={() => deleteCard(card.id)}
                    style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.75rem" }}>✕</button>
                </div>
              </div>
            ))}
            {cards.filter(c => c.col === col).length === 0 && (
              <div style={{ color: "#444", fontSize: "0.8rem", textAlign: "center", marginTop: "40px" }}>nothing queued</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px", fontSize: "0.7rem", color: "#444", textAlign: "center" }}>
        FORGE 2 QUALIFIER · forge2-qualifier-anvitamishra123 · drag cards between columns
      </div>
    </div>
  );
}
