import { useEffect, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  BriefcaseBusiness,
  UserCheck,
  Clock3,
  XCircle,
  MoreHorizontal,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import api from "./api/api";
import Candidates from "./pages/Candidates";
import "./App.css";
import Pipeline from "./pages/Pipeline";

const stages = [
  { key: "APPLIED", label: "Applied", color: "#64748b" },
  { key: "SCREENING", label: "Screening", color: "#8b5cf6" },
  { key: "INTERVIEW", label: "Interview", color: "#3b82f6" },
  { key: "OFFER", label: "Offer", color: "#f59e0b" },
  { key: "HIRED", label: "Hired", color: "#10b981" },
  { key: "REJECTED", label: "Rejected", color: "#ef4444" },
];

function formatStage(stage) {
  return stage.charAt(0) + stage.slice(1).toLowerCase();
}

function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hour = new Date().getHours();
  const greeting =
      hour < 12
          ? "Good morning"
          : hour < 17
              ? "Good afternoon"
              : "Good evening";

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [metricsResponse, candidatesResponse] = await Promise.all([
          api.get("/dashboard/metrics"),
          api.get("/candidates"),
        ]);

        setMetrics(metricsResponse.data);
        setCandidates(
            Array.isArray(candidatesResponse.data)
                ? candidatesResponse.data
                : [candidatesResponse.data]
        );
      } catch (err) {
        setError(
            err.response?.data?.message ||
            "Unable to load dashboard data. Check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stageCounts = metrics?.stageCounts ?? {};
  const chartData = stages.map((stage) => ({
    name: stage.label,
    candidates: stageCounts[stage.key] ?? 0,
  }));

  const cards = [
    {
      title: "Total candidates",
      value: metrics?.totalCandidates ?? 0,
      detail: "Candidates in your database",
      icon: Users,
      color: "purple",
    },
    {
      title: "In interview",
      value: stageCounts.INTERVIEW ?? 0,
      detail: "Candidates at interview stage",
      icon: Clock3,
      color: "blue",
    },
    {
      title: "Hired",
      value: metrics?.hired ?? 0,
      detail: "Successfully hired",
      icon: UserCheck,
      color: "green",
    },
    {
      title: "Rejected",
      value: metrics?.rejected ?? 0,
      detail: "Candidates not progressing",
      icon: XCircle,
      color: "orange",
    },
  ];

  return (
      <div className="page-content">
        <section className="welcome-row">
          <div>
            <div className="eyebrow">YOUR RECRUITMENT WORKSPACE</div>
            <h1>{greeting} <span>👋</span></h1>
            <p>Here's what's happening with your hiring pipeline today.</p>
          </div>
          <button
              className="primary-button"
              onClick={() => navigate("/candidates?new=true")}
          >
            <Plus size={18} /> Add candidate
          </button>
        </section>

        {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        )}

        <section className="metrics-grid">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
                <article className="metric-card" key={card.title}>
                  <div className="metric-card-top">
                    <span className="metric-title">{card.title}</span>
                    <span className={`metric-icon ${card.color}`}>
                  <Icon size={19} />
                </span>
                  </div>
                  <div className="metric-value">
                    {loading ? "—" : card.value}
                  </div>
                  <div className="metric-detail">{card.detail}</div>
                </article>
            );
          })}
        </section>

        <section className="dashboard-grid">
          <article className="panel funnel-panel">
            <div className="panel-header">
              <div>
                <h2>Hiring overview</h2>
                <p>Candidate distribution across stages</p>
              </div>
              <span className="period-pill">
              All time <ChevronDown size={14} />
            </span>
            </div>

            <div className="chart-area">
              {loading ? (
                  <div className="empty-state">Loading hiring metrics…</div>
              ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 12, right: 8, left: -22, bottom: 0 }}
                    >
                      <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#edf0f5"
                      />
                      <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#778196", fontSize: 12 }}
                      />
                      <YAxis
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#778196", fontSize: 12 }}
                      />
                      <Tooltip
                          cursor={{ fill: "#f5f6fb" }}
                          contentStyle={{
                            border: "1px solid #e9edf4",
                            borderRadius: 10,
                          }}
                      />
                      <Bar
                          dataKey="candidates"
                          fill="#7161ef"
                          radius={[5, 5, 0, 0]}
                          maxBarSize={38}
                      />
                    </BarChart>
                  </ResponsiveContainer>
              )}
            </div>
          </article>

          <article className="panel stage-panel">
            <div className="panel-header">
              <div>
                <h2>Pipeline snapshot</h2>
                <p>Current candidate stages</p>
              </div>
              <BriefcaseBusiness size={19} className="muted-icon" />
            </div>

            <div className="stage-list">
              {stages.map((stage) => (
                  <div className="stage-row" key={stage.key}>
                <span
                    className="stage-dot"
                    style={{ background: stage.color }}
                />
                    <span className="stage-name">{stage.label}</span>
                    <div className="stage-track">
                      <div
                          className="stage-track-fill"
                          style={{
                            width: `${
                                metrics?.totalCandidates
                                    ? ((stageCounts[stage.key] ?? 0) /
                                        metrics.totalCandidates) *
                                    100
                                    : 0
                            }%`,
                            background: stage.color,
                          }}
                      />
                    </div>
                    <strong>{stageCounts[stage.key] ?? 0}</strong>
                  </div>
              ))}
            </div>

            <button
                className="text-button"
                onClick={() => navigate("/pipeline")}
            >
              View hiring pipeline <ArrowUpRight size={15} />
            </button>
          </article>
        </section>

        <section className="panel candidates-panel">
          <div className="panel-header candidates-header">
            <div>
              <h2>Recent candidates</h2>
              <p>Your latest additions to the talent pool</p>
            </div>
            <button
                className="secondary-button"
                onClick={() => navigate("/candidates")}
            >
              View all candidates <ArrowUpRight size={15} />
            </button>
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
                <th />
              </tr>
              </thead>
              <tbody>
              {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      Loading candidates…
                    </td>
                  </tr>
              ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No candidates yet. Add your first candidate to get started.
                    </td>
                  </tr>
              ) : (
                  [...candidates]
                      .sort((a, b) => b.id - a.id)
                      .slice(0, 5)
                      .map((candidate) => (
                          <tr key={candidate.id}>
                            <td>
                              <div className="candidate-cell">
                                <div className="candidate-avatar">
                                  {(candidate.fullname || "?")
                                      .charAt(0)
                                      .toUpperCase()}
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
                        <span
                            className={`status-badge status-${candidate.stage.toLowerCase()}`}
                        >
                          <span /> {formatStage(candidate.stage)}
                        </span>
                            </td>
                            <td>
                              <button
                                  className="row-menu"
                                  aria-label="Candidate actions"
                                  onClick={() => navigate("/candidates")}
                              >
                                <MoreHorizontal size={18} />
                              </button>
                            </td>
                          </tr>
                      ))
              )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            Showing {Math.min(candidates.length, 5)} of {candidates.length} candidates
            <span><span className="online-dot" /> Data synced with your workspace</span>
          </div>
        </section>
      </div>
  );
}

function PipelinePlaceholder() {
  return (
      <div className="page-content">
        <div className="welcome-row">
          <div>
            <div className="eyebrow">RECRUITMENT WORKFLOW</div>
            <h1>Hiring pipeline</h1>
            <p>Track candidates as they progress through each hiring stage.</p>
          </div>
        </div>
        <section className="panel">
          The interactive hiring pipeline will be implemented next.
        </section>
      </div>
  );
}

function AppLayout() {
  const [candidateCount, setCandidateCount] = useState(0);

  useEffect(() => {
    api.get("/dashboard/metrics")
        .then((response) => setCandidateCount(response.data.totalCandidates ?? 0))
        .catch(() => setCandidateCount(0));
  }, []);

  return (
      <div className="app-shell">
        <aside className="sidebar">
          <NavLink className="brand" to="/dashboard">
            <span className="brand-mark"><Sparkles size={21} /></span>
            <span>earlyjobs<span className="brand-dot">.ai</span></span>
          </NavLink>

          <div className="workspace-label">WORKSPACE</div>

          <nav className="sidebar-nav">
            <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink
                to="/candidates"
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <Users size={18} /> Candidates
              <span className="nav-count">{candidateCount}</span>
            </NavLink>
            <NavLink
                to="/pipeline"
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <GitBranch size={18} /> Hiring pipeline
            </NavLink>
          </nav>

          <div className="sidebar-bottom">
            <div className="plan-card">
              <div className="plan-icon"><Sparkles size={17} /></div>
              <strong>Hiring, simplified.</strong>
              <p>Keep your candidates and hiring process organized in one place.</p>
            </div>
            <div className="profile">
              <div className="avatar">S</div>
              <div className="profile-info">
                <strong>Workspace Admin</strong>
                <span>Recruitment team</span>
              </div>
              <MoreHorizontal size={19} />
            </div>
          </div>
        </aside>

        <main className="main-area">
          <header className="topbar">
            <div className="breadcrumb">Workspace <span>/</span> EarlyJobs ATS</div>
            <div className="topbar-actions">
              <button className="icon-button" aria-label="Search">
                <Search size={18} />
              </button>
              <button className="icon-button notification-button" aria-label="Notifications">
                <Bell size={18} /><span />
              </button>
              <div className="topbar-divider" />
              <div className="topbar-user">
                <div className="avatar small">S</div>
                <ChevronDown size={15} />
              </div>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
  );
}

export default function App() {
  return (
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
  );
}
