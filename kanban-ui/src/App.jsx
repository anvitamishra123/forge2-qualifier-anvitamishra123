import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

function App() {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [tags, setTags] = useState([]);
  const [members, setMembers] = useState([]);

  const [newBoardName, setNewBoardName] = useState("");
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const loadData = async () => {
    try {
      setLoading(true);

      const [boardRes, tagRes, memberRes] = await Promise.all([
        api.get("/boards"),
        api.get("/tags"),
        api.get("/members"),
      ]);

      const boardData = boardRes.data || [];

      setBoards(boardData);
      setTags(tagRes.data || []);
      setMembers(memberRes.data || []);

      if (boardData.length > 0) {
        if (activeBoard) {
          const updatedActiveBoard = boardData.find(
            (board) => board.id === activeBoard.id
          );
          setActiveBoard(updatedActiveBoard || boardData[0]);
        } else {
          setActiveBoard(boardData[0]);
        }
      } else {
        setActiveBoard(null);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert(
        "Backend API connect nahi ho pa raha. Please check karo php artisan serve running hai ya nahi."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createBoard = async () => {
    if (!newBoardName.trim()) {
      alert("Please board name enter karo.");
      return;
    }

    await api.post("/boards", {
      name: newBoardName,
      description: "Forge 2 Kanban board",
    });

    setNewBoardName("");
    await loadData();
  };

  const createList = async () => {
    if (!activeBoard) {
      alert("Pehle board create/select karo.");
      return;
    }

    if (!newListName.trim()) {
      alert("Please list name enter karo.");
      return;
    }

    await api.post(`/boards/${activeBoard.id}/lists`, {
      name: newListName,
      position: activeBoard.lists ? activeBoard.lists.length : 0,
    });

    setNewListName("");
    await loadData();
  };

  const createCard = async (listId) => {
    const title = prompt("Enter card title:");
    if (!title) return;

    const description = prompt("Enter card description:") || "";

    await api.post(`/lists/${listId}/cards`, {
      title,
      description,
      position: 0,
      due_date: null,
    });

    await loadData();
  };

  const editCard = async (card) => {
    const title = prompt("Update card title:", card.title);
    if (!title) return;

    const description =
      prompt("Update card description:", card.description || "") || "";

    await api.put(`/cards/${card.id}`, {
      title,
      description,
      position: card.position || 0,
      due_date: card.due_date,
    });

    await loadData();
  };

  const deleteCard = async (cardId) => {
    const confirmDelete = confirm("Are you sure you want to delete this card?");
    if (!confirmDelete) return;

    await api.delete(`/cards/${cardId}`);
    await loadData();
  };

  const moveCard = async (cardId, targetListId) => {
    if (!targetListId) return;

    await api.post(`/cards/${cardId}/move`, {
      list_id: Number(targetListId),
      position: 0,
    });

    await loadData();
  };

  const setDueDate = async (card) => {
    const dueDate = prompt(
      "Enter due date in YYYY-MM-DD format:",
      card.due_date || ""
    );

    if (dueDate === null) return;

    await api.put(`/cards/${card.id}`, {
      title: card.title,
      description: card.description || "",
      position: card.position || 0,
      due_date: dueDate || null,
    });

    await loadData();
  };

  const createTag = async () => {
    const name = prompt("Enter tag name:");
    if (!name) return;

    const color = prompt("Enter tag color hex code:", "#3B82F6") || "#3B82F6";

    await api.post("/tags", {
      name,
      color,
    });

    await loadData();
  };

  const assignTag = async (card) => {
    if (tags.length === 0) {
      alert("No tags found. Please create a tag first.");
      return;
    }

    const tagList = tags.map((tag) => `${tag.id}: ${tag.name}`).join("\n");

    const tagId = prompt(`Enter tag ID:\n${tagList}`);
    if (!tagId) return;

    const existingTagIds = card.tags ? card.tags.map((tag) => tag.id) : [];
    const updatedTagIds = [...new Set([...existingTagIds, Number(tagId)])];

    await api.post(`/cards/${card.id}/tags`, {
      tag_ids: updatedTagIds,
    });

    await loadData();
  };

  const createMember = async () => {
    const name = prompt("Enter member name:");
    if (!name) return;

    const email = prompt("Enter member email:");
    if (!email) return;

    await api.post("/members", {
      name,
      email,
    });

    await loadData();
  };

  const assignMember = async (card) => {
    if (members.length === 0) {
      alert("No members found. Please create a member first.");
      return;
    }

    const memberList = members
      .map((member) => `${member.id}: ${member.name}`)
      .join("\n");

    const memberId = prompt(`Enter member ID:\n${memberList}`);
    if (!memberId) return;

    const existingMemberIds = card.members
      ? card.members.map((member) => member.id)
      : [];

    const updatedMemberIds = [
      ...new Set([...existingMemberIds, Number(memberId)]),
    ];

    await api.post(`/cards/${card.id}/members`, {
      member_ids: updatedMemberIds,
    });

    await loadData();
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;

    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < today;
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Forge 2 Kanban Board</h1>
          <p>Laravel API + React UI + Slack Agent Workflow</p>
        </div>

        <button onClick={loadData}>Refresh</button>
      </header>

      <section className="panel">
        <h2>Boards</h2>

        <div className="row">
          <input
            type="text"
            placeholder="New board name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
          <button onClick={createBoard}>Create Board</button>
        </div>

        <div className="board-tabs">
          {boards.map((board) => (
            <button
              key={board.id}
              className={activeBoard?.id === board.id ? "active" : ""}
              onClick={() => setActiveBoard(board)}
            >
              {board.name}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Tags & Members</h2>

        <div className="row">
          <button onClick={createTag}>Create Tag</button>
          <button onClick={createMember}>Create Member</button>
        </div>

        <div className="meta-grid">
          <div>
            <h3>Available Tags</h3>

            {tags.length === 0 && <p>No tags available.</p>}

            {tags.map((tag) => (
              <span
                key={tag.id}
                className="tag"
                style={{ backgroundColor: tag.color || "#3B82F6" }}
              >
                {tag.id}. {tag.name}
              </span>
            ))}
          </div>

          <div>
            <h3>Available Members</h3>

            {members.length === 0 && <p>No members available.</p>}

            {members.map((member) => (
              <span key={member.id} className="member">
                {member.id}. {member.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {loading && <p className="loading">Loading...</p>}

      {!activeBoard && !loading && (
        <section className="empty">
          <h2>No board found</h2>
          <p>Please create your first board.</p>
        </section>
      )}

      {activeBoard && (
        <>
          <section className="panel">
            <h2>Active Board: {activeBoard.name}</h2>

            <div className="row">
              <input
                type="text"
                placeholder="New list name e.g. To Do"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
              <button onClick={createList}>Add List</button>
            </div>
          </section>

          <main className="kanban">
            {(activeBoard.lists || []).map((list) => (
              <div className="list" key={list.id}>
                <div className="list-header">
                  <h3>{list.name}</h3>
                  <button onClick={() => createCard(list.id)}>+ Card</button>
                </div>

                {(list.cards || []).length === 0 && (
                  <p className="empty-list">No cards yet</p>
                )}

                {(list.cards || []).map((card) => (
                  <div
                    key={card.id}
                    className={`card ${
                      isOverdue(card.due_date) ? "overdue" : ""
                    }`}
                  >
                    <h4>{card.title}</h4>
                    <p>{card.description || "No description"}</p>

                    <div className="card-tags">
                      {(card.tags || []).map((tag) => (
                        <span
                          key={tag.id}
                          className="tag"
                          style={{ backgroundColor: tag.color || "#3B82F6" }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>

                    <div className="card-members">
                      {(card.members || []).map((member) => (
                        <span key={member.id} className="member">
                          {member.name}
                        </span>
                      ))}
                    </div>

                    <p
                      className={
                        isOverdue(card.due_date)
                          ? "due overdue-text"
                          : "due"
                      }
                    >
                      Due: {card.due_date || "Not set"}
                      {isOverdue(card.due_date) && " ⚠ Overdue"}
                    </p>

                    <select
                      defaultValue=""
                      onChange={(e) => moveCard(card.id, e.target.value)}
                    >
                      <option value="">Move to...</option>

                      {(activeBoard.lists || []).map((targetList) => (
                        <option key={targetList.id} value={targetList.id}>
                          {targetList.name}
                        </option>
                      ))}
                    </select>

                    <div className="card-actions">
                      <button onClick={() => editCard(card)}>Edit</button>
                      <button onClick={() => assignTag(card)}>Add Tag</button>
                      <button onClick={() => assignMember(card)}>
                        Assign
                      </button>
                      <button onClick={() => setDueDate(card)}>
                        Due Date
                      </button>
                      <button
                        className="danger"
                        onClick={() => deleteCard(card.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </main>
        </>
      )}
    </div>
  );
}

export default App;