import React, { useState, useCallback } from "react";
import {
  Layout,
  Table,
  Tag,
  Button,
  Input,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Badge,
  Avatar,
  Space,
  Typography,
  Tabs,
  Progress,
  Alert,
  Divider,
  Tooltip,
  Spin,
  Modal,
  message,
} from "antd";
import {
  SearchOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EyeOutlined,
  RobotOutlined,
  FlagOutlined,
  UserOutlined,
  FileTextOutlined,
  WarningOutlined,
  SafetyOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Text, Paragraph, Title } = Typography;
const { Option } = Select;

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportStatus = "pending" | "reviewing" | "approved" | "rejected";
type ReportReason = "Spam" | "Hate speech" | "NSFW" | "Misinformation" | "Violence";
type AiVerdict = "INVALID" | "VALID" | "NEEDS_REVIEW";
type FlagType = "danger" | "warning" | "ok";

interface Author {
  name: string;
  handle: string;
  avatarColor: string;
}

interface Report {
  id: number;
  author: Author;
  reporter: string;
  reason: ReportReason;
  post: string;
  status: ReportStatus;
  reportCount: number;
  time: string;
}

interface AiFlag {
  type: FlagType;
  title: string;
  detail: string;
}

interface AiResult {
  verdict: AiVerdict;
  confidence: number;
  toxicity_score: number;
  spam_score: number;
  policy_violation_score: number;
  flags: AiFlag[];
  summary: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    author: { name: "Nguyen Van A", handle: "@nguyenvana", avatarColor: "#1877f2" },
    reporter: "user_123",
    reason: "Spam",
    post: "Buy cheap likes & followers now!! 100% real 💰💰 Click here!!!",
    status: "pending",
    reportCount: 7,
    time: "2m ago",
  },
  {
    id: 2,
    author: { name: "Tran Thi B", handle: "@tranthib", avatarColor: "#e24b4a" },
    reporter: "user_456",
    reason: "Hate speech",
    post: "People like [group] should all be removed from society permanently.",
    status: "pending",
    reportCount: 14,
    time: "5m ago",
  },
  {
    id: 3,
    author: { name: "Le Minh C", handle: "@leminhc", avatarColor: "#534ab7" },
    reporter: "user_789",
    reason: "NSFW",
    post: "Graphic content warning - see what happened after the fight...",
    status: "pending",
    reportCount: 3,
    time: "12m ago",
  },
  {
    id: 4,
    author: { name: "Pham Duc D", handle: "@phamducd", avatarColor: "#0f6e56" },
    reporter: "user_321",
    reason: "Misinformation",
    post: "BREAKING: Scientists confirm 5G towers spread COVID! Share before deleted!",
    status: "reviewing",
    reportCount: 9,
    time: "18m ago",
  },
  {
    id: 5,
    author: { name: "Hoang Lan E", handle: "@hoanglane", avatarColor: "#ba7517" },
    reporter: "user_654",
    reason: "Spam",
    post: "Click this link to get FREE iPhone 15 Pro Max just complete survey!",
    status: "pending",
    reportCount: 5,
    time: "1h ago",
  },
  {
    id: 6,
    author: { name: "Do Quoc F", handle: "@doquocf", avatarColor: "#639922" },
    reporter: "user_987",
    reason: "Violence",
    post: "I will find you and make you regret what you said to my family.",
    status: "pending",
    reportCount: 11,
    time: "2h ago",
  },
  {
    id: 7,
    author: { name: "Bui Thu G", handle: "@buithug", avatarColor: "#993556" },
    reporter: "user_111",
    reason: "Spam",
    post: "This crypto signal group made me $50k in 2 days - join now FREE",
    status: "approved",
    reportCount: 2,
    time: "3h ago",
  },
  {
    id: 8,
    author: { name: "Vo Anh H", handle: "@voanh", avatarColor: "#185fa5" },
    reporter: "user_222",
    reason: "Misinformation",
    post: "Normal post: Had a great weekend hiking with friends. Beautiful views!",
    status: "rejected",
    reportCount: 1,
    time: "5h ago",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const REASON_COLORS: Record<ReportReason, string> = {
  Spam: "orange",
  "Hate speech": "red",
  NSFW: "magenta",
  Misinformation: "cyan",
  Violence: "volcano",
};

const STATUS_COLORS: Record<ReportStatus, string> = {
  pending: "warning",
  reviewing: "processing",
  approved: "success",
  rejected: "error",
};

const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: "Pending",
  reviewing: "AI Reviewing",
  approved: "Approved",
  rejected: "Rejected",
};

const VERDICT_CONFIG: Record<AiVerdict, { color: string; label: string; bg: string }> = {
  INVALID: { color: "#cf1322", label: "Invalid — Remove", bg: "#fff1f0" },
  VALID: { color: "#389e0d", label: "Valid — Keep", bg: "#f6ffed" },
  NEEDS_REVIEW: { color: "#d46b08", label: "Needs Manual Review", bg: "#fff7e6" },
};

const FLAG_ICONS: Record<FlagType, React.ReactNode> = {
  danger: <StopOutlined style={{ color: "#cf1322" }} />,
  warning: <WarningOutlined style={{ color: "#d46b08" }} />,
  ok: <CheckCircleOutlined style={{ color: "#389e0d" }} />,
};

const FLAG_BG: Record<FlagType, string> = {
  danger: "#fff1f0",
  warning: "#fff7e6",
  ok: "#f6ffed",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

// ─── AI Evaluator Panel ────────────────────────────────────────────────────────

interface AIPanelProps {
  report: Report | null;
  aiResult: AiResult | null;
  loading: boolean;
  onEvaluate: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const AIPanel: React.FC<AIPanelProps> = ({
  report,
  aiResult,
  loading,
  onEvaluate,
  onApprove,
  onReject,
}) => {
  if (!report) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 400,
          gap: 12,
          color: "#8c8c8c",
          border: "1px dashed #d9d9d9",
          borderRadius: 12,
          padding: 24,
          textAlign: "center",
        }}
      >
        <RobotOutlined style={{ fontSize: 36, opacity: 0.3 }} />
        <Text type="secondary" style={{ fontSize: 13 }}>
          Select a report from the table to evaluate with AI
        </Text>
      </div>
    );
  }

  const verdictCfg = aiResult ? VERDICT_CONFIG[aiResult.verdict] : null;

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={14}>
      {/* Post Preview */}
      <Card
        size="small"
        styles={{ body: { padding: "12px 14px" } }}
        style={{ background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 10 }}
      >
        <Space align="start" style={{ marginBottom: 8 }}>
          <Avatar
            size={32}
            style={{ background: report.author.avatarColor, fontSize: 12, fontWeight: 600 }}
          >
            {initials(report.author.name)}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 13 }}>
              {report.author.name}
            </Text>
            <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>
              {report.author.handle}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>
              {report.time}
            </Text>
          </div>
        </Space>
        <Paragraph style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>
          {report.post}
        </Paragraph>
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Reason:
          </Text>
          <Tag color={REASON_COLORS[report.reason]} style={{ fontSize: 10, margin: 0 }}>
            {report.reason}
          </Tag>
          <Text type="secondary" style={{ fontSize: 11 }}>
            · Reported by <strong>{report.reporter}</strong>
          </Text>
        </div>
      </Card>

      {/* Evaluate Button */}
      {!aiResult && !loading && (
        <Button
          type="primary"
          icon={<ThunderboltOutlined />}
          block
          size="middle"
          onClick={() => onEvaluate(report.id)}
          style={{
            background: "linear-gradient(135deg, #1877f2, #0d47a1)",
            border: "none",
            borderRadius: 8,
            fontWeight: 500,
            height: 40,
          }}
        >
          Evaluate with AI
        </Button>
      )}

      {/* Loading state */}
      {loading && (
        <Card
          size="small"
          style={{ background: "#e6f4ff", border: "1px solid #91caff", borderRadius: 10 }}
          styles={{ body: { padding: "12px 14px" } }}
        >
          <Space>
            <Spin size="small" />
            <Text style={{ color: "#0958d9", fontSize: 12 }}>
              AI is analyzing content, context, and policy violations...
            </Text>
          </Space>
        </Card>
      )}

      {/* AI Result */}
      {aiResult && verdictCfg && (
        <>
          {/* Verdict Banner */}
          <div
            style={{
              background: verdictCfg.bg,
              border: `1px solid ${verdictCfg.color}33`,
              borderRadius: 10,
              padding: "12px 14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <Text strong style={{ fontSize: 12 }}>
                AI Verdict
              </Text>
              <Tag color={aiResult.verdict === "INVALID" ? "error" : aiResult.verdict === "VALID" ? "success" : "warning"}>
                {verdictCfg.label}
              </Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.5 }}>
              {aiResult.summary}
            </Text>
          </div>

          {/* Score Bars */}
          <Card
            size="small"
            styles={{ body: { padding: "12px 14px" } }}
            style={{ borderRadius: 10 }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size={10}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 11 }}>Confidence</Text>
                  <Text strong style={{ fontSize: 11 }}>{aiResult.confidence}%</Text>
                </div>
                <Progress
                  percent={aiResult.confidence}
                  showInfo={false}
                  strokeColor={aiResult.confidence > 70 ? "#52c41a" : "#faad14"}
                  size="small"
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 11 }}>Toxicity score</Text>
                  <Text strong style={{ fontSize: 11, color: aiResult.toxicity_score > 60 ? "#cf1322" : "#595959" }}>
                    {aiResult.toxicity_score}%
                  </Text>
                </div>
                <Progress
                  percent={aiResult.toxicity_score}
                  showInfo={false}
                  strokeColor={aiResult.toxicity_score > 60 ? "#ff4d4f" : "#faad14"}
                  size="small"
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 11 }}>Spam probability</Text>
                  <Text strong style={{ fontSize: 11 }}>{aiResult.spam_score}%</Text>
                </div>
                <Progress
                  percent={aiResult.spam_score}
                  showInfo={false}
                  strokeColor="#fa8c16"
                  size="small"
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 11 }}>Policy violation</Text>
                  <Text strong style={{ fontSize: 11, color: aiResult.policy_violation_score > 60 ? "#cf1322" : "#595959" }}>
                    {aiResult.policy_violation_score}%
                  </Text>
                </div>
                <Progress
                  percent={aiResult.policy_violation_score}
                  showInfo={false}
                  strokeColor={aiResult.policy_violation_score > 60 ? "#ff4d4f" : "#faad14"}
                  size="small"
                />
              </div>
            </Space>
          </Card>

          {/* Flags */}
          <Space direction="vertical" style={{ width: "100%" }} size={6}>
            {aiResult.flags.map((flag, i) => (
              <div
                key={i}
                style={{
                  background: FLAG_BG[flag.type],
                  borderRadius: 8,
                  padding: "8px 10px",
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                <span style={{ marginTop: 2 }}>{FLAG_ICONS[flag.type]}</span>
                <div>
                  <Text strong style={{ fontSize: 11, display: "block" }}>
                    {flag.title}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {flag.detail}
                  </Text>
                </div>
              </div>
            ))}
          </Space>

          {/* Action Buttons */}
          <Row gutter={8}>
            <Col span={12}>
              <Button
                block
                danger
                icon={<StopOutlined />}
                onClick={() => onReject(report.id)}
                style={{ borderRadius: 8, fontWeight: 500 }}
              >
                Remove post
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                icon={<CheckCircleOutlined />}
                onClick={() => onApprove(report.id)}
                style={{
                  borderRadius: 8,
                  fontWeight: 500,
                  background: "#f6ffed",
                  borderColor: "#b7eb8f",
                  color: "#389e0d",
                }}
              >
                Approve post
              </Button>
            </Col>
          </Row>

          <Button
            block
            icon={<ReloadOutlined />}
            onClick={() => onEvaluate(report.id)}
            size="small"
            type="text"
            style={{ color: "#8c8c8c", fontSize: 11 }}
          >
            Re-evaluate
          </Button>
        </>
      )}
    </Space>
  );
};

// ─── Main Page Component ───────────────────────────────────────────────────────

const Temp: React.FC = () => {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [aiResults, setAiResults] = useState<Record<number, AiResult>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const selectedReport = reports.find((r) => r.id === selectedId) ?? null;
  const selectedAiResult = selectedId ? aiResults[selectedId] ?? null : null;

  // ── Filter logic ──
  const filtered = reports.filter((r) => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "pending" && r.status === "pending") ||
      (activeTab === "reviewing" && r.status === "reviewing") ||
      (activeTab === "resolved" && (r.status === "approved" || r.status === "rejected"));
    const matchSearch =
      !search ||
      r.author.name.toLowerCase().includes(search.toLowerCase()) ||
      r.post.toLowerCase().includes(search.toLowerCase()) ||
      r.author.handle.toLowerCase().includes(search.toLowerCase());
    const matchReason = !reasonFilter || r.reason === reasonFilter;
    return matchTab && matchSearch && matchReason;
  });

  // ── Update status ──
  const updateStatus = useCallback((id: number, status: ReportStatus) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  // ── AI Evaluate ──
  const runAI = useCallback(
    async (id: number) => {
      if (loadingId) return;
      const report = reports.find((r) => r.id === id);
      if (!report) return;

      setSelectedId(id);
      setLoadingId(id);
      updateStatus(id, "reviewing");

      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: `You are a Facebook content moderation AI. Evaluate this post and return ONLY valid JSON, no markdown, no explanation.

Post content: "${report.post}"
Report reason: "${report.reason}"

Return this exact JSON structure:
{
  "verdict": "INVALID" or "VALID" or "NEEDS_REVIEW",
  "confidence": 0-100,
  "toxicity_score": 0-100,
  "spam_score": 0-100,
  "policy_violation_score": 0-100,
  "flags": [
    {"type": "danger|warning|ok", "title": "short title", "detail": "1 sentence explanation"}
  ],
  "summary": "2 sentence moderation recommendation"
}`,
              },
            ],
          }),
        });

        const data = await res.json();
        const raw = (data.content as Array<{ text?: string }>)
          .map((c) => c.text ?? "")
          .join("");
        let result: AiResult;
        try {
          result = JSON.parse(raw.replace(/```json|```/g, "").trim());
        } catch {
          result = {
            verdict: "NEEDS_REVIEW",
            confidence: 60,
            toxicity_score: 50,
            spam_score: 40,
            policy_violation_score: 55,
            flags: [{ type: "warning", title: "Parse error", detail: "AI response could not be parsed. Manual review recommended." }],
            summary: "AI encountered an issue. Manual review recommended.",
          };
        }

        setAiResults((prev) => ({ ...prev, [id]: result }));
        const newStatus: ReportStatus =
          result.verdict === "INVALID" ? "rejected" : result.verdict === "VALID" ? "approved" : "pending";
        updateStatus(id, newStatus);
        messageApi.success(`AI evaluation complete: ${VERDICT_CONFIG[result.verdict].label}`);
      } catch {
        updateStatus(id, "pending");
        messageApi.error("AI evaluation failed. Check your connection.");
      } finally {
        setLoadingId(null);
      }
    },
    [reports, loadingId, updateStatus, messageApi]
  );

  // ── Batch AI ──
  const runBatchAI = useCallback(async () => {
    const pending = reports.filter((r) => r.status === "pending");
    if (!pending.length) {
      messageApi.info("No pending reports to evaluate.");
      return;
    }
    setBatchLoading(true);
    for (const r of pending) {
      await runAI(r.id);
      await new Promise((res) => setTimeout(res, 500));
    }
    setBatchLoading(false);
    messageApi.success(`Batch evaluation complete for ${pending.length} reports.`);
  }, [reports, runAI, messageApi]);

  // ── Approve / Reject handlers ──
  const handleApprove = useCallback(
    (id: number) => {
      updateStatus(id, "approved");
      messageApi.success("Post approved and reporter notified.");
    },
    [updateStatus, messageApi]
  );

  const handleReject = useCallback(
    (id: number) => {
      Modal.confirm({
        title: "Remove this post?",
        icon: <ExclamationCircleOutlined />,
        content: "The post will be removed and the author will be notified.",
        okText: "Remove",
        okType: "danger",
        cancelText: "Cancel",
        onOk: () => {
          updateStatus(id, "rejected");
          messageApi.success("Post removed successfully.");
        },
      });
    },
    [updateStatus, messageApi]
  );

  // ── Tab counts ──
  const counts = {
    all: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    reviewing: reports.filter((r) => r.status === "reviewing").length,
    resolved: reports.filter((r) => r.status === "approved" || r.status === "rejected").length,
  };

  // ── Table Columns ──
  const columns = [
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      width: 160,
      render: (_: unknown, record: Report) => (
        <Space size={8}>
          <Avatar
            size={32}
            style={{ background: record.author.avatarColor, fontSize: 11, fontWeight: 600, flexShrink: 0 }}
          >
            {initials(record.author.name)}
          </Avatar>
          <div style={{ lineHeight: 1.3 }}>
            <Text strong style={{ fontSize: 12, display: "block" }}>{record.author.name}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.author.handle}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: 120,
      render: (reason: ReportReason) => (
        <Tag color={REASON_COLORS[reason]} style={{ fontSize: 11, margin: 0 }}>
          {reason}
        </Tag>
      ),
    },
    {
      title: "Post content",
      dataIndex: "post",
      key: "post",
      render: (post: string, record: Report) => (
        <div>
          <Text
            style={{ fontSize: 12, maxWidth: 220, display: "block" }}
            ellipsis={{ tooltip: post }}
          >
            {post}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {record.time} · {record.reportCount} report{record.reportCount > 1 ? "s" : ""}
          </Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: ReportStatus) => (
        <Badge status={STATUS_COLORS[status] as any} text={STATUS_LABELS[status]} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: unknown, record: Report) => (
        <Space size={4}>
          <Tooltip title="Evaluate with AI">
            <Button
              size="small"
              icon={<RobotOutlined />}
              loading={loadingId === record.id}
              onClick={(e) => { e.stopPropagation(); runAI(record.id); }}
              style={{ borderColor: "#1877f2", color: "#1877f2", fontSize: 11 }}
            />
          </Tooltip>
          <Tooltip title="View post">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={(e) => { e.stopPropagation(); setSelectedId(record.id); }}
              style={{ fontSize: 11 }}
            />
          </Tooltip>
          <Tooltip title="Approve">
            <Button
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={(e) => { e.stopPropagation(); handleApprove(record.id); }}
              style={{ borderColor: "#52c41a", color: "#52c41a", fontSize: 11 }}
            />
          </Tooltip>
          <Tooltip title="Remove post">
            <Button
              size="small"
              danger
              icon={<StopOutlined />}
              onClick={(e) => { e.stopPropagation(); handleReject(record.id); }}
              style={{ fontSize: 11 }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: "all", label: `All (${counts.all})` },
    { key: "pending", label: <Badge count={counts.pending} size="small" offset={[6, 0]}><span>Pending</span></Badge> },
    { key: "reviewing", label: `AI Reviewing (${counts.reviewing})` },
    { key: "resolved", label: `Resolved (${counts.resolved})` },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f6fa" }}>
      <Content style={{ padding: "24px 28px" }}>
        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          
          <Space>
            <Button icon={<BarChartOutlined />}>Export report</Button>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              loading={batchLoading}
              onClick={runBatchAI}
              style={{
                background: "linear-gradient(135deg, #1877f2, #0d47a1)",
                border: "none",
                fontWeight: 500,
              }}
            >
              Run AI on all pending
            </Button>
          </Space>
        </div>

        {/* Main Content */}
        <Row gutter={16}>
          {/* Left: Reports Table */}
          <Col span={16}>
            <Card
              styles={{ body: { padding: "0 0 16px" } }}
              style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}
            >
              <div style={{ padding: "16px 18px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <Text strong style={{ fontSize: 14 }}>
                    <FlagOutlined style={{ color: "#ff4d4f", marginRight: 6 }} />
                    Flagged posts
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {counts.pending} pending
                  </Text>
                </div>

                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  items={tabItems}
                  size="small"
                  style={{ marginBottom: 0 }}
                />
              </div>

              <div style={{ padding: "12px 18px 10px", display: "flex", gap: 8 }}>
                <Input
                  prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="Search by user, content, reason..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ flex: 1, borderRadius: 8 }}
                  size="small"
                />
                <Select
                  placeholder="All reasons"
                  allowClear
                  style={{ width: 150, borderRadius: 8 }}
                  size="small"
                  onChange={(v) => setReasonFilter(v ?? null)}
                >
                  {["Spam", "Hate speech", "NSFW", "Misinformation", "Violence"].map((r) => (
                    <Option key={r} value={r}>{r}</Option>
                  ))}
                </Select>
              </div>

              <Table
                dataSource={filtered}
                columns={columns}
                rowKey="id"
                size="small"
                pagination={{ pageSize: 6, size: "small", style: { padding: "0 18px" } }}
                onRow={(record) => ({
                  onClick: () => setSelectedId(record.id),
                  style: {
                    cursor: "pointer",
                    background: selectedId === record.id ? "#e6f4ff" : undefined,
                  },
                })}
                style={{ fontSize: 12 }}
                scroll={{ x: 700 }}
              />
            </Card>
          </Col>

          {/* Right: AI Panel */}
          <Col span={8}>
            <Card
              styles={{ body: { padding: 16 } }}
              style={{ borderRadius: 12, border: "1px solid #f0f0f0", position: "sticky", top: 24 }}
              title={
                <Space>
                  <RobotOutlined style={{ color: "#1877f2" }} />
                  <Text strong style={{ fontSize: 14 }}>AI Post Evaluator</Text>
                </Space>
              }
              extra={
                selectedId && !loadingId ? (
                  <Button
                    size="small"
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={() => runAI(selectedId)}
                    style={{ fontSize: 11, color: "#8c8c8c" }}
                  >
                    Re-run
                  </Button>
                ) : null
              }
            >
              <AIPanel
                report={selectedReport}
                aiResult={selectedAiResult}
                loading={loadingId === selectedId}
                onEvaluate={runAI}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Temp;

/*
 * ─── INTEGRATION GUIDE ────────────────────────────────────────────────────────
 *
 * 1. ROUTE SETUP (routes.tsx)
 *    import ReportModerationPage from "./pages/ReportModerationPage";
 *    { path: "/reports", element: <ReportModerationPage /> }
 *
 * 2. REFINE DATA INTEGRATION
 *    Replace MOCK_REPORTS with Refine hooks:
 *
 *    const { data, isLoading } = useList<Report>({
 *      resource: "reports",
 *      pagination: { pageSize: 10 },
 *      filters: [{ field: "status", operator: "eq", value: "pending" }],
 *    });
 *    const { mutate: updateReport } = useUpdate();
 *
 *    Then replace updateStatus() calls with:
 *    updateReport({ resource: "reports", id, values: { status } });
 *
 * 3. AI API KEY
 *    The Anthropic API call should go through your backend proxy:
 *    POST /api/ai/evaluate  →  { postContent, reason }
 *    This avoids exposing your API key in the frontend.
 *
 * 4. REQUIRED PACKAGES
 *    npm install antd @refinedev/antd @refinedev/core
 *
 * ──────────────────────────────────────────────────────────────────────────────
 */
