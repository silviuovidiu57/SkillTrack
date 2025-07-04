import React, { useState, useEffect } from "react";
import { backend } from "declarations/backend";

export default function App() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [progressNote, setProgressNote] = useState("");
  const [level, setLevel] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const data = await backend.getAllSkills();
    setSkills(data.sort((a, b) => Number(b.createdAt) - Number(a.createdAt)));
  };

  const handleSubmit = async () => {
    if (!name || !startDate) return;

    if (editId !== null) {
      await backend.editSkill(editId, name, startDate, progressNote, level);
      setEditId(null);
    } else {
      await backend.addSkill(name, startDate, progressNote, level);
    }

    setName("");
    setStartDate("");
    setProgressNote("");
    setLevel("");
    fetchSkills();
  };

  const handleEdit = (skill) => {
    setEditId(skill.id);
    setName(skill.name);
    setStartDate(skill.startDate);
    setProgressNote(skill.progressNote);
    setLevel(skill.level);
  };

  const handleDelete = async (id) => {
    await backend.deleteSkill(id);
    fetchSkills();
  };

  return (
    <main className="dashboard">
      <header>
        <h1>📕 SkillTrack</h1>
        <p>Track your personal growth and skill development over time</p>
      </header>

      <section className="form-card">
        <h2>{editId !== null ? "Edit Skill" : "Add New Skill"}</h2>
        <input
          type="text"
          placeholder="Skill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <textarea
          placeholder="Progress notes"
          value={progressNote}
          onChange={(e) => setProgressNote(e.target.value)}
        ></textarea>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Select level</option>
          <option value="Beginner">🟢 Beginner</option>
          <option value="Intermediate">🟡 Intermediate</option>
          <option value="Advanced">🔴 Advanced</option>
        </select>
        <button onClick={handleSubmit}>
          {editId !== null ? "Update Skill" : "Add Skill"}
        </button>
      </section>

      <section className="skills-grid">
        {skills.map((skill) => (
          <div key={skill.id} className="skill-entry">
            <div className="skill-header">
              <h3>{skill.name}</h3>
              <span className="badge">{skill.level}</span>
            </div>
            <p><strong>Started:</strong> {skill.startDate}</p>
            <p>{skill.progressNote}</p>
            <small>📅 {new Date(Number(skill.createdAt) / 1_000_000).toLocaleString()}</small>
            <div className="entry-actions">
              <button onClick={() => handleEdit(skill)}>✏️</button>
              <button onClick={() => handleDelete(skill.id)}>❌</button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
