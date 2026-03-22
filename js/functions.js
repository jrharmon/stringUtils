window.StringFunctions = (function () {

  function parseEscapes(str) {
    return str.replace(/\\(n|t|\\)/g, function (_, c) {
      if (c === 'n') return '\n';
      if (c === 't') return '\t';
      return '\\';
    });
  }

  function formatJSON(text) {
    var result = '';
    var indent = 0;
    var inString = false;
    var i = 0;

    function pad() {
      return '  '.repeat(indent);
    }

    while (i < text.length) {
      var ch = text[i];

      if (inString) {
        result += ch;
        if (ch === '\\') {
          i++;
          result += text[i] || '';
        } else if (ch === '"') {
          inString = false;
        }
        i++;
        continue;
      }

      // Skip whitespace between tokens
      if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
        i++;
        continue;
      }

      if (ch === '"') {
        inString = true;
        result += ch;
        i++;
        continue;
      }

      if (ch === '{' || ch === '[') {
        result += ch + '\n';
        indent++;
        result += pad();
      } else if (ch === '}' || ch === ']') {
        indent = Math.max(0, indent - 1);
        result += '\n' + pad() + ch;
      } else if (ch === ',') {
        result += ch + '\n' + pad();
      } else if (ch === ':') {
        result += ': ';
      } else {
        result += ch;
      }

      i++;
    }

    return result;
  }

  return {
    'append': function (text, params) {
      var str = parseEscapes(params.text || '');
      var dir = params.direction || 'after';
      return text.split('\n').map(function (line) {
        return dir === 'before' ? str + line : line + str;
      }).join('\n');
    },

    'change-case': function (text, params) {
      return params.direction === 'lower' ? text.toLowerCase() : text.toUpperCase();
    },

    'format-json': function (text) {
      return formatJSON(text);
    },

    'replace': function (text, params) {
      var find = parseEscapes(params.find || '');
      var repl = parseEscapes(params.replace || '');
      if (!find) return text;
      return text.split(find).join(repl);
    },

    'normalize-columns': function (text, params) {
      var delim = params.delimiter || '|';
      var parsed = text.split('\n').map(function (line) {
        return line.split(delim);
      });

      var maxWidths = [];
      parsed.forEach(function (cells) {
        cells.forEach(function (cell, idx) {
          var len = cell.length;
          if (maxWidths[idx] === undefined || len > maxWidths[idx]) {
            maxWidths[idx] = len;
          }
        });
      });

      return parsed.map(function (cells) {
        return cells.map(function (cell, idx) {
          if (idx === cells.length - 1) return cell;
          return cell.padEnd(maxWidths[idx]);
        }).join(delim);
      }).join('\n');
    },

    'replace-clipboard': function (text, params, clipboardLines) {
      var search = params.search || '';
      var textLines = text.split('\n');
      var replLines = (clipboardLines || []);

      return textLines.map(function (line, idx) {
        var replacement = replLines[idx] !== undefined ? replLines[idx] : '';
        if (!search) return replacement;
        return line.split(search).join(replacement);
      }).join('\n');
    },

    'repeat': function (text, params) {
      var count = parseInt(params.count, 10) || 2;
      if (count < 1) count = 1;
      var parts = [];
      for (var i = 0; i < count; i++) {
        parts.push(text);
      }
      return parts.join('\n');
    },

    'trim': function (text, params) {
      var dir = params.direction || 'both';
      return text.split('\n').map(function (line) {
        if (dir === 'both') return line.trim();
        if (dir === 'before') return line.trimStart();
        if (dir === 'after') return line.trimEnd();
        return line;
      }).join('\n');
    },

    'delete-adjacent': function (text, params) {
      var search = params.search || '';
      var deleteSearch = params.keep || false;
      var dir = params.direction || 'before';
      if (!search) return text;
      return text.split('\n').map(function (line) {
        var idx = line.indexOf(search);
        if (idx === -1) return line;
        if (dir === 'before') {
          return deleteSearch ? line.slice(idx + search.length) : line.slice(idx);
        } else {
          return deleteSearch ? line.slice(0, idx) : line.slice(0, idx + search.length);
        }
      }).join('\n');
    },

    'sort': function (text, params) {
      var desc = params.direction === 'desc';
      var caseSensitive = params.caseSensitive || false;
      var lines = text.split('\n');

      lines.sort(function (a, b) {
        var ka = caseSensitive ? a : a.toLowerCase();
        var kb = caseSensitive ? b : b.toLowerCase();
        if (ka < kb) return desc ? 1 : -1;
        if (ka > kb) return desc ? -1 : 1;
        return 0;
      });

      return lines.join('\n');
    },

    'dedupe': function (text) {
      var seen = new Set();
      return text.split('\n').filter(function (line) {
        if (seen.has(line)) return false;
        seen.add(line);
        return true;
      }).join('\n');
    },

    'delete-lines': function (text, params) {
      var search = params.search || '';
      var withText = params.direction !== 'without';
      if (!search) return text;
      return text.split('\n').filter(function (line) {
        var found = line.indexOf(search) !== -1;
        return withText ? !found : found;
      }).join('\n');
    },

    'find-non-ascii': function (text) {
      var results = [];
      var i = 0;
      while (i < text.length) {
        if (text.charCodeAt(i) > 127) {
          // Start of a non-ASCII run
          var runStart = i;
          while (i < text.length && text.charCodeAt(i) > 127) {
            i++;
          }
          var runEnd = i; // exclusive
          var start = Math.max(0, runStart - 5);
          var end = Math.min(text.length, runEnd + 5);
          results.push(text.slice(start, end));
        } else {
          i++;
        }
      }
      return results.length ? results.join('\n') : '(no non-ASCII characters found)';
    }
  };
}());
