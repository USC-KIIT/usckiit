import { useState } from "react";
import { Copy, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";
import { TEAM_MEMBERS, type TeamCategory, type TeamMember } from "@/data/teamData";

type FilterTab = "ALL" | "LEADERSHIP" | "DOMAIN LEADS";

const FILTER_TABS: readonly { id: FilterTab; match?: TeamCategory }[] = [
  { id: "ALL" },
  { id: "LEADERSHIP", match: "Leadership" },
  { id: "DOMAIN LEADS", match: "Domain Leads" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

function TeamCard({ member }: { member: TeamMember }) {
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(member.email);
      toast.success("Copied email!", { description: member.email });
    } catch {
      toast.info(member.email);
    }
  };

  const isLeadership = member.category === "Leadership";

  return (
    <article className="glass-dark hud-brackets group flex flex-col justify-between rounded-2xl p-5 transition-colors duration-200 hover:border-flame/50">
      <div>
        {/* Portrait Frame or Geometric Initials Avatar */}
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl border ${
            isLeadership
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
                  isLeadership ? "bg-flame/25" : "bg-cobalt/25"
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
            className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 font-mono text-[9px] font-semibold tracking-[0.16em] ${
              isLeadership
                ? "bg-flame/20 text-flame border border-flame/40"
                : "bg-cobalt/20 text-cream border border-cobalt/40"
            }`}
          >
            {member.category.toUpperCase()}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-cream">{member.name}</h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-flame">
          {member.role}
        </p>
        <p className="mt-0.5 text-xs text-cream/65">{member.domain}</p>
      </div>

      {/* LinkedIn & Gmail Actions */}
      <div className="mt-5 flex items-center gap-2 border-t border-cream/10 pt-4">
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
        <a
          href={`mailto:${member.email}`}
          aria-label={`Email ${member.name}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-cream/12 bg-obsidian/80 px-3 py-2 font-mono text-[10px] tracking-[0.14em] text-cream/80 transition-colors hover:border-flame/60 hover:text-flame"
        >
          <Mail className="h-3.5 w-3.5" />
          EMAIL
        </a>
        <button
          type="button"
          onClick={handleCopyEmail}
          aria-label={`Copy ${member.name}'s email`}
          title="Copy email"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-cream/12 bg-obsidian/80 text-cream/70 transition-colors hover:border-emerald hover:text-emerald"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}

export function TeamSection() {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  const visibleMembers = TEAM_MEMBERS.filter((member) => {
    if (activeTab === "ALL") return true;
    const match = FILTER_TABS.find((t) => t.id === activeTab)?.match;
    return match ? member.category === match : true;
  });

  return (
    <section id="team" className="relative bg-carbon/45 px-4 py-16 sm:px-10 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-6">
          <div>
            <p className="font-hud text-xs text-flame">THE MINDS BEHIND USC KIIT</p>
            <h2 className="font-display-usc mt-2 text-4xl text-cream sm:text-6xl">OUR TEAM</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] transition-colors sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em] ${
                    active
                      ? "gradient-flame text-cream shadow-flame-glow"
                      : "border border-cream/15 bg-obsidian/70 text-cream/70 hover:border-flame/50 hover:text-cream"
                  }`}
                >
                  {tab.id}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {visibleMembers.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}