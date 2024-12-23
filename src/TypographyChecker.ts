import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { colorPalette } from "./ColorPalette.js";
import { designSystemConfig } from "./TypographyConfig.js";
import type { TypographyRules } from "./TypographyTypes.js";

type IssueType =
	| "fontSize"
	| "lineHeight"
	| "fontFamily"
	| "headingHierarchy"
	| "emphasisStyle"
	| "linkStyle";

interface TypographyIssue {
	element: HTMLElement;
	message: string;
	snippet?: string;
	suggestion?: string;
	type: IssueType;
}

interface HeadingRule {
	tag: string;
	level: number;
}

export class TypographyChecker extends LitElement {
	@state()
	private darkMode = false;

	@state()
	private panelOpen = false;

	@state()
	private sidePanelWidth = 320;

	@state()
	private issues: TypographyIssue[] = [];

	@state()
	private filterType: IssueType | "all" = "all";

	@property({ type: Object })
	config: TypographyRules = designSystemConfig;

	private headingRules: HeadingRule[] = [
		{ tag: "h1", level: 1 },
		{ tag: "h2", level: 2 },
		{ tag: "h3", level: 3 },
		{ tag: "h4", level: 4 },
		{ tag: "h5", level: 5 },
		{ tag: "h6", level: 6 },
	];

	static styles = [
		colorPalette,
		css`
      :host {
        display: block;
        position: relative;
        font-family: sans-serif;
        background-color: var(--light-basic-white);
        color: var(--light-basic-black);
      }
      :host(.dark) {
        background-color: var(--dark-basic-black);
        color: var(--dark-basic-white);
      }

      .checker-container {
        position: relative;
        padding: 1rem;
      }

      .typo-error {
        outline: 2px solid var(--light-basic-red);
        outline-offset: 2px;
        position: relative;
      }
      .typo-error::after {
        content: "!";
        color: var(--light-basic-white);
        background: var(--light-basic-red);
        font-weight: bold;
        border-radius: 50%;
        width: 1.2em;
        height: 1.2em;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 0.8em;
      }
      :host(.dark) .typo-error {
        outline: 2px solid var(--dark-basic-red);
      }
      :host(.dark) .typo-error::after {
        background: var(--dark-basic-red);
      }

      .side-panel {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        border-left: 1px solid var(--light-basic-silver);
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 9999;
        overflow-y: auto;
        background: var(--light-basic-white);
      }
      .side-panel.open {
        transform: translateX(0);
      }
      :host(.dark) .side-panel {
        background: var(--dark-basic-black);
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .panel-header h2 {
        margin: 0;
        font-size: 1.2rem;
      }
      .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
      }

      .controls {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .controls button {
        cursor: pointer;
        border: none;
        padding: 0.3rem 0.5rem;
        border-radius: 4px;
      }
      .controls button:hover {
        opacity: 0.8;
      }

      .error-count {
        color: var(--light-basic-red);
        font-weight: bold;
      }
      :host(.dark) .error-count {
        color: var(--dark-basic-red);
      }

      .issue-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .issue-list li {
        margin-bottom: 1rem;
        padding: 0.5rem;
        border: 1px solid var(--light-basic-silver);
        border-radius: 4px;
        background: var(--light-basic-white);
        color: var(--light-basic-red);
      }
      :host(.dark) .issue-list li {
        border-color: var(--dark-basic-silver);
        background: var(--dark-basic-black);
        color: var(--dark-basic-red);
      }
      .issue-list strong {
        display: inline-block;
        min-width: 3em;
      }
      .snippet {
        display: block;
        font-family: monospace;
        color: var(--light-basic-black);
        background: var(--light-basic-silver);
        padding: 0.25rem;
        border-radius: 4px;
        margin-top: 0.25rem;
      }
      :host(.dark) .snippet {
        color: var(--dark-basic-black);
        background: var(--dark-basic-silver);
      }
      .suggestion {
        display: block;
        margin-top: 0.25rem;
        color: var(--light-basic-black);
        font-size: 0.9rem;
      }
      :host(.dark) .suggestion {
        color: var(--dark-basic-white);
      }

      .auto-fix-btn {
        background: var(--light-basic-blue);
        color: var(--light-basic-white);
        margin-top: 0.25rem;
        border-radius: 4px;
        cursor: pointer;
        border: none;
        padding: 0.25rem 0.5rem;
      }
      :host(.dark) .auto-fix-btn {
        background: var(--dark-basic-blue);
        color: var(--dark-basic-white);
      }

      .panel-toggle-btn {
        position: fixed;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background: var(--light-basic-blue);
        color: var(--light-basic-white);
        border: none;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        z-index: 10000;
        font-size: 14px;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      .panel-toggle-btn:hover {
        opacity: 0.8;
      }

      .side-panel-resize {
        width: var(--panel-width, 320px);
      }

      @media (max-width: 600px) {
        .side-panel {
          width: 100vw !important;
          bottom: 0;
          top: auto;
          transform: translateY(100%);
          right: 0;
          left: 0;
        }
        .side-panel.open {
          transform: translateY(0);
        }
        .panel-toggle-btn {
          top: auto;
          bottom: 0;
          transform: none;
          border-radius: 4px 4px 0 0;
        }
      }
    `,
	];

	firstUpdated(): void {
		this.runCheck();
	}

	private runCheck(): void {
		const allElems = this.ownerDocument?.querySelectorAll(".typo-error");
		if (allElems) {
			for (const elem of allElems) {
				elem.classList.remove("typo-error");
			}
		}
		const slot = this.shadowRoot?.querySelector("slot");
		if (!slot) {
			this.issues = [];
			return;
		}
		const assignedNodes = slot.assignedNodes({ flatten: true });
		const newIssues = this.checkTypography(assignedNodes);
		const headingIssues = this.checkHeadingHierarchy();
		const emphasisIssues = this.checkEmphasisAndLinkStyle();
		this.issues = [...newIssues, ...headingIssues, ...emphasisIssues];
	}

	private checkTypography(nodes: Node[]): TypographyIssue[] {
		const result: TypographyIssue[] = [];

		const traverse = (node: Node) => {
			if (node.nodeType === Node.ELEMENT_NODE) {
				const el = node as HTMLElement;
				if (el.tagName !== "SCRIPT" && el.tagName !== "STYLE") {
					this.validateElement(el, result);
				}
				for (const child of el.childNodes) {
					traverse(child);
				}
			}
		};

		for (const n of nodes) {
			traverse(n);
		}
		return result;
	}

	private validateElement(el: HTMLElement, issues: TypographyIssue[]): void {
		const style = window.getComputedStyle(el);
		const tagName = el.tagName.toLowerCase();

		const fontSizePx = Number.parseFloat(style.fontSize || "0");
		const lineHeightPx = Number.parseFloat(style.lineHeight || "0");
		let expectedFontSize = this.config.baseFontSize;
		let expectedLineHeight = this.config.baseLineHeight;

		if (this.config.headings[tagName]) {
			expectedFontSize = this.config.headings[tagName].fontSize;
			expectedLineHeight = this.config.headings[tagName].lineHeight;
		}
		const expectedLineHeightPx = expectedLineHeight * expectedFontSize;

		const snippet = el.outerHTML
			.replace(/\s+/g, " ")
			.slice(0, 100)
			.concat("...");

		let hasError = false;

		if (fontSizePx < expectedFontSize) {
			hasError = true;
			issues.push({
				element: el,
				message: `Font size too small: ${fontSizePx}px < expected ${expectedFontSize}px`,
				snippet,
				suggestion: `Try using font-size: ${expectedFontSize}px;`,
				type: "fontSize",
			});
		}

		if (lineHeightPx < expectedLineHeightPx) {
			hasError = true;
			issues.push({
				element: el,
				message: `Line-height too small: ${lineHeightPx}px < expected ${expectedLineHeightPx}px`,
				snippet,
				suggestion: `Try using line-height: ${expectedLineHeight} (~${expectedLineHeightPx}px);`,
				type: "lineHeight",
			});
		}

		const fontFamily = style.fontFamily
			.split(",")[0]
			.trim()
			.replace(/['"]/g, "");
		if (!this.config.allowedFonts.includes(fontFamily)) {
			hasError = true;
			issues.push({
				element: el,
				message: `Unexpected font family: '${fontFamily}'`,
				snippet,
				suggestion: `Try using one of: ${this.config.allowedFonts.join(", ")}`,
				type: "fontFamily",
			});
		}

		if (hasError) {
			el.classList.add("typo-error");
		}
	}

	private checkHeadingHierarchy(): TypographyIssue[] {
		const res: TypographyIssue[] = [];
		const headings = this.ownerDocument?.querySelectorAll("h1,h2,h3,h4,h5,h6");
		if (!headings) return res;

		let lastLevel = 0;
		for (const h of headings) {
			const tagName = h.tagName.toLowerCase();
			const rule = this.headingRules.find((r) => r.tag === tagName);
			if (!rule) return res;

			const currentLevel = rule.level;
			if (currentLevel - lastLevel > 1) {
				h.classList.add("typo-error");
				const snippet = h.outerHTML
					.replace(/\s+/g, " ")
					.slice(0, 80)
					.concat("...");
				res.push({
					element: h as HTMLElement,
					message: `Heading level jumped from H${lastLevel} to H${currentLevel}`,
					snippet,
					suggestion: `Use H${lastLevel + 1} instead of H${currentLevel}`,
					type: "headingHierarchy",
				});
			}
			lastLevel = currentLevel;
		}
		return res;
	}

	private checkEmphasisAndLinkStyle(): TypographyIssue[] {
		const results: TypographyIssue[] = [];
		const strongElems = this.ownerDocument?.querySelectorAll("strong") || [];
		const anchorElems = this.ownerDocument?.querySelectorAll("a") || [];

		for (const elem of strongElems) {
			const compStyle = window.getComputedStyle(elem);
			const fontWeight = Number.parseFloat(compStyle.fontWeight);

			if (fontWeight > 800) {
				elem.classList.add("typo-error");
				const snippet = elem.outerHTML
					.replace(/\s+/g, " ")
					.slice(0, 80)
					.concat("...");
				results.push({
					element: elem as HTMLElement,
					message: `Strong tag with too heavy font-weight: ${fontWeight}`,
					snippet,
					suggestion: "Try a lighter font-weight (bold ~700)",
					type: "emphasisStyle",
				});
			}
		}

		for (const elem of anchorElems) {
			const compStyle = window.getComputedStyle(elem);
			const { color } = compStyle;
			const textDecoration = compStyle.textDecorationLine;

			if (
				!textDecoration.includes("underline") &&
				color === compStyle.backgroundColor
			) {
				elem.classList.add("typo-error");
				const snippet = elem.outerHTML
					.replace(/\s+/g, " ")
					.slice(0, 80)
					.concat("...");
				results.push({
					element: elem as HTMLElement,
					message:
						"Link is not clearly distinguishable (no underline or color)",
					snippet,
					suggestion: "Use underline or different color for links",
					type: "linkStyle",
				});
			}
		}

		return results;
	}

	private togglePanel(): void {
		this.panelOpen = !this.panelOpen;
	}

	private toggleDarkMode(): void {
		this.darkMode = !this.darkMode;
		if (this.darkMode) {
			this.classList.add("dark");
		} else {
			this.classList.remove("dark");
		}
	}

	private reCheck(): void {
		this.runCheck();
	}

	private changeFilter(e: Event): void {
		const select = e.currentTarget as HTMLSelectElement;
		this.filterType = select.value as IssueType | "all";
	}

	private autoFix(issue: TypographyIssue): void {
		const el = issue.element;
		if (!el) return;

		if (issue.type === "fontSize") {
			const matched = issue.suggestion?.match(/font-size:\s*(\d+)px/);
			if (matched) {
				el.style.fontSize = `${matched[1]}px`;
			}
		} else if (issue.type === "lineHeight") {
			const matched = issue.suggestion?.match(/line-height:\s*([\d\\.]+)/);
			if (matched) {
				const ratio = Number.parseFloat(matched[1]);
				if (!Number.isNaN(ratio)) {
					const currentFont = Number.parseFloat(
						window.getComputedStyle(el).fontSize,
					);
					el.style.lineHeight = `${currentFont * ratio}px`;
				}
			}
		} else if (issue.type === "fontFamily") {
			const matched = issue.suggestion?.match(/one of:\s*(.+)/);
			if (matched) {
				const firstFont = matched[1].split(",")[0].trim();
				el.style.fontFamily = firstFont;
			}
		} else if (issue.type === "headingHierarchy") {
			const matched = issue.suggestion?.match(/Use (H\d) instead of (H\d)/i);
			if (matched) {
				const newTag = matched[1].toLowerCase();
				const oldTag = matched[2].toLowerCase();
				if (newTag !== oldTag) {
					const newElem = document.createElement(newTag);
					if (el.hasAttribute("style")) {
						newElem.setAttribute("style", el.getAttribute("style") || "");
					}
					for (const cls of el.classList) {
						if (cls !== "typo-error") {
							newElem.classList.add(cls);
						}
					}
					while (el.firstChild) {
						newElem.appendChild(el.firstChild);
					}
					el.replaceWith(newElem);
				}
			}
		} else if (issue.type === "emphasisStyle") {
			el.style.fontWeight = "700";
		} else if (issue.type === "linkStyle") {
			el.style.textDecoration = "underline";
			el.style.color = "blue";
		}

		this.runCheck();
	}

	private zoomPanelIn(): void {
		this.sidePanelWidth += 20;
	}

	private zoomPanelOut(): void {
		if (this.sidePanelWidth > 200) {
			this.sidePanelWidth -= 20;
		}
	}

	render() {
		const errorCount = this.issues.length;
		const filteredIssues =
			this.filterType === "all"
				? this.issues
				: this.issues.filter((issue) => issue.type === this.filterType);

		return html`
      <div class="checker-container">
        <slot></slot>
      </div>

      ${
				errorCount > 0
					? html`
              <button class="panel-toggle-btn" @click=${this.togglePanel}>
                <span>
                  ${this.panelOpen ? "Close" : `Open Checker (${errorCount})`}
                </span>
              </button>
            `
					: nothing
			}

      <div
        class="side-panel side-panel-resize ${this.panelOpen ? "open" : ""}"
        style="--panel-width: ${this.sidePanelWidth}px;"
      >
        <div class="panel-header">
          <h2>Issues: <span class="error-count">${errorCount}</span></h2>
          <button class="close-btn" @click=${this.togglePanel}>&times;</button>
        </div>

        <div class="controls">
          <button @click=${this.toggleDarkMode}>
            ${this.darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button @click=${this.reCheck}>Re-check</button>

          <select @change=${this.changeFilter}>
            <option value="all" ?selected=${this.filterType === "all"}>All</option>
            <option value="fontSize" ?selected=${this.filterType === "fontSize"}>
              Font Size
            </option>
            <option value="lineHeight" ?selected=${this.filterType === "lineHeight"}>
              Line-height
            </option>
            <option value="fontFamily" ?selected=${this.filterType === "fontFamily"}>
              Font Family
            </option>
            <option
              value="headingHierarchy"
              ?selected=${this.filterType === "headingHierarchy"}
            >
              Heading Hierarchy
            </option>
            <option
              value="emphasisStyle"
              ?selected=${this.filterType === "emphasisStyle"}
            >
              Emphasis Style
            </option>
            <option
              value="linkStyle"
              ?selected=${this.filterType === "linkStyle"}
            >
              Link Style
            </option>
          </select>

          <button @click=${this.zoomPanelIn}>Panel +</button>
          <button @click=${this.zoomPanelOut}>Panel -</button>
        </div>

        <ul class="issue-list">
          ${filteredIssues.map(
						(issue) => html`
              <li>
                <strong>${issue.element.tagName.toLowerCase()}</strong>:
                ${issue.message}
                <span class="snippet">${issue.snippet}</span>

                ${
									issue.suggestion
										? html`<span class="suggestion">Suggestion: ${issue.suggestion}</span>`
										: nothing
								}

                <button class="auto-fix-btn" @click=${() => this.autoFix(issue)}>
                  Auto Fix
                </button>
              </li>
            `,
					)}
        </ul>
      </div>
    `;
	}
}
