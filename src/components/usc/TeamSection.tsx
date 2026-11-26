import { useEffect, useMemo, useState } from "react";
import { Copy, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";
import { DOMAINS_DATA, type DomainId } from "@/data/domainsData";
import { TEAM_MEMBERS, type TeamMember, type TeamWing } from "@/data/teamData";

type WingTab = "ALL" | "TECH" | "NON-TECH";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

function TeamCard({
  member,
  highlighted,
}: {
  member: TeamMember;
  highlighted: boolean;
}) {
  const isTech = member.wing === "Tech";
  const hasLinkedin = member.linkedinUrl.trim().length > 0;
  const hasEmail = member.email.trim().length > 0;

  const handleCopyEmail = async () => {
    if (!hasEmail) {
      toast.info("Email coming soon", {
        description: `${member.name}'s email will be updated shortly.`,
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(member.email);
      toast.success("Copied email!", { description: member.email });
    } catch {
      toast.info(member.email);
    }
  };

  return (
    <article
      id={`team-card-${member.id}`}
      className={`glass-dark hud-brackets group flex flex-col justify-between rounded-2xl p-5 transition-all duration-300 ${
        highlighted
          ? "border-flame ring-2 ring-flame/70 shadow-flame-glow scale-[1.02]"
          : isTech
            ? "hover:border-flame/50"
            : "hover:border-cobalt/50"
      }`}
    >
      <div>
        {/* Portrait Frame or Geometric Initials Avatar */}
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl border ${
            isTech
              ? "border-flame/30 shadow-[0_0_24px_-10px_var(--flame)]"
              : "border-cobalt/30 shadow-[0_0_24px_-10px_var(--cobalt)]"
          } bg-obsidian`}
        >
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
              <div
                aria-hidden
                className={`absolute h-28 w-28 rounded-full blur-2xl ${
                  isTech ? "bg-flame/25" : "bg-cobalt/25"
                }`}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.973_0.013_84/4%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.973_0.013_84/4%)_1px,transparent_1px)] bg-[size:24px_24px]"
              />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cream/15 bg-carbon/90 font-display-usc text-3xl text-cream">
                {getInitials(member.name)}
              </div>
            </div>
          )}
          <span
            className={`absolute left-3 top-3 rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-semibold tracking-[0.16em] ${
              isTech
                ? "border-flame/40 bg-flame/20 text-flame"
                : "border-cobalt/40 bg-cobalt/20 text-cream"
            }`}
          >
            {member.wing.toUpperCase()} WING
          </span>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-cream">{member.name}</h3>
        <p
          className={`mt-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
            isTech ? "text-flame" : "text-cobalt"
          }`}
        >
          {member.role}
        </p>
        <p className="mt-0.5 text-xs text-cream/65">{member.domain}</p>
      </div>

      {/* LinkedIn & Gmail Actions */}
      <div className="mt-5 flex items-center gap-2 border-t border-cream/10 pt-4">
        {hasLinkedin ? (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-cream/12 bg-obsidian/80 py-2 font-mono text-[10px] tracking-[0.14em] text-cream/80 transition-all hover:border-cobalt hover:bg-cobalt/15 hover:text-cream hover:shadow-cobalt-glow"
          >
            <Linkedin className="h-3.5 w-3.5 text-cobalt" />
            LINKEDIN
          </a>
        ) : (
          <button
            type="button"
            title="Link coming soon"
            onClick={() => toast.info("Link coming soon", { description: `${member.name}'s LinkedIn will be added soon.` })}
            aria-label={`${member.name} LinkedIn coming soon`}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-cream/10 bg-obsidian/60 py-2 font-mono text-[10px] tracking-[0.12em] text-cream/45 transition-colors hover:border-cream/25 hover:text-cream/70"
          >
            <Linkedin className="h-3.5 w-3.5 text-cobalt/60" />
            SOON
          </button>
        )}

        {hasEmail ? (
          <a
            href={`mailto:${member.email}`}
            aria-label={`Email ${member.name}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-cream/12 bg-obsidian/80 px-3 py-2 font-mono text-[10px] tracking-[0.14em] text-cream/80 transition-colors hover:border-flame/60 hover:text-flame"
          >
            <Mail className="h-3.5 w-3.5" />
            EMAIL
          </a>
        ) : (
          <button
            type="button"
            title="Link coming soon"
            onClick={() => toast.info("Link coming soon", { description: `${member.name}'s Gmail will be added soon.` })}
            aria-label={`${member.name} email coming soon`}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-cream/10 bg-obsidian/60 px-3 py-2 font-mono text-[10px] tracking-[0.12em] text-cream/45 transition-colors hover:border-cream/25 hover:text-cream/70"
          >
            <Mail className="h-3.5 w-3.5" />
            EMAIL
          </button>
        )}

        <button
          type="button"
          onClick={handleCopyEmail}
          aria-label={`Copy ${member.name}'s email`}
          title={hasEmail ? "Copy email" : "Link coming soon"}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-cream/12 bg-obsidian/80 text-cream/65 transition-colors hover:border-emerald hover:text-emerald"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}

export function TeamSection() {
  const [activeTab, setActiveTab] = useState<WingTab>("ALL");
  const [selectedDomain, setSelectedDomain] = useState<DomainId | "ALL">("ALL");
  const [highlightedLeadId, setHighlightedLeadId] = useState<string | null>(null);

  const techCount = useMemo(
    () => TEAM_MEMBERS.filter((m) => m.wing === "Tech").length,
    [],
  );
  const nonTechCount = useMemo(
    () => TEAM_MEMBERS.filter((m) => m.wing === "Non-Tech").length,
    [],
  );

  const filterTabs: readonly { id: WingTab; label: string; wing?: TeamWing }[] = [
    { id: "ALL", label: `ALL (${TEAM_MEMBERS.length})` },
    { id: "TECH", label: `TECH LEADS (${techCount})`, wing: "Tech" },
    { id: "NON-TECH", label: `NON-TECH LEADS (${nonTechCount})`, wing: "Non-Tech" },
  ];

  useEffect(() => {
    const handleHighlight = (e: Event) => {
      const detail = (e as CustomEvent<{ name?: string }>).detail;
      const targetName = detail?.name?.toLowerCase();
      if (!targetName) return;
      const match = TEAM_MEMBERS.find((m) => m.name.toLowerCase() === targetName);
      if (!match) return;

      setActiveTab("ALL");
      setSelectedDomain("ALL");
      setHighlightedLeadId(match.id);

      setTimeout(() => {
        const cardEl = document.getElementById(`team-card-${match.id}`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 120);

      setTimeout(() => {
        setHighlightedLeadId((prev) => (prev === match.id ? null : prev));
      }, 3200);
    };

    window.addEventListener("usc:highlight-lead", handleHighlight);
    return () => window.removeEventListener("usc:highlight-lead", handleHighlight);
  }, []);

  const visibleMembers = TEAM_MEMBERS.filter((member) => {
    const wingMatch =
      activeTab === "ALL"
        ? true
        : activeTab === "TECH"
          ? member.wing === "Tech"
          : member.wing === "Non-Tech";
    const domainMatch = selectedDomain === "ALL" ? true : member.domainId === selectedDomain;
    return wingMatch && domainMatch;
  });

  return (
    <section id="team" className="relative bg-carbon/45 px-4 py-16 sm:px-10 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <div>
            <p className="font-hud text-xs text-flame">THE 25 MINDS LEADING USC KIIT</p>
            <h2 className="font-display-usc mt-2 text-4xl text-cream sm:text-6xl">OUR TEAM</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedDomain("ALL");
                  }}
                  className={`cursor-pointer rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] transition-colors sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em] ${
                    active
                      ? tab.id === "NON-TECH"
                        ? "bg-cobalt text-cream shadow-cobalt-glow"
                        : "gradient-flame text-cream shadow-flame-glow"
                      : "border border-cream/15 bg-obsidian/70 text-cream/70 hover:border-flame/50 hover:text-cream"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}

            <select
              aria-label="Filter team by domain"
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value as DomainId | "ALL");
                setActiveTab("ALL");
              }}
              className="cursor-pointer rounded-full border border-cream/15 bg-obsidian/85 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-cream/85 outline-none focus:border-flame sm:py-2 sm:text-[11px]"
            >
              <option value="ALL">ALL 12 DOMAINS</option>
              <optgroup label="Tech Wing">
                {DOMAINS_DATA.filter((d) => d.wing === "tech").map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Non-Tech Wing">
                {DOMAINS_DATA.filter((d) => d.wing === "non-tech").map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {visibleMembers.map((member) => (
            <TeamCard
              key={member.id}
              member={member}
              highlighted={highlightedLeadId === member.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}