/* eslint-disable no-undef */
ace.define("ace/theme/custom", ["require", "exports", "module", "ace/lib/dom"], function (require, exports, module) 
{
  exports.isDark = true;
  exports.cssClass = "ace-vibrant-ink";
  exports.cssText = `.ace-vibrant-ink .ace_gutter {
  background: #1a1a1a;
  color: #BEBEBE
  }
  .ace-vibrant-ink .ace_print-margin {
  width: 1px;
  background: #1a1a1a
  }
  .ace-vibrant-ink {
  background-color: #0F0F0F;
  color: #FFFFFF
  }
  .ace-vibrant-ink .ace_cursor {
  color: #8A40C0
  }
  .ace-vibrant-ink .ace_marker-layer .ace_selection {
  background: #487099
  }
  .ace-vibrant-ink.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #0F0F0F;
  }
  .ace-vibrant-ink .ace_marker-layer .ace_step {
  background: rgb(102, 82, 0)
  }
  .ace-vibrant-ink .ace_marker-layer .ace_bracket {
  margin: 1px 0 0 1px;
  border: 1px solid #C0C0C0
  }
  .ace-vibrant-ink .ace_marker-layer .ace_active-line {
  background: #222
  }
  .ace-vibrant-ink .ace_gutter-active-line {
  background-color: #404040
  }
  .ace-vibrant-ink .ace_marker-layer .ace_selected-word {
  border: 1px solid #6699CC
  }
  .ace-vibrant-ink .ace_invisible {
  color: #404040
  }
  .ace-vibrant-ink .ace_keyword,
  .ace-vibrant-ink .ace_meta {
  color: #FF6600
  }
  .ace-vibrant-ink .ace_constant,
  .ace-vibrant-ink .ace_constant.ace_character,
  .ace-vibrant-ink .ace_constant.ace_character.ace_escape,
  .ace-vibrant-ink .ace_constant.ace_other {
  color: #339999
  }
  .ace-vibrant-ink .ace_constant.ace_numeric {
  color: #EEE
  }
  .ace-vibrant-ink .ace_invalid,
  .ace-vibrant-ink .ace_invalid.ace_deprecated {
  color: #CCFF33;
  background-color: #000000
  }
  .ace-vibrant-ink .ace_fold {
  background-color: #FFCC00;
  border-color: #FFFFFF
  }
  .ace-vibrant-ink .ace_entity.ace_name.ace_function,
  .ace-vibrant-ink .ace_support.ace_function,
  .ace-vibrant-ink .ace_variable {
  color: #FFCC00
  }
  .ace-vibrant-ink .ace_variable.ace_parameter {
  font-style: italic
  }
  .ace-vibrant-ink .ace_string {
  color: #66FF00
  }
  .ace-vibrant-ink .ace_string.ace_regexp {
  color: #44B4CC
  }
  .ace-vibrant-ink .ace_comment {
  color: #9933CC
  }
  .ace-vibrant-ink .ace_entity.ace_other.ace_attribute-name {
  font-style: italic;
  color: #99CC99
  }
  .ace-vibrant-ink .ace_indent-guide {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEUlEQVR42mNkAALGg2dv/gcACDUDaR36j2kAAAAASUVORK5CYII=) right repeat-y
  }
  .ace-vibrant-ink .ace_paren {
  color: #FFF
  }`;
  
  var dom = require("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});

(function () 
{
  /* eslint-disable no-undef */
  ace.require(["ace/theme/custom"], function (m) 
  {
    if (typeof module === "object" && typeof exports === "object" && module) 
    {
      module.exports = m;
    }
  });
})();
