window.FUNCTION_PARAMS = {
  'append': {
    label: 'Append Before/After',
    html() {
      return `
        <div class="param-label">Parameters</div>
        <div class="param-row">
          <label for="p-text">Text:</label>
          <input type="text" id="p-text" placeholder="text (supports \\n \\t \\\\)" />
        </div>
        <div class="param-row">
          <label for="p-direction">Position:</label>
          <select id="p-direction">
            <option value="after">After line</option>
            <option value="before">Before line</option>
          </select>
        </div>`;
    }
  },

  'change-case': {
    label: 'Change Case',
    html() {
      return `
        <div class="param-label">Parameters</div>
        <div class="param-row">
          <label for="p-direction">Case:</label>
          <select id="p-direction">
            <option value="upper">Upper</option>
            <option value="lower">Lower</option>
          </select>
        </div>`;
    }
  },

  'format-json': {
    label: 'Format JSON',
    html() { return ''; }
  },

  'replace': {
    label: 'Replace',
    html() {
      return `
        <div class="param-label">Parameters</div>
        <div class="param-row">
          <label for="p-find">Find:</label>
          <input type="text" id="p-find" placeholder="search text (supports \\n \\t \\\\)" />
        </div>
        <div class="param-row">
          <label for="p-replace">Replace with:</label>
          <input type="text" id="p-replace" placeholder="replacement (supports \\n \\t \\\\)" />
        </div>`;
    }
  },

  'normalize-columns': {
    label: 'Normalize Columns',
    html() {
      return `
        <div class="param-label">Parameters</div>
        <div class="param-row">
          <label for="p-delimiter">Delimiter:</label>
          <input type="text" id="p-delimiter" placeholder="e.g. | or ," />
        </div>`;
    }
  },

  'replace-clipboard': {
    label: 'Replace from Clipboard',
    html() {
      return `
        <div class="param-label">Parameters</div>
        <div class="param-row">
          <label for="p-search">Search text:</label>
          <input type="text" id="p-search" placeholder="text to replace on each line" />
        </div>`;
    }
  },

  'repeat': {
    label: 'Repeat',
    html() {
      return `
        <div class="param-label">Parameters</div>
        <div class="param-row">
          <label for="p-count">Count:</label>
          <input type="number" id="p-count" placeholder="e.g. 3" min="1" max="9999" />
        </div>`;
    }
  },

  'trim': {
    label: 'Trim',
    html() {
      return `
        <div class="param-label">Parameters</div>
        <div class="param-row">
          <label for="p-direction">Direction:</label>
          <select id="p-direction">
            <option value="both">Both</option>
            <option value="before">Before (left)</option>
            <option value="after">After (right)</option>
          </select>
        </div>`;
    }
  },

  'delete-adjacent': {
    label: 'Delete Before/After',
    html() {
      return `
        <div class="param-label">Parameters</div>
        <div class="param-row">
          <label for="p-search">Search text:</label>
          <input type="text" id="p-search" placeholder="the marker text" />
        </div>
        <div class="param-row">
          <label for="p-direction">Delete:</label>
          <select id="p-direction">
            <option value="before">Before text</option>
            <option value="after">After text</option>
          </select>
        </div>
        <div class="param-row checkbox-row">
          <input type="checkbox" id="p-keep" />
          <label for="p-keep">Delete search text</label>
        </div>`;
    }
  },

  'sort': {
    label: 'Sort',
    html() {
      return `
        <div class="param-label">Parameters</div>
        <div class="param-row">
          <label for="p-direction">Direction:</label>
          <select id="p-direction">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div class="param-row checkbox-row">
          <input type="checkbox" id="p-case-sensitive" />
          <label for="p-case-sensitive">Case sensitive</label>
        </div>`;
    }
  },

  'dedupe': {
    label: 'De-dupe',
    html() { return ''; }
  },

  'delete-lines': {
    label: 'Delete Lines With/Without',
    html() {
      return `
        <div class="param-label">Parameters</div>
        <div class="param-row">
          <label for="p-search">Search text:</label>
          <input type="text" id="p-search" placeholder="text to match" />
        </div>
        <div class="param-row">
          <label for="p-direction">Delete lines:</label>
          <select id="p-direction">
            <option value="with">With text</option>
            <option value="without">Without text</option>
          </select>
        </div>`;
    }
  }
};
