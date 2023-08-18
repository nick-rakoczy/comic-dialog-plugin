import {
    MarkdownPostProcessorContext,
    MarkdownRenderChild,
    MarkdownRenderer,
    Plugin,
} from 'obsidian';

export default class ComicDialogPlugin extends Plugin {
    styleBlock: HTMLElement | null = null

    detectLineType(line: string): string {
        if (line.startsWith("  ")) {
            return "speech";
        }
        if (line.startsWith("*")) {
            return "note";
        }

        return "description"
    }
    handleDialogBlock(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
        const lines = source.split("\n").map(line => ({
            line,
            type: this.detectLineType(line),
            speaker: null,
            text: null,
            mood: null
        })).map(line => {
           if (line.type == "speech") {
               const trimmedLine = line.line.trim();
               const nameLen = trimmedLine.indexOf(":");
               const [speaker, mood] = trimmedLine.substring(0, nameLen).split("|", 2);
               const text = trimmedLine.substring(nameLen + 1).trim();

               return {
                   ...line,
                   speaker,
                   text,
                   mood
               };
           } else {
               return line;
           }
        });

        const metadata = this.app.metadataCache.getCache(ctx.sourcePath) || {};
        const frontmatter = metadata.frontmatter || {};
        const configuredSpeakers = frontmatter["speakers"] || {};

        const speakers = lines
            .filter(line => line.speaker)
            .map(line => line.speaker!)
            .filter(speaker => !configuredSpeakers[speaker]);

        lines.forEach(line => {
            const targetDiv = el.createDiv();
            const mdRenderer = new MarkdownRenderChild(targetDiv);
            ctx.addChild(mdRenderer);

            const appReference = this.app;
            function writeMarkdown(md: string) {
                MarkdownRenderer.render(appReference, md, targetDiv, ctx.sourcePath, mdRenderer);
            }

            switch (line.type) {
                case "description":
                    targetDiv.addClass("desc");
                    writeMarkdown(line.line);
                    break;
                case "note":
                    targetDiv.addClass("note");
                    writeMarkdown(line.line.substring(1).trim());
                    break;
                case "speech":
                    const speakerName = line.speaker || "Unknown";
                    const spokenText = line.text || "";
                    targetDiv.detach();

                    if (spokenText.trim() == "") {
                        return;
                    }

                    const speechDiv = el.createDiv("speech");
                    const nameDiv = speechDiv.createDiv("name");

                    if (line.mood) {
                        const moodDiv = speechDiv.createDiv("mood");
                        moodDiv.appendText(line.mood);
                    }

                    const speakerNumber = speakers.indexOf(speakerName);
                    const speakerColor = configuredSpeakers[speakerName];
                    speechDiv.appendChild(targetDiv);
                    nameDiv.appendText(speakerName);

                    if (speakerColor) {
                        nameDiv.setAttribute("style", `color:${speakerColor}`);
                    } else {
                        nameDiv.addClass(`p${speakerNumber}`);
                    }

                    targetDiv.addClass("speaks");
                    writeMarkdown(spokenText);
                    break;
                default:
                    targetDiv.addClass("unknown");
                    writeMarkdown(line.line);
                    break;
            }
        });
        el.addClass("comic-dialog-block");
    }

    setupStyles() {
        this.styleBlock = createEl("style");

        // language=CSS
        this.styleBlock.appendText(`
            .comic-dialog-block {
                border-radius: 1rem;
                
                --speaks-color-0: var(--color-red);
                --speaks-color-1: var(--color-orange);
                --speaks-color-2: var(--color-yellow);
                --speaks-color-3: var(--color-green);
                --speaks-color-4: var(--color-cyan);
                --speaks-color-5: var(--color-blue);
                --speaks-color-6: var(--color-purple);
                --speaks-color-7: var(--color-pink);
            }

            .comic-dialog-block .unknown {
                background-color: var(--color-red);
            }

            .comic-dialog-block .note {
                background-color: rgba(var(--color-cyan-rgb), 10%);
                border-radius: 0.5rem;
                color: var(--color-cyan);
                margin-top: 1rem;
                margin-bottom: 1rem;
                padding: 0.75rem;
            }
            
            .comic-dialog-block .desc {
                text-align: justify;
            }
            
            .comic-dialog-block .speech {
                background-color: var(--background-modifier-form-field);
                border-radius: 0.5rem;
                margin: 1rem;
                padding: 0.75rem;
                display: flex;
                gap: 2rem;
            }
            
            .comic-dialog-block .speech .name {
                width: 10rem;
                flex: 0 0 fit-content;
            }

            .comic-dialog-block .speech .mood {
                width: 10rem;
                flex: 0 0 fit-content;
                font-style: italic;
                color: #696d70;
            }

            .comic-dialog-block .speech .name.p0 {
                color: var(--speaks-color-0);
            }
            .comic-dialog-block .speech .name.p1 {
                color: var(--speaks-color-1);
            }
            .comic-dialog-block .speech .name.p2 {
                color: var(--speaks-color-2);
            }
            .comic-dialog-block .speech .name.p3 {
                color: var(--speaks-color-3);
            }
            .comic-dialog-block .speech .name.p4 {
                color: var(--speaks-color-4);
            }
            .comic-dialog-block .speech .name.p5 {
                color: var(--speaks-color-5);
            }
            .comic-dialog-block .speech .name.p6 {
                color: var(--speaks-color-6);
            }
            .comic-dialog-block .speech .name.p7 {
                color: var(--speaks-color-7);
            }
            
            .comic-dialog-block .speech .speaks {
                flex: 0 1 initial;
            }
            
            .comic-dialog-block .speech .speaks p {
                display: inline;
            }
        `);

        document.head.appendChild(this.styleBlock);
    }

    onload() {
        this.setupStyles();
        this.registerMarkdownCodeBlockProcessor("comic-dialog", this.handleDialogBlock.bind(this));
    }

    unload() {
        if (this.styleBlock != null) {
            document.head.removeChild(this.styleBlock);
        }
    }
}