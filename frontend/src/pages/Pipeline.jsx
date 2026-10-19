
import { useEffect, useState } from "react";
import api from "../api/api";
import {
    RefreshCw,
    UserRound,
    BriefcaseBusiness,
    AlertCircle,
} from "lucide-react";

const STAGES = [
    { key: "APPLIED", label: "Applied" },
    { key: "SCREENING", label: "Screening" },
    { key: "INTERVIEW", label: "Interview" },
    { key: "OFFER", label: "Offer" },
    { key: "HIRED", label: "Hired" },
    { key: "REJECTED", label: "Rejected" },
];

function Pipeline() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    async function loadCandidates() {
        try {
            setError("");
            const response = await api.get("/candidates");
            setCandidates(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load candidates. Check whether the backend is running."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCandidates();
    }, []);

    async function changeStage(candidateId, newStage) {
        const previousCandidates = candidates;

        setCandidates((current) =>
            current.map((candidate) =>
                candidate.id === candidateId
                    ? { ...candidate, stage: newStage }
                    : candidate
            )
        );

        setUpdatingId(candidateId);
        setError("");

        try {
            const response = await api.patch(
                `/candidates/${candidateId}/stage`,
                { stage: newStage }
            );

            setCandidates((current) =>
                current.map((candidate) =>
                    candidate.id === candidateId
                        ? { ...candidate, ...response.data, stage: newStage }
                        : candidate
                )
            );
        } catch (err) {
            setCandidates(previousCandidates);
            setError(
                err.response?.data?.message ||
                "Could not update the candidate's stage."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    const getInitials = (name = "") =>
        name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join("");

    if (loading) {
        return (
            <div className="pipeline-loading">
                <RefreshCw size={20} className="pipeline-spin" />
                Loading hiring pipeline...
            </div>
        );
    }

    return (
        <section className="pipeline-page">
            <div className="pipeline-heading">
                <div>
                    <h1>Hiring Pipeline</h1>
                    <p>Track candidates and move them through your hiring process.</p>
                </div>

                <button
                    type="button"
                    className="pipeline-refresh"
                    onClick={() => {
                        setLoading(true);
                        loadCandidates();
                    }}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="pipeline-error" role="alert">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="pipeline-summary">
                <div>
                    <span>Total candidates</span>
                    <strong>{candidates.length}</strong>
                </div>
                <div>
                    <span>Active pipeline</span>
                    <strong>
                        {
                            candidates.filter(
                                (candidate) =>
                                    !["HIRED", "REJECTED"].includes(candidate.stage)
                            ).length
                        }
                    </strong>
                </div>
                <div>
                    <span>Hired</span>
                    <strong>
                        {candidates.filter((candidate) => candidate.stage === "HIRED").length}
                    </strong>
                </div>
            </div>

            <div className="pipeline-board">
                {STAGES.map((stage) => {
                    const stageCandidates = candidates.filter(
                        (candidate) => candidate.stage === stage.key
                    );

                    return (
                        <div
                            className={`pipeline-column pipeline-column-${stage.key.toLowerCase()}`}
                            key={stage.key}
                        >
                            <div className="pipeline-column-header">
                                <div>
                                    <span className="pipeline-stage-dot" />
                                    <h2>{stage.label}</h2>
                                </div>
                                <span className="pipeline-count">{stageCandidates.length}</span>
                            </div>

                            <div className="pipeline-card-list">
                                {stageCandidates.length === 0 ? (
                                    <div className="pipeline-empty">
                                        <UserRound size={20} />
                                        <span>No candidates</span>
                                    </div>
                                ) : (
                                    stageCandidates.map((candidate) => (
                                        <article
                                            className="pipeline-candidate-card"
                                            key={candidate.id}
                                        >
                                            <div className="pipeline-card-person">
                                                <div className="pipeline-avatar">
                                                    {getInitials(candidate.fullname)}
                                                </div>
                                                <div className="pipeline-person-details">
                                                    <h3>{candidate.fullname}</h3>
                                                    <span>
                            Candidate #{candidate.id}
                          </span>
                                                </div>
                                            </div>

                                            <div className="pipeline-job">
                                                <BriefcaseBusiness size={15} />
                                                <span>{candidate.jobTitle || "Position not specified"}</span>
                                            </div>

                                            <div className="pipeline-card-meta">
                        <span>
                          {candidate.experienceYears ?? 0} years experience
                        </span>
                                                {candidate.source && (
                                                    <span className="pipeline-source">
                            {candidate.source}
                          </span>
                                                )}
                                            </div>

                                            {candidate.email && (
                                                <p className="pipeline-email">{candidate.email}</p>
                                            )}

                                            <label
                                                className="pipeline-move-label"
                                                htmlFor={`stage-${candidate.id}`}
                                            >
                                                Move candidate
                                            </label>
                                            <select
                                                id={`stage-${candidate.id}`}
                                                value={candidate.stage}
                                                disabled={updatingId === candidate.id}
                                                onChange={(event) =>
                                                    changeStage(candidate.id, event.target.value)
                                                }
                                            >
                                                {STAGES.map((option) => (
                                                    <option key={option.key} value={option.key}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>

                                            {updatingId === candidate.id && (
                                                <span className="pipeline-updating">
                          Saving stage...
                        </span>
                                            )}
                                        </article>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Pipeline;
