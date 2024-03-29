import { Decoration, EditorView, MatchDecorator, ViewPlugin, WidgetType } from "@codemirror/view";

/**
 * 自定义一个组件 显示自定义的标签
 */

// Plugin
const customFieldPlugin = ViewPlugin.fromClass(
  class {
    customFieldPlugin;

    constructor(view) {
      this.customFieldPlugin = placeholderMatcher.createDeco(view);
    }

    update(update) {
      this.customFieldPlugin = placeholderMatcher.updateDeco(update, this.customFieldPlugin);
    }
  },
  {
    decorations: v => v.customFieldPlugin,
    provide: plugin =>
      EditorView.atomicRanges.of(view => {
        return view.plugin(plugin)?.customFieldPlugin || Decoration.none;
      })
  }
);

// 匹配字符的正则 例如 #{name} #{age}
const placeholderMatcher = new MatchDecorator({
  regexp: /\#\{[a-zA-Z0-9_,]+\}/g,
  decoration: match =>
    Decoration.replace({
      widget: new PlaceholderWidget(match[0])
    })
});

class PlaceholderWidget extends WidgetType {
  label;

  constructor(label: string) {
    super();
    this.label = label;
  }

  eq(other: { label: string }) {
    return other.label === this.label;
  }

  toDOM() {
    let wrap = document.createElement("span");
    console.log(customFieldLabelMap);
    // 普通的说明是题目引用标签 如果带有score表示引用分数
    if (this.label.endsWith("score}")) {
      let value = this.label.replace("#{", "").replace("}", "").replace("score", "");
      wrap.innerHTML = customFieldLabelMap[value] + "(分值)" || value;
    } else {
      let value = this.label.replace("#{", "").replace("}", "");
      wrap.innerHTML = customFieldLabelMap[value] || value;
    }
    wrap.className = "cm-field-value";
    return wrap;
  }
}

// Theme
const tduckTheme = EditorView.baseTheme({
  ".cm-field-value": {
    paddingLeft: "6px",
    margin: "1px",
    padding: "1px",
    background: "#1890ff",
    color: "#ffffff",
    fontWeight: "50"
  },
  ".cm-content, .cm-gutter": {
    minHeight: "150px"
  },
  "[contenteditable]:focus": {
    backgroundColor: "#ffffff"
  }
});

let customFieldLabelMap: any = {};

const setCustomFieldLabelMap = (obj: any) => {
  customFieldLabelMap = obj;
};

export { customFieldPlugin, tduckTheme, setCustomFieldLabelMap };
