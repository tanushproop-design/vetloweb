import { useState, useEffect } from 'react';
import { 
  Shield, 
  Settings, 
  UserCheck, 
  Terminal, 
  Bot, 
  Volume2, 
  HelpCircle, 
  AlertTriangle, 
  FileText, 
  Gift, 
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Server,
  Users,
  Activity,
  Clock
} from 'lucide-react';
import './App.css';

// Bot commands data mapped directly from HELP_CATEGORIES in main.py
const COMMANDS_DATA = {
  "moderation": {
    "label": "Moderation",
    "desc": "Ban, kick, warn, mute & more",
    "icon": Shield,
    "cmds": [
      { "name": ">ban", "desc": "Ban a member from the server" },
      { "name": ">unban", "desc": "Unban a member from the server" },
      { "name": ">kick", "desc": "Kick a member from the server" },
      { "name": ">timeout", "desc": "Timeout a member (mute them)" },
      { "name": ">removetimeout", "desc": "Remove timeout from a member" },
      { "name": ">purge", "desc": "Delete a specified number of messages" },
      { "name": ">warn", "desc": "Warn a member (accumulates warnings)" },
      { "name": ">scan", "desc": "Scan member activity in the server" },
      { "name": ">lock", "desc": "Lock the current channel" },
      { "name": ">unlock", "desc": "Unlock the current channel" },
      { "name": ">lockallchannel", "desc": "Lock ALL channels in the server" },
      { "name": ">unlockallchannel", "desc": "Unlock ALL channels in the server" },
      { "name": ">role", "desc": "Assign a role to a member" },
      { "name": ">removerole", "desc": "Remove a role from a member" },
      { "name": ">roleall", "desc": "Assign a role to all members in the server" },
      { "name": ">removeroleall", "desc": "Remove a role from all members in the server" },
      { "name": ">jailsetup", "desc": "Setup the jail system and jail channels" },
      { "name": ">jailunsetup", "desc": "Remove the jail system config" },
      { "name": ">jail", "desc": "Jail a member (sends to jail channel)" },
      { "name": ">unjail", "desc": "Unjail a member" },
      { "name": ">vcmuteall", "desc": "Mute all members in the voice channel" },
      { "name": ">vcunmuteall", "desc": "Unmute all members in the voice channel" }
    ]
  },
  "administration": {
    "label": "Administration",
    "desc": "Setup, config & server management",
    "icon": Settings,
    "cmds": [
      { "name": ">welcomeset", "desc": "Set welcome channel shortcut" },
      { "name": ">welcomeremove", "desc": "Remove welcome system shortcut" },
      { "name": ">goodbyeset", "desc": "Set goodbye channel shortcut" },
      { "name": ">goodbyeremove", "desc": "Remove goodbye system shortcut" },
      { "name": ">autorole", "desc": "Set autorole (role given on join)" },
      { "name": ">removeautorole", "desc": "Remove the configured autorole" },
      { "name": ">setprefix", "desc": "Change the bot's command prefix" },
      { "name": ">setvanity", "desc": "Set a custom server vanity prefix/link" },
      { "name": ">removanity", "desc": "Remove custom server vanity prefix/link" },
      { "name": ">setapplylink", "desc": "Set staff/membership application link" },
      { "name": ">inviteset", "desc": "Set invite tracking and logs channel" },
      { "name": ">removeinviteset", "desc": "Remove invite tracking and config" },
      { "name": ">reload", "desc": "Reload all setups & panels in the server" },
      { "name": ">linkprotect", "desc": "Toggle link protection system on/off" }
    ]
  },
  "automod": {
    "label": "AutoModeration",
    "desc": "Advanced auto-moderation filters",
    "icon": Bot,
    "cmds": [
      { "name": ">automod", "desc": "View dynamic auto-mod configuration panel" },
      { "name": ">automod on", "desc": "Enable all auto-mod protection filters" },
      { "name": ">automod off", "desc": "Disable all auto-mod protection filters" },
      { "name": ">automod <feature> on/off", "desc": "Toggle individual features like anti_spam, anti_links, anti_badwords, anti_invites, anti_zalgo" }
    ]
  },
  "ticket": {
    "label": "Ticket",
    "desc": "Ticket system setup & management",
    "icon": FileText,
    "cmds": [
      { "name": ">ticketsetup", "desc": "Setup ticket panels & create Ticket Access role" },
      { "name": ">ticketunsetup", "desc": "Remove ticket panels & delete Ticket Access role" }
    ]
  },
  "leveling": {
    "label": "Leveling",
    "desc": "XP, ranks & role rewards",
    "icon": UserCheck,
    "cmds": [
      { "name": ">rank", "desc": "Check your current rank and XP level" },
      { "name": ">leaderboard", "desc": "View the top 10 members by server XP" },
      { "name": ">give-xp", "desc": "Give XP to a member (Admin)" },
      { "name": ">reset-xp", "desc": "Reset XP of a member (Admin)" },
      { "name": ">set-role-reward", "desc": "Set role reward for reaching a level" },
      { "name": ">remove-role-reward", "desc": "Remove a configured level role reward" },
      { "name": ">list-role-rewards", "desc": "List all configured role rewards" },
      { "name": ">levelupchannel", "desc": "Set channel for level-up announcements" },
      { "name": ">levelupchannelremove", "desc": "Remove level-up announcements channel" }
    ]
  },
  "welcome": {
    "label": "Welcome & Embeds",
    "desc": "Welcome, goodbye & custom embeds setup",
    "icon": Sparkles,
    "cmds": [
      { "name": ">welcome channel", "desc": "Set the channel for welcome greeting messages" },
      { "name": ">welcome message", "desc": "Set template or embed link (e.g. welcome) for join greetings" },
      { "name": ">welcome config", "desc": "Preview and test welcome setup in welcome channel" },
      { "name": ">welcome remove", "desc": "Disable join welcome messages" },
      { "name": ">goodbye channel", "desc": "Set the channel for goodbye messages" },
      { "name": ">goodbye message", "desc": "Set template or embed link for goodbye messages" },
      { "name": ">goodbye config", "desc": "Preview and test goodbye setup in goodbye channel" },
      { "name": ">goodbye remove", "desc": "Disable leave goodbye messages" },
      { "name": ">embed create", "desc": "Start interactive Custom Embed Builder" },
      { "name": ">embed edit", "desc": "Open interactive custom embed editor menu" },
      { "name": ">embed delete", "desc": "Delete a custom embed structure" },
      { "name": ">embed list", "desc": "List all server custom embeds" },
      { "name": ">embed preview", "desc": "Test render a custom embed" },
      { "name": ">tagmessage", "desc": "Set custom tag message" },
      { "name": ">removetagmessage", "desc": "Remove custom tag message" }
    ]
  },
  "general": {
    "label": "General",
    "desc": "Ping, info, avatar & utility",
    "icon": HelpCircle,
    "cmds": [
      { "name": ">ping", "desc": "View bot connection latency to Discord" },
      { "name": ">serverinfo", "desc": "View information about the Discord server" },
      { "name": ">servericon", "desc": "Show the server's icon image" },
      { "name": ">user", "desc": "Show information about yourself or a member" },
      { "name": ">avatar", "desc": "Show avatar of yourself or a member" },
      { "name": ">say", "desc": "Make the bot repeat your text message" },
      { "name": ">support", "desc": "Get direct support server link" },
      { "name": ">botinfo", "desc": "Show bot statistics & specifications" },
      { "name": ">stats", "desc": "View detailed member stats" },
      { "name": ">vanity", "desc": "Show the server vanity link invite" }
    ]
  },
  "security": {
    "label": "Security",
    "desc": "Anti-nuke & protection (Owner only)",
    "icon": AlertTriangle,
    "cmds": [
      { "name": ">antinuke setup", "desc": "Enable all security & anti-nuke protection" },
      { "name": ">antinuke unsetup", "desc": "Disable anti-nuke protection" },
      { "name": ">antinuke status", "desc": "View protection and whitelist status" },
      { "name": ">addwhitelist", "desc": "Add a user to the anti-nuke whitelist" },
      { "name": ">removewhitelist", "desc": "Remove a user from the anti-nuke whitelist" },
      { "name": ">setlink", "desc": "Set server unban recovery link" },
      { "name": ">setlogs", "desc": "Set the security logs channel" },
      { "name": ">removesetlogs", "desc": "Remove the security logs channel" },
      { "name": ">antiraid", "desc": "Toggle anti-raid protection filters" },
      { "name": ">isolate", "desc": "Enable isolate mode (lock server joins)" },
      { "name": ">unisolate", "desc": "Disable isolate mode" },
      { "name": ">vetlobarriersetup", "desc": "Enable Vetlo Barrier (total block)" },
      { "name": ">vetlobarrierunsetup", "desc": "Disable Vetlo Barrier" }
    ]
  },
  "logging": {
    "label": "Logging",
    "desc": "Role, channel & audit logging",
    "icon": FileText,
    "cmds": [
      { "name": ">rolelogs", "desc": "Set channel for role creation/delete/edit logs" },
      { "name": ">removerolelogs", "desc": "Disable role logs" },
      { "name": ">channellogs", "desc": "Set channel for channel create/delete logs" },
      { "name": ">removechannellogs", "desc": "Disable channel logs" }
    ]
  },
  "giveaway": {
    "label": "Giveaway",
    "desc": "Giveaway commands & management",
    "icon": Gift,
    "cmds": [
      { "name": ">giveaway", "desc": "Start a new giveaway in the channel" },
      { "name": ">endgiveaway", "desc": "End an active giveaway and pick winners" },
      { "name": ">removegiveaway", "desc": "Delete an active giveaway setup" },
      { "name": ">deletegiveaway", "desc": "Delete ALL server giveaways" }
    ]
  },
  "voice": {
    "label": "Voice",
    "desc": "Temp VC, pull & voice controls",
    "icon": Volume2,
    "cmds": [
      { "name": ">vcsetup", "desc": "Setup Join-to-Create custom temporary VC system" },
      { "name": ">vcunsetup", "desc": "Remove Join-to-Create temporary VC system" },
      { "name": ">pull", "desc": "Drag all users to your voice channel (Admin)" },
      { "name": ">vcmute", "desc": "Voice mute a member in VC" },
      { "name": ">vcunmute", "desc": "Voice unmute a member in VC" }
    ]
  },
  "premium": {
    "label": "Premium",
    "desc": "Premium-only features & commands",
    "icon": Sparkles,
    "cmds": [
      { "name": ">premium", "desc": "Activate premium key for the server" },
      { "name": ">premiumpasswords", "desc": "View generated premium passwords (Owner)" },
      { "name": ">regenpremium", "desc": "Regenerate premium passwords (Owner)" },
      { "name": ">givepremium", "desc": "Give premium to a server (Owner)" },
      { "name": ">removepremium", "desc": "Remove premium from a server (Owner)" },
      { "name": ">dmall", "desc": "Send a direct message to all server members" },
      { "name": ">profilechange", "desc": "Change the bot's profile picture" },
      { "name": ">resetprofile", "desc": "Reset bot profile picture to default" }
    ]
  }
};

function App() {
  const [activeTab, setActiveTab] = useState("moderation");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Preloader state variables
  const [loading, setLoading] = useState(true);
  const [loadedClass, setLoadedClass] = useState(false);
  const [statusText, setStatusText] = useState("Initializing Vetlo Bot modules...");

  useEffect(() => {
    // Stagger loading status text for that premium hacker preloader vibe
    const textSequence = [
      { delay: 500, text: "Connecting to Discord secure gateway..." },
      { delay: 1100, text: "Syncing command list database..." },
      { delay: 1700, text: "Loading cyber theme stylesheets..." },
      { delay: 2100, text: "All systems green!" }
    ];

    textSequence.forEach((step) => {
      setTimeout(() => {
        setStatusText(step.text);
      }, step.delay);
    });

    // Fade out preloader and expand logo after loading completes
    setTimeout(() => {
      setLoadedClass(true);
      setTimeout(() => {
        setLoading(false);
      }, 900); // match CSS transition duration
    }, 2500);
  }, []);

  // Filter commands based on search query
  const getFilteredCommands = () => {
    if (!searchQuery) return null;
    
    const results = [];
    const query = searchQuery.toLowerCase();
    
    Object.entries(COMMANDS_DATA).forEach(([categoryKey, cat]) => {
      cat.cmds.forEach(cmd => {
        if (cmd.name.toLowerCase().includes(query) || cmd.desc.toLowerCase().includes(query)) {
          results.push({
            ...cmd,
            category: cat.label,
            categoryKey
          });
        }
      });
    });
    return results;
  };

  const filteredResults = getFilteredCommands();
  const currentCategory = COMMANDS_DATA[activeTab];

  return (
    <>
      {/* Premium Cyber preloader */}
      {loading && (
        <div className={`preloader ${loadedClass ? 'loaded' : ''}`}>
          <div className="tech-grid"></div>
          <div className="scanline"></div>
          
          <div className="preloader-content">
            <div className="logo-wrapper">
              <img src="/logo.png" alt="Vetlo Logo" className="preloader-logo-v" />
            </div>
            
            <h2 className={`preloader-title-text ${loadedClass ? 'fade-out' : ''}`}>Vetlo on Web</h2>
            
            <div className={`preloader-status-container ${loadedClass ? 'fade-out' : ''}`}>
              <div className="loading-bar-container">
                <div className="loading-bar-fill"></div>
              </div>
              <div className="status-text">{statusText}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main dashboard content */}
      <div className="dashboard-container">
        {/* Navigation Navbar */}
        <header className="navbar">
          <a href="#" className="nav-brand">
            <img src="/logo.png" alt="Vetlo Logo" className="nav-logo" />
            <span className="nav-title">Vetlo</span>
          </a>
          <div className="nav-menu">
            <span className="dev-badge">Developer: tanush_44</span>
            <a href="https://canary.discord.com/oauth2/authorize?client_id=1425494057014136913" target="_blank" className="nav-link" rel="noreferrer">
              Invite Bot <ExternalLink size={14} style={{ display: 'inline', marginLeft: '4px' }} />
            </a>
            <a href="https://discord.gg/mellowcafe" target="_blank" className="nav-link" rel="noreferrer">Support</a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-glow"></div>
          <h1 className="hero-title">Vetlo Discord Bot</h1>
          <p className="hero-desc">
            A premium multi-purpose Discord bot with advanced anti-nuke security, custom greet builders, tickets, auto-moderation, JTC voice, and leveling.
          </p>
          <div className="hero-buttons">
            <a href="https://canary.discord.com/oauth2/authorize?client_id=1425494057014136913" target="_blank" className="btn btn-primary animate-pulse-glow" rel="noreferrer">
              <Bot size={18} /> Invite Vetlo
            </a>
            <a href="https://discord.gg/mellowcafe" target="_blank" className="btn btn-terminal" rel="noreferrer">
              <span className="terminal-prompt">&gt;_</span> Support Server
            </a>
            <a href="#commands" className="btn btn-secondary">
              <Terminal size={18} /> Explore Commands
            </a>
          </div>
        </section>

        {/* Stats KPI Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span>TOTAL SERVERS</span>
              <Server size={18} className="stat-icon" />
            </div>
            <div className="stat-value">120+</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span>TOTAL USERS</span>
              <Users size={18} className="stat-icon" />
            </div>
            <div className="stat-value">45,000+</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span>LATENCY</span>
              <Activity size={18} className="stat-icon" />
            </div>
            <div className="stat-value">22ms</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span>UPTIME</span>
              <Clock size={18} className="stat-icon" />
            </div>
            <div className="stat-value">99.9%</div>
          </div>
        </section>

        {/* Command Directory Section */}
        <section id="commands" className="cmd-section">
          <div className="cmd-header-row">
            <h2 style={{ fontSize: '28px', fontWeight: '700' }}>Command Directory</h2>
            
            {/* Search bar */}
            <div className="cmd-search-bar">
              <Search size={18} color="var(--text-secondary)" />
              <input 
                type="text" 
                className="cmd-search-input" 
                placeholder="Search commands..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {searchQuery ? (
            /* Search Results View */
            <div className="commands-card">
              <div className="category-info">
                <h3>Search Results</h3>
                <p>Found {filteredResults.length} command(s) matching "{searchQuery}"</p>
              </div>
              
              <div className="commands-list">
                {filteredResults.length > 0 ? (
                  filteredResults.map((cmd, idx) => (
                    <div className="command-item" key={idx}>
                      <div className="command-head">
                        <span className="command-name">{cmd.name}</span>
                        <span className="dev-badge" style={{ fontSize: '11px', padding: '2px 8px' }}>{cmd.category}</span>
                      </div>
                      <p className="command-desc">{cmd.desc}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>
                    No commands found. Try searching for something else!
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Standard Category Tabs View */
            <div className="cmd-layout-grid">
              <div className="categories-sidebar">
                {Object.entries(COMMANDS_DATA).map(([key, cat]) => {
                  const IconComponent = cat.icon;
                  return (
                    <button 
                      key={key}
                      className={`category-tab ${activeTab === key ? 'active' : ''}`}
                      onClick={() => setActiveTab(key)}
                    >
                      <IconComponent size={18} />
                      <span>{cat.label}</span>
                      <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: activeTab === key ? 1 : 0.3 }} />
                    </button>
                  );
                })}
              </div>

              <div className="commands-card">
                <div className="category-info">
                  <h3>{currentCategory.label}</h3>
                  <p>{currentCategory.desc}</p>
                </div>

                <div className="commands-list">
                  {currentCategory.cmds.map((cmd, idx) => (
                    <div className="command-item" key={idx}>
                      <div className="command-head">
                        <span className="command-name">{cmd.name}</span>
                      </div>
                      <p className="command-desc">{cmd.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Footer credits */}
        <footer className="footer">
          <p>© 2026 Vetlo Bot. All rights reserved.</p>
          <p className="footer-dev">Developed by tanush_44 | Built with React & Vite</p>
        </footer>
      </div>
    </>
  );
}

export default App;
