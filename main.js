/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ComicDialogPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var ComicDialogPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.styleBlock = null;
  }
  detectLineType(line) {
    if (line.startsWith("  ")) {
      return "speech";
    }
    if (line.startsWith("*")) {
      return "note";
    }
    return "description";
  }
  handleDialogBlock(source, el, ctx) {
    const lines = source.split("\n").map((line) => ({
      line,
      type: this.detectLineType(line),
      speaker: null,
      text: null,
      mood: null
    })).map((line) => {
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
    const speakers = lines.filter((line) => line.speaker).map((line) => line.speaker).filter((speaker) => !configuredSpeakers[speaker]);
    lines.forEach((line) => {
      const targetDiv = el.createDiv();
      const mdRenderer = new import_obsidian.MarkdownRenderChild(targetDiv);
      ctx.addChild(mdRenderer);
      const appReference = this.app;
      function writeMarkdown(md) {
        import_obsidian.MarkdownRenderer.render(appReference, md, targetDiv, ctx.sourcePath, mdRenderer);
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
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHtcclxuICAgIE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsXHJcbiAgICBNYXJrZG93blJlbmRlckNoaWxkLFxyXG4gICAgTWFya2Rvd25SZW5kZXJlcixcclxuICAgIFBsdWdpbixcclxufSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21pY0RpYWxvZ1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgICBzdHlsZUJsb2NrOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsXHJcblxyXG4gICAgZGV0ZWN0TGluZVR5cGUobGluZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAobGluZS5zdGFydHNXaXRoKFwiICBcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwic3BlZWNoXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgoXCIqXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIm5vdGVcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBcImRlc2NyaXB0aW9uXCJcclxuICAgIH1cclxuICAgIGhhbmRsZURpYWxvZ0Jsb2NrKHNvdXJjZTogc3RyaW5nLCBlbDogSFRNTEVsZW1lbnQsIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCkge1xyXG4gICAgICAgIGNvbnN0IGxpbmVzID0gc291cmNlLnNwbGl0KFwiXFxuXCIpLm1hcChsaW5lID0+ICh7XHJcbiAgICAgICAgICAgIGxpbmUsXHJcbiAgICAgICAgICAgIHR5cGU6IHRoaXMuZGV0ZWN0TGluZVR5cGUobGluZSksXHJcbiAgICAgICAgICAgIHNwZWFrZXI6IG51bGwsXHJcbiAgICAgICAgICAgIHRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIG1vb2Q6IG51bGxcclxuICAgICAgICB9KSkubWFwKGxpbmUgPT4ge1xyXG4gICAgICAgICAgIGlmIChsaW5lLnR5cGUgPT0gXCJzcGVlY2hcIikge1xyXG4gICAgICAgICAgICAgICBjb25zdCB0cmltbWVkTGluZSA9IGxpbmUubGluZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IG5hbWVMZW4gPSB0cmltbWVkTGluZS5pbmRleE9mKFwiOlwiKTtcclxuICAgICAgICAgICAgICAgY29uc3QgW3NwZWFrZXIsIG1vb2RdID0gdHJpbW1lZExpbmUuc3Vic3RyaW5nKDAsIG5hbWVMZW4pLnNwbGl0KFwifFwiLCAyKTtcclxuICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRyaW1tZWRMaW5lLnN1YnN0cmluZyhuYW1lTGVuICsgMSkudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgIC4uLmxpbmUsXHJcbiAgICAgICAgICAgICAgICAgICBzcGVha2VyLFxyXG4gICAgICAgICAgICAgICAgICAgdGV4dCxcclxuICAgICAgICAgICAgICAgICAgIG1vb2RcclxuICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICByZXR1cm4gbGluZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShjdHguc291cmNlUGF0aCkgfHwge307XHJcbiAgICAgICAgY29uc3QgZnJvbnRtYXR0ZXIgPSBtZXRhZGF0YS5mcm9udG1hdHRlciB8fCB7fTtcclxuICAgICAgICBjb25zdCBjb25maWd1cmVkU3BlYWtlcnMgPSBmcm9udG1hdHRlcltcInNwZWFrZXJzXCJdIHx8IHt9O1xyXG5cclxuICAgICAgICBjb25zdCBzcGVha2VycyA9IGxpbmVzXHJcbiAgICAgICAgICAgIC5maWx0ZXIobGluZSA9PiBsaW5lLnNwZWFrZXIpXHJcbiAgICAgICAgICAgIC5tYXAobGluZSA9PiBsaW5lLnNwZWFrZXIhKVxyXG4gICAgICAgICAgICAuZmlsdGVyKHNwZWFrZXIgPT4gIWNvbmZpZ3VyZWRTcGVha2Vyc1tzcGVha2VyXSk7XHJcblxyXG4gICAgICAgIGxpbmVzLmZvckVhY2gobGluZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldERpdiA9IGVsLmNyZWF0ZURpdigpO1xyXG4gICAgICAgICAgICBjb25zdCBtZFJlbmRlcmVyID0gbmV3IE1hcmtkb3duUmVuZGVyQ2hpbGQodGFyZ2V0RGl2KTtcclxuICAgICAgICAgICAgY3R4LmFkZENoaWxkKG1kUmVuZGVyZXIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYXBwUmVmZXJlbmNlID0gdGhpcy5hcHA7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHdyaXRlTWFya2Rvd24obWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgTWFya2Rvd25SZW5kZXJlci5yZW5kZXIoYXBwUmVmZXJlbmNlLCBtZCwgdGFyZ2V0RGl2LCBjdHguc291cmNlUGF0aCwgbWRSZW5kZXJlcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAobGluZS50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGVzY3JpcHRpb25cIjpcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXREaXYuYWRkQ2xhc3MoXCJkZXNjXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlTWFya2Rvd24obGluZS5saW5lKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJub3RlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RGl2LmFkZENsYXNzKFwibm90ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZU1hcmtkb3duKGxpbmUubGluZS5zdWJzdHJpbmcoMSkudHJpbSgpKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzcGVlY2hcIjpcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcGVha2VyTmFtZSA9IGxpbmUuc3BlYWtlciB8fCBcIlVua25vd25cIjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcG9rZW5UZXh0ID0gbGluZS50ZXh0IHx8IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RGl2LmRldGFjaCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3Bva2VuVGV4dC50cmltKCkgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcGVlY2hEaXYgPSBlbC5jcmVhdGVEaXYoXCJzcGVlY2hcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmFtZURpdiA9IHNwZWVjaERpdi5jcmVhdGVEaXYoXCJuYW1lXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZS5tb29kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vb2REaXYgPSBzcGVlY2hEaXYuY3JlYXRlRGl2KFwibW9vZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9vZERpdi5hcHBlbmRUZXh0KGxpbmUubW9vZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcGVha2VyTnVtYmVyID0gc3BlYWtlcnMuaW5kZXhPZihzcGVha2VyTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BlYWtlckNvbG9yID0gY29uZmlndXJlZFNwZWFrZXJzW3NwZWFrZXJOYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBzcGVlY2hEaXYuYXBwZW5kQ2hpbGQodGFyZ2V0RGl2KTtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lRGl2LmFwcGVuZFRleHQoc3BlYWtlck5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3BlYWtlckNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVEaXYuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgYGNvbG9yOiR7c3BlYWtlckNvbG9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVEaXYuYWRkQ2xhc3MoYHAke3NwZWFrZXJOdW1iZXJ9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXREaXYuYWRkQ2xhc3MoXCJzcGVha3NcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVNYXJrZG93bihzcG9rZW5UZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RGl2LmFkZENsYXNzKFwidW5rbm93blwiKTtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZU1hcmtkb3duKGxpbmUubGluZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBlbC5hZGRDbGFzcyhcImNvbWljLWRpYWxvZy1ibG9ja1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFN0eWxlcygpIHtcclxuICAgICAgICB0aGlzLnN0eWxlQmxvY2sgPSBjcmVhdGVFbChcInN0eWxlXCIpO1xyXG5cclxuICAgICAgICAvLyBsYW5ndWFnZT1DU1NcclxuICAgICAgICB0aGlzLnN0eWxlQmxvY2suYXBwZW5kVGV4dChgXHJcbiAgICAgICAgICAgIC5jb21pYy1kaWFsb2ctYmxvY2sge1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMXJlbTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLS1zcGVha3MtY29sb3ItMDogdmFyKC0tY29sb3ItcmVkKTtcclxuICAgICAgICAgICAgICAgIC0tc3BlYWtzLWNvbG9yLTE6IHZhcigtLWNvbG9yLW9yYW5nZSk7XHJcbiAgICAgICAgICAgICAgICAtLXNwZWFrcy1jb2xvci0yOiB2YXIoLS1jb2xvci15ZWxsb3cpO1xyXG4gICAgICAgICAgICAgICAgLS1zcGVha3MtY29sb3ItMzogdmFyKC0tY29sb3ItZ3JlZW4pO1xyXG4gICAgICAgICAgICAgICAgLS1zcGVha3MtY29sb3ItNDogdmFyKC0tY29sb3ItY3lhbik7XHJcbiAgICAgICAgICAgICAgICAtLXNwZWFrcy1jb2xvci01OiB2YXIoLS1jb2xvci1ibHVlKTtcclxuICAgICAgICAgICAgICAgIC0tc3BlYWtzLWNvbG9yLTY6IHZhcigtLWNvbG9yLXB1cnBsZSk7XHJcbiAgICAgICAgICAgICAgICAtLXNwZWFrcy1jb2xvci03OiB2YXIoLS1jb2xvci1waW5rKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLmNvbWljLWRpYWxvZy1ibG9jayAudW5rbm93biB7XHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvci1yZWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAuY29taWMtZGlhbG9nLWJsb2NrIC5ub3RlIHtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEodmFyKC0tY29sb3ItY3lhbi1yZ2IpLCAxMCUpO1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcigtLWNvbG9yLWN5YW4pO1xyXG4gICAgICAgICAgICAgICAgbWFyZ2luLXRvcDogMXJlbTtcclxuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDFyZW07XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAwLjc1cmVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAuY29taWMtZGlhbG9nLWJsb2NrIC5kZXNjIHtcclxuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGp1c3RpZnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC5jb21pYy1kaWFsb2ctYmxvY2sgLnNwZWVjaCB7XHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iYWNrZ3JvdW5kLW1vZGlmaWVyLWZvcm0tZmllbGQpO1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xyXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAxcmVtO1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogMC43NXJlbTtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgICAgICBnYXA6IDJyZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC5jb21pYy1kaWFsb2ctYmxvY2sgLnNwZWVjaCAubmFtZSB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogMTByZW07XHJcbiAgICAgICAgICAgICAgICBmbGV4OiAwIDAgZml0LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC5jb21pYy1kaWFsb2ctYmxvY2sgLnNwZWVjaCAubW9vZCB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogMTByZW07XHJcbiAgICAgICAgICAgICAgICBmbGV4OiAwIDAgZml0LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICBmb250LXN0eWxlOiBpdGFsaWM7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogIzY5NmQ3MDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLmNvbWljLWRpYWxvZy1ibG9jayAuc3BlZWNoIC5uYW1lLnAwIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zcGVha3MtY29sb3ItMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLmNvbWljLWRpYWxvZy1ibG9jayAuc3BlZWNoIC5uYW1lLnAxIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zcGVha3MtY29sb3ItMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLmNvbWljLWRpYWxvZy1ibG9jayAuc3BlZWNoIC5uYW1lLnAyIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zcGVha3MtY29sb3ItMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLmNvbWljLWRpYWxvZy1ibG9jayAuc3BlZWNoIC5uYW1lLnAzIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zcGVha3MtY29sb3ItMyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLmNvbWljLWRpYWxvZy1ibG9jayAuc3BlZWNoIC5uYW1lLnA0IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zcGVha3MtY29sb3ItNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLmNvbWljLWRpYWxvZy1ibG9jayAuc3BlZWNoIC5uYW1lLnA1IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zcGVha3MtY29sb3ItNSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLmNvbWljLWRpYWxvZy1ibG9jayAuc3BlZWNoIC5uYW1lLnA2IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zcGVha3MtY29sb3ItNik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLmNvbWljLWRpYWxvZy1ibG9jayAuc3BlZWNoIC5uYW1lLnA3IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zcGVha3MtY29sb3ItNyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC5jb21pYy1kaWFsb2ctYmxvY2sgLnNwZWVjaCAuc3BlYWtzIHtcclxuICAgICAgICAgICAgICAgIGZsZXg6IDAgMSBpbml0aWFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAuY29taWMtZGlhbG9nLWJsb2NrIC5zcGVlY2ggLnNwZWFrcyBwIHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGApO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGVCbG9jayk7XHJcbiAgICB9XHJcblxyXG4gICAgb25sb2FkKCkge1xyXG4gICAgICAgIHRoaXMuc2V0dXBTdHlsZXMoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyTWFya2Rvd25Db2RlQmxvY2tQcm9jZXNzb3IoXCJjb21pYy1kaWFsb2dcIiwgdGhpcy5oYW5kbGVEaWFsb2dCbG9jay5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICB1bmxvYWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVCbG9jayAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQodGhpcy5zdHlsZUJsb2NrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBS087QUFFUCxJQUFxQixvQkFBckIsY0FBK0MsdUJBQU87QUFBQSxFQUF0RDtBQUFBO0FBQ0ksc0JBQWlDO0FBQUE7QUFBQSxFQUVqQyxlQUFlLE1BQXNCO0FBQ2pD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
