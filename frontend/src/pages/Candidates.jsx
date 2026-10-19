import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Plus, Search, Pencil, Trash2, X, RefreshCw
} from "lucide-react";
import api from "../api/api";

const stages = [
    "APPLIED", "SCREENING", "INTERVIEW",
    "OFFER", "HIRED", "REJECTED"
];

const emptyForm = {
    fullname: "",
    email: "",
    phone: "",
    jobTitle: "",
    experienceYears: 0,
    source: "LinkedIn",
    notes: "",
};

function label(stage) {
    return stage.charAt(0) + stage.slice(1).toLowerCase();
}

export default function Candidates() {
    const [candidates, setCandidates] = useState([]);
    const [search, setSearch] = useState("");
    const [stage, setStage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("new") === "true") {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    async function loadCandidates() {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/candidates", {
                params: {
                    search: search.trim() || undefined,
                    stage: stage || undefined,
                },
            });
            setCandidates(
                Array.isArray(response.data) ? response.data : [response.data]
            );
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to load candidates."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(loadCandidates, 250);
        return () => clearTimeout(timer);
    }, [search, stage]);

    function openCreate() {
        setEditingId(null);
        setForm(emptyForm);
        setError("");
        setNotice("");
        setShowForm(true);
    }

    function openEdit(candidate) {
        setEditingId(candidate.id);
        setForm({
            fullname: candidate.fullname ?? "",
            email: candidate.email ?? "",
            phone: candidate.phone ?? "",
            jobTitle: candidate.jobTitle ?? "",
            experienceYears: candidate.experienceYears ?? 0,
            source: candidate.source ?? "",
            notes: candidate.notes ?? "",
        });
        setError("");
        setNotice("");
        setShowForm(true);
    }

    function updateField(event) {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    }

    async function saveCandidate(event) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setNotice("");

        const payload = {
            ...form,
            experienceYears: Number(form.experienceYears),
        };

        try {
            if (editingId !== null) {
                await api.put(`/candidates/${editingId}`, payload);
                setNotice("Candidate updated successfully.");
            } else {
                await api.post("/candidates", payload);
                setNotice("Candidate added successfully.");
            }

            setShowForm(false);
            await loadCandidates();
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to save candidate."
            );
        } finally {
            setSaving(false);
        }
    }

    async function deleteCandidate(candidate) {
        const confirmed = window.confirm(
            `Delete ${candidate.fullname}? This action cannot be undone.`
        );
        if (!confirmed) return;

        setError("");
        setNotice("");

        try {
            await api.delete(`/candidates/${candidate.id}`);
            setNotice(`${candidate.fullname} was deleted.`);
            await loadCandidates();
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to delete candidate."
            );
        }
    }

    async function changeStage(candidate, nextStage) {
        setError("");
        setNotice("");

        try {
            await api.patch(`/candidates/${candidate.id}/stage`, {
                stage: nextStage,
            });
            setNotice(`${candidate.fullname}'s stage was updated.`);
            await loadCandidates();
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to update candidate stage."
            );
        }
    }

    return (
        <div className="page-content">
            <section className="welcome-row">
                <div>
                    <div className="eyebrow">TALENT DIRECTORY</div>
                    <h1>Candidates</h1>
                    <p>Manage candidate profiles and track their hiring progress.</p>
                </div>
                <button className="primary-button" onClick={openCreate}>
                    <Plus size={17} /> Add candidate
                </button>
            </section>

            {notice && <div className="success-banner">{notice}</div>}
            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button onClick={() => setError("")}>Dismiss</button>
                </div>
            )}

            <section className="panel candidate-management">
                <div className="candidate-toolbar">
                    <div className="search-field">
                        <Search size={17} />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search name, email, or job title..."
                        />
                        {search && (
                            <button
                                className="clear-search"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    <select
                        value={stage}
                        onChange={(event) => setStage(event.target.value)}
                        aria-label="Filter by hiring stage"
                    >
                        <option value="">All stages</option>
                        {stages.map((item) => (
                            <option value={item} key={item}>{label(item)}</option>
                        ))}
                    </select>

                    <button
                        className="icon-button refresh-button"
                        onClick={loadCandidates}
                        title="Refresh candidates"
                        aria-label="Refresh candidates"
                    >
                        <RefreshCw size={17} />
                    </button>
                </div>

                <div className="candidate-results">
          <span>
            {loading ? "Loading candidates..." :
                `${candidates.length} candidate${candidates.length === 1 ? "" : "s"}`}
          </span>
                    <span>Search and filters update automatically</span>
                </div>

                <div className="table-wrap">
                    <table className="candidate-table">
                        <thead>
                        <tr>
                            <th>Candidate</th>
                            <th>Position</th>
                            <th>Experience</th>
                            <th>Source</th>
                            <th>Stage</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="empty-state">Loading candidates…</td></tr>
                        ) : candidates.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-state">
                                    No candidates match these filters.
                                </td>
                            </tr>
                        ) : candidates.map((candidate) => (
                            <tr key={candidate.id}>
                                <td>
                                    <div className="candidate-cell">
                                        <div className="candidate-avatar">
                                            {(candidate.fullname || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <strong>{candidate.fullname}</strong>
                                            <span>{candidate.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{candidate.jobTitle}</td>
                                <td>{candidate.experienceYears} yrs</td>
                                <td>{candidate.source || "—"}</td>
                                <td>
                                    <select
                                        className={`stage-select status-${candidate.stage.toLowerCase()}`}
                                        value={candidate.stage}
                                        onChange={(event) =>
                                            changeStage(candidate, event.target.value)
                                        }
                                        aria-label={`Change stage for ${candidate.fullname}`}
                                    >
                                        {stages.map((item) => (
                                            <option value={item} key={item}>{label(item)}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <div className="row-actions">
                                        <button
                                            className="action-button"
                                            onClick={() => openEdit(candidate)}
                                            aria-label={`Edit ${candidate.fullname}`}
                                            title="Edit candidate"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            className="action-button danger"
                                            onClick={() => deleteCandidate(candidate)}
                                            aria-label={`Delete ${candidate.fullname}`}
                                            title="Delete candidate"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {showForm && (
                <div
                    className="modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !saving) {
                            setShowForm(false);
                        }
                    }}
                >
                    <section className="candidate-modal" role="dialog" aria-modal="true">
                        <div className="modal-header">
                            <div>
                                <div className="eyebrow">
                                    {editingId ? "EDIT PROFILE" : "NEW PROFILE"}
                                </div>
                                <h2>{editingId ? "Edit candidate" : "Add candidate"}</h2>
                            </div>
                            <button
                                className="icon-button"
                                onClick={() => setShowForm(false)}
                                disabled={saving}
                                aria-label="Close form"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={saveCandidate}>
                            <div className="form-grid">
                                <label>
                                    Full name *
                                    <input
                                        name="fullname"
                                        value={form.fullname}
                                        onChange={updateField}
                                        required
                                        maxLength={120}
                                    />
                                </label>
                                <label>
                                    Email *
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={updateField}
                                        required
                                        maxLength={180}
                                    />
                                </label>
                                <label>
                                    Phone
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={updateField}
                                        maxLength={20}
                                    />
                                </label>
                                <label>
                                    Job title *
                                    <input
                                        name="jobTitle"
                                        value={form.jobTitle}
                                        onChange={updateField}
                                        required
                                        maxLength={120}
                                    />
                                </label>
                                <label>
                                    Experience (years) *
                                    <input
                                        name="experienceYears"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={form.experienceYears}
                                        onChange={updateField}
                                        required
                                    />
                                </label>
                                <label>
                                    Source
                                    <select name="source" value={form.source} onChange={updateField}>
                                        <option value="">Select source</option>
                                        <option>LinkedIn</option>
                                        <option>Company website</option>
                                        <option>Referral</option>
                                        <option>Job portal</option>
                                        <option>Campus</option>
                                        <option>Other</option>
                                    </select>
                                </label>
                                <label className="full-width">
                                    Notes
                                    <textarea
                                        name="notes"
                                        value={form.notes}
                                        onChange={updateField}
                                        rows="3"
                                        maxLength={5000}
                                    />
                                </label>
                            </div>

                            {error && <div className="form-error">{error}</div>}

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => setShowForm(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." :
                                        editingId ? "Save changes" : "Create candidate"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}
